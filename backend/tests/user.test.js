const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

// Use a separate test DB
const TEST_DB = "mongodb://localhost:27017/chatapp_test";

beforeAll(async () => {
    await mongoose.connect(TEST_DB);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
describe("GET /", () => {
    test("should return API running status", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", "OK");
    });
});

// ─── User Registration ────────────────────────────────────────────────────────
describe("POST /api/users/register", () => {
    test("should register a new user successfully", async () => {
        const res = await request(app).post("/api/users/register").send({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("email", "testuser@example.com");
    });

    test("should fail if email already exists", async () => {
        const res = await request(app).post("/api/users/register").send({
            username: "testuser2",
            email: "testuser@example.com",
            password: "password123",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message");
    });

    test("should fail if required fields are missing", async () => {
        const res = await request(app).post("/api/users/register").send({
            email: "missing@example.com",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("All fields are required");
    });
});

// ─── User Login ───────────────────────────────────────────────────────────────
describe("POST /api/users/login", () => {
    test("should login with correct credentials", async () => {
        const res = await request(app).post("/api/users/login").send({
            email: "testuser@example.com",
            password: "password123",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    test("should fail with wrong password", async () => {
        const res = await request(app).post("/api/users/login").send({
            email: "testuser@example.com",
            password: "wrongpassword",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Invalid credentials");
    });

    test("should fail if fields are missing", async () => {
        const res = await request(app).post("/api/users/login").send({});
        expect(res.statusCode).toBe(400);
    });
});

// ─── Get Users (Protected) ────────────────────────────────────────────────────
describe("GET /api/users", () => {
    test("should return 401 if no token provided", async () => {
        const res = await request(app).get("/api/users");
        expect(res.statusCode).toBe(401);
    });

    test("should return users list with valid token", async () => {
        // Login first to get token
        const loginRes = await request(app).post("/api/users/login").send({
            email: "testuser@example.com",
            password: "password123",
        });
        const token = loginRes.body.token;

        const res = await request(app)
            .get("/api/users")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
