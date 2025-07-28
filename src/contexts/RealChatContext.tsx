import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  unreadCount: number;
  sendMessage: (message: string, recipientId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getMessagesForConversation: (userId1: string, userId2: string) => ChatMessage[];
  getConversations: () => { userId: string; userName: string; lastMessage: ChatMessage | null; unreadCount: number }[];
  isLoading: boolean;
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();

  const unreadCount = messages.filter(msg => 
    msg.recipient_id === user?.id && !msg.is_read
  ).length;

  // Fetch messages
  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      const messagesWithSenderInfo = data.map(msg => ({
        ...msg,
        sender_name: 'Usuário',
        sender_role: 'student'
      }));

      setMessages(messagesWithSenderInfo);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    fetchMessages();

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          // Refetch messages when there's a change
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sendMessage = async (message: string, recipientId: string): Promise<void> => {
    if (!user || !message.trim()) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          message: message.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Erro ao enviar mensagem');
        return;
      }

      // The real-time subscription will handle updating the UI
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  const markAsRead = async (messageId: string): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('recipient_id', user.id);

      if (error) {
        console.error('Error marking message as read:', error);
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all messages as read:', error);
      }
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  };

  const getMessagesForConversation = (userId1: string, userId2: string): ChatMessage[] => {
    return messages.filter(msg => 
      (msg.sender_id === userId1 && msg.recipient_id === userId2) ||
      (msg.sender_id === userId2 && msg.recipient_id === userId1)
    );
  };

  const getConversations = () => {
    if (!user) return [];

    const conversationMap = new Map();
    
    messages.forEach(msg => {
      const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
      const otherUserName = msg.sender_id === user.id ? 'Outro usuário' : (msg.sender_name || 'Usuário');
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: msg,
          unreadCount: 0
        });
      } else {
        const existing = conversationMap.get(otherUserId);
        if (new Date(msg.created_at) > new Date(existing.lastMessage.created_at)) {
          existing.lastMessage = msg;
        }
      }
      
      // Count unread messages
      if (msg.recipient_id === user.id && !msg.is_read) {
        const conversation = conversationMap.get(otherUserId);
        conversation.unreadCount++;
      }
    });

    return Array.from(conversationMap.values());
  };

  return (
    <ChatContext.Provider value={{
      messages,
      unreadCount,
      sendMessage,
      markAsRead,
      markAllAsRead,
      getMessagesForConversation,
      getConversations,
      isLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
};