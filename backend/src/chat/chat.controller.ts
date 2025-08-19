import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

export class ChatController {
  private io: Server;
  private activeSockets: Map<string, Socket> = new Map();
  private typingUsers: Set<string> = new Set();

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? ['https://your-production-url.com', 'https://www.your-production-url.com']
          : ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      allowEIO3: true
    });

    this.initializeSocketEvents();
  }

  private initializeSocketEvents() {
    this.io.on('connection', (socket: Socket) => {
      console.log('New client connected:', socket.id);
      this.activeSockets.set(socket.id, socket);

      // Handle new messages
      socket.on('message', (message: { text: string; sender: string }) => {
        const chatMessage = {
          id: Date.now().toString(),
          text: message.text,
          sender: message.sender,
          timestamp: new Date().toISOString(),
        };

        // Broadcast to all connected clients
        this.io.emit('message', chatMessage);
      });

      // Handle typing indicators
      socket.on('typing', (isTyping: boolean) => {
        if (isTyping) {
          this.typingUsers.add(socket.id);
        } else {
          this.typingUsers.delete(socket.id);
        }
        
        // Emit to all clients except the sender
        socket.broadcast.emit('typing', this.typingUsers.size > 0);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        this.activeSockets.delete(socket.id);
        this.typingUsers.delete(socket.id);
        
        // Update typing status for remaining users
        socket.broadcast.emit('typing', this.typingUsers.size > 0);
      });
    });
  }

  // Method to send system messages (e.g., when an expert joins the chat)
  public sendSystemMessage(message: string) {
    this.io.emit('message', {
      id: Date.now().toString(),
      text: message,
      sender: 'system',
      timestamp: new Date().toISOString(),
    });
  }
}

export default ChatController;
