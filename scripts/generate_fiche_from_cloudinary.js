#!/usr/bin/env node

/**
 * Generate or update property fiche from Cloudinary folder
 * 
 * This script:
 * 1. Connects to Cloudinary using environment variables
 * 2. Fetches all images from a specified folder
 * 3. Determines transaction type and rank from folder name
 * 4. Updates or creates property in biens.json
 * 
 * Naming convention:
 * - Folders starting with "V" (e.g., V01, V15) = "vente" (sale)
 * - Folders starting with "LC" (e.g., LC01, LC08) = "location" (rental)
 * - Rank is parsed from numeric suffix (V15 → 15, LC03 → 3)
 * 
 * Environment variables required:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 * - FOLDER (e.g., "V01" or "LC08")
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BIENS_JSON_PATH = path.join(__dirname, '..', 'biens.json');

// Get environment variables
const cloud = process.env.CLOUDINARY_CLOUD_NAME;
const key = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;
const folder = (process.env.FOLDER || '').trim();

/**
 * Exit with error message
 */
function fail(msg) {
  console.error('❌ ERROR:', msg);
  process.exit(1);
}

/**
 * Validate environment variables
 */
function validateEnvironment() {
  if (!cloud || !key || !secret) {
    fail('Missing Cloudinary secrets. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }
  
  if (!folder) {
    fail('Missing FOLDER environment variable (e.g., "V01" or "LC08").');
  }
  
  console.log(`✓ Environment validated`);
  console.log(`  Cloud: ${cloud}`);
  console.log(`  Folder: ${folder}`);
}

/**
 * Determine transaction type from folder name
 * @param {string} folderName - Folder name (e.g., "V01", "LC08")
 * @returns {string} - Transaction type: "vente" or "location"
 */
function determineTransactionType(folderName) {
  const upper = folderName.toUpperCase();
  
  if (upper.startsWith('V') && /^V\d+/.test(upper)) {
    return 'vente';
  }
  
  if (upper.startsWith('LC')) {
    return 'location';
  }
  
  // Default to location if pattern doesn't match
  console.warn(`⚠️  Warning: Folder "${folderName}" doesn't match V* or LC* pattern. Defaulting to "location".`);
  return 'location';
}

/**
 * Parse rank from folder name
 * @param {string} folderName - Folder name (e.g., "V01", "LC08", "V15")
 * @returns {number} - Rank (e.g., 1, 8, 15)
 */
function parseRank(folderName) {
  // Extract numeric portion
  const match = folderName.match(/\d+/);
  
  if (match) {
    const rank = parseInt(match[0], 10);
    console.log(`  Parsed rank: ${rank} from folder "${folderName}"`);
    return rank;
  }
  
  console.warn(`⚠️  Warning: Could not parse rank from folder "${folderName}". Using 0.`);
  return 0;
}

/**
 * Fetch images from Cloudinary
 * @returns {Promise<Array>} - Array of image resources
 */
async function fetchCloudinaryImages() {
  console.log(`\n📡 Fetching images from Cloudinary folder: "${folder}"`);
  
  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/resources/search`;
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  
  const body = {
    expression: `folder:"${folder.replace(/"/g, '\\"')}"`,
    sort_by: [{ public_id: 'asc' }],
    max_results: 200
  };
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      fail(`Cloudinary API error ${res.status}: ${text.slice(0, 500)}`);
    }
    
    const json = await res.json();
    const resources = Array.isArray(json.resources) ? json.resources : [];
    
    if (resources.length === 0) {
      fail(`No images found in Cloudinary folder "${folder}". Please check the folder name.`);
    }
    
    console.log(`✓ Found ${resources.length} image(s) in Cloudinary`);
    return resources;
    
  } catch (error) {
    fail(`Failed to fetch from Cloudinary: ${error.message}`);
  }
}

/**
 * Build photos array from Cloudinary resources
 * @param {Array} resources - Cloudinary resources
 * @returns {Array} - Array of photo objects with URLs and metadata
 */
function buildPhotosArray(resources) {
  console.log('\n📸 Building photos array...');
  
  const photos = resources.map((resource, index) => {
    console.log(`  ${index + 1}. ${resource.public_id}`);
    
    return {
      url: resource.secure_url,
      public_id: resource.public_id,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes
    };
  });
  
  console.log(`✓ Built photos array with ${photos.length} photo(s)`);
  return photos;
}

/**
 * Load biens.json
 * @returns {Object} - Parsed biens.json content
 */
function loadBiensJson() {
  console.log(`\n📂 Loading ${BIENS_JSON_PATH}...`);
  
  try {
    const content = fs.readFileSync(BIENS_JSON_PATH, 'utf8');
    const data = JSON.parse(content);
    
    if (!data.properties) {
      data.properties = [];
    }
    
    console.log(`✓ Loaded biens.json with ${data.properties.length} existing properties`);
    return data;
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('  File not found, creating new structure');
      return { properties: [] };
    }
    fail(`Failed to read biens.json: ${error.message}`);
  }
}

/**
 * Create or update property in biens.json
 * @param {Object} data - Biens.json data
 * @param {Array} photos - Photos array from Cloudinary
 * @returns {Object} - Updated data
 */
function updateProperty(data, photos) {
  console.log(`\n�� Creating/updating property for folder "${folder}"...`);
  
  const transaction = determineTransactionType(folder);
  const rank = parseRank(folder);
  const now = new Date().toISOString();
  
  // Find existing property by reference
  const existingIndex = data.properties.findIndex(p => p.reference === folder);
  
  const propertyData = {
    reference: folder,
    transaction: transaction,
    type: transaction, // For schema compatibility
    propertyType: 'Appartement',
    title: 'À compléter',
    city: 'À compléter',
    district: 'À compléter',
    surface: 50,
    rooms: 2,
    price: transaction === 'vente' ? 100000 : 1000,
    features: [],
    image: photos[0].url, // Main image
    images: photos.map(p => p.url), // For compatibility with existing schema
    photos: photos, // Full metadata array
    cloudinaryFolder: folder,
    rank: rank,
    status: 'published',
    dateUpdated: now
  };
  
  if (existingIndex >= 0) {
    // Update existing property
    console.log(`  Found existing property at index ${existingIndex}`);
    
    // Preserve certain fields from existing property
    const existing = data.properties[existingIndex];
    
    if (existing.title && existing.title !== 'À compléter') {
      propertyData.title = existing.title;
    }
    if (existing.city && existing.city !== 'À compléter') {
      propertyData.city = existing.city;
    }
    if (existing.district && existing.district !== 'À compléter') {
      propertyData.district = existing.district;
    }
    if (existing.surface && existing.surface !== 50) {
      propertyData.surface = existing.surface;
    }
    if (existing.rooms && existing.rooms !== 2) {
      propertyData.rooms = existing.rooms;
    }
    if (existing.price && existing.price !== (transaction === 'vente' ? 100000 : 1000)) {
      propertyData.price = existing.price;
    }
    if (existing.propertyType && existing.propertyType !== 'Appartement') {
      propertyData.propertyType = existing.propertyType;
    }
    if (existing.features && existing.features.length > 0) {
      propertyData.features = existing.features;
    }
    if (existing.brochureUrl) {
      propertyData.brochureUrl = existing.brochureUrl;
    }
    if (existing.dateAdded) {
      propertyData.dateAdded = existing.dateAdded;
    }
    
    // Update the property
    data.properties[existingIndex] = propertyData;
    console.log(`✓ Updated existing property "${folder}"`);
    
  } else {
    // Create new property
    propertyData.dateAdded = now;
    data.properties.push(propertyData);
    console.log(`✓ Created new property "${folder}"`);
  }
  
  return data;
}

/**
 * Save biens.json
 * @param {Object} data - Data to save
 */
function saveBiensJson(data) {
  console.log(`\n💾 Saving ${BIENS_JSON_PATH}...`);
  
  try {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(BIENS_JSON_PATH, content, 'utf8');
    console.log(`✓ Saved successfully`);
    
  } catch (error) {
    fail(`Failed to write biens.json: ${error.message}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  Cloudinary Fiche Generator');
  console.log('═══════════════════════════════════════════════════\n');
  
  // Validate environment
  validateEnvironment();
  
  // Fetch images from Cloudinary
  const resources = await fetchCloudinaryImages();
  
  // Build photos array
  const photos = buildPhotosArray(resources);
  
  // Verify we have at least one photo
  if (!photos || photos.length === 0) {
    fail('No valid photos found to create property fiche.');
  }
  
  // Load biens.json
  const data = loadBiensJson();
  
  // Update property
  const updatedData = updateProperty(data, photos);
  
  // Save biens.json
  saveBiensJson(updatedData);
  
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  ✓ Success!');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`Property "${folder}" has been created/updated in biens.json`);
  console.log(`  Transaction: ${determineTransactionType(folder)}`);
  console.log(`  Rank: ${parseRank(folder)}`);
  console.log(`  Photos: ${photos.length}`);
  console.log(`  Main image: ${photos[0].url.substring(0, 60)}...`);
  console.log('\nNext steps:');
  console.log('  1. Review the property in biens.json');
  console.log('  2. Update title, city, district, and other fields as needed');
  console.log('  3. Commit the changes\n');
}

// Run main function
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
