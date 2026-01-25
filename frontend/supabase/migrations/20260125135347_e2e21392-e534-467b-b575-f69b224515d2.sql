-- Create enum for analysis status
CREATE TYPE public.analysis_status AS ENUM ('pending', 'running', 'completed', 'failed');

-- Create table to store patient analyses
CREATE TABLE public.patient_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_dob DATE,
    ehr_data JSONB NOT NULL DEFAULT '{}',
    selected_drugs TEXT[] NOT NULL DEFAULT '{}',
    selected_model TEXT NOT NULL,
    analysis_result JSONB,
    status analysis_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patient_analyses ENABLE ROW LEVEL SECURITY;

-- For now, allow public access since we're in sandbox mode (no auth yet)
CREATE POLICY "Allow all operations during sandbox mode"
ON public.patient_analyses
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_patient_analyses_updated_at
BEFORE UPDATE ON public.patient_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();