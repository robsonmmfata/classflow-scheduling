-- First let's make sure we have the right structure for real-time chat
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

-- Add chat_messages to realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Create an index for better performance on queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_participants ON public.chat_messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Create a view to get conversations with user info
CREATE OR REPLACE VIEW public.chat_conversations AS
SELECT DISTINCT
  CASE 
    WHEN cm.sender_id < cm.recipient_id 
    THEN cm.sender_id 
    ELSE cm.recipient_id 
  END as user1_id,
  CASE 
    WHEN cm.sender_id < cm.recipient_id 
    THEN cm.recipient_id 
    ELSE cm.sender_id 
  END as user2_id,
  p1.display_name as user1_name,
  p1.role as user1_role,
  p2.display_name as user2_name,
  p2.role as user2_role,
  (SELECT message FROM public.chat_messages 
   WHERE (sender_id = user1_id AND recipient_id = user2_id) 
      OR (sender_id = user2_id AND recipient_id = user1_id)
   ORDER BY created_at DESC LIMIT 1) as last_message,
  (SELECT created_at FROM public.chat_messages 
   WHERE (sender_id = user1_id AND recipient_id = user2_id) 
      OR (sender_id = user2_id AND recipient_id = user1_id)
   ORDER BY created_at DESC LIMIT 1) as last_message_at,
  (SELECT COUNT(*) FROM public.chat_messages 
   WHERE recipient_id = user1_id AND sender_id = user2_id AND is_read = false) as user1_unread,
  (SELECT COUNT(*) FROM public.chat_messages 
   WHERE recipient_id = user2_id AND sender_id = user1_id AND is_read = false) as user2_unread
FROM public.chat_messages cm
LEFT JOIN public.profiles p1 ON p1.user_id = (
  CASE 
    WHEN cm.sender_id < cm.recipient_id 
    THEN cm.sender_id 
    ELSE cm.recipient_id 
  END
)
LEFT JOIN public.profiles p2 ON p2.user_id = (
  CASE 
    WHEN cm.sender_id < cm.recipient_id 
    THEN cm.recipient_id 
    ELSE cm.sender_id 
  END
);