import type { Component } from "@/lib/types";
import { hipaa, meta, rule, scaling } from "./helpers";

export const AUTH: Component[] = [
  {
    id: "authjs",
    layer: "auth",
    name: "Auth.js",
    summary:
      "Open-source auth for Next.js and friends. You own the user table.",
    plainSummary: "A free login library that lives in your web app.",
    tags: ["auth", "typescript"],
    synergy: [
      {
        with: "nextjs",
        bonus: 2,
        reason: "Auth.js started as NextAuth for Next.js.",
      },
    ],
    rules: [
      rule(
        { field: "auth", anyOf: ["email", "social", "passwordless"] },
        3,
        "Covers email, OAuth, and magic links.",
      ),
      rule(
        { field: "auth", is: "sso" },
        -1,
        "Enterprise SSO is easier with WorkOS/Clerk/Cognito.",
      ),
      rule({ field: "languages", includes: "typescript" }, 2, "TS-native."),
      rule({ field: "lockIn", is: "portable" }, 2, "You keep the user table."),
    ],
    scaling: scaling(
      "Auth.js in the Next.js app plus a users table.",
      "Add rate limits and a dedicated email sender.",
      "Keep it, or move SSO to an IdP; the user table stays yours.",
    ),
    pros: ["Open source.", "No per-user tax."],
    cons: ["You own security updates and email deliverability."],
    meta: meta(3, 3, true, ["https://authjs.dev/"]),
  },
  {
    id: "better-auth",
    layer: "auth",
    name: "Better Auth",
    summary:
      "Modern TypeScript auth library with org/SSO plugins. Still self-hosted.",
    plainSummary: "A newer open-source login library for TypeScript apps.",
    tags: ["auth", "typescript"],
    rules: [
      rule(
        { field: "auth", anyOf: ["email", "social", "passwordless", "sso"] },
        2,
        "Plugins cover common login styles.",
      ),
      rule({ field: "languages", includes: "typescript" }, 2, "TS-native."),
      rule({ field: "lockIn", is: "portable" }, 2, "Self-hosted."),
    ],
    scaling: scaling(
      "Library in your API plus SQL.",
      "Enable org and SSO plugins.",
      "Still your database; add an enterprise IdP if required.",
    ),
    pros: ["Portable.", "Featureful."],
    cons: ["Younger than Auth.js/Clerk."],
    meta: meta(2, 2, true, ["https://www.better-auth.com/docs"]),
  },
  {
    id: "clerk",
    layer: "auth",
    name: "Clerk",
    summary:
      "Hosted auth UX. Fastest pretty login for TS apps; per-MAU pricing and lock-in.",
    plainSummary:
      "A hosted login box — fastest to look finished, you pay per user later.",
    tags: ["auth", "low-ops", "lock-in"],
    rules: [
      rule(
        { field: "auth", anyOf: ["email", "social", "passwordless"] },
        3,
        "Clerk’s UI covers these well.",
      ),
      rule({ field: "timeline", is: "days" }, 2, "You skip building login UI."),
      rule({ field: "lockIn", is: "portable" }, -2, "Users live at Clerk."),
      rule({ field: "auth", is: "none" }, "exclude", "No auth needed."),
    ],
    scaling: scaling(
      "Drop-in components.",
      "Organizations and RBAC.",
      "Watch MAU pricing; you can export users if you must leave.",
    ),
    pros: ["UX.", "Speed."],
    cons: ["Price.", "Vendor."],
    meta: meta(2, 3, false, ["https://clerk.com/docs"]),
  },
  {
    id: "auth0",
    layer: "auth",
    name: "Auth0",
    summary:
      "Enterprise identity platform. Right for SSO-heavy products; cost and complexity for a hobby app.",
    plainSummary:
      "A heavyweight login vendor used by large companies, especially for corporate single sign-on.",
    tags: ["auth", "lock-in"],
    rules: [
      rule(
        { field: "auth", is: "sso" },
        3,
        "SAML/OIDC enterprise SSO is Auth0’s job.",
      ),
      rule(
        { field: "compliance", anyOf: ["soc2", "hipaa"] },
        1,
        "Enterprise posture.",
      ),
      rule(
        { field: "budget", anyOf: ["zero", "under-50"] },
        -2,
        "Easy to outgrow the free tier.",
      ),
      rule({ field: "auth", is: "none" }, "exclude", "No auth needed."),
    ],
    scaling: scaling(
      "One tenant and a social connection.",
      "Organizations and enterprise connections.",
      "This is already an enterprise IdP; watch rule complexity.",
    ),
    pros: ["SSO.", "Ecosystem."],
    cons: ["Cost.", "Complexity."],
    meta: meta(3, 3, false, ["https://auth0.com/docs"]),
  },
  {
    id: "supabase-auth",
    layer: "auth",
    name: "Supabase Auth",
    summary:
      "Auth included with Supabase. Best when the database is already Supabase.",
    plainSummary:
      "Login that comes with Supabase — email, social, and magic links.",
    tags: ["auth", "baas"],
    synergy: [
      { with: "supabase", bonus: 3, reason: "Auth is part of Supabase." },
    ],
    rules: [
      rule(
        { field: "auth", anyOf: ["email", "social", "passwordless"] },
        2,
        "These methods are included.",
      ),
      rule({ field: "auth", is: "sso" }, 1, "SSO exists on higher plans."),
      rule(
        hipaa,
        "exclude",
        "Hobby Supabase Auth is the wrong HIPAA starting point.",
      ),
    ],
    scaling: scaling(
      "Enable providers on the project.",
      "Hook sessions into RLS.",
      "You can keep GoTrue or replace with an IdP later.",
    ),
    pros: ["Included.", "RLS integration."],
    cons: ["Vendor coupling."],
    meta: meta(3, 3, true, ["https://supabase.com/docs/guides/auth"]),
  },
  {
    id: "firebase-auth",
    layer: "auth",
    name: "Firebase Auth",
    summary: "Google’s mobile-friendly auth. Pairs with Firebase; lock-in.",
    plainSummary: "Google’s login for apps — easy on phones, tied to Firebase.",
    tags: ["auth", "baas", "hobby"],
    synergy: [
      {
        with: "firebase",
        bonus: 3,
        reason: "Firebase Auth is the Firebase login.",
      },
    ],
    rules: [
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        2,
        "Mobile SDKs are excellent.",
      ),
      rule(
        { field: "auth", anyOf: ["email", "social", "passwordless"] },
        2,
        "These methods are included.",
      ),
      rule(
        hipaa,
        "exclude",
        "Hobby Firebase Auth is the wrong HIPAA starting point.",
      ),
    ],
    scaling: scaling(
      "Enable providers.",
      "Blocking functions for custom checks.",
      "Export users if you leave Google.",
    ),
    pros: ["Mobile DX."],
    cons: ["Lock-in."],
    meta: meta(3, 3, false, ["https://firebase.google.com/docs/auth"]),
  },
  {
    id: "cognito",
    layer: "auth",
    name: "Amazon Cognito",
    summary: "AWS identity. Correct on AWS; the console UX is the tax.",
    plainSummary: "Amazon’s login service — natural on AWS, clunky to set up.",
    tags: ["auth", "aws"],
    rules: [
      rule(
        { field: "existingCloud", includes: "aws" },
        3,
        "Cognito is the AWS IdP.",
      ),
      rule(
        { field: "auth", anyOf: ["email", "social", "sso"] },
        2,
        "User pools cover these.",
      ),
      rule(
        { field: "existingCloud", includes: "azure" },
        -2,
        "Use Entra ID on Azure.",
      ),
    ],
    scaling: scaling(
      "One user pool.",
      "Hosted UI or a custom app client.",
      "This already scales; complexity is the risk, not QPS.",
    ),
    pros: ["AWS-native.", "Scales."],
    cons: ["DX."],
    meta: meta(3, 3, false, ["https://docs.aws.amazon.com/cognito/"]),
  },
  {
    id: "keycloak",
    layer: "auth",
    name: "Keycloak",
    summary:
      "Open-source IdP. Right when you must self-host identity; you operate it.",
    plainSummary:
      "A login system you run yourself — maximum control, you are on call for it.",
    tags: ["auth", "high-ops"],
    rules: [
      rule(
        { field: "deployPreference", is: "self-hosted" },
        3,
        "Keycloak is the self-hosted IdP.",
      ),
      rule({ field: "lockIn", is: "portable" }, 2, "Open source."),
      rule({ field: "auth", is: "sso" }, 2, "SAML/OIDC are first-class."),
      rule(
        { field: "ops", is: "none" },
        "exclude",
        "Do not self-host Keycloak with zero ops.",
      ),
    ],
    scaling: scaling(
      "One Keycloak on a VM with Postgres.",
      "Clustered nodes and a proper backup.",
      "This can be an enterprise IdP if you staff it.",
    ),
    pros: ["Open source.", "SSO."],
    cons: ["Ops."],
    meta: meta(2, 3, true, ["https://www.keycloak.org/documentation"]),
  },
  {
    id: "workos",
    layer: "auth",
    name: "WorkOS",
    summary:
      "Enterprise SSO and directory sync as an API. Pair with your own user table.",
    plainSummary:
      "Add corporate single sign-on without becoming an identity company.",
    tags: ["auth", "low-ops"],
    rules: [
      rule({ field: "auth", is: "sso" }, 3, "WorkOS exists for SAML/OIDC SSO."),
      rule(
        { field: "product", anyOf: ["webapp", "internal"] },
        1,
        "B2B SaaS is the buyer.",
      ),
      rule({ field: "auth", is: "none" }, "exclude", "No auth needed."),
    ],
    scaling: scaling(
      "One WorkOS environment plus your users table.",
      "Directory sync when HRIS matters.",
      "This is already the enterprise SSO shape.",
    ),
    pros: ["SSO without becoming Okta.", "You keep users."],
    cons: ["Another vendor."],
    meta: meta(2, 3, false, ["https://workos.com/docs"]),
  },
  {
    id: "framework-auth",
    layer: "auth",
    name: "Framework built-in auth",
    summary:
      "Django auth, Laravel Breeze/Fortify, Rails Devise. Fastest when you already chose that monolith.",
    plainSummary:
      "Login that comes with Django, Rails, or Laravel — fastest if you already picked that toolkit.",
    tags: ["auth"],
    synergy: [
      { with: "django", bonus: 3, reason: "django.contrib.auth is included." },
      { with: "rails", bonus: 3, reason: "Devise is the Rails default." },
      {
        with: "laravel",
        bonus: 3,
        reason: "Breeze/Fortify/Jetstream are first-party.",
      },
    ],
    rules: [
      rule(
        { field: "languages", anyOf: ["python", "ruby", "php"] },
        3,
        "The framework already solved auth.",
      ),
      rule(
        { field: "auth", anyOf: ["email", "passwordless"] },
        2,
        "Built-ins cover email/password well.",
      ),
      rule(
        { field: "auth", is: "sso" },
        -1,
        "You will still add an IdP library.",
      ),
    ],
    scaling: scaling(
      "Use the framework’s session auth.",
      "Add 2FA and rate limits.",
      "Keep the user table; add an IdP for enterprise SSO.",
    ),
    pros: ["Already there.", "Portable data."],
    cons: ["Social/SSO is extra work."],
    meta: meta(3, 3, true, [
      "https://docs.djangoproject.com/en/stable/topics/auth/",
    ]),
  },
];
