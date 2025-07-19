
import { GoogleGenAI, Type } from "@google/genai";
import type { PromptRequest, AppCreationPrompt, GeneratedPrompt } from '../types';
import { ProblemType } from "../types";

// Assumes process.env.API_KEY is set in the environment where this code runs.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildOtherPrompt = (request: PromptRequest): string => {
    return `
      Eres un experto en ingeniería de prompts. Tu tarea es generar un único prompt creativo, preciso y profesional para un modelo de IA generativa. El propósito de este prompt es ayudar a un usuario a concebir y diseñar una aplicación o a resolver un problema específico dentro de su campo.

      **Contexto y Requisitos:**
      1.  **Industria/Profesión/Servicio:** ${request.industry}
      2.  **Tipo de Problema a Resolver:** ${request.problemType}
      3.  **Nivel de Complejidad Deseado:** ${request.complexity}. El prompt debe reflejar este nivel; un nivel 'Experto' debe requerir un conocimiento profundo del dominio, mientras que 'Principiante' debe ser más accesible.
      4.  **Formato del Prompt Solicitado:** ${request.promptFormat}.
          - Si es 'Instrucciones Detalladas', el prompt debe ser una lista de pasos o requisitos claros.
          - Si es 'Serie de Preguntas', el prompt debe guiar al usuario a través de una reflexión estructurada.
          - Si es 'Basado en Ejemplos', el prompt debe presentar un caso concreto y pedir una solución o expansión.
          - Si es 'Escenario de Rol', el prompt debe establecer un personaje y una situación para que el usuario actúe.

      **Tu Tarea:**
      Genera UN (1) prompt de alta calidad que cumpla con todos los criterios anteriores. El prompt debe ser original, inspirador y estar perfectamente adaptado al contexto profesional indicado.

      **IMPORTANTE:** NO incluyas introducciones, saludos, explicaciones o cualquier texto conversacional. Tu respuesta debe ser ÚNICAMENTE el prompt generado, listo para ser copiado y utilizado.
    `;
};

export const generateCreativePrompt = async (request: PromptRequest): Promise<GeneratedPrompt> => {
  try {
    if (request.problemType === ProblemType.APP_CREATION) {
      const appCreationSchema = {
        type: Type.OBJECT,
        properties: {
          problema: { type: Type.STRING, description: 'El problema, desafío o ineficiencia que enfrenta el sector.' },
          usuariosAfectados: { type: Type.STRING, description: 'Los principales usuarios, roles o perfiles que sufren este problema.' },
          solucionPropuesta: { type: Type.STRING, description: 'Cómo la aplicación solucionará el problema. El concepto central de la app.' },
          funcionalidadesClave: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Una lista de 3 a 5 funcionalidades esenciales de la aplicación.'
          },
          beneficiosEsperados: { type: Type.STRING, description: 'Beneficios concretos para usuarios y negocio (ahorro de tiempo, reducción de costos, etc.).' },
          impactoPotencial: { type: Type.STRING, description: 'El impacto más amplio que la aplicación podría tener en la industria.' },
        },
        required: ['problema', 'usuariosAfectados', 'solucionPropuesta', 'funcionalidadesClave', 'beneficiosEsperados', 'impactoPotencial']
      };

      const metaPrompt = `
        Como experto estratega de productos en la industria de **${request.industry}**, tu tarea es conceptualizar una nueva aplicación.
        Identifica un problema o necesidad significativa dentro de esta industria y diseña una solución de aplicación a un nivel de complejidad **${request.complexity}**.
        Proporciona los detalles de tu concepto de aplicación en formato JSON estructurado.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: metaPrompt,
        config: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
          responseMimeType: "application/json",
          responseSchema: appCreationSchema,
        }
      });
      
      const text = response.text;
      if (!text || text.trim().length === 0) {
        throw new Error("La API no devolvió contenido. Inténtalo de nuevo con otros parámetros.");
      }
      return JSON.parse(text) as AppCreationPrompt;

    } else {
      const metaPrompt = buildOtherPrompt(request);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: metaPrompt,
        config: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
        }
      });
      const text = response.text;
      if (!text || text.trim().length === 0) {
          throw new Error("La API no devolvió contenido. Inténtalo de nuevo con otros parámetros.");
      }
      return text.trim();
    }
  } catch (error) {
    console.error("Error al generar el prompt:", error);
    if (error instanceof Error) {
        if (error.name === 'SyntaxError') {
            return `Error: La respuesta de la API no es un JSON válido.`;
        }
        return `Error: ${error.message}`;
    }
    return "Ocurrió un error inesperado al contactar la API.";
  }
};
