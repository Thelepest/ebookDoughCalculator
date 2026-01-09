const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

// --- PayPal Configuration ---
// TODO: Set these in your Firebase environment config
// firebase functions:config:set paypal.client_id="YOUR_PAYPAL_CLIENT_ID"
// firebase functions:config:set paypal.client_secret="YOUR_PAYPAL_CLIENT_SECRET"
// firebase functions:config:set paypal.webhook_id="YOUR_PAYPAL_WEBHOOK_ID"
const PAYPAL_CLIENT_ID = functions.config().paypal.client_id;
const PAYPAL_CLIENT_SECRET = functions.config().paypal.client_secret;
const PAYPAL_WEBHOOK_ID = functions.config().paypal.webhook_id;

// Use 'https://api-m.paypal.com' for production
const PAYPAL_API_BASE_URL = "https://api-m.sandbox.paypal.com";

/**
 * Generates a PayPal access token.
 */
async function generateAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await axios.post(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, "grant_type=client_credentials", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`,
        },
    });
    return response.data.access_token;
}

/**
 * Verifies a PayPal webhook signature.
 */
async function verifyPayPalWebhook(headers, rawBody) {
    try {
        const accessToken = await generateAccessToken();
        const verificationUrl = `${PAYPAL_API_BASE_URL}/v1/notifications/verify-webhook-signature`;

        const response = await axios.post(verificationUrl, {
            transmission_id: headers["paypal-transmission-id"],
            transmission_time: headers["paypal-transmission-time"],
            cert_url: headers["paypal-cert-url"],
            auth_algo: headers["paypal-auth-algo"],
            transmission_sig: headers["paypal-transmission-sig"],
            webhook_id: PAYPAL_WEBHOOK_ID,
            webhook_event: JSON.parse(rawBody),
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        return response.data.verification_status === "SUCCESS";
    } catch (error) {
        functions.logger.error("Error verifying PayPal webhook:", error);
        return false;
    }
}

/**
 * Handles incoming webhooks from PayPal.
 */
exports.paypalWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    const isVerified = await verifyPayPalWebhook(req.headers, req.rawBody);

    if (!isVerified) {
        functions.logger.warn("PayPal webhook verification failed!");
        return res.status(403).send("Webhook verification failed");
    }

    functions.logger.info("PayPal webhook successfully verified!");

    const event = req.body;
    const eventType = event.event_type;

    try {
        switch (eventType) {
            case "BILLING.SUBSCRIPTION.CANCELLED": {
                const subscription = event.resource;
                const paypalSubscriptionId = subscription.id;

                // Find the user with this subscription ID
                const usersRef = admin.firestore().collection("users");
                const snapshot = await usersRef.where("paypalSubscriptionId", "==", paypalSubscriptionId).limit(1).get();

                if (snapshot.empty) {
                    functions.logger.warn(`No user found for PayPal subscription ID: ${paypalSubscriptionId}`);
                    break;
                }

                const userDoc = snapshot.docs[0];
                await userDoc.ref.update({
                    subscriptionTier: "free",
                });

                functions.logger.info(`Subscription cancelled for user ${userDoc.id}. Tier set to free.`);
                break;
            }

            case "BILLING.SUBSCRIPTION.ACTIVATED": {
                 // This is a good backup for the client-side onApprove.
                 const subscription = event.resource;
                 const customId = subscription.custom_id; // We will need to pass this from the client
 
                 if (!customId) {
                     functions.logger.error("No custom_id found in activated subscription webhook.");
                     break;
                 }
 
                 const [userId, tier] = customId.split('|');
 
                 if (!userId || !tier) {
                     functions.logger.error(`Invalid custom_id format: ${customId}`);
                     break;
                 }
 
                 await admin.firestore().collection("users").doc(userId).update({
                     subscriptionTier: tier,
                     paypalSubscriptionId: subscription.id,
                 });
 
                 functions.logger.info(`Subscription activated via webhook for user ${userId}. Tier set to ${tier}.`);
                 break;
            }

            default:
                functions.logger.info(`Unhandled PayPal event type: ${eventType}`);
                break;
        }

        res.status(200).send("Webhook received and processed");

    } catch (error) {
        functions.logger.error("Error processing PayPal webhook event:", error);
        res.status(500).send("Internal Server Error");
    }
});
