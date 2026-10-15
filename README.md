# Bearny Connect Hub

BUILD THE COMPLETE APPLICATION NOW, NOT A PLAN. PROJECT TITLE: "Bearny Final — Rebuilt". This is a full rebuild of an unsatisfactory healthcare research prototype. Do not clone the failed project. DO NOT ask the user questions; implement and test autonomously. User has been extremely disappointed with generic designs. Prioritize actual beautiful interface and coherent patient flow over technical feature lists.

RESEARCH SCOPE: only concept 4 CONNECT TO PEERS (patient explicitly CHOOSES between two alternatives: internal Bearny community and fictional WhatsApp-style group) and concept 6 ASK BEARNY (natural chat with deterministic prepared answer bank, NOT generative AI). Patient and professional/admin roles within one app. No clinical monitoring, wearable tracking, exercise category, medical charts, real patient data, WhatsApp API, hospital logo, or fake clinician approval.

USER JOURNEY (every arrow must work):
Landing -> Patient demo entry -> Patient home -> Connect with Others -> Choose between Bearny Community and WhatsApp-style Groups.
Internal: community category browse (Everyday Life, Food & Wellbeing, Motivation & Support), search, open thread, read realistic fictional replies, reply, start new discussion, save, report, confirmation, return. Existing user-generated demo content persists during browser session.
WhatsApp: group directory with 2 richly seeded fictional groups, select group -> concise privacy explanation -> join simulated group -> authentic chat-bubble screen with timestamps, participants, typing/send, optional demo image share (use built-in fixture, no actual uploads), member list, leave group -> directory. Sent message visibly appears. Clearly simulated and not actually WhatsApp. Group experiences must be equally developed, not a fake preview.
Ask: Patient home -> Ask Bearny -> elegant chat workspace with assistant greeting, three safe quick prompts, text entry, messages rendered in alternating chat bubbles, deterministic intent classification to prepared answers (routine, motivation, social connection, food/general wellbeing, general rehab information, unknown, personal medical, emergency). Sensitive medical input must not get medical advice. Emergency response clearly directs emergency services; 144 in Switzerland. Safe follow-up chips actually trigger more answers, reset conversation with confirmation, thumbs helpful/unhelpful stored as feedback. No mascot. Do not put technical explanations in every chat bubble.
Patient profile: display name, accessible large text and reduced motion, reset demo data, logout. No diagnosis or medical record required.
Professional entry -> separate desktop-friendly professional dashboard -> moderation queue with actionable hide/restore/dismiss that changes patient community -> prepared answer library with edit/add and preview (no clinical approval claim) -> feedback view. All actions functional in local session, role isolation, demo only.

DESIGN: genuinely polished, premium, emotionally warm, mature, modern Swiss digital health aesthetic. Cream/off-white background #F2F1F6, deep forest green #25684F and accent green #35946D, airy white surfaces, warm coral used sparingly, restrained golden accent. Typography: large accessible headings, crisp readable body, intentional spacing, high contrast, friendly illustrations ONLY if relevant and tasteful (no mascots). Editorial hero with real photo if safe or refined gradient abstract visual; no giant emoji tile grids. Patient home has EXACTLY TWO dominant feature destinations, each with substantial engaging previews, then compact real community preview. Don't present a generic four-tile dashboard. Header shows Bearny and role-appropriate controls; desktop simple nav, mobile bottom nav Home / Connect / Ask Bearny / Profile; WhatsApp is NOT a separate global tab. Professional dashboard sidebar. Accessible 44px targets, focus states, mobile 375px, desktop 1440px, no horizontal overflow. Thoughtful skeleton/empty states and toast feedback. Discreet research-demo disclaimer (not 3 paragraphs at every screen).

CONTENT: fictional Swiss-friendly characters Mira, Daniel, Sofia, Alex; believable supportive threads about getting back into everyday routines, simple meals, social isolation, motivation; nonclinical. Human and clear copy. EN only unless genuinely complete DE translation (avoid fake toggle).

ROUTES: / landing, /patient (home), /patient/connect (choice), /patient/community (category/feed), /patient/community/:threadId, /patient/community/new, /patient/groups (directory), /patient/groups/:id (chat), /patient/ask, /patient/profile; /professional (dashboard), /professional/moderation, /professional/answers, /professional/feedback. Role-entry can use /login or in-page demo selector. Back buttons on subpages, direct deep links route safely. No fake disabled controls; anything shown as clickable must do something meaningful.

ACCEPTANCE TESTS (execute, not merely claim): 1 patient enter, 2 home shows 2 features, 3 choose alternatives, 4 search/filter thread, 5 create thread and see it, 6 reply appears, 7 save/report works, 8 group enter/privacy/join/send/member list/leave, 9 Ask quick prompt, 10 typed prompt, 11 follow-up, 12 unknown, 13 personal medical refusal, 14 emergency, 15 helpful feedback, 16 professional role access, 17 hide thread and see patient view, 18 edit prepared answer and see chatbot update, 19 reset demo, 20 mobile and keyboard, 21 build and tests. Use Playwright/browser if available. Include proof in your final response: exact tests executed, passes/fails, screenshots or screenshot descriptions, remaining caveats. Never publish. Preserve original projects untouched.

Implement FULL application end-to-end autonomously now. First build a cohesive visual system, then all journeys and test them.


## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
