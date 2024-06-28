import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected!`);

    socket.on("generate", () => {
      const responseMessage = `Response to ${socket.id}`;
      socket.emit("response", responseMessage);
    });
  });

  return io;
};

export default setupSocket;
