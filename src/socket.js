import { Server } from "socket.io";
import geminiModel from "./lib/gemini.js";

const setupSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected!`);

    socket.on("generate", async (message) => {
      try {
        const { text } = message;

        // make a prompt + text
        const geminiResponse = await geminiModel.generateContent(text);

        const result = await geminiResponse.response;

        // convert to json

        // make logic to create question and option

        socket.emit("response", result.text());
      } catch (error) {
        socket.emit("error", `Internal server Error ${error}`);
      }
    });
  });

  return io;
};

export default setupSocket;
