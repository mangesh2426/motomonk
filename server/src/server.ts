import authRoutes from './routes/authRoutes';
import leadRoutes from "./routes/leadRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import whatsappRoutes from "./routes/whatsappRoutes";
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

// Connect to database
connectDB();

import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For dev
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  
  // Admin joins a specific room to receive all live chats
  socket.on('join_admin', () => {
    socket.join('admin_room');
    console.log('Admin joined room:', socket.id);
  });

  // Client sends a message -> broadcast to admin room
  socket.on('client_message', (data) => {
    // data: { text, sender: 'user', sessionId }
    io.to('admin_room').emit('receive_client_message', { ...data, sessionId: socket.id });
  });

  // Admin takes over and sends a message to specific client
  socket.on('admin_message', (data) => {
    // data: { text, sessionId }
    io.to(data.sessionId).emit('receive_admin_message', { text: data.text, sender: 'admin', id: Date.now().toString() });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    io.to('admin_room').emit('client_disconnected', socket.id);
  });
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://motomonk-invj.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use("/api/leads", leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Moto Monk API is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
