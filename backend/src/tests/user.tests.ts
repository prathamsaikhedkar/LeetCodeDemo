import { test, describe } from "node:test"
import assert from "node:assert"
import app from "../app.js"
import supertest from "supertest"
import { ApiResponse } from "../utils/api_formats.js"
import connect_db from "../connect_db.js"


const request = supertest(app)
const db = connect_db()

describe('Express API Endpoints', () => {
  
  // Test GET route
  describe('GET /api/user', () => {
    test('should return a user with a 200 status code', async () => {
      const response = await request.get('/api/user');
      
      assert.strictEqual(response.statusCode, 200);
      assert.deepStrictEqual(response.body, {
        id: 1,
        name: 'Alex'
      });
    });
  });

// test("GET /api/health", async (t) => {
//   await request.get("/api/health").expect(200).expect('Content-Type', /application\/json/)
// })

test("GET /api/invalid-endpoint", async (t) => {
  await request.get("/api/invalid-endpoint").expect(404).expect('Content-Type', /application\/json/)
})
})



