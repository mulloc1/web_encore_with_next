// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

console.log("getAllArchiveBoard");

const header = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": Deno.env.get("NEXT_PUBLIC_ORIGIN") ||
    "*",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": Deno.env.get("NEXT_PUBLIC_ORIGIN") ||
          "*", // 개발 환경 모든 출처 허용, 운영 환경에서는 특정 출처만 허용
        "Access-Control-Allow-Methods": "GET, OPTIONS", // 허용된 메서드
        "Access-Control-Allow-Headers": "x-client-info, apikey, Authorization",
        "Content-Type": "application/json",
      },
    });
  }
  let page: number;
  let sd: string;
  let sgg: string;
  let category: string;
  let majorName: string;

  try {
    const url = new URL(req.url);
    page = parseInt(url.searchParams.get("page") || "0");
    sd = url.searchParams.get("sd") || "";
    sgg = url.searchParams.get("sgg") || "";
    category = url.searchParams.get("category") || "";
    majorName = url.searchParams.get("majorName") || "";
  } catch (error) {
    console.error("데이터 불러오기 오류:", error);
    return new Response(
      JSON.stringify({ error: "데이터를 불러오는데 실패했습니다" }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  // sd ,sgg, category, majorName

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    let query = supabaseClient.from("archiveBoard")
      .select(`
        *,
        major!inner(category, majorName),
        locale!inner(sd, sgg)
      `);
    if (sd != "") {
      query = query.eq("locale.sd", sd);
      if (sgg != "") {
        query = query.eq("locale.sgg", sgg);
      }
    }
    if (category != "") {
      query = query.eq("major.category", category);
      if (majorName != "") {
        query = query.eq("major.majorName", majorName);
      }
    }
    const { data, error } = await query
      .order("createdAt", { ascending: false })
      .range(page * 8, ((page + 1) * 8) - 1);

    console.log(data);

    if (error) {
      console.error("데이터 불러오기 오류:", error);
      return new Response(
        JSON.stringify({ error: "데이터를 불러오는데 실패했습니다" }),
        {
          headers: header,
        },
      );
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: header,
      },
    );
  } catch (error) {
    console.error("데이터 불러오기 오류:", error);
    return new Response(
      JSON.stringify({ error: "데이터를 불러오는데 실패했습니다" }),
      {
        headers: header,
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/getAllArchiveBoard' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'
*/
