import React, { useState } from 'react';
import type { PromptRequest } from '../types';
import { ProblemType, Complexity, PromptFormat } from '../types';
import { PROBLEM_TYPE_OPTIONS, COMPLEXITY_OPTIONS, PROMPT_FORMAT_OPTIONS } from '../constants';
import { Icon } from './Icon';

interface PromptGeneratorFormProps {
    onGenerate: (request: PromptRequest) => void;
    isLoading: boolean;
}

const FormInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block mb-2 text-sm font-medium text-slate-400">{label}</label>
        {children}
    </div>
);

export const PromptGeneratorForm: React.FC<PromptGeneratorFormProps> = ({ onGenerate, isLoading }) => {
    const [industry, setIndustry] = useState('');
    const [problemType, setProblemType] = useState<ProblemType>(ProblemType.APP_CREATION);
    const [complexity, setComplexity] = useState<Complexity>(Complexity.INTERMEDIATE);
    const [promptFormat, setPromptFormat] = useState<PromptFormat>(PromptFormat.INSTRUCTIONS);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!industry.trim()) {
            alert('Por favor, especifica una industria, servicio o profesión.');
            return;
        }
        onGenerate({ industry, problemType, complexity, promptFormat });
    };
    
    const isAppCreation = problemType === ProblemType.APP_CREATION;
    const baseInputClasses = "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 outline-none";

    return (
        <div className="p-6 md:p-8 bg-slate-800/50 rounded-lg border border-slate-700 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput label="Industria, Servicio o Profesión">
                    <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="Ej: Desarrollo de software, fisioterapia, cafetería de especialidad"
                        className={baseInputClasses}
                        required
                    />
                </FormInput>

                <div className={`grid grid-cols-1 ${isAppCreation ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
                    <FormInput label="Tipo de Problema">
                        <select
                            value={problemType}
                            onChange={(e) => setProblemType(e.target.value as ProblemType)}
                            className={baseInputClasses}
                        >
                            {PROBLEM_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </FormInput>

                    <FormInput label="Nivel de Complejidad">
                        <select
                            value={complexity}
                            onChange={(e) => setComplexity(e.target.value as Complexity)}
                            className={baseInputClasses}
                        >
                            {COMPLEXITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </FormInput>
                    
                    {!isAppCreation && (
                        <FormInput label="Formato del Prompt">
                            <select
                                value={promptFormat}
                                onChange={(e) => setPromptFormat(e.target.value as PromptFormat)}
                                className={baseInputClasses}
                            >
                                {PROMPT_FORMAT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </FormInput>
                    )}
                </div>
                
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-sky-600 rounded-md shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Icon name="loader" className="animate-spin w-5 h-5" />
                                Generando...
                            </>
                        ) : (
                             <>
                                <Icon name="sparkles" className="w-5 h-5" />
                                Generar Prompt
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};