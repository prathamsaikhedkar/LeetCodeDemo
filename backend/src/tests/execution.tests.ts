import { describe, it, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import {
  executionRequestSchema,
  executionResponseSchema,
  submitCodeExecution,
  getExecutionResult,
} from "../controllers/execution.controllers.js"
import { ApiError } from "../utils/api_formats.js"

describe("Code Execution Controller & Schemas", () => {
  // Store reference to original global fetch for safe teardown
  const originalFetch = globalThis.fetch

  afterEach(() => {
    // Always restore the real global fetch after each test
    globalThis.fetch = originalFetch
  })

  // ==========================================================================
  // 1. Zod Schema Unit Tests
  // ==========================================================================
  describe("Zod Validation Schemas", () => {
    describe("executionRequestSchema", () => {
      it("should successfully parse a valid execution request payload", () => {
        const validPayload = {
          source_code: 'print("Hello, World!")',
          language_id: 71,
          token: "submission-token-uuid-1234",
        }

        const result = executionRequestSchema.safeParse(validPayload)
        assert.strictEqual(result.success, true)
        if (result.success) {
          assert.strictEqual(result.data.token, "submission-token-uuid-1234")
          assert.strictEqual(result.data.language_id, 71)
        }
      })

      it("should fail validation if required fields are missing", () => {
        const invalidPayload = {
          source_code: 'print("Missing token and language")',
        }

        const result = executionRequestSchema.safeParse(invalidPayload)
        assert.strictEqual(result.success, false)
      })

      it("should fail validation if language_id is not a number", () => {
        const invalidPayload = {
          source_code: "console.log(1)",
          language_id: "javascript", // string instead of number
          token: "token-123",
        }

        const result = executionRequestSchema.safeParse(invalidPayload)
        assert.strictEqual(result.success, false)
      })
    })

    describe("executionResponseSchema", () => {
      it("should successfully parse a complete execution result", () => {
        const sampleResponse = {
          stdout: "42\n",
          time: 0.045,
          memory: 3200,
          stderr: null,
          token: "token-123",
          compile_output: null,
          message: null,
          status: {
            id: 3,
            description: "Accepted",
          },
        }

        const result = executionResponseSchema.safeParse(sampleResponse)
        assert.strictEqual(result.success, true)
        if (result.success) {
          assert.strictEqual(result.data.stdout, "42\n")
          assert.strictEqual(result.data.status?.description, "Accepted")
        }
      })

      it("should accept null and omitted optional fields", () => {
        const minimalResponse = {
          stdout: null,
          status: null,
        }

        const result = executionResponseSchema.safeParse(minimalResponse)
        assert.strictEqual(result.success, true)
      })

      it("should reject non-numeric time or invalid status structures", () => {
        const invalidResponse = {
          time: "fast", // should be number | null | undefined
          status: "Accepted", // should be object { id, description }
        }

        const result = executionResponseSchema.safeParse(invalidResponse)
        assert.strictEqual(result.success, false)
      })
    })
  })

  // ==========================================================================
  // 2. submitCodeExecution Unit Tests
  // ==========================================================================
  describe("submitCodeExecution", () => {
    it("should throw a 400 ApiError if code or languageId is missing", async () => {
      await assert.rejects(
        async () => {
          await submitCodeExecution("", 71)
        },
        (err: unknown) => {
          assert.ok(err instanceof ApiError)
          assert.strictEqual(err.status, 400)
          assert.match(err.message, /code and language are required/i)
          return true
        }
      )

      await assert.rejects(
        async () => {
          await submitCodeExecution('print("test")', 0)
        },
        (err: unknown) => {
          assert.ok(err instanceof ApiError)
          assert.strictEqual(err.status, 400)
          return true
        }
      )
    })

    it("should submit code and return the parsed execution request response", async () => {
      const mockResponseData = {
        source_code: 'print("Hello")',
        language_id: 71,
        token: "mock-token-xyz-987",
      }

      // Mock global fetch to return our sample execution service response
      let capturedUrl = ""
      let capturedOptions: RequestInit | undefined

      globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
        capturedUrl = input.toString()
        capturedOptions = init
        return new Response(JSON.stringify(mockResponseData), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        })
      }) as typeof fetch

      const result = await submitCodeExecution('print("Hello")', 71)

      // Verify request payload sent to the execution service
      assert.strictEqual(capturedOptions?.method, "POST")
      assert.ok(capturedUrl.includes("/submissions/"))

      const parsedSentBody = JSON.parse(capturedOptions?.body as string)
      assert.strictEqual(parsedSentBody.source_code, 'print("Hello")')
      assert.strictEqual(parsedSentBody.language_id, 71)

      // Verify result parsed from the response
      assert.strictEqual(result.token, "mock-token-xyz-987")
    })

    it("should throw an ApiError if the execution service responds with an error status", async () => {
      globalThis.fetch = (async () => {
        return new Response(JSON.stringify({ error: "Service Unavailable" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      }) as typeof fetch

      await assert.rejects(
        async () => {
          await submitCodeExecution('print("fail")', 71)
        },
        (err: unknown) => {
          assert.ok(err instanceof ApiError)
          assert.strictEqual(err.status, 503)
          assert.match(err.message, /failed to execute code/i)
          return true
        }
      )
    })

    it("should throw a 500 ApiError if the execution service returns an invalid response structure", async () => {
      // Missing required token and language_id in response
      globalThis.fetch = (async () => {
        return new Response(JSON.stringify({ unexpectedKey: "no-token-here" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      }) as typeof fetch

      await assert.rejects(
        async () => {
          await submitCodeExecution('print("fail schema")', 71)
        },
        (err: unknown) => {
          assert.ok(err instanceof ApiError)
          assert.strictEqual(err.status, 500)
          assert.match(err.message, /invalid response format/i)
          return true
        }
      )
    })
  })

  // ==========================================================================
  // 3. getExecutionResult Unit Tests
  // ==========================================================================
  describe("getExecutionResult", () => {
    it("should retrieve execution results and format query params properly", async () => {
      const mockResultData = {
        stdout: "Result: 15\n",
        time: 0.02,
        memory: 1500,
        stderr: null,
        token: "token-abc-123",
        status: {
          id: 3,
          description: "Accepted",
        },
      }

      let capturedUrl = ""
      globalThis.fetch = (async (input: string | URL | Request) => {
        capturedUrl = input.toString()
        return new Response(JSON.stringify(mockResultData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      }) as typeof fetch

      const requestedFields = ["stdout", "time", "memory", "status"]
      const result = await getExecutionResult("token-abc-123", requestedFields)

      // Verify the URL was constructed with requested fields
      assert.ok(capturedUrl.includes("token-abc-123"))
      assert.ok(capturedUrl.includes("fields=stdout,time,memory,status"))

      // Verify returned result matches
      assert.strictEqual(result.stdout, "Result: 15\n")
      assert.strictEqual(result.time, 0.02)
      assert.strictEqual(result.status?.id, 3)
      assert.strictEqual(result.status?.description, "Accepted")
    })

    it("should throw an ApiError if retrieving results returns a 404 or non-ok status", async () => {
      globalThis.fetch = (async () => {
        return new Response(JSON.stringify({ error: "Submission not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        })
      }) as typeof fetch

      await assert.rejects(
        async () => {
          await getExecutionResult("non-existent-token", ["stdout"])
        },
        (err: unknown) => {
          assert.ok(err instanceof ApiError)
          assert.strictEqual(err.status, 404)
          assert.match(err.message, /failed to get execution result/i)
          return true
        }
      )
    })

    it("should throw a 500 ApiError if the execution result payload does not match schema", async () => {
      // Malformed result: status is not an object or null
      globalThis.fetch = (async () => {
        return new Response(JSON.stringify({ status: 12345 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      }) as typeof fetch

      await assert.rejects(
        async () => {
          await getExecutionResult("token-corrupt", ["status"])
        },
        (err: unknown) => {
          assert.ok(err instanceof ApiError)
          assert.strictEqual(err.status, 500)
          assert.match(err.message, /invalid response format/i)
          return true
        }
      )
    })
  })
})
