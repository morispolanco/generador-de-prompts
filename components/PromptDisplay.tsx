
import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from './Icon';
import { Loader } from './Loader';
import type { GeneratedPrompt, AppCreationPrompt } from '../types';

interface PromptDisplayProps {
    prompt: GeneratedPrompt;
    isLoading: boolean;
    error: string | null;
}

const isAppCreationPrompt = (prompt: GeneratedPrompt): prompt is AppCreationPrompt => {
    return typeof prompt === 'object' && prompt !== null && 'problema' in prompt;
};

const formatAppCreationPromptForCopy = (prompt: AppCreationPrompt): string => {
    return `
Desarrolla una aplicación que resuelva el siguiente problema:

**Problema/Dolor:**
${prompt.problema}

**Usuarios Afectados:**
${prompt.usuariosAfectados}

**Solución Propuesta:**
${prompt.solucionPropuesta}

**Funcionalidades Clave:**
${prompt.funcionalidadesClave.map(f => `*   ${f}`).join('\n')}

**Beneficios Esperados:**
${prompt.beneficiosEsperados}

**Impacto Potencial:**
${prompt.impactoPotencial}
    `.trim();
};


export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, isLoading, error }) => {
    const [copied, setCopied] = useState(false);

    const promptToCopy = useMemo(() => {
        if (!prompt) return '';
        if (isAppCreationPrompt(prompt)) {
            return formatAppCreationPromptForCopy(prompt);
        }
        return prompt;
    }, [prompt]);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = () => {
        if (promptToCopy) {
            navigator.clipboard.writeText(promptToCopy);
            setCopied(true);
        }
    };
    
    if (isLoading) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-slate-400">
                <Loader />
                <p className="mt-4 text-lg">Generando prompt...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-red-300">
                <h3 className="font-bold mb-2">Error</h3>
                <p>{error}</p>
            </div>
        );
    }
    
    if (!prompt) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-slate-800/50 border-dashed border-2 border-slate-700 rounded-lg p-6 text-slate-500">
                <p className="text-center">El prompt generado aparecerá aquí.</p>
            </div>
        );
    }

    if (isAppCreationPrompt(prompt)) {
        const p = prompt;
        return (
             <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-t-lg border-b border-slate-700">
                    <h3 className="font-semibold text-slate-300">Propuesta de Aplicación</h3>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors duration-200 disabled:opacity-50"
                        disabled={copied}
                    >
                        <Icon name={copied ? "check" : "copy"} className="w-4 h-4" />
                        {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <h4 className="font-bold text-sky-400 mb-1">Problema/Dolor</h4>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{p.problema}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sky-400 mb-1">Usuarios Afectados</h4>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{p.usuariosAfectados}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sky-400 mb-1">Solución Propuesta</h4>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{p.solucionPropuesta}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sky-400 mb-1">Funcionalidades Clave</h4>
                        <ul className="list-disc list-inside text-slate-300 space-y-1 pl-2">
                            {p.funcionalidadesClave.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sky-400 mb-1">Beneficios Esperados</h4>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{p.beneficiosEsperados}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sky-400 mb-1">Impacto Potencial</h4>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{p.impactoPotencial}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-t-lg border-b border-slate-700">
                <h3 className="font-semibold text-slate-300">Prompt Generado</h3>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors duration-200 disabled:opacity-50"
                    disabled={copied}
                >
                    <Icon name={copied ? "check" : "copy"} className="w-4 h-4" />
                    {copied ? 'Copiado!' : 'Copiar'}
                </button>
            </div>
            <div className="p-6">
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{prompt}</p>
            </div>
        </div>
    );
};
