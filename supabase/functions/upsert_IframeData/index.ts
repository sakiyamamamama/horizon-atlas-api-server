import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import "https://deno.land/std@0.217.0/dotenv/load.ts";

const supabaseKey: string = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabaseUrl: string = Deno.env.get('SUPABASE_URL')!;

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  try {
    const { slug,ogs_data,blockId } = await req.json();

    if (!slug || !ogs_data || !blockId) {
      return new Response(JSON.stringify({ error: "Missing slug or ogs_data or blockId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const { data:get_data, error:get_err } = await supabase.from("IframeData").select("*").match({"blockId":blockId});

    if (get_err) {
      return new Response(JSON.stringify({ error: get_err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if(!get_data || get_data.length === 0){
      const { data, error } = await supabase.from("IframeData").insert([
        {data:ogs_data,slug,blockId}
      ]);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    
      return new Response(JSON.stringify({ message: "Insert successfully",data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }else{
      const { data, error } = await supabase.from("IframeData").update(
        {data:ogs_data}
      ).eq("blockId", blockId).select("*");
  
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      if (!data || data.length === 0) {
        return new Response(JSON.stringify({ error: "No matching record found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      return new Response(JSON.stringify({ message: "Update successfully", updated: data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } 

  } catch (err) {
    return new Response(JSON.stringify({ error: `Invalid request: ${err}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
