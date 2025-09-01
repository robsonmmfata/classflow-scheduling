import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packageType, studentInfo, isGuest = false } = await req.json();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    let user = null;
    let customerEmail = "guest@brazucaportuguese.com";

    // Get user if not guest
    if (!isGuest) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        user = data.user;
        if (user?.email) {
          customerEmail = user.email;
        }
      }
    } else if (studentInfo?.email) {
      customerEmail = studentInfo.email;
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Package pricing configuration
    const packagePricing = {
      trial: {
        name: "Aula Experimental",
        price: 2500, // $25.00
        description: "Uma aula de 25 minutos para experimentar nossa metodologia"
      },
      package4: {
        name: "Pacote 4 Aulas",
        price: 18000, // $180.00
        description: "Quatro aulas de 50 minutos - Ideal para começar"
      },
      package8: {
        name: "Pacote 8 Aulas", 
        price: 32000, // $320.00
        description: "Oito aulas de 50 minutos - Melhor custo-benefício"
      },
      monthly: {
        name: "Plano Mensal",
        price: 48000, // $480.00
        description: "Doze aulas mensais - Máximo aproveitamento"
      }
    };

    const selectedPackage = packagePricing[packageType as keyof typeof packagePricing];
    if (!selectedPackage) {
      throw new Error("Pacote inválido selecionado");
    }

    // Check if customer exists
    const customers = await stripe.customers.list({ 
      email: customerEmail, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: selectedPackage.name,
              description: selectedPackage.description
            },
            unit_amount: selectedPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel`,
      metadata: {
        package_type: packageType,
        user_id: user?.id || "guest",
        student_email: customerEmail,
        student_name: studentInfo?.name || "",
        student_phone: studentInfo?.phone || ""
      }
    });

    // Log payment attempt
    console.log(`Stripe payment created: ${session.id} for ${customerEmail} - ${selectedPackage.name}`);

    return new Response(JSON.stringify({ 
      url: session.url,
      session_id: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Stripe payment error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erro interno do servidor" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});