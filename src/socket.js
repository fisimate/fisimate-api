import { Server } from "socket.io";
import geminiModel from "./lib/gemini.js";
import prisma from "./lib/prisma.js";

const setupSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected!`);

    socket.on("generate", async (message) => {
      try {
        const { text } = message;

        const prompt = `Buatkan saya soal tentang ${text} dan berikan response dengan format: {"questions": "<<soal akan berada disini>>","options": [{"option": "<<pilihan jawaban 1>>","correct": <<boolean>>},{"option": "<<pilihan jawaban 2>>","correct": <<boolean>>},{"option": "<<pilihan jawaban 3>>","correct": <<boolean>>},{"option": "<<pilihan jawaban 4>>","correct": <<boolean>>}]}`;

        // make a prompt + text
        const geminiResponse = await geminiModel.generateContent(prompt);

        const result = await geminiResponse.response;

        let response = result.text();

        // clear the response
        if (response.startsWith("```json") && response.endsWith("```")) {
          response = response.slice(7, -3).trim();
        }

        // convert to json
        const jsonResponse = JSON.parse(response);

        socket.emit("response", jsonResponse);
      } catch (error) {
        socket.emit("error", `Internal server Error ${error}`);
      }
    });

    socket.on("save", async (message) => {
      try {
        const { simulationId, questions, options } = message;

        const createdQuestion = await prisma.question.create({
          data: {
            simulationId,
            text: questions,
            quizOptions: {
              create: options.map((option) => ({
                text: option.option,
                isCorrect: option.correct,
              })),
            },
          },
          include: {
            quizOptions: true,
          },
        });

        socket.emit("saveSuccess", "Question saved successfully!");
      } catch (error) {
        socket.emit("error", `Internal server Error ${error}`);
      }
    });
  });

  return io;
};

export default setupSocket;
