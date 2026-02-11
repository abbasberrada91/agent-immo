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
        
        // Retry configuration for handling concurrent updates
        this.MAX_RETRIES = 3;
        this.RETRY_DELAY_MS = 500;
        this.SHA_MISMATCH_ERROR = 'does not match';
        
        // Timeout configuration for large file downloads
        this.LARGE_FILE_TIMEOUT_MS = 60000; // 60 seconds
    }

    /**
     * Get GitHub token from localStorage
     */
    getToken() {
        return localStorage.getItem('githubToken');
    }

    /**
     * Check if error is a SHA mismatch error and should be retried
     * @param {Object} errorData - Error response from GitHub API
     * @param {number} retryCount - Current retry count
     * @returns {boolean} True if should retry
     */
    shouldRetryOperation(errorData, retryCount) {
        return errorData && 
               errorData.message && 
               errorData.message.includes(this.SHA_MISMATCH_ERROR) && 
               retryCount < this.MAX_RETRIES;
    }

    /**
     * Wait before retrying with exponential backoff
     * @param {number} retryCount - Current retry count (0-based)
     */
    async waitBeforeRetry(retryCount) {
        const delay = this.RETRY_DELAY_MS * (retryCount + 1);
        const retryNumber = retryCount + 1;
        console.warn(`SHA mismatch detected, retrying in ${delay}ms... (retry ${retryNumber}/${this.MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Parse and validate JSON content
     * @param {string} content - JSON string to parse
     * @returns {Object} Parsed JSON object
     * @throws {Error} If content is empty or JSON is invalid
     */
    parseAndValidateJSON(content) {
        if (!content || content.trim().length === 0) {
            throw new Error('Empty content received');
        }
        
        // Log first few characters to help debug (limit to 50 chars for performance)
        console.log('Content starts with:', content.substring(0, 50));
        console.log('Content length:', content.length, 'characters');
        
        try {
            return JSON.parse(content);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Content length:', content.length);
            // Log a small snippet for debugging (not included in user-facing error)
            const snippet = content.substring(0, 50);
            console.error('Content snippet:', snippet);
            throw new Error(`Invalid JSON in biens.json: ${parseError.message}`);
        }
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
            
            // Validate that we got required fields
            if (!data.sha) {
                throw new Error('Invalid response from GitHub API: missing SHA field');
            }
            
            // If file is too large (> 1MB), GitHub API doesn't include content field
            // In this case, fetch from raw URL instead
            // Note: GitHub API still returns the SHA field even for large files
            // Reference: https://docs.github.com/en/rest/repos/contents
            if (!('content' in data) || data.content === null) {
                console.log('File too large for Contents API, fetching from raw URL...');
                console.log('File size:', data.size, 'bytes');
                
                let rawResponse;
                try {
                    // Add a longer timeout for large files
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), this.LARGE_FILE_TIMEOUT_MS);
                    
                    // Add cache-busting parameter to ensure fresh content
                    const cacheBuster = `?t=${Date.now()}`;
                    
                    rawResponse = await fetch(
                        `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${this.filePath}${cacheBuster}`,
                        { 
                            signal: controller.signal,
                            cache: 'no-store' // Disable browser cache
                        }
                    );
                    
                    clearTimeout(timeoutId);
                } catch (fetchError) {
                    console.error('Network error fetching from raw URL:', fetchError);
                    if (fetchError.name === 'AbortError') {
                        const timeoutSeconds = this.LARGE_FILE_TIMEOUT_MS / 1000;
                        throw new Error(`Request timed out after ${timeoutSeconds} seconds. The file may be too large. Please try refreshing the page or contact support if the issue persists.`);
                    }
                    throw new Error(`Network error: ${fetchError.message}. Please check your internet connection.`);
                }
                
                if (!rawResponse.ok) {
                    console.error('Raw URL fetch failed with status:', rawResponse.status, rawResponse.statusText);
                    throw new Error(`Failed to fetch properties from raw URL: ${rawResponse.status} ${rawResponse.statusText}`);
                }
                
                // Check content-type
                const contentType = rawResponse.headers.get('content-type');
                console.log('Raw response content-type:', contentType);
                console.log('Raw response status:', rawResponse.status);
                
                // Check if we got HTML instead of JSON (error page)
                if (contentType && contentType.includes('text/html')) {
                    console.error('Received HTML instead of JSON');
                    const htmlContent = await rawResponse.text();
                    console.error('HTML content preview:', htmlContent.substring(0, 200));
                    throw new Error('Received HTML error page instead of JSON. The file may not be accessible.');
                }
                
                // For large JSON files, use .json() which is more efficient
                let parsedData;
                try {
                    console.log('Attempting to parse JSON directly from response...');
                    
                    // Clone the response first to allow fallback to text parsing if needed
                    // The original response will be consumed by .json(), the clone allows us to retry with .text()
                    const responseClone = rawResponse.clone();
                    
                    try {
                        parsedData = await rawResponse.json();
                        console.log('Successfully parsed JSON directly');
                    } catch (jsonError) {
                        // If direct JSON parsing fails, try reading as text first
                        console.warn('Direct JSON parsing failed, trying text approach:', jsonError.message);
                        const textContent = await responseClone.text();
                        console.log('Text content length:', textContent.length);
                        
                        if (!textContent || textContent.trim().length === 0) {
                            throw new Error('Response body is empty');
                        }
                        
                        // Check if it looks like JSON (log small preview for debugging)
                        const preview = textContent.substring(0, 50);
                        if (!textContent.trim().startsWith('{') && !textContent.trim().startsWith('[')) {
                            console.error('Content does not look like JSON. Preview:', preview);
                            throw new Error('Response is not valid JSON format');
                        }
                        
                        // Try parsing the text as JSON
                        parsedData = this.parseAndValidateJSON(textContent);
                    }
                } catch (jsonError) {
                    console.error('JSON parsing failed:', jsonError);
                    console.error('Error name:', jsonError.name);
                    console.error('Error message:', jsonError.message);
                    
                    // Provide more specific error message
                    if (jsonError.message.includes('Unexpected end')) {
                        throw new Error('JSON parsing failed: The response was incomplete or empty. This may happen if the file is too large or the connection was interrupted. Please try refreshing the page.');
                    } else {
                        throw new Error(`Failed to parse JSON from raw URL: ${jsonError.message}`);
                    }
                }
                
                // Validate the structure of the parsed data
                if (!parsedData || typeof parsedData !== 'object') {
                    throw new Error('Parsed data is not an object');
                }
                
                if (!parsedData.properties || !Array.isArray(parsedData.properties)) {
                    throw new Error('Invalid data structure: missing or invalid properties array');
                }
                
                console.log('Successfully loaded', parsedData.properties.length, 'properties');
                
                return {
                    data: parsedData,
                    sha: data.sha // SHA is guaranteed to be present (validated at line 84)
                };
            }
            
            // For files under 1MB, content is base64-encoded in the response
            console.log('File under 1MB, decoding base64 content...');
            const content = atob(data.content); // Decode base64
            console.log('Decoded content length:', content.length);
            
            const parsedData = this.parseAndValidateJSON(content);
            
            // Validate the structure of the parsed data
            if (!parsedData || typeof parsedData !== 'object') {
                throw new Error('Parsed data is not an object');
            }
            
            if (!parsedData.properties || !Array.isArray(parsedData.properties)) {
                throw new Error('Invalid data structure: missing or invalid properties array');
            }
            
            console.log('Successfully loaded', parsedData.properties.length, 'properties');
            
            return {
                data: parsedData,
                sha: data.sha
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
                if (this.shouldRetryOperation(errorData, retryCount)) {
                    await this.waitBeforeRetry(retryCount);
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
                if (this.shouldRetryOperation(errorData, retryCount)) {
                    await this.waitBeforeRetry(retryCount);
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
                if (this.shouldRetryOperation(errorData, retryCount)) {
                    await this.waitBeforeRetry(retryCount);
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
