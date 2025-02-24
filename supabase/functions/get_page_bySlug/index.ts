import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import "https://deno.land/std@0.217.0/dotenv/load.ts";

const supabaseKey:string = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabaseUrl:string = Deno.env.get('SUPABASE_URL')!;

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  const { slug } = await req.json();

  if (!slug) {
    return new Response(JSON.stringify({ error: "Missing slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } 

  const { data, error } = await supabase.from("Page").select("*").match({"slug":slug});

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    
  });
});
