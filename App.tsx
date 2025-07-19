
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptGeneratorForm } from './components/PromptGeneratorForm';
import { PromptDisplay } from './components/PromptDisplay';
import { generateCreativePrompt } from './services/geminiService';
import type { PromptRequest, GeneratedPrompt } from './types';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt>('');

    const handleGeneratePrompt = useCallback(async (request: PromptRequest) => {
        setIsLoading(true);
        setError(null);
        setGeneratedPrompt('');

        try {
            const prompt = await generateCreativePrompt(request);
            if (typeof prompt === 'string' && prompt.startsWith('Error:')) {
                setError(prompt);
            } else {
                setGeneratedPrompt(prompt);
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
            setError(`Error al generar el prompt: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-300">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <p className="text-center text-lg text-slate-400 mb-8">
                        Define tu campo y personaliza los detalles para generar un prompt de IA a la medida.
                    </p>
                    <PromptGeneratorForm onGenerate={handleGeneratePrompt} isLoading={isLoading} />
                    <div className="mt-8">
                        <PromptDisplay
                            prompt={generatedPrompt}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </div>
            </main>
             <footer className="text-center py-4 mt-8">
                <p className="text-sm text-slate-500">Desarrollado con React, Tailwind CSS y Gemini API.</p>
            </footer>
        </div>
    );
};

export default App;
