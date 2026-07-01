import { createClient } from "@supabase/supabase-js";
import configs from "../configs/index.js";

const supabase = createClient(configs.supabaseProjectUrl, configs.supabaseAPIKey)

export default supabase