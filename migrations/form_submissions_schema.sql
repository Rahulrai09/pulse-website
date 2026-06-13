-- PULSE FORM SUBMISSIONS TABLE
-- This table stores all enquiries, demo requests, and quote requests from the public website.

CREATE TABLE IF NOT EXISTS public.form_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    form_type TEXT NOT NULL, -- 'contact', 'demo', 'quote', etc.
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    source_page TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
    notes TEXT, -- Internal notes for admin use
    updated_by UUID -- Admin user ID who last updated the record
);

-- Enable Row Level Security
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT into this table (Public Forms)
CREATE POLICY "Enable insert for anonymous users" ON public.form_submissions
    FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated users (Admins) to manage all submissions
CREATE POLICY "Enable read/write for authenticated admins" ON public.form_submissions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON public.form_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON public.form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON public.form_submissions(created_at DESC);
