
import React from 'react';
import { Icon } from './Icon';

export const Header: React.FC = () => {
    return (
        <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 py-4 border-b border-slate-700/50">
            <div className="container mx-auto px-4 flex items-center justify-center">
                 <Icon name="logo" className="w-8 h-8 text-sky-400 mr-3" />
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                    Generador de Prompts IA
                </h1>
            </div>
        </header>
    );
};
