// This is a helper function to add the Stripe secret key
// Run this once to configure your Stripe integration

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  return new Response(
    JSON.stringify({
      message: "Para adicionar as chaves secretas do Stripe:",
      steps: [
        "1. Vá para o Supabase Dashboard",
        "2. Navegue até Edge Functions → Settings",
        "3. Adicione as seguintes secrets:",
        "   - STRIPE_SECRET_KEY: sua chave secreta do Stripe",
        "   - PAYPAL_CLIENT_ID: seu client ID do PayPal", 
        "   - PAYPAL_CLIENT_SECRET: seu client secret do PayPal",
        "4. Essas chaves estarão disponíveis em todas as edge functions"
      ],
      stripe_dashboard: "https://dashboard.stripe.com/apikeys",
      paypal_dashboard: "https://developer.paypal.com/developer/applications"
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}