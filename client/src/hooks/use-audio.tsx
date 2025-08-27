import { useCallback } from 'react';

// Audio frequencies for different events
const AUDIO_FREQUENCIES = {
  SUCCESS: 800, // Bright, high tone like Finch app
  SAVE: 600,    // Medium tone for saves
  MILESTONE: 1000, // Very bright for milestones
  COMPLETE: [800, 1000, 1200], // Chord for mission completion
};

interface AudioOptions {
  duration?: number;
  volume?: number;
  fade?: boolean;
}

export function useAudio() {
  const createAudioContext = useCallback(() => {
    try {
      return new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }, []);

  const playTone = useCallback((frequency: number, options: AudioOptions = {}) => {
    const {
      duration = 200,
      volume = 0.3,
      fade = true
    } = options;

    const audioContext = createAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    
    if (fade) {
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration / 1000);
    } else {
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime + duration / 1000);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration / 1000 + 0.01);
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000 + 0.01);
  }, [createAudioContext]);

  const playChord = useCallback((frequencies: number[], options: AudioOptions = {}) => {
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        playTone(freq, options);
      }, index * 100);
    });
  }, [playTone]);

  const playSuccess = useCallback(() => {
    playTone(AUDIO_FREQUENCIES.SUCCESS, { duration: 300, volume: 0.4 });
  }, [playTone]);

  const playSave = useCallback(() => {
    playTone(AUDIO_FREQUENCIES.SAVE, { duration: 150, volume: 0.3 });
  }, [playTone]);

  const playMilestone = useCallback(() => {
    playTone(AUDIO_FREQUENCIES.MILESTONE, { duration: 500, volume: 0.4 });
  }, [playTone]);

  const playComplete = useCallback(() => {
    playChord(AUDIO_FREQUENCIES.COMPLETE, { duration: 200, volume: 0.3 });
  }, [playChord]);

  return {
    playSuccess,
    playSave,
    playMilestone,
    playComplete,
    playTone,
    playChord
  };
}