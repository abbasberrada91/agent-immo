const state = {
  properties: [],
  activeTransaction: 'all',
  zone: '',
  type: '',
  budget: null,
};

const filterButtons = document.querySelectorAll('.filter-btn');
const listingGrid = document.querySelector('#listing-grid');
const listingSummary = document.querySelector('#listing-summary');
const statsCount = document.querySelector('#stats-count');
const form = document.querySelector('.search-bar');
const searchZone = document.querySelector('#search-zone');
const searchType = document.querySelector('#search-type');
const searchBudget = document.querySelector('#search-budget');
const cardTemplate = document.querySelector('#property-card-template');

const formatPrice = (property) =>
  property.transaction === 'location'
    ? `${property.price.toLocaleString('fr-FR')} € / mois`
    : `${property.price.toLocaleString('fr-FR')} €`;

const parseBudget = (value) => {
  const cleaned = value.replace(/[\s€/.]/g, '').replace(',', '.');
  if (!cleaned) return null;
  const budget = Number(cleaned);
  return Number.isFinite(budget) ? budget : null;
};

const matchesFilters = (property) => {
  const transactionMatch =
    state.activeTransaction === 'all' || property.transaction === state.activeTransaction;

  const zoneMatch =
    !state.zone ||
    property.city.toLowerCase().includes(state.zone) ||
    property.district.toLowerCase().includes(state.zone);

  const typeMatch = !state.type || property.propertyType === state.type;

  const budgetMatch = state.budget === null || property.price <= state.budget;

  return transactionMatch && zoneMatch && typeMatch && budgetMatch;
};

const renderProperties = () => {
  const visibleProperties = state.properties.filter(matchesFilters);
  listingGrid.innerHTML = '';

  visibleProperties.forEach((property) => {
    const fragment = cardTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.property-card');
    const image = fragment.querySelector('img');
    const badge = fragment.querySelector('.badge');
    const ref = fragment.querySelector('.ref');
    const title = fragment.querySelector('h3');
    const details = fragment.querySelector('.details');
    const price = fragment.querySelector('strong');
    const link = fragment.querySelector('a');

    card.dataset.type = property.transaction;
    image.src = property.image;
    image.alt = property.alt;

    badge.textContent = property.transaction === 'vente' ? 'Vente' : 'Location';
    badge.classList.add(property.transaction === 'vente' ? 'sale' : 'rent');
    // Bien déjà loué/vendu par l'agence : affiché comme référence, marqué indisponible.
    if (property.status === 'loue') {
      badge.textContent = 'Loué';
      badge.classList.add('loue');
      card.classList.add('is-loue');
    }

    ref.textContent = `Réf. ${property.reference}`;
    title.textContent = `${property.title} — ${property.city} ${property.district}`;
    details.textContent = `${property.surface} m² • ${property.rooms} pièces • ${property.features.join(' • ')}`;
    price.textContent = formatPrice(property);
    
    // Handle brochureUrl - hide the link if it's null or empty
    if (property.brochureUrl && property.brochureUrl !== 'null') {
      link.href = property.brochureUrl;
    } else {
      link.style.display = 'none';
    }

    // Make card clickable to open detail page
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking on the brochure link
      if (e.target.tagName === 'A') {
        return;
      }
      window.location.href = `detail.html?ref=${encodeURIComponent(property.reference)}`;
    });

    listingGrid.appendChild(fragment);
  });

  statsCount.textContent = String(state.properties.length);
  listingSummary.textContent = `${visibleProperties.length} bien(s) affiché(s) sur ${state.properties.length}.`;
};

const setActiveFilter = (button) => {
  filterButtons.forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
  state.activeTransaction = button.dataset.filter;
  renderProperties();
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setActiveFilter(button));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  state.zone = searchZone.value.trim().toLowerCase();
  state.type = searchType.value;
  state.budget = parseBudget(searchBudget.value);
  renderProperties();
});

// Helper function to detect network errors
const isNetworkError = (error) => {
  // Network errors are typically TypeError with specific messages
  // Note: Checks are intentionally broad to catch various network error scenarios
  // from the Fetch API (e.g., "Failed to fetch", "NetworkError", "Network request failed")
  if (!(error instanceof TypeError)) {
    return false;
  }
  const message = error.message.toLowerCase();
  return message.includes('fetch') || message.includes('network');
};

// Helper function to apply error styling to an element
const applyErrorStyling = (element) => {
  element.style.whiteSpace = 'pre-line';
  element.style.color = '#e53e3e';
  element.style.padding = '1rem';
  element.style.background = '#fff5f5';
  element.style.border = '1px solid #fc8181';
  element.style.borderRadius = '8px';
};

const loadProperties = async (retryCount = 0) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 1000;
  
  try {
    const response = await fetch('biens.json', {
      cache: 'no-cache', // Ensure we get fresh data for real-time property listings
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      // Provide specific error messages based on status code
      let errorMessage = `Erreur HTTP ${response.status}: `;
      switch (response.status) {
        case 404:
          errorMessage += 'Le fichier biens.json est introuvable. Vérifiez que le fichier existe dans le dépôt.';
          break;
        case 403:
          errorMessage += 'Accès refusé. Vérifiez les permissions du fichier biens.json.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage += 'Le serveur rencontre des difficultés. Réessayez dans quelques instants.';
          break;
        default:
          errorMessage += `Impossible de charger les biens (${response.statusText})`;
      }
      throw new Error(errorMessage);
    }

    // Validate content type
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      throw new Error(`Type de contenu invalide: ${contentType}. Le fichier biens.json doit être au format JSON.`);
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error(`Format JSON invalide dans biens.json: ${jsonError.message}. Vérifiez la syntaxe du fichier.`);
    }

    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Le fichier biens.json ne contient pas un objet JSON valide.');
    }

    if (!data.properties) {
      throw new Error('Le fichier biens.json doit contenir un champ "properties".');
    }

    if (!Array.isArray(data.properties)) {
      throw new Error('Le champ "properties" dans biens.json doit être un tableau.');
    }

    state.properties = data.properties;
    renderProperties();
    
  } catch (error) {
    console.error('Error loading properties:', error);
    
    // Handle network errors with retry logic
    if (isNetworkError(error) && retryCount < MAX_RETRIES) {
      console.warn(`Network error, retrying in ${RETRY_DELAY_MS}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return loadProperties(retryCount + 1);
    }
    
    // Build actionable error message for users
    let userMessage = '❌ ' + error.message;
    
    // Add actionable suggestions based on error type
    // Note: Error message checks are intentionally broad to catch related error scenarios
    // Our error messages include "Format JSON invalide" and "JSON" keywords
    if (isNetworkError(error)) {
      userMessage += '\n\n💡 Actions à essayer:\n';
      userMessage += '• Vérifiez votre connexion internet\n';
      userMessage += '• Rechargez la page (F5 ou Ctrl+R)\n';
      userMessage += '• Vérifiez que le fichier biens.json existe dans le dépôt GitHub';
    } else if (error.message.includes('JSON')) {
      userMessage += '\n\n💡 Actions à essayer:\n';
      userMessage += '• Vérifiez la syntaxe JSON du fichier biens.json\n';
      userMessage += '• Utilisez un validateur JSON en ligne (jsonlint.com)\n';
      userMessage += '• Assurez-vous qu\'il n\'y a pas de virgules en trop ou de guillemets manquants';
    } else if (error.message.includes('404')) {
      userMessage += '\n\n💡 Actions à essayer:\n';
      userMessage += '• Vérifiez que biens.json existe à la racine du projet\n';
      userMessage += '• Assurez-vous que le fichier a été commit et push sur GitHub';
    }
    
    listingSummary.textContent = userMessage;
    applyErrorStyling(listingSummary);
  }
};

loadProperties();
