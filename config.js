/**
 * Configuration centrale de l'application Henri Martin Immobilier
 * ==================================================================
 * Ce fichier centralise toutes les configurations de l'application
 */

const AppConfig = {
    // Configuration GitHub
    github: {
        owner: 'abbasberrada91',
        repo: 'agent-immo',
        branch: 'main',
        dataFile: 'biens.json',
        
        // URLs de l'API GitHub
        apiBaseUrl: 'https://api.github.com',
        
        // Headers standard pour les requêtes API
        getHeaders: (token) => ({
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': token ? `Bearer ${token}` : undefined,
            'Content-Type': 'application/json'
        })
    },
    
    // Configuration du token
    token: {
        storageKey: 'githubToken',
        
        // Récupérer le token depuis localStorage
        get: () => {
            return localStorage.getItem(AppConfig.token.storageKey);
        },
        
        // Sauvegarder le token dans localStorage
        set: (token) => {
            if (!token) {
                throw new Error('Token cannot be empty');
            }
            localStorage.setItem(AppConfig.token.storageKey, token.trim());
        },
        
        // Supprimer le token
        remove: () => {
            localStorage.removeItem(AppConfig.token.storageKey);
        },
        
        // Vérifier si le token existe
        exists: () => {
            return !!localStorage.getItem(AppConfig.token.storageKey);
        },
        
        // Valider le format du token
        validate: (token) => {
            if (!token || typeof token !== 'string') {
                return false;
            }
            
            const trimmedToken = token.trim();
            
            // Les tokens GitHub commencent par 'ghp_' (classic) ou 'github_pat_' (fine-grained)
            return trimmedToken.startsWith('ghp_') || 
                   trimmedToken.startsWith('github_pat_');
        },
        
        // Obtenir le format attendu du token
        expectedFormat: () => {
            return 'Token should start with "ghp_" (classic) or "github_pat_" (fine-grained)';
        }
    },
    
    // Configuration de l'application
    app: {
        name: 'Henri Martin Immobilier',
        version: '1.0.0',
        
        // URLs de l'application
        urls: {
            home: 'index.html',
            addProperty: 'ajouter_appartement.html',
            admin: 'admin_properties.html',
            login: 'login.html',
            configureToken: 'configurer-token.html',
            resetPassword: 'reset-password.html'
        },
        
        // Guides et documentation
        guides: {
            tokenConfig: 'CONFIGURATION_TOKEN_GITHUB.md',
            quickToken: 'GUIDE_RAPIDE_TOKEN.md',
            addProperty: 'GUIDE_AJOUT_APPARTEMENTS.md',
            quickStart: 'DEMARRAGE_RAPIDE.md'
        }
    },
    
    // Configuration des messages
    messages: {
        errors: {
            noToken: 'GitHub token non configuré. Cliquez sur "⚙️ Configurer Token" pour continuer.',
            invalidToken: 'Le token fourni n\'est pas valide. Il doit commencer par "ghp_" ou "github_pat_".',
            apiError: (message) => `Erreur lors de l\'appel API : ${message}`,
            duplicate: (reference) => `Un bien avec la référence "${reference}" existe déjà.`,
            notFound: (reference) => `Bien avec référence "${reference}" non trouvé.`,
            missingFields: (fields) => `Champs obligatoires manquants : ${fields.join(', ')}`
        },
        success: {
            tokenConfigured: 'Token configuré avec succès !',
            propertyAdded: (reference) => `Bien ${reference} ajouté avec succès !`,
            propertyUpdated: (reference) => `Bien ${reference} modifié avec succès !`,
            propertyDeleted: (reference) => `Bien ${reference} supprimé avec succès !`
        },
        warnings: {
            tokenExpiry: 'Votre token va bientôt expirer. Pensez à en créer un nouveau.',
            unsavedChanges: 'Vous avez des modifications non sauvegardées. Continuer ?'
        }
    },
    
    // Configuration de validation
    validation: {
        propertyFields: {
            required: [
                'reference',
                'transaction',
                'propertyType',
                'title',
                'city',
                'district',
                'surface',
                'rooms',
                'price'
            ],
            optional: [
                'features',
                'image',
                'alt',
                'brochureUrl',
                'description',
                'floor',
                'totalFloors',
                'parkingSpaces',
                'balcony',
                'terrace',
                'garden',
                'elevator',
                'disabled',
                'energyClass',
                'ghgClass',
                'dateAdded',
                'dateModified',
                'status'
            ]
        },
        
        // Valider une propriété
        validateProperty: (property) => {
            const errors = [];
            
            // Vérifier les champs obligatoires
            AppConfig.validation.propertyFields.required.forEach(field => {
                if (!property[field]) {
                    errors.push(`Champ obligatoire manquant : ${field}`);
                }
            });
            
            // Validations spécifiques
            if (property.surface && (property.surface <= 0 || isNaN(property.surface))) {
                errors.push('La surface doit être un nombre positif');
            }
            
            if (property.rooms && (property.rooms <= 0 || isNaN(property.rooms))) {
                errors.push('Le nombre de pièces doit être un nombre positif');
            }
            
            if (property.price && (property.price <= 0 || isNaN(property.price))) {
                errors.push('Le prix doit être un nombre positif');
            }
            
            return {
                valid: errors.length === 0,
                errors: errors
            };
        }
    },
    
    // Utilitaires
    utils: {
        // Construire l'URL de l'API pour le fichier de données
        getFileApiUrl: () => {
            const { owner, repo, dataFile } = AppConfig.github;
            return `${AppConfig.github.apiBaseUrl}/repos/${owner}/${repo}/contents/${dataFile}`;
        },
        
        // Encoder du contenu en base64 pour l'API GitHub
        encodeBase64: (content) => {
            // Encode UTF-8 to base64 properly for GitHub API
            return btoa(encodeURIComponent(content).replace(/%([0-9A-F]{2})/g, 
                (match, p1) => String.fromCharCode(parseInt(p1, 16))));
        },
        
        // Décoder du contenu base64 de l'API GitHub
        decodeBase64: (content) => {
            return atob(content);
        },
        
        // Formater un nombre avec des espaces pour les milliers
        formatNumber: (number) => {
            return new Intl.NumberFormat('fr-FR').format(number);
        },
        
        // Formater un prix
        formatPrice: (price) => {
            return `${AppConfig.utils.formatNumber(price)} €`;
        },
        
        // Formater une date
        formatDate: (dateString) => {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        }
    }
};

// Exposer la configuration globalement
if (typeof window !== 'undefined') {
    window.AppConfig = AppConfig;
}

// Export pour les modules (si utilisé avec un bundler)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}
