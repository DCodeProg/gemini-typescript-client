// TODO: Importez les types et utilitaires nécessaires

import {
    ApiResponse,
    RequestOptions,
    Statistics,
    SuccessResponse,
    ErrorResponse,
    isSuccessResponse,
    ResponseMetadata,
    modelName as DEFAULT_MODEL
} from "../types/gemini.types";
import {
    calculateElapsedTime,
    createDefaultConfig,
    formatPrompt,
    logMessages,
    validateApiKey,
    isErrorResponse,
    updateStat
} from "../utils/validators";

// TODO: Créez une classe GeminiClient
// Propriétés privées :
// - apiKey: string
// - modelName: string
// - baseUrl: string (readonly)
// - stats: Statistics

// Propriété publique :
// - debug: boolean

// Constructeur :
// - Paramètres : apiKey: string, modelName?: string, debug?: boolean
// - Initialise toutes les propriétés
// - baseUrl = "https://generativelanguage.googleapis.com/v1beta"
// - Initialise stats à 0
// L'url finale doit être https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=APIKEY

// Méthodes à implémenter :

// 1. Méthode privée buildUrl
// Paramètres : endpoint: string
// Retour : string
// Construit l'URL complète avec la clé API

// 2. Méthode publique async ask
// Paramètres : options: RequestOptions
// Retour : Promise<ApiResponse>
// Envoie une requête à l'API Gemini
// Gère les erreurs et met à jour les statistiques
// La requête doit être un POST sur l'URL avec comme body :
/* 	{
       contents: [
          {
            parts: [{ text: "" }],
          },
        ],
       generationConfig: options.config || {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
    };
*/

// 3. Méthode publique getStats
// Retour : Statistics
// Retourne une copie des statistiques

// 4. Méthode publique resetStats
// Retour : void
// Remet les statistiques à zéro

// 5. Getter modelInfo
// Retour : string
// Retourne "Model: {modelName}"

// Votre code ici

export class GeminiClient {
    private apiKey: string;
    private modelName: string
    private readonly baseUrl: string = process.env.BASE_URL!;
    private stats: Statistics;

    public debug: boolean;

    constructor(apiKey: string, modelName?: string, debug: boolean = false) {
        if (!validateApiKey(apiKey)) {
            throw new Error("Invalid API key: must start with 'AI' and be at least 20 characters long");
        }
        this.apiKey = apiKey;
        this.modelName = modelName || DEFAULT_MODEL;
        this.debug = debug;
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
        };
    }

    private buildUrl(endpoint: string): string {
        return `${this.baseUrl}/${endpoint}?key=${this.apiKey}`;
    }

    public async ask(options: RequestOptions): Promise<ApiResponse> {
        const startTime = Date.now();
        this.stats = updateStat(this.stats, 'totalRequests', this.stats.totalRequests + 1);

        try {
            const url = this.buildUrl(`models/${this.modelName}:generateContent`);
            const formattedPrompt = formatPrompt(options.prompt);
            const generationConfig = options.config || createDefaultConfig();

            const body = {
                contents: [
                    {
                        parts: [{ text: formattedPrompt }],
                    },
                ],
                generationConfig,
            };

            if (this.debug) {
                logMessages("[GeminiClient] Request URL", url);
                logMessages("[GeminiClient] Payload", JSON.stringify(body, null, 2));
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const elapsed = calculateElapsedTime(startTime);
            this.updateAverageResponseTime(elapsed);

            if (!response.ok) {
                this.stats = updateStat(this.stats, 'failedRequests', this.stats.failedRequests + 1);
                const errorText = await response.text();
                if (this.debug) {
                    logMessages("[GeminiClient] HTTP Error", `${response.status}`, errorText);
                }
                const errorResponse: ErrorResponse = {
                    success: false,
                    error: errorText || "Request failed",
                    code: response.status,
                };
                return errorResponse;
            }

            const data = await response.json();

            if (this.debug) {
                logMessages("[GeminiClient] Response data", JSON.stringify(data, null, 2));
            }

            // Extract text from first candidate
            const responseText = this.extractTextFromResponse(data);
            const metadata = this.extractMetadataFromResponse(data);

            this.stats = updateStat(this.stats, 'successfulRequests', this.stats.successfulRequests + 1);

            const successResponse: SuccessResponse = {
                success: true,
                data: responseText,
                metadata,
            };
            return successResponse;
        } catch (error: any) {
            const elapsed = calculateElapsedTime(startTime);
            this.updateAverageResponseTime(elapsed);
            this.stats = updateStat(this.stats, 'failedRequests', this.stats.failedRequests + 1);

            if (this.debug) {
                logMessages("[GeminiClient] Error", error?.message || "Unknown error");
            }

            const errorResponse: ErrorResponse = {
                success: false,
                error: error?.message || "Unknown error",
                code: -1,
            };
            return errorResponse;
        }
    }

    private updateAverageResponseTime(elapsed: number): void {
        const count = this.stats.totalRequests;
        const previous = count - 1;
        this.stats.averageResponseTime =
            previous <= 0
                ? elapsed
                : (this.stats.averageResponseTime * previous + elapsed) / count;
    }

    private extractTextFromResponse(data: any): string {
        try {
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && typeof text === 'string') {
                return text;
            }
            return JSON.stringify(data);
        } catch (error) {
            if (this.debug) {
                logMessages("[GeminiClient] Failed to extract text", (error as Error)?.message || "Unknown error");
            }
            return JSON.stringify(data);
        }
    }

    private extractMetadataFromResponse(data: any): ResponseMetadata {
        try {
            const finishReason = data.candidates?.[0]?.finishReason ?? "UNKNOWN";
            const tokensUsed = data.usageMetadata?.totalTokenCount ?? 0;

            return {
                model: this.modelName,
                tokensUsed: typeof tokensUsed === 'number' ? tokensUsed : 0,
                finishReason: typeof finishReason === 'string' ? finishReason : "UNKNOWN",
            };
        } catch (error) {
            if (this.debug) {
                logMessages("[GeminiClient] Failed to extract metadata", (error as Error)?.message || "Unknown error");
            }
            return {
                model: this.modelName,
                tokensUsed: 0,
                finishReason: "UNKNOWN",
            };
        }
    }

    public getStats(): Statistics {
        return { ...this.stats };
    }

    public resetStats(): void {
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
        };
    }

    public get modelInfo(): string {
        return `Model: ${this.modelName}`;
    }
}