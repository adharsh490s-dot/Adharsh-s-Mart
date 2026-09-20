# AdharshMart Premium Marketplace

## Build
- Apply the selected editorial marketplace composition with an obsidian, charcoal, metallic-gold, and champagne design system.
- Rework the persistent navigation, search, mobile tabs, footer, and home page around luxury product imagery and faster shopping access.
- Carry the same visual language through sign-in, product cards, checkout, and delivery tracking without changing the established shopping behavior.
- Add an always-available AI concierge using the supported chat foundations, streamed responses, reasoning status, and clear error handling.
- Connect authenticated cart and order activity to Lovable Cloud while preserving the current guest browsing experience and demo delivery journey.

## Quality
- Keep motion cinematic but brief, support reduced-motion preferences, and preserve keyboard and mobile usability.
- Add complete page metadata where missing and verify the main journey at desktop and mobile sizes.

## Technical details
- Use the existing TanStack Start routes, semantic Tailwind tokens, Lovable Cloud authentication, and existing product assets.
- Use AI Elements for the concierge transcript and composer, with `openai/gpt-6-astra` served securely from a streaming server route.
- Keep the AI key server-only and send the complete conversation on every turn.
