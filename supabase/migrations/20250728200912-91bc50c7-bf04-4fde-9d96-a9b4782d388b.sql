-- Fix security issues by updating functions with secure search_path

-- Drop and recreate function to update timestamps with secure search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop and recreate function to handle new user registration with secure search_path
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')
  );
  
  -- If the user is a student, also create a student record
  IF COALESCE(NEW.raw_user_meta_data ->> 'role', 'student') = 'student' THEN
    INSERT INTO public.students (user_id, name, email)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
      NEW.email
    );
  END IF;
  
  RETURN NEW;
END;
$$;