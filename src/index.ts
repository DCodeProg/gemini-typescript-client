import dotenv from "dotenv";
import { GeminiClient } from "./models/GeminiClient";
import { isSuccessResponse } from "./types/gemini.types";

async function main() {
    // 1. Initialisez le client avec votre clé API
    dotenv.config();
    const apiKey = process.env.API_KEY;
    const model = process.env.MODEL_NAME || "gemini-2.5-flash-lite";
    const debugMode = process.env.DEBUG_MODE === "true";

    // 2. Créez une instance de GeminiClient avec le modèle "gemini-2.5-flash-lite"
    let client = new GeminiClient(apiKey!, model, debugMode);

    // 3. Testez plusieurs requêtes avec différentes configurations
    await client.ask({
        prompt: "Que veux-dire hello world ?",
        config: { temperature: 0.5, maxOutputTokens: 150 }
    }).then(response => {
        if (isSuccessResponse(response)) {
            console.log("Generated Text:", response.data);
        } else {
            console.error("Error Response:", response.error);
        }
    });

    // 4. Affichez les statistiques
    console.log("Statistics:", client.getStats());

    // 5. Gérez les erreurs
}

// TODO: Appelez la fonction main
main().catch(error => console.error("Main Error:", error));