import type { Component } from "@/lib/types";
import { meta, rule, scaling } from "./helpers";

export const PAYMENTS: Component[] = [
  {
    id: "stripe",
    layer: "payments",
    name: "Stripe",
    summary:
      "Default payments API for one-time, subscriptions, and Connect marketplaces in many countries.",
    plainSummary:
      "The most common way to take cards and subscriptions on the internet.",
    tags: ["payments"],
    rules: [
      rule(
        { field: "payments", anyOf: ["once", "subscriptions", "marketplace"] },
        3,
        "Stripe covers these models.",
      ),
      rule(
        { field: "payments", is: "regional" },
        -1,
        "You may still need a local gateway.",
      ),
      rule(
        { field: "payments", is: "iap" },
        -2,
        "App Store purchases go through Apple/Google, not Stripe.",
      ),
      rule({ field: "payments", is: "none" }, "exclude", "No payments."),
    ],
    scaling: scaling(
      "Checkout or Billing for v1.",
      "Webhooks, Radar, and customer portal.",
      "Connect or a dedicated payments service; never store raw cards if you can avoid PCI.",
    ),
    pros: ["APIs.", "Subscriptions.", "Connect."],
    cons: ["Not every local method.", "You still handle tax/VAT."],
    meta: meta(3, 3, false, ["https://docs.stripe.com/"]),
  },
  {
    id: "paddle",
    layer: "payments",
    name: "Paddle / Lemon Squeezy",
    summary:
      "Merchant of record. They handle tax; you get a simpler SaaS checkout.",
    plainSummary:
      "They sell your software for you and handle sales tax — simpler for many online products.",
    tags: ["payments", "low-ops"],
    rules: [
      rule(
        { field: "payments", anyOf: ["once", "subscriptions"] },
        2,
        "MoR is a good SaaS fit.",
      ),
      rule(
        { field: "product", is: "webapp" },
        1,
        "SaaS checkouts are the buyer.",
      ),
      rule(
        { field: "payments", is: "marketplace" },
        -2,
        "MoR is the wrong model for a two-sided marketplace.",
      ),
      rule({ field: "payments", is: "none" }, "exclude", "No payments."),
    ],
    scaling: scaling(
      "Overlay checkout.",
      "Webhooks into entitlements.",
      "Stay until you outgrow their country coverage or need Connect-style payouts.",
    ),
    pros: ["Tax as MoR.", "Simple."],
    cons: ["Less control.", "Fees."],
    meta: meta(2, 3, false, ["https://developer.paddle.com/"]),
  },
  {
    id: "razorpay",
    layer: "payments",
    name: "Razorpay",
    summary: "Strong for India (UPI, local cards) and nearby methods.",
    plainSummary:
      "A payments company that is a better fit when customers pay with UPI and local methods.",
    tags: ["payments"],
    rules: [
      rule(
        { field: "payments", is: "regional" },
        3,
        "Regional methods like UPI are the point.",
      ),
      rule(
        { field: "geo", is: "one-region" },
        1,
        "A local gateway matches a local market.",
      ),
      rule({ field: "payments", is: "none" }, "exclude", "No payments."),
    ],
    scaling: scaling(
      "Standard checkout.",
      "Webhooks and settlements.",
      "Add a global processor if you expand countries.",
    ),
    pros: ["Local methods."],
    cons: ["Not a global default."],
    meta: meta(2, 3, false, ["https://razorpay.com/docs/"]),
  },
  {
    id: "adyen",
    layer: "payments",
    name: "Adyen",
    summary:
      "Enterprise global acquiring. Right when you are already large or need unified worldwide acquiring.",
    plainSummary:
      "A payments platform for large companies that sell in many countries.",
    tags: ["payments", "hyperscale"],
    rules: [
      rule(
        { field: "payments", anyOf: ["once", "subscriptions", "marketplace"] },
        1,
        "Adyen can do these.",
      ),
      rule(
        { field: "scaleAmbition", anyOf: ["global", "billion"] },
        2,
        "Global acquiring is the point.",
      ),
      rule(
        { field: "budget", is: "enterprise" },
        2,
        "Enterprise sales motion.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -3,
        "Wrong first processor.",
      ),
      rule({ field: "payments", is: "none" }, "exclude", "No payments."),
    ],
    scaling: scaling(
      "Do not start here unless you already have an Adyen relationship.",
      "Unified commerce APIs.",
      "This is already a global acquiring shape.",
    ),
    pros: ["Global.", "Unified."],
    cons: ["Enterprise sales.", "Overkill for v1."],
    meta: meta(2, 3, false, ["https://docs.adyen.com/"]),
  },
  {
    id: "revenuecat",
    layer: "payments",
    name: "RevenueCat",
    summary:
      "Entitlements for App Store and Play billing. The right IAP layer.",
    plainSummary:
      "Helps iPhone and Android in-app purchases without you fighting both stores alone.",
    tags: ["payments"],
    synergy: [
      {
        with: "expo",
        bonus: 2,
        reason: "RevenueCat has first-class React Native support.",
      },
      { with: "flutter", bonus: 1, reason: "Official Flutter SDK." },
    ],
    rules: [
      rule({ field: "payments", is: "iap" }, 3, "IAP is RevenueCat’s job."),
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        2,
        "Stores are mobile.",
      ),
      rule({ field: "payments", is: "none" }, "exclude", "No payments."),
      rule(
        { field: "payments", is: "subscriptions" },
        -1,
        "Web subscriptions are Stripe/Paddle, not RevenueCat.",
      ),
    ],
    scaling: scaling(
      "SDK + dashboard entitlements.",
      "Webhooks into your user table.",
      "This is the IAP shape; web billing stays a card processor.",
    ),
    pros: ["Store abstractions.", "Analytics."],
    cons: ["Does not replace Stripe for web."],
    meta: meta(2, 3, false, ["https://www.revenuecat.com/docs"]),
  },
];

export const MESSAGING: Component[] = [
  {
    id: "resend",
    layer: "messaging",
    name: "Resend",
    summary:
      "Modern transactional email API with a pleasant DX for TypeScript teams.",
    plainSummary:
      "A simple service that sends login codes and receipts by email.",
    tags: ["email", "low-ops"],
    rules: [
      rule(
        { field: "integrations", includes: "email" },
        3,
        "You asked for transactional email.",
      ),
      rule(
        { field: "auth", anyOf: ["email", "passwordless"] },
        2,
        "Login email has to come from somewhere.",
      ),
      rule({ field: "languages", includes: "typescript" }, 1, "Nice TS SDK."),
    ],
    scaling: scaling(
      "One API key and a verified domain.",
      "Templates and webhooks.",
      "Warm IPs or a second vendor if deliverability is the business.",
    ),
    pros: ["DX.", "React email."],
    cons: ["Not SMS."],
    meta: meta(2, 3, false, ["https://resend.com/docs"]),
  },
  {
    id: "ses",
    layer: "messaging",
    name: "Amazon SES",
    summary:
      "Cheap transactional email on AWS. You own more deliverability work.",
    plainSummary: "Amazon’s cheap email sender — natural on AWS, more setup.",
    tags: ["email", "aws"],
    rules: [
      rule(
        { field: "existingCloud", includes: "aws" },
        3,
        "SES is native AWS.",
      ),
      rule(
        { field: "integrations", includes: "email" },
        2,
        "Transactional email.",
      ),
      rule(
        { field: "budget", anyOf: ["zero", "under-50"] },
        1,
        "Very cheap at volume.",
      ),
    ],
    scaling: scaling(
      "Sandbox then production access.",
      "Configuration sets and bounce handling.",
      "Dedicated IPs when volume demands it.",
    ),
    pros: ["Price.", "AWS-native."],
    cons: ["DX.", "Deliverability is on you."],
    meta: meta(3, 3, false, ["https://docs.aws.amazon.com/ses/"]),
  },
  {
    id: "postmark",
    layer: "messaging",
    name: "Postmark",
    summary: "Transactional email with a reputation for landing in the inbox.",
    plainSummary: "An email sender known for actually reaching the inbox.",
    tags: ["email"],
    rules: [
      rule(
        { field: "integrations", includes: "email" },
        2,
        "Transactional email.",
      ),
      rule(
        { field: "auth", anyOf: ["email", "passwordless"] },
        1,
        "Auth emails matter.",
      ),
      rule(
        { field: "lockIn", is: "portable" },
        -1,
        "Postmark is a vendor, though you can switch SMTP later.",
      ),
    ],
    scaling: scaling(
      "One server and a domain.",
      "Templates and message streams.",
      "This is enough for huge transactional volume if you stay in policy.",
    ),
    pros: ["Deliverability."],
    cons: ["Not a marketing ESP."],
    meta: meta(2, 3, false, ["https://postmarkapp.com/developer"]),
  },
  {
    id: "fcm",
    layer: "messaging",
    name: "FCM / APNs / Expo Push",
    summary:
      "Platform push. Use Expo Push if you are on Expo; otherwise FCM+APNs.",
    plainSummary: "Phone notifications through Apple and Google.",
    tags: ["push"],
    synergy: [
      { with: "expo", bonus: 2, reason: "Expo Push wraps APNs and FCM." },
    ],
    rules: [
      rule(
        { field: "integrations", includes: "push" },
        3,
        "You asked for push or SMS (push here).",
      ),
      rule(
        { field: "realtime", is: "notify" },
        2,
        "Notifications were requested.",
      ),
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        2,
        "Push is a mobile channel.",
      ),
    ],
    scaling: scaling(
      "Device tokens and a small send path.",
      "Topics and quiet hours.",
      "A dedicated notification service in front of FCM/APNs.",
    ),
    pros: ["Native reach."],
    cons: ["Two stores, many edge cases."],
    meta: meta(3, 3, false, [
      "https://firebase.google.com/docs/cloud-messaging",
    ]),
  },
  {
    id: "twilio",
    layer: "messaging",
    name: "Twilio",
    summary:
      "SMS, WhatsApp, and voice. Right when you must leave the email/push channel.",
    plainSummary: "The common way to send text messages and phone-based codes.",
    tags: ["sms"],
    rules: [
      rule(
        { field: "integrations", includes: "push" },
        1,
        "SMS is often lumped with push in early products.",
      ),
      rule(
        { field: "auth", is: "passwordless" },
        1,
        "SMS OTP is a Twilio case.",
      ),
      rule(
        { field: "integrations", includes: "email" },
        -1,
        "Prefer email unless you truly need SMS.",
      ),
    ],
    scaling: scaling(
      "One Messaging Service.",
      "Geo permissions and opt-out.",
      "Short codes and a dedicated messaging service.",
    ),
    pros: ["SMS/WhatsApp."],
    cons: ["Cost per message.", "Compliance."],
    meta: meta(3, 3, false, ["https://www.twilio.com/docs"]),
  },
];
