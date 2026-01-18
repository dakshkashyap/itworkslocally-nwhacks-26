import { useState, useCallback, useRef } from "react";
import { analyzeError, AnalysisResult, ExpertiseLevel } from "@/lib/gemini";
import { playAnalysisAudio } from "@/lib/elevenlabs";

const LOADING_MESSAGES = [
  "Asking Stack Overflow...",
  "Blaming the intern...",
  "Checking if you tried turning it off and on...",
  "Consulting the rubber duck...",
  "Reading the docs (just kidding)...",
  "Checking if it's a DNS issue...",
  "It's always DNS...",
  "Praying to the demo gods...",
  "Running rm -rf node_modules...",
  "Mass git blame-ing everyone...",
  "Wondering if we should mass rewrite in Rust...",
];

export function useAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startLoadingMessages = useCallback(() => {
    let index = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);
    messageIntervalRef.current = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[index]);
    }, 2000);
  }, []);

  const stopLoadingMessages = useCallback(() => {
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current);
      messageIntervalRef.current = null;
    }
    setLoadingMessage("");
  }, []);

  const analyze = useCallback(
    async (
      errorLog: string,
      localEnv: string,
      prodEnv: string,
      expertiseLevel: ExpertiseLevel
    ) => {
      setIsLoading(true);
      setError(null);
      setResult(null);
      startLoadingMessages();

      try {
        const analysisResult = await analyzeError(
          errorLog,
          localEnv,
          prodEnv,
          expertiseLevel
        );
        setResult(analysisResult);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong";
        setError(errorMessage);
      } finally {
        stopLoadingMessages();
        setIsLoading(false);
      }
    },
    [startLoadingMessages, stopLoadingMessages]
  );

  const playVoice = useCallback(async () => {
    if (!result) return;

    // Stop if already playing
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      audioRef.current = null;
      return;
    }

    try {
      setIsPlaying(true);
      const audio = await playAnalysisAudio(result);
      audioRef.current = audio;

      audio.onended = () => {
        console.log("Audio playback ended");
        setIsPlaying(false);
        // Clean up blob URL
        if ((audio as any)._blobUrl) {
          URL.revokeObjectURL((audio as any)._blobUrl);
        }
        audioRef.current = null;
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
        if ((audio as any)._blobUrl) {
          URL.revokeObjectURL((audio as any)._blobUrl);
        }
        audioRef.current = null;
      };
    } catch (err) {
      console.error("Voice synthesis error:", err);
      setIsPlaying(false);
      setError(err instanceof Error ? err.message : "Failed to play audio. Check your ElevenLabs API key.");
    }
  }, [result, isPlaying]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return {
    isLoading,
    loadingMessage,
    result,
    error,
    isPlaying,
    analyze,
    playVoice,
    reset,
  };
}
