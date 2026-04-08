import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, GeneratedResponse } from "../types";
import { stripHtml } from "../lib/utils";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is not defined. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export async function generateResponse(
  jobPost: string,
  profile: UserProfile,
  tone: "professional" | "casual" | "enthusiastic"
): Promise<GeneratedResponse> {
  try {
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

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("Invalid Gemini API Key. Please check your Vercel environment variables.");
    }
    throw error;
  }
}

export async function extractJobMetadata(jobPost: string): Promise<{ company: string; title: string }> {
  try {
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      Extract the company name and job title from the following job post.
      If not found, return "Unknown".
      
      JOB POST:
      ${jobPost}
      
      OUTPUT FORMAT:
      Return a JSON object:
      {
        "company": "Company Name",
        "title": "Job Title"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            company: { type: Type.STRING },
            title: { type: Type.STRING },
          },
          required: ["company", "title"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("Invalid Gemini API Key. Please check your Vercel environment variables.");
    }
    throw error;
  }
}
