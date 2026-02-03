import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  Deno.env.get("SERVICE_ROLE_KEY") ??
  Deno.env.get("SUPABASE_SECRET_KEY") ??
  "";
const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID") ?? "";
const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET") ?? "";
const PAYPAL_API_BASE = Deno.env.get("PAYPAL_API_BASE") ?? "https://api-m.paypal.com";
const PAYPAL_PLAN_TOP_BAKER = Deno.env.get("PAYPAL_PLAN_TOP_BAKER") ?? "";
const PAYPAL_PLAN_PREMIUM_BAKER = Deno.env.get("PAYPAL_PLAN_PREMIUM_BAKER") ?? "";

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const getUserFromRequest = async (req: Request) => {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
};

const getPayPalAccessToken = async () => {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal auth failed: ${errorText}`);
  }
  const data = await response.json();
  return data.access_token as string;
};

const planIdToTier = (planId: string | undefined) => {
  if (!planId) return null;
  if (planId === PAYPAL_PLAN_TOP_BAKER) return "top_baker";
  if (planId === PAYPAL_PLAN_PREMIUM_BAKER) return "premium_baker";
  return null;
};

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const user = await getUserFromRequest(req);
    if (!user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const payload = await req.json();
    const { subscriptionId, tier, userId } = payload ?? {};
    if (!subscriptionId || !tier || !userId || userId !== user.id) {
      return jsonResponse({ error: "Invalid payload" }, 400);
    }

    const token = await getPayPalAccessToken();
    const subResponse = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!subResponse.ok) {
      const errorText = await subResponse.text();
      return jsonResponse({ error: errorText }, 400);
    }

    const subscription = await subResponse.json();
    if (subscription.status !== "ACTIVE") {
      return jsonResponse({ error: "Subscription not active" }, 409);
    }

    const resolvedTier = planIdToTier(subscription.plan_id);
    if (!resolvedTier || resolvedTier !== tier) {
      return jsonResponse({ error: "Plan mismatch" }, 409);
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        subscriptiontier: tier,
        paypalsubscriptionid: subscriptionId,
      })
      .eq("id", user.id);

    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});
