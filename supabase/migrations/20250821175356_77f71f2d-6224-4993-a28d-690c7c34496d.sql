-- Create shared_code table for storing shared code snippets
CREATE TABLE public.shared_code (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  html TEXT NOT NULL,
  css TEXT NOT NULL,
  javascript TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.shared_code ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anyone can read shared code)
CREATE POLICY "Shared code is viewable by everyone" 
ON public.shared_code 
FOR SELECT 
USING (expires_at > now());

-- Create policy for inserting (anyone can create a share)
CREATE POLICY "Anyone can create shared code" 
ON public.shared_code 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster lookups by expiration
CREATE INDEX idx_shared_code_expires_at ON public.shared_code(expires_at);

-- Create function to clean up expired shares
CREATE OR REPLACE FUNCTION public.cleanup_expired_shares()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.shared_code 
  WHERE expires_at < now();
END;
$$;