import { GoogleGenAI } from "@google/genai";
import type { PromptRequest } from '../types';
import { ProblemType } from "../types";

// Assumes process.env.API_KEY is set in the environment where this code runs.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildMetaPrompt = (request: PromptRequest): string => {
  if (request.problemType === ProblemType.APP_CREATION) {
    return `
Eres un experto estratega de productos y un ingeniero de prompts con profundo conocimiento de la industria: **${request.industry}**.

**Tu Tarea:**
Tu objetivo es generar un prompt de alta calidad, detallado y estructurado. Este prompt será utilizado para instruir a una IA en el diseño de una aplicación. El prompt que generes debe estar perfectamente adaptado a la industria especificada y al nivel de complejidad solicitado.

**Contexto:**
- **Industria Base:** ${request.industry}
- **Nivel de Complejidad de la Solución:** ${request.complexity}. La profundidad del problema y la sofisticación de las funcionalidades propuestas deben reflejar este nivel.

**Instrucciones para tu Respuesta:**
1.  Identifica un problema o necesidad concreta y significativa dentro de la industria especificada.
2.  Rellena la plantilla que se proporciona a continuación con información detallada, coherente y profesional.
3.  Tu respuesta final debe ser **ÚNICAMENTE** el texto del prompt generado a partir de la plantilla. No incluyas introducciones, saludos, explicaciones o cualquier texto fuera de la plantilla.
4.  El prompt generado DEBE comenzar exactamente con "Desarrolla una aplicación que...".

---

**PLANTILLA DEL PROMPT A GENERAR**

Desarrolla una aplicación que resuelva un problema concreto o una necesidad significativa que hayas identificado en la industria de **${request.industry}**.

**Problema/Dolor:**
[Describe aquí claramente cuál es el problema, desafío o ineficiencia que enfrenta este sector. Sé específico.]

**Usuarios Afectados:**
[Identifica aquí quiénes son los principales usuarios, roles o perfiles que sufren este problema.]

**Solución Propuesta:**
[Explica aquí cómo la aplicación solucionará o aliviará esta dificultad. Describe el concepto central de la app.]

**Funcionalidades Clave:**
*   [Funcionalidad esencial 1]
*   [Funcionalidad esencial 2]
*   [Funcionalidad esencial 3]

**Beneficios Esperados:**
[Detalla aquí los beneficios concretos que obtendrán los usuarios y/o el negocio (ej: ahorro de tiempo, reducción de costos, aumento de ingresos, mejora de la experiencia).]

**Impacto Potencial:**
[Describe aquí brevemente el impacto más amplio que la aplicación podría tener en la industria o en la forma en que se trabaja en ella.]
`;
  }

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


export const generateCreativePrompt = async (request: PromptRequest): Promise<string> => {
  try {
    const metaPrompt = buildMetaPrompt(request);

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
  } catch (error) {
    console.error("Error al generar el prompt:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "Ocurrió un error inesperado al contactar la API.";
  }
};