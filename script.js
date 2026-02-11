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

const loadProperties = async () => {
  try {
    const response = await fetch('biens.json');
    if (!response.ok) {
      throw new Error(`Impossible de charger les biens (code ${response.status})`);
    }

    const data = await response.json();
    state.properties = data.properties;
    renderProperties();
  } catch (error) {
    listingSummary.textContent = 'Erreur de chargement du catalogue. Vérifiez biens.json.';
    console.error(error);
  }
};

loadProperties();
