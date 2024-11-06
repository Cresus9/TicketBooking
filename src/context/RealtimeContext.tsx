import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface RealtimeContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  joinEventRoom: (eventId: string) => void;
  leaveEventRoom: (eventId: string) => void;
  sendChatMessage: (eventId: string, message: string) => void;
  setTyping: (eventId: string, isTyping: boolean) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socketInstance = io(import.meta.env.VITE_API_URL + '/realtime', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('userOnline', (userId: string) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    });

    socketInstance.on('userOffline', (userId: string) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isAuthenticated, user]);

  const joinEventRoom = (eventId: string) => {
    if (socket) {
      socket.emit('joinEventRoom', eventId);
    }
  };

  const leaveEventRoom = (eventId: string) => {
    if (socket) {
      socket.emit('leaveEventRoom', eventId);
    }
  };

  const sendChatMessage = (eventId: string, message: string) => {
    if (socket) {
      socket.emit('chatMessage', { eventId, message });
    }
  };

  const setTyping = (eventId: string, isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', { eventId, isTyping });
    }
  };

  return (
    <RealtimeContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        joinEventRoom,
        leaveEventRoom,
        sendChatMessage,
        setTyping,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}