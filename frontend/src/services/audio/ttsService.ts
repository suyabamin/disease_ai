export class TTSService {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  public static speak(text: string, lang: 'bn' | 'en' = 'bn'): boolean {
    if (!this.synth) return false;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    utterance.rate = 0.9; // Slightly slower for clear rural field listening

    // Try to find a matching voice
    const voices = this.synth.getVoices();
    const match = voices.find((v) => v.lang.includes(lang === 'bn' ? 'bn' : 'en'));
    if (match) {
      utterance.voice = match;
    }

    this.synth.speak(utterance);
    return true;
  }

  public static stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public static isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }
}
