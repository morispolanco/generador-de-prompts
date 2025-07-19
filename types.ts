
export enum ProblemType {
  APP_CREATION = 'Creación de Aplicación',
  PROCESS_OPTIMIZATION = 'Optimización de Procesos',
  MARKETING_STRATEGY = 'Estrategia de Marketing',
  DATA_ANALYSIS = 'Análisis de Datos',
  CONTENT_CREATION = 'Creación de Contenido',
}

export enum Complexity {
  BEGINNER = 'Principiante',
  INTERMEDIATE = 'Intermedio',
  ADVANCED = 'Avanzado',
  EXPERT = 'Experto',
}

export enum PromptFormat {
  INSTRUCTIONS = 'Instrucciones Detalladas',
  QUESTIONS = 'Serie de Preguntas',
  EXAMPLES = 'Basado en Ejemplos',
  ROLE_PLAY = 'Escenario de Rol',
}

export interface PromptRequest {
  industry: string;
  problemType: ProblemType;
  complexity: Complexity;
  promptFormat: PromptFormat;
}

export interface AppCreationPrompt {
  problema: string;
  usuariosAfectados: string;
  solucionPropuesta: string;
  funcionalidadesClave: string[];
  beneficiosEsperados: string;
  impactoPotencial: string;
}

export type GeneratedPrompt = string | AppCreationPrompt;
