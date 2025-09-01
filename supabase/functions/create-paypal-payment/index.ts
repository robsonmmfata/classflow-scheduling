import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packageType, studentInfo } = await req.json();

    const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
    const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
    const environment = Deno.env.get("PAYPAL_ENVIRONMENT") || "sandbox";
    
    if (!clientId || !clientSecret) {
      throw new Error("PayPal credentials not configured");
    }

    // PayPal API base URL
    const baseURL = environment === "sandbox" 
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com";

    // Get PayPal access token
    const authResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en_US",
        "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });

    if (!authResponse.ok) {
      throw new Error("Failed to get PayPal access token");
    }

    const { access_token } = await authResponse.json();

    // Package pricing configuration
    const packagePricing = {
      trial: {
        name: "Aula Experimental",
        value: "25.00",
        description: "Uma aula de 25 minutos para experimentar nossa metodologia"
      },
      package4: {
        name: "Pacote 4 Aulas",
        value: "180.00", 
        description: "Quatro aulas de 50 minutos - Ideal para começar"
      },
      package8: {
        name: "Pacote 8 Aulas",
        value: "320.00",
        description: "Oito aulas de 50 minutos - Melhor custo-benefício"
      },
      monthly: {
        name: "Plano Mensal",
        value: "480.00",
        description: "Doze aulas mensais - Máximo aproveitamento"
      }
    };

    const selectedPackage = packagePricing[packageType as keyof typeof packagePricing];
    if (!selectedPackage) {
      throw new Error("Pacote inválido selecionado");
    }

    // Create PayPal order
    const orderResponse = await fetch(`${baseURL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "PayPal-Request-Id": crypto.randomUUID()
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: `${packageType}_${Date.now()}`,
            amount: {
              currency_code: "USD",
              value: selectedPackage.value
            },
            description: selectedPackage.description,
            custom_id: JSON.stringify({
              package_type: packageType,
              student_email: studentInfo?.email || "",
              student_name: studentInfo?.name || "",
              student_phone: studentInfo?.phone || ""
            })
          }
        ],
        application_context: {
          return_url: `${req.headers.get("origin")}/payment-success`,
          cancel_url: `${req.headers.get("origin")}/payment-cancel`,
          brand_name: "Brazuca Portuguese",
          locale: "pt-BR",
          landing_page: "BILLING",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW"
        }
      })
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error("PayPal order creation error:", errorData);
      throw new Error("Failed to create PayPal order");
    }

    const orderData = await orderResponse.json();
    
    // Find approval URL
    const approvalUrl = orderData.links.find(
      (link: any) => link.rel === "approve"
    )?.href;

    if (!approvalUrl) {
      throw new Error("PayPal approval URL not found");
    }

    console.log(`PayPal payment created: ${orderData.id} for ${studentInfo?.email || 'guest'} - ${selectedPackage.name}`);

    return new Response(JSON.stringify({ 
      url: approvalUrl,
      order_id: orderData.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("PayPal payment error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erro interno do servidor" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});