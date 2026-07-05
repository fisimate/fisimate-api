import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Fisimate API",
      version: "1.0.0",
      description:
        "Dokumentasi REST API untuk platform pembelajaran fisika Fisimate (auth, bank soal/materi/rumus, simulasi, kuis, dashboard, dan manajemen user/siswa).",
    },
    servers: [
      {
        url: "/api/v1",
        description: "Base API path",
      },
    ],
    tags: [
      { name: "Auth", description: "Registrasi, login, OAuth, refresh token" },
      { name: "Users", description: "Profile user & manajemen data siswa (teacher only)" },
      { name: "Chapters", description: "Manajemen bab (teacher only untuk create/update/delete)" },
      { name: "Exam Banks", description: "Bank soal ujian per bab" },
      { name: "Material Banks", description: "Bank materi per bab" },
      { name: "Formula Banks", description: "Bank rumus per bab" },
      { name: "Simulations", description: "Simulasi, materi simulasi, dan progress belajar" },
      { name: "Quizzes", description: "Kuis simulasi, attempt, review, dan generate soal AI" },
      { name: "Dashboard", description: "Statistik dashboard, leaderboard, dan data mobile" },
      { name: "Chatbot", description: "Generator soal pilihan ganda Fisika via SumoPod AI" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Berhasil mendapatkan data!" },
            data: { nullable: true },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Terjadi kesalahan!" },
            data: { nullable: true, example: null },
          },
        },
        Role: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "user" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            fullname: { type: "string" },
            email: { type: "string", format: "email" },
            nis: { type: "string", nullable: true },
            profilePicture: { type: "string", nullable: true },
            roleId: { type: "string", format: "uuid" },
            role: { $ref: "#/components/schemas/Role" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Chapter: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            slug: { type: "string" },
            icon: { type: "string", nullable: true },
            shortDescription: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Bank: {
          type: "object",
          description: "Bentuk umum untuk Exam Bank, Material Bank, dan Formula Bank",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            icon: { type: "string" },
            filePath: { type: "string" },
            chapterId: { type: "string", format: "uuid" },
            chapter: { $ref: "#/components/schemas/Chapter" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Simulation: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            icon: { type: "string" },
            chapterId: { type: "string", format: "uuid" },
            chapter: { $ref: "#/components/schemas/Chapter" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Material: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            filePath: { type: "string" },
            simulationId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        QuizReview: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            filePath: { type: "string" },
            simulationId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        QuizOption: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            text: { type: "string" },
            isCorrect: { type: "boolean" },
            questionId: { type: "string", format: "uuid" },
          },
        },
        Question: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            text: { type: "string" },
            imageUrl: { type: "string", nullable: true },
            simulationId: { type: "string", format: "uuid" },
            quizOptions: {
              type: "array",
              items: { $ref: "#/components/schemas/QuizOption" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        QuizAttempt: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            simulationId: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            score: { type: "number" },
            attemptAt: { type: "string", format: "date-time" },
          },
        },
        SimulationProgress: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            simulationId: { type: "string", format: "uuid" },
            currentStep: { type: "integer" },
            totalSteps: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Input tidak valid",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
            },
          },
        },
        Unauthenticated: {
          description: "Token tidak ada / tidak valid / expired atau role tidak diizinkan",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
            },
          },
        },
        NotFound: {
          description: "Data tidak ditemukan",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
