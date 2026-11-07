/**
 * ============================================================================
 * TUTORIAL: Modern TypeScript Backend Testing with Node:test & Supertest
 * ============================================================================
 *
 * 1. Test Runner: `node:test`
 *    - Node's built-in, zero-dependency test runner (Node 18+).
 *    - Provides `describe`, `it`, `test`, `before`, `after`, `beforeEach`, `afterEach`.
 *
 * 2. Assertions: `node:assert/strict`
 *    - Built into Node.js standard library.
 *    - Common assertions:
 *      * assert.equal(actual, expected)      -> value equality (==)
 *      * assert.strictEqual(actual, expected) -> strict equality (===)
 *      * assert.deepStrictEqual(a, b)         -> deep object/array comparison
 *      * assert.ok(booleanCondition)          -> truthy check
 *      * assert.match(string, /regex/)        -> pattern match
 *
 * 3. HTTP Testing: `supertest`
 *    - Wraps your Express `app` instance without binding to a physical network port.
 *    - Chain methods: .get(), .post(), .send(), .set(), .expect()
 * ============================================================================
 */

import { describe, it, before, after } from "node:test"
import assert from "node:assert/strict"
import supertest from "supertest"
import app from "../app.js"

const request = supertest(app)

describe("API Endpoints Suite", () => {
  before(() => {
    // e.g. Setup test database connection, create test fixtures, etc.
  })

  after(() => {
    // e.g. Tear down DB connections, delete seeded test records, etc.
  })

  describe("GET /health", () => {
    it("should return 200 with server status message", async () => {
      const response = await request.get("/health")

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.headers["content-type"]?.includes("application/json"), true)
      assert.strictEqual(response.body.status, 200)
      assert.strictEqual(response.body.message, "Server is healthy")
    })
  })

  describe("404 Catch-All Handler", () => {
    it("should return 404 for unknown endpoints", async () => {
      const response = await request.get("/api/non-existent-route")

      assert.strictEqual(response.status, 404)
      assert.strictEqual(response.body.status, 404)
    })
  })

  
  describe("GET /users", () => {
    it("should respond with a structured ApiResponse or 404 when empty", async () => {
      const response = await request.get("/users")

      // If database is populated, status is 200; if empty, controller returns 404
      assert.ok(
        response.status === 200 || response.status === 404,
        `Expected status 200 or 404, received ${response.status}`
      )

      if (response.status === 200) {
        assert.strictEqual(Array.isArray(response.body.data), true)
      }
    })
  })
})
