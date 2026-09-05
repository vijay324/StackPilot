import type { Component } from "@/lib/types";
import { hipaa, meta, rule, scaling } from "./helpers";

export const REALTIME: Component[] = [
  {
    id: "socketio",
    layer: "realtimeTransport",
    name: "Socket.IO / WebSockets",
    summary:
      "Self-managed sockets on Node/Go. Flexible; you own fan-out, presence, and multi-instance pub/sub.",
    plainSummary:
      "Direct live connections to your server — flexible, and you must keep them working as you grow.",
    tags: ["realtime", "hyperscale"],
    synergy: [
      {
        with: "go",
        bonus: 2,
        reason: "Go handles huge connection counts for raw sockets.",
      },
    ],
    rules: [
      rule(
        { field: "realtime", anyOf: ["live", "collab", "multiplayer"] },
        2,
        "WebSockets are the open standard.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        3,
        "Low-latency multiplayer needs a socket (or UDP) path, not serverless HTTP.",
      ),
      rule(
        { field: "deployPreference", is: "serverless" },
        -3,
        "Classic sockets fight a functions-only host.",
      ),
      rule(
        { field: "lockIn", is: "portable" },
        2,
        "You are not tied to a realtime SaaS.",
      ),
      rule(
        { field: "ops", is: "none" },
        -2,
        "You must run sticky sessions or a socket layer.",
      ),
    ],
    scaling: scaling(
      "One Node or Go process with Socket.IO/ws.",
      "Redis adapter for multiple instances.",
      "Dedicated gateway tier, sharding by room, maybe a mesh.",
    ),
    pros: ["Open.", "Full control."],
    cons: ["You operate fan-out."],
    meta: meta(3, 3, true, ["https://socket.io/docs/v4/"]),
  },
  {
    id: "supabase-realtime",
    layer: "realtimeTransport",
    name: "Supabase Realtime",
    summary:
      "Postgres change feeds and presence via Supabase. Best when the database is already Supabase.",
    plainSummary:
      "Live updates that come with Supabase — enough for many chat and dashboard cases.",
    tags: ["realtime", "baas"],
    synergy: [
      {
        with: "supabase",
        bonus: 3,
        reason: "Realtime is included with Supabase.",
      },
    ],
    rules: [
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        2,
        "Subscriptions cover live screens and light collab.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        -2,
        "Not a game or WebRTC stack.",
      ),
      rule(
        hipaa,
        "exclude",
        "Hobby BaaS realtime is the wrong HIPAA starting point.",
      ),
    ],
    scaling: scaling(
      "Enable Realtime on the project.",
      "Tune publication and RLS.",
      "Split extremely hot channels to a dedicated socket service.",
    ),
    pros: ["Included.", "RLS-aware."],
    cons: ["Vendor.", "Not multiplayer-grade."],
    meta: meta(3, 3, true, ["https://supabase.com/docs/guides/realtime"]),
  },
  {
    id: "firebase-rtdb",
    layer: "realtimeTransport",
    name: "Firebase Realtime Database",
    summary:
      "The original Firebase live tree. Simple sync; security rules take discipline.",
    plainSummary:
      "Firebase’s original live data tree — simple for chat-like apps.",
    tags: ["realtime", "baas", "hobby"],
    synergy: [
      { with: "firebase", bonus: 3, reason: "RTDB is a Firebase product." },
    ],
    rules: [
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        2,
        "Live trees are the point.",
      ),
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        1,
        "Mobile SDKs are strong.",
      ),
      rule(
        hipaa,
        "exclude",
        "Hobby Firebase is the wrong HIPAA starting point.",
      ),
    ],
    scaling: scaling(
      "One RTDB or Firestore listeners.",
      "Shard paths; watch billed bandwidth.",
      "Move fan-out off Firebase if bills or model explode.",
    ),
    pros: ["Dead-simple sync."],
    cons: ["Lock-in.", "Rules complexity."],
    meta: meta(3, 3, false, ["https://firebase.google.com/docs/database"]),
  },
  {
    id: "ably",
    layer: "realtimeTransport",
    name: "Ably / Pusher",
    summary:
      "Managed pub/sub channels. Buy realtime instead of building it when ops is scarce.",
    plainSummary: "A specialist company runs live updates for you.",
    tags: ["realtime", "low-ops", "lock-in"],
    rules: [
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        3,
        "Managed channels are their product.",
      ),
      rule(
        { field: "ops", is: "none" },
        3,
        "You should not run a socket cluster.",
      ),
      rule(
        { field: "lockIn", is: "portable" },
        -2,
        "You depend on a realtime vendor.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        1,
        "Better than serverless HTTP, still not a game engine.",
      ),
    ],
    scaling: scaling(
      "One app and channels.",
      "Presence and rewind features.",
      "These networks already scale; watch message cost.",
    ),
    pros: ["No socket ops.", "Global."],
    cons: ["Usage cost.", "Vendor."],
    meta: meta(2, 3, false, ["https://ably.com/docs"]),
  },
  {
    id: "phoenix-channels",
    layer: "realtimeTransport",
    name: "Phoenix Channels",
    summary:
      "BEAM channels and presence. Outstanding connection density for collab and chat.",
    plainSummary:
      "Live rooms and presence on the Elixir server — unusually good at many simultaneous connections.",
    tags: ["realtime", "hyperscale"],
    synergy: [{ with: "phoenix", bonus: 3, reason: "Channels are Phoenix." }],
    rules: [
      rule(
        { field: "realtime", anyOf: ["live", "collab", "multiplayer"] },
        3,
        "Channels are a first-class collab primitive.",
      ),
      rule(
        { field: "languages", includes: "elixir" },
        3,
        "You already run the BEAM.",
      ),
      rule(
        { field: "product", is: "realtime" },
        3,
        "This is the Phoenix specialty.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -1,
        "Elixir is extra learning.",
      ),
    ],
    scaling: scaling(
      "One node and PubSub.",
      "Cluster across regions on Fly.",
      "Partition PubSub and isolate hot topics.",
    ),
    pros: ["Density.", "Presence."],
    cons: ["Elixir hiring."],
    meta: meta(1, 3, true, ["https://hexdocs.pm/phoenix/channels.html"]),
  },
  {
    id: "signalr",
    layer: "realtimeTransport",
    name: "SignalR",
    summary: "Microsoft’s realtime library. Default next to ASP.NET on Azure.",
    plainSummary: "Live updates for Microsoft stacks.",
    tags: ["realtime", "dotnet"],
    synergy: [
      {
        with: "aspnet",
        bonus: 3,
        reason: "SignalR is the ASP.NET realtime library.",
      },
    ],
    rules: [
      rule(
        { field: "languages", includes: "csharp" },
        3,
        "SignalR is the .NET default.",
      ),
      rule(
        { field: "existingCloud", includes: "azure" },
        2,
        "Azure SignalR Service is managed.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        2,
        "Covers many live needs.",
      ),
    ],
    scaling: scaling(
      "In-process SignalR on one app.",
      "Azure SignalR Service backplane.",
      "Regional services plus sticky routing if needed.",
    ),
    pros: [".NET native.", "Managed option."],
    cons: ["Outside .NET it is the wrong default."],
    meta: meta(2, 3, true, [
      "https://learn.microsoft.com/aspnet/core/signalr/",
    ]),
  },
  {
    id: "liveblocks",
    layer: "realtimeTransport",
    name: "Liveblocks / PartyKit",
    summary:
      "Collaboration primitives (cursors, CRDTs, rooms) for document editors. Faster than rolling your own.",
    plainSummary:
      "Ready-made building blocks for co-editing — cursors, rooms, and shared documents.",
    tags: ["realtime", "low-ops"],
    rules: [
      rule(
        { field: "realtime", is: "collab" },
        3,
        "CRDT/rooms products exist specifically for editors.",
      ),
      rule(
        { field: "webKind", is: "editor" },
        3,
        "Editor-like UIs need presence and shared state.",
      ),
      rule(
        { field: "product", is: "realtime" },
        2,
        "Collaboration is the product.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        -1,
        "Use a game/WebRTC stack instead.",
      ),
    ],
    scaling: scaling(
      "One Liveblocks/PartyKit project from the web app.",
      "Room sharding and auth.",
      "Keep them for collab state; media and game loop elsewhere.",
    ),
    pros: ["Editor primitives.", "Fast to ship."],
    cons: ["Vendor or niche runtime."],
    meta: meta(2, 2, false, ["https://liveblocks.io/docs"]),
  },
  {
    id: "livekit",
    layer: "realtimeTransport",
    name: "LiveKit",
    summary:
      "Open-source WebRTC SFU for audio/video and some realtime data. The right media layer.",
    plainSummary: "The specialist layer for live audio and video rooms.",
    tags: ["realtime", "hyperscale"],
    rules: [
      rule(
        { field: "realtime", is: "multiplayer" },
        3,
        "Audio/video and low-latency rooms need WebRTC, not HTTP.",
      ),
      rule({ field: "media", is: "video" }, 2, "Live video is a LiveKit job."),
      rule(
        { field: "realtime", is: "none" },
        "exclude",
        "You do not need a media SFU.",
      ),
    ],
    scaling: scaling(
      "LiveKit Cloud for a prototype.",
      "Self-host SFUs in more regions.",
      "This is a known large-scale media shape.",
    ),
    pros: ["Real WebRTC.", "Open source."],
    cons: ["You still need an app backend."],
    meta: meta(2, 3, true, ["https://docs.livekit.io/"]),
  },
];
