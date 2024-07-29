// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Get these values from your Supabase project settings
const supabaseUrl = 'https://ztmblpbgyagrsefigaqz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0bWJscGJneWFncnNlZmlnYXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNDI1MjMsImV4cCI6MjAzNzgxODUyM30.-dRKbkqu9bLwVC6m32YWLVAfG30gB90Vy_Fw84zVEow';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
