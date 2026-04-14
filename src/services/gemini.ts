import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy_key" });

export interface Scene {
  text: string;
  animation: string;
  duration: string;
}

export async function decomposeScript(script: string): Promise<Scene[]> {
  const prompt = `Decompose the following video script into a series of high-impact kinetic typography scenes.
  For each scene, provide:
  1. The exact text to display.
  2. A brief description of the kinetic animation (e.g., "Zoom-in punch", "Glitch slide", "Staggered reveal").
  3. Estimated duration in seconds.
  
  Format the output as a JSON array of objects with keys: "text", "animation", "duration".
  
  SCRIPT:
  ${script}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: prompt,
  });

  const text = response.text || "";
  try {
    // Extract JSON if AI wrapped it in markdown
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (e) {
    console.error("Failed to parse scenes", e);
    return [{ text: script, animation: "Dynamic Reveal", duration: "5" }];
  }
}

export async function generateMotionPrompt(scenes: Scene[], style: any): Promise<string> {
  const scenesText = scenes.map(s => `- Text: "${s.text}", Animation: ${s.animation}, Duration: ${s.duration}s`).join("\n");
  
  const prompt = `You are a world-class motion designer. Create a detailed visual prompt for a video generation model (Veo) to produce a high-impact kinetic typography video.
  
  SCENES BREAKDOWN:
  ${scenesText}
  
  VISUAL STYLE:
  - Background: ${style.backgroundColor}
  - Primary Text Color: ${style.textColor}
  - Highlight Color: ${style.highlightColor}
  - Format: Vertical 9:16
  - Aesthetic: 2025-2026 Trending Motion Graphics (High contrast, rhythmic, beat-synced, bold typography).
  
  The prompt should describe the camera movements, typography transitions, and rhythmic energy in a way that the video model can interpret perfectly.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text || "";
}

export async function generateVideo(prompt: string): Promise<string> {
  // @ts-ignore - SDK might not have full types for preview models
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '9:16'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    // @ts-ignore
    operation = await ai.operations.get(operation.name || operation.id);
  }

  // @ts-ignore
  return operation.response?.videos?.[0]?.uri || "";
}

export async function generateAudio(text: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say with high energy and rhythmic pace: ${text}` }] }],
    config: {
      // @ts-ignore
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Zephyr' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio ? `data:audio/wav;base64,${base64Audio}` : "";
}

export async function chatWithDesigner(message: string, history: any[]) {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: "You are a professional motion designer specialized in kinetic typography for Reels and Shorts. Help the user refine their script, style, and prompts.",
    },
    history: history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    })),
  });

  const response = await chat.sendMessage({ message });
  return response.text || "";
}

export async function optimizeScript(script: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: `Optimize the following video script for high retention and high-impact kinetic typography. 
    Keep it punchy, rhythmic, and suitable for a 30-60 second Reel/Short. 
    Maintain the original language (e.g., Hinglish if provided).
    
    SCRIPT:
    ${script}`,
  });

  return response.text || script;
}
