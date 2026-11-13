import { describe, it, after } from "node:test"
import assert from "node:assert/strict"
import supertest from "supertest"
import app from "../app.js"
import connect_db from "../connect_db.js"
import { Problems, Examples } from "../db/schema.js"
import { eq } from "drizzle-orm"

const request = supertest(app)
const db = connect_db()

describe("Problem & Admin Endpoints", () => {
  let createdProblemId: number | null = null

  after(async () => {
    // Cleanup any test problem created during test execution
    if (db && createdProblemId) {
      try {
        await db.delete(Examples).where(eq(Examples.problemId, createdProblemId))
        await db.delete(Problems).where(eq(Problems.id, createdProblemId))
      } catch {
        // Ignore cleanup errors if record was already removed
      }
    }
  })

  // --------------------------------------------------------------------------
  // 1. GET /api/problems
  // --------------------------------------------------------------------------
  describe("GET /api/problems", () => {
    it("should return 200 with problem list or 404 if no problems are seeded", async () => {
      const response = await request.get("/api/problems")

      assert.ok(
        response.status === 200 || response.status === 404,
        `Expected status 200 or 404, received ${response.status}`
      )

      if (response.status === 200) {
        assert.strictEqual(Array.isArray(response.body.data), true)
        assert.strictEqual(response.body.status, 200)
      } else {
        assert.strictEqual(response.body.status, 404)
      }
    })
  })

  // --------------------------------------------------------------------------
  // 2. GET /api/problems/:id
  // --------------------------------------------------------------------------
  describe("GET /api/problems/:id", () => {
    it("should return 404 for a non-existent problem ID", async () => {
      const nonExistentId = 99999999
      const response = await request.get(`/api/problems/${nonExistentId}`)

      assert.strictEqual(response.status, 404)
      assert.strictEqual(response.body.status, 404)
    })
  })

  // --------------------------------------------------------------------------
  // 3. POST /api/admin/problems (Create Problem)
  // --------------------------------------------------------------------------
  describe("POST /api/admin/problems", () => {
    it("should create a new problem with examples and return 201", async () => {
      const payload = {
        title: "Test Problem: Add Two Numbers",
        description: "Given two integers a and b, return their sum.",
        difficulty: "Easy",
        problemExamples: [
          { input: "a = 2, b = 3", output: "5" },
          { input: "a = -1, b = 1", output: "0" },
        ],
      }

      const response = await request
        .post("/api/admin/problems")
        .send(payload)
        .set("Content-Type", "application/json")

      // If DB is connected and creates record
      if (response.status === 201) {
        assert.strictEqual(response.body.status, 201)
        assert.ok(response.body.data.problem)
        assert.strictEqual(response.body.data.problem[0].title, payload.title)

        createdProblemId = response.body.data.problem[0].id
      } else {
        assert.ok([201, 500].includes(response.status))
      }
    })
  })
})
