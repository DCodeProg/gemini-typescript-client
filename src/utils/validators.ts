// TODO: Importez les types nécessaires depuis gemini.types.ts

import { GenerationConfig } from "../types/gemini.types";

// TODO: Créez une fonction qui valide une clé API
// Nom : validateApiKey
// Paramètres : apiKey: string
// Retour : boolean
// La clé doit commencer par "AI" et faire au moins 20 caractères
function validateApiKey(apiKey: string): boolean {
    if (apiKey.startsWith("AI")) {
        return apiKey.length >= 20;
    }
    return false;
}

// TODO: Créez une fonction qui formate un prompt
// Nom : formatPrompt
// Paramètres : prompt: string, maxLength?: number (défaut 1000)
// Retour : string
// Coupe le prompt si trop long et ajoute "..."
function formatPrompt(prompt: string, maxLength: number = 1000): string {
    if (prompt.length > maxLength) {
        return prompt.slice(0, maxLength) + "...";
    }
    return prompt;
}

// TODO: Créez une fonction avec paramètres par défaut
// Nom : createDefaultConfig
// Paramètres : temperature?: number, maxTokens?: number
// Retour : GenerationConfig
// Valeurs par défaut : temperature = 0.7, maxTokens = 2048
function createDefaultConfig(temperature: number = 0.7, maxTokens: number = 2048): GenerationConfig {
    return {
        temperature,
        maxOutputTokens: maxTokens
    };
}

// TODO: Créez une fonction fléchée qui calcule le temps écoulé
// Nom : calculateElapsedTime
// Paramètres : startTime: number
// Retour : number (en millisecondes)
const calculateElapsedTime = (startTime: number): number => Date.now() - startTime;


// TODO: Créez une fonction avec rest parameters
// Nom : logMessages
// Paramètres : prefix: string, ...messages: string[]
// Retour : void
// Affiche chaque message avec le préfixe
function logMessages(prefix: string, ...messages: string[]): void {
    messages.forEach(message => console.log(`${prefix}: ${message}`))
};