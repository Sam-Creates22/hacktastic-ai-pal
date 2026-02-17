
-- Add profile fields to existing profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mobile text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS university_roll_number text,
ADD COLUMN IF NOT EXISTS profile_completed boolean NOT NULL DEFAULT false;

-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamp with time zone NOT NULL,
  created_by uuid NOT NULL,
  visibility text NOT NULL DEFAULT 'shared' CHECK (visibility IN ('private', 'shared')),
  approved boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Users can view approved shared events or their own events
CREATE POLICY "Users can view approved events or own events"
ON public.events FOR SELECT
USING (
  (approved = true AND visibility = 'shared')
  OR (auth.uid() = created_by)
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Users can create events
CREATE POLICY "Users can create events"
ON public.events FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Only admins can update events (approve/reject)
CREATE POLICY "Admins can update events"
ON public.events FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete events
CREATE POLICY "Admins can delete events"
ON public.events FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- System/admins can insert notifications (using service role or admin)
CREATE POLICY "Admins can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = user_id);

-- Allow admins to delete notifications
CREATE POLICY "Admins can delete notifications"
ON public.notifications FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
