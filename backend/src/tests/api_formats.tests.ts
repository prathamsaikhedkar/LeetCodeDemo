import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { ApiResponse, ApiError } from "../utils/api_formats.js"

describe("API Formats Utilities", () => {
  describe("ApiResponse", () => {
    it("should instantiate with status, message, and optional data", () => {
      const response = new ApiResponse(200, "Success", { count: 5 })

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.message, "Success")
      assert.deepStrictEqual(response.data, { count: 5 })
    })

    it("should allow data to be undefined when omitted", () => {
      const response = new ApiResponse(204, "No Content")

      assert.strictEqual(response.status, 204)
      assert.strictEqual(response.message, "No Content")
      assert.strictEqual(response.data, undefined)
    })
  })

  describe("ApiError", () => {
    it("should instantiate as an instance of Error with status and message", () => {
      const error = new ApiError(404, "Resource not found")

      assert.ok(error instanceof Error)
      assert.strictEqual(error.status, 404)
      assert.strictEqual(error.message, "Resource not found")
      assert.ok(error.stack)
    })

    it("should capture 500 status errors properly", () => {
      const error = new ApiError(500, "Internal Server Error")

      assert.strictEqual(error.status, 500)
      assert.strictEqual(error.message, "Internal Server Error")
    })
  })
})
