import { Server } from "socket.io";
import geminiModel from "./lib/gemini.js";

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

        // clear the response
        if (result.startsWith("```json") && result.endsWith("```")) {
          result = result.slice(7, -3).trim();
        }

        // convert to json
        const jsonResponse = JSON.parse(result.text());

        // make logic to create question and option

        socket.emit("response", jsonResponse);
      } catch (error) {
        socket.emit("error", `Internal server Error ${error}`);
      }
    });
  });

  return io;
};

export default setupSocket;
