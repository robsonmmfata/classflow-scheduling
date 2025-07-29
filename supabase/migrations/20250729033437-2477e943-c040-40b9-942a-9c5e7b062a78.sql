-- Primeiro, remover a constraint existente
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Criar nova constraint que inclui 'teacher'
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'admin', 'teacher'));