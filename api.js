/**
 * API client for managing properties via GitHub API
 * This module handles all interactions with the biens.json file
 */

class PropertyAPI {
    constructor() {
        this.owner = 'abbasberrada91';
        this.repo = 'agent-immo';
        this.branch = 'main';
        this.filePath = 'biens.json';
    }

    /**
     * Get GitHub token from localStorage
     */
    getToken() {
        return localStorage.getItem('githubToken');
    }

    /**
     * Fetch current biens.json content from GitHub
     */
    async fetchProperties() {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.filePath}?ref=${this.branch}`
            );
            
            if (!response.ok) {
                throw new Error(`Failed to fetch properties: ${response.statusText}`);
            }
            
            const data = await response.json();
            const content = atob(data.content); // Decode base64
            return {
                data: JSON.parse(content),
                sha: data.sha // Need this for updating
            };
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    }

    /**
     * Add a new property to biens.json
     * @param {Object} property - Property data
     * @param {number} retryCount - Internal retry counter (default: 0)
     * @returns {Object} Result with success status and message
     */
    async addProperty(property, retryCount = 0) {
        const token = this.getToken();
        
        if (!token) {
            return {
                success: false,
                error: 'NO_TOKEN',
                message: 'GitHub token non configuré. Cliquez sur "⚙️ Configurer Token" pour continuer.'
            };
        }

        try {
            // 1. Fetch current file
            const { data: biens, sha } = await this.fetchProperties();
            
            // 2. Check for duplicate reference
            const existingRefs = biens.properties.map(p => p.reference);
            if (existingRefs.includes(property.reference)) {
                return {
                    success: false,
                    error: 'DUPLICATE',
                    message: `Un bien avec la référence "${property.reference}" existe déjà.`
                };
            }
            
            // 3. Add metadata
            const newProperty = {
                ...property,
                dateAdded: new Date().toISOString(),
                status: 'published'
            };
            
            // 4. Add to properties array
            biens.properties.push(newProperty);
            
            // 5. Update file on GitHub
            // Properly encode UTF-8 to base64 for GitHub API
            const content = btoa(encodeURIComponent(JSON.stringify(biens, null, 2)).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
            
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.filePath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Ajout automatique du bien ${property.reference}`,
                        content: content,
                        sha: sha,
                        branch: this.branch
                    })
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Check for SHA mismatch error and retry with fresh data
                if (errorData.message && errorData.message.includes('does not match') && retryCount < 3) {
                    console.log(`SHA mismatch detected, retrying... (attempt ${retryCount + 1}/3)`);
                    // Wait a bit before retrying to avoid race conditions
                    await new Promise(resolve => setTimeout(resolve, 500 * (retryCount + 1)));
                    return this.addProperty(property, retryCount + 1);
                }
                
                throw new Error(errorData.message || response.statusText);
            }
            
            return {
                success: true,
                message: `Bien ${property.reference} ajouté avec succès !`,
                property: newProperty
            };
            
        } catch (error) {
            console.error('Error adding property:', error);
            return {
                success: false,
                error: 'API_ERROR',
                message: `Erreur lors de l'ajout : ${error.message}`
            };
        }
    }

    /**
     * Update an existing property
     * @param {string} reference - Property reference to update
     * @param {Object} updates - Fields to update
     * @param {number} retryCount - Internal retry counter (default: 0)
     * @returns {Object} Result with success status and message
     */
    async updateProperty(reference, updates, retryCount = 0) {
        const token = this.getToken();
        
        if (!token) {
            return {
                success: false,
                error: 'NO_TOKEN',
                message: 'GitHub token non configuré.'
            };
        }

        try {
            // 1. Fetch current file
            const { data: biens, sha } = await this.fetchProperties();
            
            // 2. Find property index
            const index = biens.properties.findIndex(p => p.reference === reference);
            if (index === -1) {
                return {
                    success: false,
                    error: 'NOT_FOUND',
                    message: `Bien avec référence "${reference}" non trouvé.`
                };
            }
            
            // 3. Update property
            biens.properties[index] = {
                ...biens.properties[index],
                ...updates,
                dateModified: new Date().toISOString()
            };
            
            // 4. Update file on GitHub
            // Properly encode UTF-8 to base64 for GitHub API
            const content = btoa(encodeURIComponent(JSON.stringify(biens, null, 2)).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
            
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.filePath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Modification du bien ${reference}`,
                        content: content,
                        sha: sha,
                        branch: this.branch
                    })
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Check for SHA mismatch error and retry with fresh data
                if (errorData.message && errorData.message.includes('does not match') && retryCount < 3) {
                    console.log(`SHA mismatch detected, retrying... (attempt ${retryCount + 1}/3)`);
                    // Wait a bit before retrying to avoid race conditions
                    await new Promise(resolve => setTimeout(resolve, 500 * (retryCount + 1)));
                    return this.updateProperty(reference, updates, retryCount + 1);
                }
                
                throw new Error(errorData.message || response.statusText);
            }
            
            return {
                success: true,
                message: `Bien ${reference} modifié avec succès !`,
                property: biens.properties[index]
            };
            
        } catch (error) {
            console.error('Error updating property:', error);
            return {
                success: false,
                error: 'API_ERROR',
                message: `Erreur lors de la modification : ${error.message}`
            };
        }
    }

    /**
     * Delete a property
     * @param {string} reference - Property reference to delete
     * @param {number} retryCount - Internal retry counter (default: 0)
     * @returns {Object} Result with success status and message
     */
    async deleteProperty(reference, retryCount = 0) {
        const token = this.getToken();
        
        if (!token) {
            return {
                success: false,
                error: 'NO_TOKEN',
                message: 'GitHub token non configuré.'
            };
        }

        try {
            // 1. Fetch current file
            const { data: biens, sha } = await this.fetchProperties();
            
            // 2. Filter out property
            const originalLength = biens.properties.length;
            biens.properties = biens.properties.filter(p => p.reference !== reference);
            
            if (biens.properties.length === originalLength) {
                return {
                    success: false,
                    error: 'NOT_FOUND',
                    message: `Bien avec référence "${reference}" non trouvé.`
                };
            }
            
            // 3. Update file on GitHub
            // Properly encode UTF-8 to base64 for GitHub API
            const content = btoa(encodeURIComponent(JSON.stringify(biens, null, 2)).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
            
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.filePath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Suppression du bien ${reference}`,
                        content: content,
                        sha: sha,
                        branch: this.branch
                    })
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Check for SHA mismatch error and retry with fresh data
                if (errorData.message && errorData.message.includes('does not match') && retryCount < 3) {
                    console.log(`SHA mismatch detected, retrying... (attempt ${retryCount + 1}/3)`);
                    // Wait a bit before retrying to avoid race conditions
                    await new Promise(resolve => setTimeout(resolve, 500 * (retryCount + 1)));
                    return this.deleteProperty(reference, retryCount + 1);
                }
                
                throw new Error(errorData.message || response.statusText);
            }
            
            return {
                success: true,
                message: `Bien ${reference} supprimé avec succès !`
            };
            
        } catch (error) {
            console.error('Error deleting property:', error);
            return {
                success: false,
                error: 'API_ERROR',
                message: `Erreur lors de la suppression : ${error.message}`
            };
        }
    }
}

// Create global instance
window.propertyAPI = new PropertyAPI();
