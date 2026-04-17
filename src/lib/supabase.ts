import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hunkiopuzhnzyevlibks.supabase.co';
const supabaseAnonKey = 'sb_publishable_xbUA6-IEhSSIEs6rZV43DQ_Z32_b7_X';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
