// 1. Type pour la clé API (string)
export type ApiKey = string;

// 2. Type pour le nom du modèle avec inférence
// Initialisez une variable avec "gemini-2.5-flash-lite"
export const modelName = "gemini-2.5-flash-lite";

// 3. Types spéciaux
// - Un type pour un timestamp (number)
export type Timestamp = number;
// - Un type pour un flag de debug (boolean)
export type DebugFlag = boolean;
// - Un type any pour des métadonnées génériques
export type GenericMetadata = any;
// - Un type unknown pour des réponses brutes
export type RawResponse = unknown;

// TODO: Créez un enum pour les rôles de messages
// Valeurs possibles : USER, MODEL, SYSTEM
export enum MessageRole {
    USER = "USER",
    MODEL = "MODEL",
    SYSTEM = "SYSTEM"
}

// TODO: Créez un enum pour les niveaux de température
// LOW = 0.2, MEDIUM = 0.7, HIGH = 1.0
export enum TemperatureLevel {
    LOW = 0.2,
    MEDIUM = 0.7,
    HIGH = 1.0
}

// TODO: Définissez un type pour un message
// Propriétés :
// - role: utiliser l'enum MessageRole
// - content: string
// - timestamp: number
export type Message = {
    role: MessageRole;
    content: string;
    timestamp: number;
};

// TODO: Définissez un type pour l'historique des messages
// C'est un tableau de Message
export type MessageHistory = Message[];

// TODO: Définissez un type pour la configuration de génération
// Propriétés :
// - temperature: number
// - maxOutputTokens: number
// - topK: number (optionnel)
// - topP: number (optionnel)
export type GenerationConfig = {
    temperature: number;
    maxOutputTokens: number;
    topK?: number;
    topP?: number;
};

// TODO: Définissez un type pour les métadonnées de réponse
// Propriétés :
// - model: string
// - tokensUsed: number
// - finishReason: string (optionnel)
export type ResponseMetadata = {
    model: string;
    tokensUsed: number;
    finishReason?: string;
};

// TODO: Créez une interface pour les options de requête
// Propriétés :
// - prompt: string
// - config: GenerationConfig (optionnel)
// - history: MessageHistory (optionnel)
export interface RequestOptions {
    prompt: string;
    config?: GenerationConfig;
    history?: MessageHistory;
}

// TODO: Créez une interface pour une réponse réussie
// Propriétés :
// - success: true (literal type)
// - data: string
// - metadata: ResponseMetadata
export interface SuccessResponse {
    success: true;
    data: string;
    metadata: ResponseMetadata;
}

// TODO: Créez une interface pour une réponse échouée
// Propriétés :
// - success: false (literal type)
// - error: string
// - code: number
export interface ErrorResponse {
    success: false;
    error: string;
    code: number;
}

// TODO: Créez un type union pour ApiResponse
// Peut être soit SuccessResponse soit ErrorResponse
export type ApiResponse = SuccessResponse | ErrorResponse;

// TODO: Créez une interface pour les statistiques
// Propriétés :
// - totalRequests: number
// - successfulRequests: number
// - failedRequests: number
// - averageResponseTime: number
export interface Statistics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
}

// TODO: Créez une fonction de casting pour vérifier si une réponse est un succès
// Fonction : isSuccessResponse(response: ApiResponse): response is SuccessResponse
export function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
    return response.success === true;
}