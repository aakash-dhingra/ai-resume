import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

// In a real-world app, this would be managed more securely.
// For this applet, we assume it's available in the environment.
declare const process: any;

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private readonly ai: GoogleGenAI;
  private readonly KNOWLEDGE_BASE = `
    Name: AAKASH DHINGRA
    Role: Lead Full-Stack Engineer & Creative Technologist

    Projects:
    - "Nexus AI": A RAG-based document analyzer built with Python and Gemini. It uses vector databases to perform semantic search on large document sets, providing accurate and context-aware answers. Core logic involves text chunking, embedding generation, and similarity search.
    - "SwiftCart": A high-performance e-commerce engine using Next.js, Vercel, and Stripe. It's designed for scalability and speed, featuring server-side rendering (SSR), static site generation (SSG), and optimized image loading. The backend handles complex product variants and inventory management.
    - "Orbit Dashboard": A real-time data visualization tool for space debris tracking built with D3.js and Angular. It consumes live satellite data from an API, processes it, and renders it on an interactive 3D globe. The challenge was handling large data streams efficiently without freezing the UI.
  `;

  constructor() {
    // IMPORTANT: This relies on the `process.env.API_KEY` being available in the execution environment.
    // The Applet environment is responsible for providing this.
    const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY 
      ? process.env.API_KEY 
      : undefined;

    if (!apiKey) {
      console.error('API_KEY not found. Please ensure it is set in the environment variables.');
      // Stub the AI object to prevent crashes if key is missing
      this.ai = { models: {}, chats: {}, operations: {} } as any;
      return;
    }
    this.ai = new GoogleGenAI({ apiKey });
  }
  
  private checkForApiKey(): boolean {
      if (!this.ai.models.generateContent) {
          alert('Gemini API Key is not configured. Features will be disabled.');
          return false;
      }
      return true;
  }

  async generateVibeChatResponse(query: string): Promise<string> {
    if (!this.checkForApiKey()) return "API Key not configured.";
    try {
      const prompt = `You are a helpful and professional AI assistant for Aakash Dhingra's resume. Your personality is witty but professional. Answer the user's question based ONLY on the following knowledge base. Do not invent information. If the answer is not in the knowledge base, say you don't have that information but can talk about his listed projects.\n\nKNOWLEDGE BASE:\n${this.KNOWLEDGE_BASE}\n\nUSER QUESTION: "${query}"\n\nYOUR ANSWER:`;
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Error in generateVibeChatResponse:', error);
      return 'Sorry, I encountered an error while processing your request.';
    }
  }

  async generateHeaderImage(companyName: string): Promise<string> {
    if (!this.checkForApiKey()) return ""; // returns empty string for image src
    try {
        const prompt = `Generate a stunning, futuristic, abstract landscape in a dark, cyberpunk style, themed around the company "${companyName}". Use a dark color palette with prominent neon cyan and purple highlights. The scene should feel like it's from the year 2026. Cinematic lighting, epic scale, 8k resolution, hyper-detailed.`;
        
        const response = await this.ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return '';
    } catch (error) {
        console.error('Error generating header image:', error);
        return '';
    }
  }

  async analyzeSkillProof(imageBase64: string, mimeType: string): Promise<string> {
    if (!this.checkForApiKey()) return "API Key not configured.";
    try {
        const prompt = `You are an expert code analysis AI working for Aakash Dhingra. A user has uploaded an image of a technical problem or code snippet. Your task is to analyze it and explain how it relates to one of aakash's projects from the knowledge base provided below. Be specific. If it's a direct match in technology or logic, point it out. If it's conceptually similar, explain the connection clearly. Start your response with "Interesting! This looks like..."\n\nKNOWLEDGE BASE:\n${this.KNOWLEDGE_BASE}\n\nANALYSIS:`;

        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType
            }
        };

        const textPart = { text: prompt };

        const response: GenerateContentResponse = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
        });

        return response.text;
    } catch (error) {
        console.error('Error analyzing skill proof:', error);
        return 'Sorry, I had trouble analyzing that image. Please try another one.';
    }
  }
}