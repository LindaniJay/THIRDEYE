import { Server } from 'socket.io';

export class ChatController {
  io;
  activeSockets = new Map();
  typingUsers = new Set();

  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production'
          ? [
              process.env.FRONTEND_URL || 'https://your-production-url.com',
              process.env.FRONTEND_URL_ALT || 'https://www.your-production-url.com'
            ]
          : ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      allowEIO3: true
    });

    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    this.io.on('connection', (socket) => {
      this.activeSockets.set(socket.id, socket);

      socket.on('message', (message) => {
        const chatMessage = {
          id: Date.now().toString(),
          text: message.text,
          sender: message.sender,
          timestamp: new Date().toISOString(),
        };

        this.io.emit('message', chatMessage);
      });

      socket.on('typing', (isTyping) => {
        if (isTyping) {
          this.typingUsers.add(socket.id);
        } else {
          this.typingUsers.delete(socket.id);
        }
        socket.broadcast.emit('typing', this.typingUsers.size > 0);
      });

      socket.on('disconnect', () => {
        this.activeSockets.delete(socket.id);
        this.typingUsers.delete(socket.id);
        socket.broadcast.emit('typing', this.typingUsers.size > 0);
      });
    });
  }

  sendSystemMessage(message) {
    this.io.emit('message', {
      id: Date.now().toString(),
      text: message,
      sender: 'system',
      timestamp: new Date().toISOString(),
    });
  }
}

export default ChatController;



