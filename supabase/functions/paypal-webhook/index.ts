import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? "";
const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID") ?? "";
const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET") ?? "";
const PAYPAL_WEBHOOK_ID = Deno.env.get("PAYPAL_WEBHOOK_ID") ?? "";
const PAYPAL_API_BASE = Deno.env.get("PAYPAL_API_BASE") ?? "https://api-m.paypal.com";
const PAYPAL_PLAN_TOP_BAKER = Deno.env.get("PAYPAL_PLAN_TOP_BAKER") ?? "";
const PAYPAL_PLAN_PREMIUM_BAKER = Deno.env.get("PAYPAL_PLAN_PREMIUM_BAKER") ?? "";

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

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
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    if (!PAYPAL_WEBHOOK_ID) {
      return jsonResponse({ error: "Missing PAYPAL_WEBHOOK_ID" }, 400);
    }

    const token = await getPayPalAccessToken();
    const webhookEvent = await req.json();

    const verifyPayload = {
      auth_algo: req.headers.get("paypal-auth-algo"),
      cert_url: req.headers.get("paypal-cert-url"),
      transmission_id: req.headers.get("paypal-transmission-id"),
      transmission_sig: req.headers.get("paypal-transmission-sig"),
      transmission_time: req.headers.get("paypal-transmission-time"),
      webhook_id: PAYPAL_WEBHOOK_ID,
      webhook_event: webhookEvent,
    };

    const verifyResponse = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyPayload),
    });

    const verifyData = await verifyResponse.json();
    if (!verifyResponse.ok || verifyData.verification_status !== "SUCCESS") {
      return jsonResponse({ error: "Invalid webhook signature" }, 400);
    }

    const subscriptionId = webhookEvent?.resource?.id || webhookEvent?.resource?.billing_agreement_id;
    const planId = webhookEvent?.resource?.plan_id;
    const tier = planIdToTier(planId);
    if (!subscriptionId || !tier) {
      return jsonResponse({ received: true });
    }

    if (["BILLING.SUBSCRIPTION.ACTIVATED", "BILLING.SUBSCRIPTION.UPDATED"].includes(webhookEvent.event_type)) {
      await supabaseAdmin
        .from("users")
        .update({
          subscriptiontier: tier,
          paypalsubscriptionid: subscriptionId,
        })
        .eq("paypalsubscriptionid", subscriptionId);
    }

    if (["BILLING.SUBSCRIPTION.CANCELLED", "BILLING.SUBSCRIPTION.SUSPENDED", "BILLING.SUBSCRIPTION.EXPIRED"].includes(webhookEvent.event_type)) {
      await supabaseAdmin
        .from("users")
        .update({
          subscriptiontier: "free",
          paypalsubscriptionid: null,
        })
        .eq("paypalsubscriptionid", subscriptionId);
    }

    return jsonResponse({ received: true });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});
