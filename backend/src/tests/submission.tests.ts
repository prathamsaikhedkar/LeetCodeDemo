import { describe, it } from "node:test"
import assert from "node:assert/strict"
import supertest from "supertest"
import type { Request, Response } from "express"
import app from "../app.js"
import { createSubmission } from "../controllers/submission.controllers.js"
import { ApiError } from "../utils/api_formats.js"

const request = supertest(app)

describe("Submission Controller & Endpoints", () => {
  // --------------------------------------------------------------------------
  // 1. Controller Unit Tests: createSubmission validation
  // --------------------------------------------------------------------------
  describe("createSubmission Input Validation", () => {
    it("should throw a 400 ApiError if required body parameters are missing", async () => {
      const mockReq = {
        body: {
          problemId: 1,
          userId: 1,
          // Missing sourceCode and languageId
        },
      } as unknown as Request

      const mockRes = {} as unknown as Response

      await assert.rejects(
        async () => {
          await createSubmission(mockReq, mockRes)
        },
        (err: unknown) => {
          assert.ok(err instanceof ApiError)
          assert.strictEqual(err.status, 400)
          assert.match(err.message, /required/i)
          return true
        }
      )
    })

    it("should throw a 400 ApiError when body is empty", async () => {
      const mockReq = { body: {} } as unknown as Request
      const mockRes = {} as unknown as Response

      await assert.rejects(
        async () => {
          await createSubmission(mockReq, mockRes)
        },
        (err: unknown) => {
          assert.ok(err instanceof ApiError)
          assert.strictEqual(err.status, 400)
          return true
        }
      )
    })
  })

  // --------------------------------------------------------------------------
  // 2. HTTP Route Testing: GET /api/submissions/:id
  // --------------------------------------------------------------------------
  describe("GET /api/submissions/:id", () => {
    it("should return a response for a submission query", async () => {
      const response = await request.get("/api/submissions/99999999")

      assert.ok(
        [200, 404, 500].includes(response.status),
        `Expected status 200, 404, or 500, got ${response.status}`
      )
    })
  })
})
