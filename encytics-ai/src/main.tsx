import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts (@fontsource) — replaces the render-blocking Google Fonts
// @import chain. Only the weights the UI actually uses are shipped:
//   Syne (display): 600, 700 · DM Sans (body): 400, 500, 600 · JetBrains Mono: 400
import '@fontsource/syne/600.css'
import '@fontsource/syne/700.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/jetbrains-mono/400.css'

import './index.css'
import App from './App.tsx'

// Sentry error monitoring — opt-in via VITE_SENTRY_DSN. The SDK is imported
// dynamically so it never ships in the bundle when no DSN is configured.
const sentryDsn = import.meta.env.VITE_SENTRY_DSN
if (sentryDsn) {
  import('@sentry/react').then((Sentry) => {
    Sentry.init({ dsn: sentryDsn })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
