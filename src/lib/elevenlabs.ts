export async function synthesizeSpeech(text: string): Promise<ArrayBuffer> {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

  console.log("ElevenLabs: Starting speech synthesis...");
  
  if (!apiKey) {
    console.error("ElevenLabs: API key not configured");
    throw new Error("ElevenLabs API key not configured");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("ElevenLabs Error Response:", response.status, errorText);
    throw new Error(`Failed to generate speech: ${response.status} - ${errorText}`);
  }

  console.log("ElevenLabs: Speech synthesis successful");
  return await response.arrayBuffer();
}

export function formatAnalysisForSpeech(analysis: {
  whatWentWrong: string;
  howToFix: string[];
  preventionTips: string[];
  tldr: string;
}): string {
  const steps = analysis.howToFix
    .map((step, i) => `Step ${i + 1}: ${step.replace(/Step \d+:/i, "")}`)
    .join(". ");

  const tips = analysis.preventionTips.join(". ");

  return `Here's the quick summary: ${analysis.tldr}. 

What went wrong: ${analysis.whatWentWrong}. 

Here's how to fix it: ${steps}. 

To prevent this in the future: ${tips}. 

Good luck, and may your deploys be ever successful!`.trim();
}

export async function playAnalysisAudio(analysis: {
  whatWentWrong: string;
  howToFix: string[];
  preventionTips: string[];
  tldr: string;
}): Promise<HTMLAudioElement> {
  const script = formatAnalysisForSpeech(analysis);
  console.log("ElevenLabs: Generating audio for script length:", script.length);
  
  const audioBuffer = await synthesizeSpeech(script);

  const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);

  const audio = new Audio(url);
  
  // Store URL for cleanup
  (audio as any)._blobUrl = url;
  
  console.log("ElevenLabs: Starting audio playback");
  await audio.play();

  return audio;
}
