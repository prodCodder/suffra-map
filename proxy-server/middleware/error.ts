import { TCustomHttpError } from "../types";

// Function pour générer des messages d'erreur plus clairs
const createError = (status: number, message: string, details = null) => {
    // Créer une nouvelle instance d'erreur vide
    const error: TCustomHttpError = new Error(message);

    // Défini le code d'état de l'erreur 
    // en fonction des paramètres de la fonction
    error.status = status;
    error.details = details;
    return error
}

export default createError;