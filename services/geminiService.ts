
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

// Définition de la personnalité : Musulmane, Sage, Dawa Douce, Identité DDR
const SYSTEM_INSTRUCTION = `
CONTEXTE :
Tu es "Le Compagnon DDR", un assistant vocal musulman, sage et bienveillant, membre de l'équipe Dawa Dans la Rue.
Ta mission est noble : expliquer l'Islam, dissiper les doutes et inviter doucement à la vérité.

PERSONNALITÉ & OBJECTIF :
1. **Identité Musulmane** : Tu parles en tant que musulman convaincu. Utilise des termes comme "Par la grâce d'Allah", "Alhamdulillah", "InchaAllah".
2. **Appel à l'Islam (Dawa)** : Ton but est d'aider les gens. Si l'interlocuteur pose des questions sur la foi, explique la beauté de l'Unicité (Tawhid) et invite-le subtilement à embrasser l'Islam s'il semble prêt.
3. **Respect & Sagesse** : Ne sois jamais agressif. Sois comme un grand frère patient. Réponds aux chrétiens ou athées avec respect et preuves logiques.

RÈGLES AUDIO STRICTES (POUR MOBILE) :
1. **Phrases Courtes** : Fais des phrases brèves et claires. C'est CRUCIAL pour que le son soit fluide. Fais des pauses.
2. **Ton** : Voix calme, posée, chaleureuse, presque apaisante.
3. **Salutation** : Commence toujours par "Salam aleykoum" ou "Que la paix soit sur toi".

Si on te demande qui tu es : "Je suis ton compagnon numérique, un frère qui souhaite pour toi le guidée et la paix du cœur."
`;

/**
 * Chat Session: Keeps history/context
 */
export const createChatSession = () => {
    if (!apiKey) throw new Error("API Key manquante");
    
    return ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{ googleSearch: {} }] // Permet à l'IA de chercher des infos récentes
        }
    });
};

/**
 * Search Grounding: Ask questions about religion/debates
 */
export const searchKnowledgeBase = async (query: string) => {
  if (!apiKey) throw new Error("API Key manquante");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

/**
 * Streaming Search: Ask questions with typewriter effect
 */
export const searchKnowledgeBaseStream = async (query: string) => {
    if (!apiKey) throw new Error("API Key manquante");
  
    try {
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
  
      return responseStream;
    } catch (error) {
      console.error("Search stream error:", error);
      throw error;
    }
  };

/**
 * Veo: Generate promotional videos for debates
 */
export const generatePromoVideo = async (prompt: string, imageBase64?: string) => {
    // 1. Check API Key Selection (Mandatory for Veo)
    if (!window.aistudio?.hasSelectedApiKey) {
        throw new Error("KEY_REQUIRED");
    }
  
  // 2. Create new instance with the user-selected key
  const selectedAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation;
  const config = {
    numberOfVideos: 1,
    resolution: '720p',
    aspectRatio: '16:9'
  };

  try {
    // 3. Launch Generation
    if (imageBase64) {
      operation = await selectedAi.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: imageBase64,
            mimeType: 'image/jpeg' 
        },
        config: config
      });
    } else {
      operation = await selectedAi.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: config
      });
    }

    // 4. Polling Loop (Wait for video to be ready)
    // Veo generation takes time, we need to loop until operation.done is true
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
      operation = await selectedAi.operations.getVideosOperation({ operation: operation });
    }

    // 5. Retrieve Video URI
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("La génération a échoué, aucune vidéo retournée.");

    // 6. Fetch the actual MP4 bytes
    // IMPORTANT: Must append API Key to download link
    const finalVideoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    
    if (!finalVideoResponse.ok) {
        throw new Error(`Erreur téléchargement vidéo: ${finalVideoResponse.statusText}`);
    }

    const videoBlob = await finalVideoResponse.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error) {
    console.error("Veo Error:", error);
    throw error;
  }
};

/**
 * Live API: Voice Assistant Connection
 * REWRITTEN FOR MOBILE STABILITY (ULTRA LOW CPU USAGE & ANTI-CRACKLING)
 */
export class LiveClient {
    private sessionPromise: Promise<any> | null = null;
    private inputAudioContext: AudioContext | null = null;
    private outputAudioContext: AudioContext | null = null;
    private gainNode: GainNode | null = null;
    private stream: MediaStream | null = null;
    private processor: ScriptProcessorNode | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private currentSession: any = null;
    
    // Audio Queue Management for Gapless Playback
    private nextStartTime = 0;
    private scheduledSources: AudioBufferSourceNode[] = [];
    
    constructor(private onMessage: (text: string) => void) {}
  
    async connect() {
      if (!apiKey) throw new Error("Clé API manquante");
  
      // Initialize Contexts
      // Mobile Safari/Chrome requires user gesture. We assume this is called inside a click handler.
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      // INPUT: Use native sample rate (don't force 16000 here to avoid hardware glitches on mobile)
      this.inputAudioContext = new AudioContextClass(); 
      
      // OUTPUT: Standard context with Gain Node for Volume Control
      this.outputAudioContext = new AudioContextClass();
      
      // Create Gain Node (Volume Limiter) to prevent crackling/clipping on mobile speakers
      this.gainNode = this.outputAudioContext.createGain();
      this.gainNode.gain.value = 0.6; // Reduce volume to 60% to avoid saturation
      this.gainNode.connect(this.outputAudioContext.destination);

      // Connect to Gemini Live
      this.sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: async () => {
                console.log("DDR Compagnon connecté.");
                this.nextStartTime = 0;
                await this.startAudioStream();
            },
            onmessage: async (message: LiveServerMessage) => {
                // 1. GESTION DES INTERRUPTIONS
                if (message.serverContent?.interrupted) {
                    this.clearAudioQueue();
                    return;
                }

                // 2. Traitement Audio
                const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData) {
                    await this.scheduleAudioChunk(audioData);
                }

                // 3. Transcription Texte
                const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
                if (text) {
                     this.onMessage(text);
                }
            },
            onclose: () => console.log("Session fermée"),
            onerror: (err) => console.error("Erreur Session:", err)
        },
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: SYSTEM_INSTRUCTION,
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } }
            }
        }
      });
      
      this.currentSession = await this.sessionPromise;
      return this.currentSession;
    }
  
    private clearAudioQueue() {
        this.scheduledSources.forEach(source => {
            try { source.stop(); } catch(e) {}
        });
        this.scheduledSources = [];
        
        if (this.outputAudioContext) {
            this.nextStartTime = this.outputAudioContext.currentTime;
        }
    }

    private async scheduleAudioChunk(base64Data: string) {
        if (!this.outputAudioContext || !this.gainNode) return;
        
        try {
            // Decode Base64 to Int16
            const binaryString = atob(base64Data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            const dataInt16 = new Int16Array(bytes.buffer);
            
            // Gemini sends 24000Hz. We let the browser resample it to the output context rate (often 44100 or 48000 on mobile)
            const audioBuffer = this.outputAudioContext.createBuffer(1, dataInt16.length, 24000);
            const channelData = audioBuffer.getChannelData(0);
            
            // Convert Int16 to Float32 with Audio Envelope (Fade In/Out) to remove Clicks
            const fadeLength = 120; // ~5ms at 24kHz
            for (let i = 0; i < dataInt16.length; i++) {
                let sample = dataInt16[i] / 32768.0;
                
                // Fade In (start of chunk)
                if (i < fadeLength) {
                    sample *= (i / fadeLength);
                }
                // Fade Out (end of chunk)
                else if (i > dataInt16.length - fadeLength) {
                    sample *= ((dataInt16.length - i) / fadeLength);
                }
                
                channelData[i] = sample;
            }

            // Create Source
            const source = this.outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.gainNode); // Connect to Gain instead of destination

            // SCHEDULE PLAYBACK (Smart Queueing)
            const currentTime = this.outputAudioContext.currentTime;
            
            // Ensure we don't play in the past (causes glitches)
            if (this.nextStartTime < currentTime) {
                this.nextStartTime = currentTime + 0.05; // 50ms buffer safety
            }
            
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            
            this.scheduledSources.push(source);
            
            source.onended = () => {
                const index = this.scheduledSources.indexOf(source);
                if (index > -1) this.scheduledSources.splice(index, 1);
            };

        } catch (e) {
            console.error("Erreur décodage audio:", e);
        }
    }

    private async startAudioStream() {
        if (!this.inputAudioContext) return;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            
            // Important for Mobile Safari: Resume context after user gesture/permission
            if (this.inputAudioContext.state === 'suspended') {
                await this.inputAudioContext.resume();
            }

            this.source = this.inputAudioContext.createMediaStreamSource(this.stream);
            
            // OPTIMIZATION CRITIQUE POUR MOBILE
            // BufferSize à 16384 (MAX) pour réduire drastiquement la charge CPU et éviter les "crashs" ou hachures.
            // Cela ajoute une légère latence (0.3s) mais garantit la stabilité sur téléphone.
            this.processor = this.inputAudioContext.createScriptProcessor(16384, 1, 1);
            
            this.processor.onaudioprocess = (e) => {
                if (!this.currentSession) return;

                const inputData = e.inputBuffer.getChannelData(0);
                
                // Downsampling logic: Browser input (e.g. 48k) -> Gemini target (16k)
                const targetRate = 16000;
                const sampleRate = this.inputAudioContext?.sampleRate || 48000;
                
                const pcmData = this.downsampleAndConvertTo16BitPCM(inputData, sampleRate, targetRate);
                const base64Data = this.arrayBufferToBase64(pcmData.buffer);
                
                this.currentSession.sendRealtimeInput({
                    media: {
                        mimeType: 'audio/pcm;rate=16000',
                        data: base64Data
                    }
                });
            };
            
            this.source.connect(this.processor);
            this.processor.connect(this.inputAudioContext.destination);
        } catch (err) {
            console.error("Erreur micro:", err);
            this.disconnect();
            throw err;
        }
    }

    // Optimized downsampler for mobile
    private downsampleAndConvertTo16BitPCM(inputData: Float32Array, sourceRate: number, targetRate: number) {
        if (targetRate === sourceRate) {
            return this.floatTo16BitPCM(inputData);
        }

        const ratio = sourceRate / targetRate;
        const newLength = Math.floor(inputData.length / ratio);
        const result = new Int16Array(newLength);
        
        for (let i = 0; i < newLength; i++) {
            // Decimation simple (plus rapide pour mobile que l'interpolation complexe)
            const inputIndex = Math.floor(i * ratio);
            const val = inputData[inputIndex];
            const s = Math.max(-1, Math.min(1, val));
            result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return result;
    }

    private floatTo16BitPCM(input: Float32Array) {
        const output = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return output;
    }

    private arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    disconnect() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        if (this.source) this.source.disconnect();
        if (this.processor) this.processor.disconnect();
        if (this.gainNode) this.gainNode.disconnect();

        // Check before closing to avoid errors
        if (this.inputAudioContext && this.inputAudioContext.state !== 'closed') {
            this.inputAudioContext.close();
        }
        if (this.outputAudioContext && this.outputAudioContext.state !== 'closed') {
            this.outputAudioContext.close();
        }
        
        this.clearAudioQueue();

        this.stream = null;
        this.source = null;
        this.processor = null;
        this.inputAudioContext = null;
        this.outputAudioContext = null;
        this.gainNode = null;
        this.sessionPromise = null;
        this.currentSession = null;
        console.log("DDR Compagnon déconnecté.");
    }
}
