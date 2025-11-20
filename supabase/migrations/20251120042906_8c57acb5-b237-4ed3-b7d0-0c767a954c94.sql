-- Fix search_path for update_user_level function
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.level = FLOOR(NEW.total_spent / 10)::INTEGER;
  IF NEW.level > 100 THEN
    NEW.level = 100;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;