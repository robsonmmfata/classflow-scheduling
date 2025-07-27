import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, User } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { messages, unreadCount, sendMessage, markAllAsRead, getMessagesForUser } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const userMessages = user ? getMessagesForUser(user.id) : [];

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [userMessages]);

  useEffect(() => {
    if (isOpen) {
      markAllAsRead();
    }
  }, [isOpen, markAllAsRead]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;
    
    sendMessage(message, user.id, user.name, user.role);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative rounded-full w-16 h-16 bg-gradient-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white text-xs flex items-center justify-center p-0">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 h-96 shadow-xl border-0 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm">Chat com a Professora</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-3 gap-3">
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="space-y-3 pr-3">
              {userMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderRole === user?.role ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2 rounded-lg text-sm ${
                      msg.senderRole === user?.role
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-medium text-xs">
                        {msg.senderName}
                      </span>
                      <span className="text-xs opacity-70">
                        {msg.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="break-words">{msg.message}</p>
                  </div>
                </div>
              ))}
              
              {userMessages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Inicie uma conversa com a professora!</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm"
              disabled={!user}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim() || !user}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {!user && (
            <p className="text-xs text-muted-foreground text-center">
              Faça login para enviar mensagens
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;