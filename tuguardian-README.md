# Tu Guardián — Agencia de Seguros Médicos

Static website for **Tu Guardián** — Spanish-language health insurance agency.

## Pages

| File | Maps to | Description |
|------|---------|-------------|
| `tuguardian-index.html` | `/` | Homepage — hero, partners, about, reviews, contact |
| `tuguardian-privacy.html` | `/privacy-policy` | Política de Privacidad |
| `tuguardian-terms.html` | `/terms-&-conditions` | Términos y Condiciones |

## Deploy on Render

1. Push all 3 HTML files + this README to a GitHub repo (e.g. `tuguardian-site`)
2. In Render → **New → Static Site** → connect repo
3. Settings:
   - Branch: `main`
   - Publish directory: `.` (dot — root folder)
   - Build command: *(leave blank)*
4. Click **Create Static Site** — live in ~30 seconds

## Contact Form Activation

Forms use [Formspree](https://formspree.io) (free tier):
1. Sign up at formspree.io → create a new form
2. In `tuguardian-index.html`, find:
   ```
   action="https://formspree.io/f/your-form-id"
   ```
3. Replace `your-form-id` with your actual Formspree ID

## Custom Domain (tuguardianteasegura.com)

1. Render → your site → **Settings → Custom Domains**
2. Add `tuguardianteasegura.com` and `www.tuguardianteasegura.com`
3. At your domain registrar (GoDaddy), update DNS:
   - **A record** → Render's IP (shown in dashboard)
   - **CNAME** → `www` → your `.onrender.com` URL

## Branding

- Primary: `#1DB954` (green) + `#a5ff57` (green-light)
- Accent: `#F5C842` (yellow)
- Background: `#111a14` (dark) / `#f0f7f2` (light sections)
- Fonts: Playfair Display (headings) + Montserrat (body)
- Logo: embedded as base64 — no external image files needed

## Key Info

- Phone: (305) 307-1982
- Address: 7955 NW 12th Street, Doral, Florida 33126
- Quote form: Google Forms link embedded in hero buttons
- Facebook: https://www.facebook.com/365792669948578
- Instagram: https://www.instagram.com/tuguardianins
- Google Site Verification: e6jrkFzf7HQ1VmtSvUvjCEpIqZKzSXSxuh59s7bJzq0
