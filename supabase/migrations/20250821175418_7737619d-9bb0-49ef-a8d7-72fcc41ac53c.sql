-- Fix the cleanup function to have proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_shares()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.shared_code 
  WHERE expires_at < now();
END;
$$;