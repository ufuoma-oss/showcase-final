
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { BrandProfile, ImageAspectRatio, ImageResolution } from "../types";

// Helper to get a fresh AI instance with the latest key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper for API calls to handle 503 Overloaded errors
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    // Check for various forms of 503/Overloaded errors
    const status = error?.status || error?.response?.status || error?.code || error?.error?.code;
    const message = error?.message || error?.error?.message || '';
    
    const isOverloaded = status === 503 || message.includes('overloaded') || message.includes('UNAVAILABLE');
    const isPermission = status === 403;

    if (isOverloaded && retries > 0) {
      console.warn(`Model overloaded. Retrying in ${delay}ms... (${retries} attempts left)`);
      await wait(delay);
      return withRetry(fn, retries - 1, delay * 2); // Exponential backoff
    }
    
    // If permission denied, do not retry, just throw to let user know to check key/billing
    if (isPermission) {
        throw new Error("Permission Denied: Please check your API Key and Billing status for Gemini Pro Vision.");
    }
    
    throw error;
  }
};

export const fileToGenerativePart = async (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Safety check for empty files
      if (!base64String) {
          reject(new Error("File processing failed"));
          return;
      }
      const base64Data = base64String.split(',')[1];
      resolve({
        data: base64Data,
        mimeType: file.type,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * COMMAND PROCESSOR (Text Fallback)
 * Only used if the intent is purely informational or ambiguous.
 */
export const sendChatMessage = async (
  history: any[], // Type relaxed to avoid circular dependency
  newMessage: string,
  brand: BrandProfile,
  attachments?: { data: string; mimeType: string }[],
  isComplex: boolean = false
): Promise<string> => {
  
  const ai = getAI();
  const modelName = 'gemini-2.5-flash'; 
  
  const systemInstruction = `
    ROLE: Studio Command Interface.
    STRICT MODE: DO NOT CHAT. DO NOT TELL STORIES. NO PHILOSOPHY.
    TASK: The user is trying to generate or edit images.
    
    If the user's input is a number (e.g., "Five") or ambiguous:
    1. Assume they want to generate/edit an image with that quantity or subject.
    2. If you cannot generate, ask for a visual description briefly.
    
    Example input: "Five"
    Example output: "Please describe what you want 5 of. E.g., '5 perfume bottles'."

    DO NOT output narratives, visions, or creative writing.
    Keep responses robotic, concise, and operational.
  `;

  const parts: any[] = [];
  
  if (attachments && attachments.length > 0) {
    attachments.forEach(att => {
      parts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.data
        }
      });
    });
  }
  
  parts.push({ text: newMessage });

  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: modelName,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
      }
    }));

    return response.text || "Command processed.";
  } catch (e) {
    console.error("Chat generation failed:", e);
    return "System standby. The creative engine is currently rebooting. Please try again in a moment.";
  }
};

/**
 * IMAGE GENERATION
 */
export const generateProductImage = async (
  prompt: string,
  aspectRatio: ImageAspectRatio = ImageAspectRatio.PORTRAIT,
  defaultResolution: ImageResolution = ImageResolution.R4K,
  referenceImages?: { data: string; mimeType: string }[],
  brand?: BrandProfile,
  onRetry?: () => void
): Promise<{ image: string | null; feedback: string | null }> => {
  const ai = getAI();
  
  // STRICT MODEL ENFORCEMENT
  // We strictly use gemini-3-pro-image-preview as requested.
  // RESOLUTION LOCKED TO 4K (Ultra HD).
  const modelName = 'gemini-3-pro-image-preview';

  // 2. Strict Prompt Engineering
  const lowerPrompt = prompt.toLowerCase();
  
  // DETECT INTENT
  const isFlyer = lowerPrompt.match(/(flyer|poster|ad|banner|campaign|post|greeting|invitation|card|story|promotion|sale|marketing)/);
  const isInterior = lowerPrompt.match(/(interior|room|furniture|design makeover|living room|bedroom|store|office|kitchen|space|area|decorate|staging|home staging|redesign|renovate|arrange|stage)/);
  const isInfluencer = lowerPrompt.match(/(influencer|holding|holding the product|holding it|model holding)/);
  
  // GHOST MANNEQUIN DETECTION
  const isGhost = lowerPrompt.includes('ghost mannequin') || lowerPrompt.includes('invisible model');
  const isBlackGhost = lowerPrompt.includes('black mannequin') || lowerPrompt.includes('black ghost');
  
  // MODEL DETECTION
  const mentionsHuman = lowerPrompt.match(/\b(man|woman|person|people|model|girl|boy|guy|lady|human|face|skin|wearing|influencer)\b/);

  // LOGIC: High-End African Aesthetic
  let humanLogic = ``;

  if (isFlyer) {
      if (mentionsHuman) {
          humanLogic = `
          SUBJECT: Modern Marketing Design WITH HUMAN MODEL.
          - TYPE: DIGITAL GRAPHIC DESIGN (FULL BLEED).
          - COMPOSITION: Edge-to-edge design. NO borders. NO paper mockups. NO 3D perspective of a sheet.
          - ETHNICITY: Melanin-rich Black African.
          - STYLE: High-end editorial integration.
          - SKIN TONE: Deep, rich, luxurious chocolate tones.
          `;
      } else {
          // STRICT NEGATIVE PROMPT FOR FLYERS
          humanLogic = `
          SUBJECT: PURE GRAPHIC DESIGN / TYPOGRAPHY FOCUSED.
          - TYPE: DIGITAL GRAPHIC DESIGN (FULL BLEED).
          - COMPOSITION: Edge-to-edge design. NO borders. NO paper mockups. NO 3D perspective.
          - FORMAT: Print-ready digital asset.
          - ABSOLUTELY NO HUMANS. NO HANDS. NO FINGERS. NO BODY PARTS. NO SILHOUETTES.
          - Focus strictly on the layout, typography, and any provided product images.
          - VISUAL STYLE: Match the user's requested style (e.g. Fun, Bold, Minimalist) exactly.
          `;
      }
  } else if (isInterior) {
       // INTERIOR LOGIC - ROBUST & PERMISSIVE
       // STRICT PRESERVATION LOGIC
       const isStaging = prompt.match(/(stage|arrange|furnish|decorate|add items|place)/i);
       
       humanLogic = `
       SUBJECT: ARCHITECTURAL INTERIOR VISUALIZATION & STAGING.
       - TYPE: Professional Architectural Visualization.
       - INPUT HANDLING:
           1. **STRUCTURAL LOCK**: The user has provided an image of a space. You must PRESERVE the existing walls, windows, doors, ceiling, and floor plan EXACTLY. Do not hallucinate new windows or change the room's geometry.
           2. **TASK**: ${isStaging ? 'STAGING ONLY. Add furniture and decor to the existing empty or semi-empty space. Do not remodel the architecture.' : 'Redecorate existing space while keeping the structure 100% intact.'}
           3. **EXISTING FURNITURE**: If the room contains furniture, you may replace it or arrange around it as requested. Do NOT block generation because of furniture.
       - STRICT NO-HUMAN RULE: Do NOT generate people, homeowners, or occupants in the room. The room must be empty of people.
       - VISUAL STYLE: Photorealistic, High-End, Magazine Quality.
       `;
  } else if (isInfluencer) {
       humanLogic = `
      SUBJECT: LIFESTYLE INFLUENCER SHOT.
      - ACTION: The model is naturally holding or interacting with the product.
      - ETHNICITY: Melanin-rich Black African.
      - VIBE: Trendy, Social Media famous, High-end, "It Girl" / "It Guy" aesthetic.
      - SKIN TONE: Deep, rich, luxurious chocolate tones. Glowing skin.
      - MAKEUP: Flawless, contemporary.
      - FOCUS: The product must be clearly visible in their hand/hands.
      `;
  } else if (isBlackGhost) {
      humanLogic = `
      SUBJECT: BLACK GHOST MANNEQUIN PHOTOGRAPHY.
      - INVISIBLE MODEL: The clothing must look filled out by a body, but NO BODY PARTS should be visible.
      - INNER FORM: The neck hole, sleeve openings, and hem areas should reveal a MATTE BLACK, NON-REFLECTIVE INNER SHELL.
      - STEALTH AESTHETIC: High contrast, premium, futuristic.
      - 3D VOLUME: The fabric must drape naturally as if worn.
      - STRICTLY FORBIDDEN: Human skin, hands, feet, white mannequin parts.
      `;
  } else if (isGhost) {
      humanLogic = `
      SUBJECT: GHOST MANNEQUIN PHOTOGRAPHY.
      - INVISIBLE MODEL: The clothing must look filled out by a body, but NO BODY PARTS should be visible.
      - NO HANDS. NO FEET. NO NECK. NO HEAD.
      - HOLLOW NECK EFFECT: Show the inside label or back of the neck where the head would be.
      - 3D VOLUME: The fabric must drape naturally as if worn.
      - STRICTLY FORBIDDEN: Flat lay, wrinkled clothes on floor, visible mannequins, plastic dummies.
      `;
  } else if (mentionsHuman || (!isFlyer && !isInterior)) {
      const impliesObjectOnly = lowerPrompt.match(/(on white background|on a table|flat lay|product shot|close up of|only the|just the)/);
      
      if (impliesObjectOnly && !mentionsHuman) {
          humanLogic = `
          SUBJECT: PROFESSIONAL PRODUCT PHOTOGRAPHY.
          - FOCUS: The product is the sole hero.
          - NO HUMANS. NO HANDS.
          - LIGHTING: High-end commercial studio lighting.
          `;
      } else {
          humanLogic = `
          SUBJECT: FASHION MODEL PHOTOGRAPHY.
          - ETHNICITY: Melanin-rich Black African.
          - STYLE: High-end editorial, Vogue Africa aesthetic.
          - POSE: Dynamic, confident, showcasing the outfit.
          - SKIN: Deep, glowing, unblemished.
          `;
      }
  }

  // --- STRICT BRAND LEAKAGE PREVENTION ---
  // Only include brand context if the user has explicitly enabled it.
  const brandLogic = (brand && brand.applyBrandTone) ? `
  BRAND CONTEXT:
  - Name: ${brand.name}
  - Industry: ${brand.industry}
  - Tone: ${brand.tone}
  - INSTRUCTION: Apply this brand tone visually to the generated image.
  ` : "";

  let technicalReqs = ``;
  
  if (isFlyer) {
      technicalReqs = `
      TECHNICAL REQUIREMENTS:
      - TYPE: Digital Graphic Design / Print Ready Asset.
      - VIEW: Frontal, Flat, 2D (unless 3D typography is requested).
      - COMPOSITION: Full Bleed, Edge-to-Edge, No Borders, No Mockup Environment.
      - QUALITY: 4K, Vector-like Sharpness, Perfect Typography.
      - DO NOT generate a photo of a paper on a table. Generate the design itself.
      `;
  } else {
      technicalReqs = `
      TECHNICAL REQUIREMENTS:
      - RESOLUTION: 4K, Ultra-Detailed.
      - LIGHTING: Professional Studio or Natural Golden Hour (depending on context).
      - CAMERA: 85mm lens, f/1.8.
      - TEXTURE: Real fabric textures, skin pores visible.
      - NO DISTORTIONS: Perfect hands, eyes, and face.
      `;
  }

  const finalPrompt = `
  TASK: ${isFlyer ? 'Generate a Professional Digital Marketing Design (Full Bleed)' : 'Generate a photorealistic 4K image'}.
  USER PROMPT: "${prompt}"
  
  IMPORTANT: FOLLOW USER PROMPT EXACTLY. DO NOT ADD ELEMENTS NOT REQUESTED.
  
  ${humanLogic}
  
  ${brandLogic}
  
  ${technicalReqs}
  `;

  try {
    const parts: any[] = [];
    
    // Add reference images if any
    if (referenceImages && referenceImages.length > 0) {
        referenceImages.forEach(img => {
            parts.push({
                inlineData: {
                    mimeType: img.mimeType,
                    data: img.data
                }
            });
        });
    }
    
    parts.push({ text: finalPrompt });

    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: modelName,
        contents: {
            parts: parts
        },
        config: {
            imageConfig: {
                aspectRatio: aspectRatio,
                imageSize: '2K' // Note: Gemini 3 Pro Image Preview supports 2K
            }
        }
    }));

    // Extract image from response
    let generatedImage = null;
    let feedbackText = null;

    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                generatedImage = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            } else if (part.text) {
                feedbackText = part.text;
            }
        }
    }
    
    return { image: generatedImage, feedback: feedbackText };
  } catch (error) {
    console.error("Image generation failed:", error);
    return { image: null, feedback: null };
  }
};

/**
 * EDIT IMAGE
 * Uses the image model to modify an existing image based on a prompt.
 * 
 * UPDATE: Uses a strict 'Photo Editor' persona to ensure consistency.
 */
export const editProductImage = async (
    base64Image: string,
    mimeType: string,
    prompt: string,
    aspectRatio: ImageAspectRatio = ImageAspectRatio.PORTRAIT
  ): Promise<{ image: string | null; feedback: string | null }> => {
    const ai = getAI();
    const modelName = 'gemini-3-pro-image-preview';
  
    try {
      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
              { inlineData: { mimeType: mimeType, data: base64Image } },
              { text: `
              ROLE: Expert Photo Editor & Retoucher.
              TASK: Edit the attached image according to this instruction: "${prompt}".
              
              STRICT CONSISTENCY RULES:
              1. PRESERVE THE IMAGE: Do not change the model's face, the product details, or the scene composition unless the user explicitly asks to change them.
              2. ISOLATION: If the user asks to "change the background", ONLY change the background. Keep the foreground subject identical.
              3. NO HALLUCINATIONS: Do not add random objects, change the lighting style, or alter the camera angle unless requested.
              4. INTERIOR SPECIFIC: If this is a room, do not move walls or windows. Only add/remove furniture if asked.
              5. NO HUMANS: If the image does not currently have a human, do NOT add one unless asked.
              
              EXECUTION:
              - Perform the edit with pixel-perfect precision.
              - Maintain 4K photorealism.
              - Do exactly what the user asked, nothing more, nothing less.
              ` }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: '2K'
          }
        }
      }));
      
      let generatedImage = null;
      let feedbackText = null;

      if (response.candidates && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  generatedImage = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              } else if (part.text) {
                  feedbackText = part.text;
              }
          }
      }
      
      return { image: generatedImage, feedback: feedbackText };
    } catch (e) {
        console.error("Edit failed", e);
        return { image: null, feedback: null };
    }
  };
