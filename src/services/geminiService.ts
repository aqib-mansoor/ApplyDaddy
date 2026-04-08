import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, GeneratedResponse } from "../types";
import { stripHtml } from "../lib/utils";

const getApiKey = () => {
  // Try multiple sources for the API key
  const key = process.env.GEMINI_API_KEY || 
              (import.meta as any).env.VITE_GEMINI_API_KEY || 
              (import.meta as any).env.GEMINI_API_KEY;
  return key;
};

function getAI() {
  const API_KEY = getApiKey();
  if (!API_KEY) {
    throw new Error(
      "Gemini API Key is missing. \n\n" +
      "DEBUG INFO: \n" +
      "- process.env.GEMINI_API_KEY: " + (process.env.GEMINI_API_KEY ? "Found" : "Missing") + "\n" +
      "- VITE_GEMINI_API_KEY: " + ((import.meta as any).env.VITE_GEMINI_API_KEY ? "Found" : "Missing") + "\n\n" +
      "FIX: Please add GEMINI_API_KEY or VITE_GEMINI_API_KEY to your Vercel Environment Variables and REDEPLOY."
    );
  }
  return new GoogleGenAI({ apiKey: API_KEY });
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const message = error.message || "";
      const status = error.status || "";
      const isTransient = message.includes("high demand") || message.includes("503") || status === "UNAVAILABLE" || message.includes("deadline exceeded");
      
      if (isTransient && i < maxRetries) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff: 1s, 2s
        console.warn(`Gemini transient error, retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function generateResponse(
  jobPost: string,
  profile: UserProfile,
  tone: "professional" | "casual" | "enthusiastic"
): Promise<GeneratedResponse> {
  try {
    const ai = getAI();
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      You are "ApplyDaddy", a world-class career coach and job application expert.
      Your goal is to write a hyper-personalized job application response based on a job post and a user's profile.
      
      USER PROFILE:
      Name: ${profile.fullName}
      Email: ${profile.email}
      Phone: ${profile.phone || 'Not provided'}
      Location: ${profile.location || 'Not provided'}
      Education: ${profile.education || 'Not provided'}
      Skills: ${profile.skills.join(", ")}
      Experience: ${stripHtml(profile.experience)}
      Bio: ${stripHtml(profile.bio)}
      
      JOB POST:
      ${jobPost}
      
      TONE: ${tone}
      
      INSTRUCTIONS:
      1. Write a professional email response.
      2. Write a shorter, more direct WhatsApp/Message response.
      3. **CRITICAL RELEVANCE RULE**: Only include specific work experience and company names from the user's profile if they are RELEVANT to the job post.
      4. If the job is in a completely different field than the user's primary experience (e.g., user is a Web Developer but the job is for Call Center, Medical Billing, or Teaching), do NOT mention the irrelevant technical experience or specific tech company names.
      5. In cases of field mismatch, focus on general qualifications (like being a graduate), soft skills, and transferable experience from the "Bio" and "Experience" sections that makes sense for the target role.
      6. Ensure the response highlights the user's relevant skills for the specific job.
      7. Keep it engaging, confident, and professional.
      8. Do NOT use placeholders like [Company Name], extract them from the job post if possible, or use generic professional terms.
      
      OUTPUT FORMAT:
      Return a JSON object with the following structure:
      {
        "subject": "Email subject line",
        "email": "Full email body",
        "whatsapp": "WhatsApp message body"
      }
    `;

    const result = await withRetry(async () => {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              email: { type: Type.STRING },
              whatsapp: { type: Type.STRING },
            },
            required: ["subject", "email", "whatsapp"],
          },
        },
      });
      return response.text;
    });

    return JSON.parse(result);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    const message = error.message || "";
    const status = error.status || "";
    
    if (message.includes("high demand") || message.includes("503") || status === "UNAVAILABLE") {
      throw new Error("Daddy's AI is currently very busy helping others. Please wait a few seconds and try clicking 'Generate' again!");
    }
    
    if (message.includes("API key not valid") || message.includes("invalid API key") || message.includes("403") || message.includes("401")) {
      throw new Error("Invalid Gemini API Key. The key was found but rejected by Google. Please check if your key is restricted or create a NEW one in Google AI Studio.");
    }
    if (message.includes("API key is missing")) {
      throw new Error("Gemini API Key is missing. Please ensure GEMINI_API_KEY or VITE_GEMINI_API_KEY is set in your Vercel Environment Variables and REDEPLOY.");
    }
    
    // If it's already a clean error message we threw, just rethrow it
    if (typeof error === 'string') throw error;
    if (error instanceof Error && !error.message.startsWith('{')) throw error;

    // Fallback for raw JSON errors from the SDK
    throw new Error("Daddy encountered a temporary glitch in the AI. Please try again in a moment.");
  }
}

export async function extractJobMetadata(jobPost: string): Promise<{ company: string; titles: string[] }> {
  try {
    const ai = getAI();
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      Extract the company name and all job titles mentioned in the following job post.
      If multiple job roles are being hired for, list all of them.
      If not found, return "Unknown" for company and an empty array for titles.
      
      JOB POST:
      ${jobPost}
      
      OUTPUT FORMAT:
      Return a JSON object:
      {
        "company": "Company Name",
        "titles": ["Job Title 1", "Job Title 2"]
      }
    `;

    const result = await withRetry(async () => {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              titles: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
            },
            required: ["company", "titles"],
          },
        },
      });
      return response.text;
    });

    return JSON.parse(result);
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    const message = error.message || "";
    const status = error.status || "";

    if (message.includes("high demand") || message.includes("503") || status === "UNAVAILABLE") {
      throw new Error("Daddy's AI is a bit overwhelmed right now. Please try 'Magic Fill' again in a few seconds.");
    }

    if (message.includes("API key not valid") || message.includes("invalid API key") || message.includes("403") || message.includes("401")) {
      throw new Error("Invalid Gemini API Key. The key was found but rejected by Google. Please check if your key is restricted or create a NEW one in Google AI Studio.");
    }
    if (message.includes("API key is missing")) {
      throw new Error("Gemini API Key is missing. Please ensure GEMINI_API_KEY or VITE_GEMINI_API_KEY is set in your Vercel Environment Variables and REDEPLOY.");
    }
    
    // Fallback
    throw new Error("Magic Fill encountered a temporary issue. Please try again or fill the fields manually.");
  }
}
