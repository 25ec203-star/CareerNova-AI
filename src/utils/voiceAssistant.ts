// Utility for browser-native Text-to-Speech and Speech-to-Text

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(
  text: string,
  options?: {
    rate?: number;
    volume?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
  }
): () => void {
  if (!isSpeechSynthesisSupported()) {
    options?.onStart?.();
    setTimeout(() => options?.onEnd?.(), 1000);
    return () => {};
  }

  // Cancel any ongoing utterance
  window.speechSynthesis.cancel();

  const cleanText = text.replace(/[*_#`]/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);

  utterance.rate = options?.rate ?? 1.0;
  utterance.volume = options?.volume ?? 1.0;
  utterance.pitch = options?.pitch ?? 1.0;

  // Prefer natural English voices
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Alex') ||
        v.name.includes('Daniel'))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis error:', e);
    options?.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
    options?.onEnd?.();
  };
}

export function createSpeechRecognizer(callbacks: {
  onTranscript: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}): { start: () => void; stop: () => void; isSupported: boolean } {
  if (!isSpeechRecognitionSupported()) {
    return {
      start: () => callbacks.onError?.('Speech Recognition is not supported in this browser.'),
      stop: () => {},
      isSupported: false,
    };
  }

  const SpeechRecognitionClass =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  let recognition: any = null;
  let isRunning = false;

  try {
    recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isRunning = true;
      callbacks.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const combined = (finalTranscript || interimTranscript).trim();
      if (combined) {
        callbacks.onTranscript(combined, Boolean(finalTranscript));
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        console.warn('Speech recognition event error:', event.error);
        callbacks.onError?.(event.error);
      }
    };

    recognition.onend = () => {
      isRunning = false;
      callbacks.onEnd?.();
    };
  } catch (err) {
    console.warn('Failed to initialize SpeechRecognition:', err);
  }

  return {
    isSupported: true,
    start: () => {
      if (recognition && !isRunning) {
        try {
          recognition.start();
        } catch (e) {
          console.log('Recognition already started or error:', e);
        }
      }
    },
    stop: () => {
      if (recognition && isRunning) {
        try {
          recognition.stop();
        } catch (e) {
          // ignore
        }
      }
    },
  };
}
