

- Fictional demo state lives in a shared browser-session provider, hydrated after mount; no database or real authentication is used because this is an explicitly session-only research demo.
- Hydration merges seeded conversation entries by stable ID while preserving session contributions and moderation flags, so richer demo content appears without resetting the user's work.
- Preserve the demo React context identity through Vite hot data, because its mixed component/utility module can refresh consumers while the existing provider remains mounted.
- Patient and professional file-route layouts gate their own outlets by the demo role, keeping navigation and permissions separate without implying production security.
- Prepared responses are selected by a pure deterministic safety-first classifier; emergency and medical safety responses are immutable and cannot be overridden by professional edits.
- Shared UI uses global semantic tokens and AI Elements for conversation, messages, and composers; feature modules sit outside file routes so routing remains thin.
- The simulated group composer is a dedicated accessible form separate from Ask Bearny's AI Elements composer, so familiar group-chat styling cannot alter the assistant workflow.
- UI and seeded demo content are translated at render time via `useT()` (src/lib/i18n.tsx) from English-keyed dictionaries in src/i18n/; stored data stays English so classification, moderation and hydration are language-independent.
