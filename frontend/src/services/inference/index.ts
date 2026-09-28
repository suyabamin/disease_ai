/**
 * getInferenceProvider()
 * ----------------------
 * Returns the appropriate inference provider based on environment config.
 *
 * ┌─────────────────────────────────────┬──────────────────────────────┐
 * │ VITE_AI_API_BASE_URL is set         │ → ApiInferenceProvider (real)│
 * │ VITE_DEMO_MODE=true explicitly      │ → DemoInferenceProvider      │
 * │ VITE_AI_API_BASE_URL not set        │ → DemoInferenceProvider      │
 * └─────────────────────────────────────┴──────────────────────────────┘
 *
 * IMPORTANT: The real API NEVER falls back to demo predictions.
 * If the API is configured but unreachable, it will throw an error
 * and the UI must show "AI service unavailable."
 */
import { InferenceProvider } from './types';
import { DemoInferenceProvider } from './DemoInferenceProvider';
import { ApiInferenceProvider } from './ApiInferenceProvider';

const apiBaseUrl = import.meta.env.VITE_AI_API_BASE_URL as string | undefined;
const demoModeEnv = import.meta.env.VITE_DEMO_MODE as string | undefined;

// Explicit demo mode flag — default false
const isDemoMode = demoModeEnv === 'true';

// Use real API when URL is configured AND demo mode is not explicitly enabled
const useRealApi = !isDemoMode && !!apiBaseUrl && apiBaseUrl.trim() !== '';

if (useRealApi) {
  console.info(`[AgroAI] Real AI backend configured: ${apiBaseUrl}`);
} else if (isDemoMode) {
  console.info('[AgroAI] Demo mode enabled (VITE_DEMO_MODE=true). Predictions are simulated.');
} else {
  console.warn(
    '[AgroAI] VITE_AI_API_BASE_URL is not set. ' +
    'Running in demo mode. Set the URL to enable real AI predictions.'
  );
}

export const getInferenceProvider = (): InferenceProvider => {
  if (useRealApi) {
    return new ApiInferenceProvider(apiBaseUrl!);
  }
  return new DemoInferenceProvider();
};
