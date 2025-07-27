import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'admin';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ChatContextType {
  messages: ChatMessage[];
  unreadCount: number;
  sendMessage: (message: string, senderId: string, senderName: string, senderRole: 'student' | 'admin') => void;
  markAsRead: (messageId: string) => void;
  markAllAsRead: () => void;
  getMessagesForUser: (userId: string) => ChatMessage[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '2',
      senderName: 'Professor Maria',
      senderRole: 'admin',
      message: 'Olá! Como posso ajudá-lo hoje?',
      timestamp: new Date(Date.now() - 60000),
      read: false
    }
  ]);

  const unreadCount = messages.filter(msg => !msg.read).length;

  const sendMessage = (message: string, senderId: string, senderName: string, senderRole: 'student' | 'admin') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      senderName,
      senderRole,
      message,
      timestamp: new Date(),
      read: false
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Auto-respond from teacher if student sends message
    if (senderRole === 'student') {
      setTimeout(() => {
        const responses = [
          'Obrigada pela mensagem! Vou responder em breve.',
          'Entendi! Vamos discutir isso na próxima aula.',
          'Ótima pergunta! Te respondo logo.',
          'Certo! Estou aqui para ajudar.',
          'Perfeito! Vamos trabalhar isso juntos.'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const teacherResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: '2',
          senderName: 'Professor Maria',
          senderRole: 'admin',
          message: randomResponse,
          timestamp: new Date(),
          read: false
        };
        
        setMessages(prev => [...prev, teacherResponse]);
      }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const markAllAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  };

  const getMessagesForUser = (userId: string) => {
    return messages.filter(msg => 
      msg.senderId === userId || 
      (userId === '1' && msg.senderRole === 'admin') || 
      (userId === '2' && msg.senderRole === 'student')
    );
  };

  return (
    <ChatContext.Provider value={{
      messages,
      unreadCount,
      sendMessage,
      markAsRead,
      markAllAsRead,
      getMessagesForUser
    }}>
      {children}
    </ChatContext.Provider>
  );
};