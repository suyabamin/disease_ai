---
name: agroai-bangladesh-project-builder
description: Build the AgroAI Bangladesh crop disease detection web application from the design assets in the current project, without training an AI model.
---

# AgroAI Bangladesh — Project Builder Skill

## Mission

Build a complete, working, mobile-first web application called **AgroAI Bangladesh** for crop-leaf disease detection. Treat the existing design files in the project/workspace as the primary visual source of truth. Implement the design as closely as possible while preserving usability, responsive behavior, and WCAG 2.2 AA accessibility.

**Do not train, fine-tune, or claim to have trained an AI model.** Build an integration-ready inference layer that can connect to a separately hosted model/API later. Until a real inference endpoint is configured, use an explicitly labelled demo/mock provider with deterministic sample results. Never present mock predictions as real AI diagnoses.

## 1. Start by inspecting the project

Before changing code:

1. Inspect the entire project tree, package files, existing app, routes, design assets, images, fonts, and README.
2. Find and inspect every supplied design file, screenshot, Figma export, image, or reference asset available in the workspace. Use the supplied design as the source of truth; do not replace it with an unrelated template.
3. Identify the existing framework and preserve working setup where reasonable.
4. Write a short implementation plan and then proceed without asking for confirmation unless a blocking ambiguity prevents progress.
5. Do not overwrite user work or delete assets just because they appear unused. Check references first.

If no design file is accessible, build a coherent design using the visual requirements below and clearly note that the supplied design asset could not be located.

## 2. Product requirements

Users must be able to:

- Register with name, email, and password.
- Log in and log out.
- Reset their password.
- View a simple dashboard.
- Take a photo using a supported mobile camera input or select an image from their device.
- Preview, replace, and remove a selected image.
- Submit an image for disease analysis.
- See crop, predicted disease, confidence, danger/severity label, short symptoms, recommended immediate actions, prevention, and treatment guidance when available.
- Receive a low-confidence / unable-to-identify state instead of a forced prediction.
- Save detection results to their account history.
- Search/filter history and open a previous result.
- Delete an individual history item after confirmation.
- View and edit basic profile information.
- Switch between Bangla and English if practical within the existing design.
- Use the app on mobile, tablet, and desktop.

Use a small, focused navigation structure:
- Home
- Detect
- History
- Profile

Avoid unnecessary admin panels, charts, and extra features.

## 3. Preferred stack

Use the existing project stack if it is already established. Otherwise prefer:

- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS if already configured; otherwise use the project’s existing styling system
- Routing: React Router
- Icons: Lucide React
- Animation: Framer Motion or Motion, only if compatible with the project
- Authentication: Firebase Authentication
- Database: Cloud Firestore
- Image hosting: a configurable third-party provider such as Cloudinary, using unsigned upload presets only when configured safely
- Deployment: Vercel for the frontend
- AI inference: a separate HTTPS API, such as a Python/FastAPI service hosted independently

Do not add large dependencies without a clear need. Do not migrate the project to another framework without a strong reason.

## 4. Design and UX principles

- Mobile-first; prioritize 360px, 390px, and 412px viewport widths.
- Keep text minimal and plain.
- One clear primary action per screen.
- Large camera and upload actions.
- Use the supplied design assets and match their layout, spacing, colors, typography, cards, iconography, and overall visual language.
- Use short labels and concise Bangla/English copy.
- Avoid visual clutter, excessive gradients, excessive shadows, and decorative dashboard widgets.
- Prevent horizontal scrolling at all supported widths.
- Provide skeletons or clear loading states for async actions.
- Provide useful empty, success, error, offline/network, and low-confidence states.
- Use realistic sample content only where needed and label demo data clearly.

## 5. Animation

Use restrained, purposeful micro-interactions:
- Gentle page/section fade or slide transitions.
- Button press feedback.
- Upload card hover/focus feedback.
- Leaf image scanning-line animation during analysis.
- Smooth result reveal.
- Confidence ring/indicator animation.
- Short success checkmark animation.
- Active navigation transition.

Requirements:
- Respect `prefers-reduced-motion`.
- Do not block user actions during animation.
- Avoid flashing, long delays, or motion that obscures information.
- Ensure loading progress is not communicated through animation alone; provide text such as “Analyzing image…”.

## 6. WCAG 2.2 AA accessibility

Treat accessibility as a functional requirement, not a finishing touch.

- Normal text contrast at least 4.5:1; large text at least 3:1.
- UI component boundaries and meaningful graphical objects should have sufficient contrast.
- Never rely on color alone for risk, confidence, validation, or selection; combine color with text and/or icons.
- All interactive controls must work with keyboard.
- Provide visible focus indicators.
- Use semantic landmarks and logical heading levels.
- Associate every form input with a persistent visible label.
- Give icon-only controls accessible names.
- Use appropriate alt text for meaningful images; decorative images should have empty alt text.
- Announce async status/errors accessibly (e.g. `aria-live` where appropriate).
- Maintain logical focus order and handle dialogs/modals correctly.
- Touch targets should be at least 44×44 CSS pixels where practical.
- Ensure text remains usable at 200% zoom and layout reflows without horizontal scrolling at narrow widths.
- Do not disable browser zoom.
- Provide validation instructions in text, not just color.
- Respect reduced-motion preferences.
- Use native HTML elements before custom controls.

## 7. Authentication and data security

Firebase configuration must come from environment variables. Never commit secrets.

Suggested frontend environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET` (only if Firebase Storage is used; it is not required)
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_IMAGE_PROVIDER` (for example `cloudinary`)
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_AI_API_BASE_URL`
- `VITE_DEMO_MODE` (`true` or `false`)

Only expose provider values that are explicitly designed to be public client configuration. Never put private API secrets in `VITE_` variables.

Implement Firestore security rules so authenticated users can read/write only their own profile and detection documents. Do not trust a user ID supplied by the client without verifying the authenticated session in security rules/backend logic.

Include a `.env.example` with placeholder values only.

If Firebase credentials are not available, the app must still start in a clearly labelled local/demo mode. Do not silently pretend Firebase persistence is active. Isolate demo persistence behind a repository/provider so Firebase can be enabled later.

## 8. Image upload

Implement an image upload service abstraction.

Requirements:
- Accept common image formats: JPEG, PNG, and WebP.
- Validate file type and a sensible maximum file size before upload.
- Show upload progress or a clear uploading state where supported.
- Show a preview before analysis.
- Provide replace/remove controls.
- Handle cancel, failure, and retry states.
- Do not store large base64 images in Firestore.
- Store the hosted image URL and provider asset identifier in the detection document.
- Do not upload anything until the user explicitly selects/submits an image.
- Do not claim that a file is safely deleted from the image provider unless deletion is actually implemented server-side.

Cloudinary or another image host must be configurable. If its credentials/configuration are missing, explain that image hosting is in demo mode and use a local object URL for preview only; do not claim it is permanently stored.

## 9. AI inference integration — no model training

Create a clean interface such as:

`analyzeCropImage(imageUrlOrFile): Promise<DetectionResult>`

Use a provider pattern:
- `ApiInferenceProvider`: sends the image to the configured AI API.
- `DemoInferenceProvider`: returns clearly labelled demo results for UI development.

When `VITE_AI_API_BASE_URL` is configured and demo mode is disabled, call the real API. Handle timeout, invalid response, network failure, and server errors.

Do not build a fake model, do not train a model, and do not describe demo output as actual detection. Show a visible “Demo result — not a real diagnosis” label whenever the mock provider is active.

Use a documented response shape similar to:

```ts
type DetectionResult = {
  crop: string;
  disease: string | null;
  confidence: number; // 0–1 or normalized consistently in the app
  riskLevel: "low" | "medium" | "high" | "unknown";
  isHealthy?: boolean;
  symptoms: string[];
  immediateActions: string[];
  prevention: string[];
  treatmentGuidance: string[];
  disclaimer: string;
  modelVersion?: string;
  demo: boolean;
};
```

Define and document the confidence threshold in one place. If confidence is below the threshold, or the API returns an unknown class, show the low-confidence screen rather than a confident disease claim. Confidence is not the same as disease severity; display these as separate concepts.

Risk level should come from a verified disease knowledge base or trusted API output, not be inferred directly from model confidence. Do not invent treatment recommendations. Use carefully labelled educational demo content until recommendations are reviewed by a qualified agricultural source.

## 10. Firestore data model

Use a simple structure, for example:

- `users/{uid}`
  - `displayName`
  - `email`
  - `preferredLanguage`
  - `createdAt`
  - `updatedAt`

- `users/{uid}/detections/{detectionId}`
  - `crop`
  - `disease`
  - `confidence`
  - `riskLevel`
  - `imageUrl`
  - `imageProvider`
  - `imageAssetId` (when available)
  - `symptoms`
  - `immediateActions`
  - `prevention`
  - `treatmentGuidance`
  - `demo`
  - `modelVersion`
  - `createdAt`

Use server timestamps where appropriate. Paginate history rather than loading an unlimited number of documents. Keep query indexes and security rules documented.

## 11. Suggested project organization

Adapt this to the existing codebase rather than forcing an exact structure.

```text
src/
  app/
    router.tsx
    providers.tsx
  components/
    layout/
    navigation/
    forms/
    upload/
    detection/
    history/
    feedback/
  pages/
    HomePage.tsx
    LoginPage.tsx
    RegisterPage.tsx
    ForgotPasswordPage.tsx
    DetectPage.tsx
    ResultPage.tsx
    HistoryPage.tsx
    DetectionDetailsPage.tsx
    ProfilePage.tsx
    NotFoundPage.tsx
  features/
    auth/
    detections/
    history/
    profile/
  services/
    firebase/
    imageUpload/
    inference/
  repositories/
    detectionRepository.ts
  hooks/
  i18n/
  types/
  utils/
  styles/
```

Also include:
- `.env.example`
- `README.md`
- Firestore security rules
- Vercel deployment configuration only if needed
- Tests for key flows where test infrastructure exists

## 12. Required quality and behavior

- Use TypeScript types for domain data and API responses.
- Keep components small and reusable.
- Avoid giant single-file components.
- Avoid duplicated business logic.
- Do not hardcode credentials.
- Do not leave dead buttons or fake interactions.
- Every visible button/link must perform its stated action or be clearly disabled with an explanation.
- Include friendly empty and error states.
- Avoid swallowing errors silently.
- Do not log passwords, tokens, or sensitive user data.
- Protect authenticated routes.
- Preserve user history across sessions when Firebase is configured.
- Handle unauthenticated access and expired sessions.
- Make demo mode usable without Firebase credentials.
- Do not claim production readiness if required external services are unconfigured.

## 13. Verification

After implementation:

1. Install dependencies using the project’s package manager.
2. Run lint/type-check/build scripts that are available.
3. Fix errors caused by the implementation.
4. Test registration/login flows where Firebase configuration permits; otherwise test and label demo mode.
5. Test image validation, preview, replace/remove, analysis loading, success, low-confidence, API error, and retry states.
6. Test history empty state, populated state, details, filters, and deletion confirmation.
7. Inspect mobile widths and desktop layout.
8. Check keyboard navigation, focus visibility, form labels, contrast, reduced motion, and status announcements.
9. Report exactly which checks passed and which could not be run because credentials or external services were unavailable.

## 14. Final response from the coding agent

When finished, provide:
- Summary of implemented features
- Important files created/modified
- Commands to run locally
- Required environment variables and how to configure them
- How to enable Firebase
- How to configure image hosting
- How to connect the real AI API later
- Build/test results
- Any known limitations

Never claim a real AI model is connected unless a working inference endpoint has been configured and verified.
