import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xwtbchjxmsxnnqkrxffh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dGJjaGp4bXN4bm5xa3J4ZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0MDU0ODksImV4cCI6MjA1Mjk4MTQ4OX0.agjhatd4YRK_LW27B04itUN3yBaBhqq2rQsFR_fhI-4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
