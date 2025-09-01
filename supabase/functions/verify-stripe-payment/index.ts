import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error("Session ID é obrigatório");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Initialize Supabase with service role key to bypass RLS
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      const metadata = session.metadata;
      if (!metadata) {
        throw new Error("Metadata do pagamento não encontrada");
      }

      // Determine lessons count based on package
      const lessonsCount = {
        trial: 1,
        package4: 4,
        package8: 8,
        monthly: 12
      }[metadata.package_type] || 1;

      // Create or update student record
      if (metadata.user_id && metadata.user_id !== "guest") {
        // Registered user - update existing student record
        const { error: updateError } = await supabaseService
          .from("students")
          .update({
            remaining_lessons: lessonsCount,
            total_lessons_purchased: lessonsCount,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", metadata.user_id);

        if (updateError) {
          console.error("Error updating student:", updateError);
        }
      }

      // Create lesson package record
      const { error: packageError } = await supabaseService
        .from("lesson_packages")
        .insert({
          student_id: metadata.user_id !== "guest" ? metadata.user_id : null,
          package_name: metadata.package_type,
          lessons_included: lessonsCount,
          total_price: session.amount_total ? session.amount_total / 100 : 0,
          purchase_date: new Date().toISOString(),
          expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
          status: "active"
        });

      if (packageError) {
        console.error("Error creating lesson package:", packageError);
        throw new Error("Erro ao criar pacote de aulas");
      }

      console.log(`Payment verified and processed: ${session_id}`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        package_type: metadata.package_type,
        lessons_count: lessonsCount 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Pagamento não foi concluído" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erro interno do servidor" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});