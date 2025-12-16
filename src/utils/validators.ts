// TODO: Importez les types nécessaires depuis gemini.types.ts

import { ErrorResponse, GenerationConfig, Message, MessageRole, Statistics } from "../types/gemini.types";

// TODO: Créez une fonction qui valide une clé API
// Nom : validateApiKey
// Paramètres : apiKey: string
// Retour : boolean
// La clé doit commencer par "AI" et faire au moins 20 caractères
export function validateApiKey(apiKey: string): boolean {
    const apiKeyPattern = /^AI.{18,}$/;
    if (apiKeyPattern.test(apiKey)) {
        return true;
    }
    return false;
}

// TODO: Créez une fonction qui formate un prompt
// Nom : formatPrompt
// Paramètres : prompt: string, maxLength?: number (défaut 1000)
// Retour : string
// Coupe le prompt si trop long et ajoute "..."
export function formatPrompt(prompt: string, maxLength: number = 1000): string {
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
export function createDefaultConfig(temperature: number = 0.7, maxTokens: number = 2048): GenerationConfig {
    return {
        temperature,
        maxOutputTokens: maxTokens
    };
}

// TODO: Créez une fonction fléchée qui calcule le temps écoulé
// Nom : calculateElapsedTime
// Paramètres : startTime: number
// Retour : number (en millisecondes)
export const calculateElapsedTime = (startTime: number): number => Date.now() - startTime;


// TODO: Créez une fonction avec rest parameters
// Nom : logMessages
// Paramètres : prefix: string, ...messages: string[]
// Retour : void
// Affiche chaque message avec le préfixe
export function logMessages(prefix: string, ...messages: string[]): void {
    messages.forEach(message => console.log(`${prefix}: ${message}`))
};


// TODO: Créez un type guard pour vérifier si une valeur est un Message
// Nom : isMessage
// Paramètre : value: unknown
// Retour : value is Message
// Vérifie la présence de role, content et timestamp
export function isMessage(value: unknown): value is Message {
    if (typeof value === 'object' && value !== null) {
        const msg = value as Message;
        return 'role' in msg && 'content' in msg && 'timestamp' in msg;
    }
    return false;
}

// TODO: Créez un type guard pour vérifier si c'est une ErrorResponse
// Nom : isErrorResponse
// Paramètre : response: ApiResponse
// Retour : response is ErrorResponse
// Vérifie success === false
export function isErrorResponse(response: any): response is ErrorResponse {
    return response && response.success === false;
}

// TODO: Créez un type guard pour vérifier un tableau de messages
// Nom : isMessageArray
// Paramètre : value: unknown
// Retour : value is Message[]
// Vérifie que c'est un tableau et que chaque élément est un Message
export function isMessageArray(value: unknown): value is Message[] {
    if (Array.isArray(value)) {
        return value.every(item => isMessage(item));
    }
    return false;
}

// TODO: Créez un type guard pour différencier les types de MessageRole
// Nom : isUserMessage
// Paramètre : message: Message
// Retour : boolean
// Vérifie si role === MessageRole.USER
export function isUserMessage(message: Message): boolean {
    return message.role === MessageRole.USER;
}

// TODO: Créez une fonction générique qui récupère une propriété d'un objet
// Nom : getProperty
// Type générique : T, K extends keyof T
// Paramètres : obj: T, key: K
// Retour : T[K]
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// TODO: Créez une fonction qui vérifie si une clé existe dans Statistics
// Nom : isStatKey
// Paramètre : key: string
// Retour : key is keyof Statistics
export function isStatKey(key: string): key is keyof Statistics {
    const statKeys: Array<keyof Statistics> = ['totalRequests', 'successfulRequests', 'failedRequests', 'averageResponseTime'];
    return statKeys.includes(key as keyof Statistics);
}

// TODO: Créez un type pour les clés d'un GenerationConfig
// Nom : ConfigKeys
// Utilise keyof
export type ConfigKeys = keyof GenerationConfig;

// TODO: Créez une fonction qui met à jour une propriété des statistiques
// Nom : updateStat
// Type générique : K extends keyof Statistics
// Paramètres : stats: Statistics, key: K, value: Statistics[K]
// Retour : Statistics
// Retourne un nouvel objet avec la propriété mise à jour
export function updateStat<K extends keyof Statistics>(stats: Statistics, key: K, value: Statistics[K]): Statistics {
    return {
        ...stats,
        [key]: value
    };
}

// TODO: Créez un type qui rend toutes les clés string de Message optionnelles
// Nom : PartialStringFields
// Utilise keyof et types conditionnels
export type PartialStringFields = {
    [K in keyof Message as Message[K] extends string ? K : never]?: Message[K];
};