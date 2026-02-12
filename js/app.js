/**
 * ============================================================================
 * SALEM RECIPE BOOK - MAIN APPLICATION (UPDATED)
 * ============================================================================
 * Enhanced with URL routing and recipe index page
 */

// ═══════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ═══════════════════════════════════════════════════════════════════
let recipes = [];
let currentRecipeId = 0;
let currentServings = 4;
let activeCategory = null;
let navOpen = false;

// Fraction conversion map
const FRACTIONS = { 0.25: '¼', 0.33: '⅓', 0.5: '½', 0.67: '⅔', 0.75: '¾' };

// SVG Icons (reusable)
const ICONS = {
  clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9733a" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  layers: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9733a" stroke-width="2" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  users: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  chevron: '<svg class="chevron" id="ID_chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9733a" stroke-width="2.2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>'
};

// Category definitions for recipe index
const CATEGORIES = {
  'Appetizers & Side Dishes': { number: 'I', description: 'Start your meal right', slug: 'appetizers-side-dishes' },
  'Soups': { number: 'II', description: 'Warming and hearty', slug: 'soups' },
  'Salads': { number: 'III', description: 'Fresh and vibrant', slug: 'salads' },
  'Main Dishes': { number: 'IV', description: 'The heart of the meal', slug: 'main-dishes' },
  'Specialty & Cultural Dishes': { number: 'V', description: 'Unique recipes with rich cultural backgrounds', slug: 'specialty-cultural-dishes' },
  'Baked Goods & Desserts': { number: 'V', description: 'Sweet treats and baked delights to end your meal', slug: 'baked-goods-desserts' }
};

const CATEGORY_GRID_IDS = {
  'Appetizers & Side Dishes': 'appetizers-side-dishes-grid',
  'Soups': 'soups-grid',
  'Salads': 'salads-grid',
  'Main Dishes': 'main-dishes-grid',
  'Specialty & Cultural Dishes': 'specialty-grid',
  'Baked Goods & Desserts': 'baked-goods-desserts-grid'
};

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════
async function init() {
  try {
    const response = await fetch('data/recipes.json');
    const data = await response.json();
    recipes = data.recipes;
    
    console.log(`✓ Loaded ${recipes.length} recipes from ${data.meta.title}`);
    
    initRouter();
    setupEventListeners();
    populateRecipeIndex();
    handleRoute();
  } catch (error) {
    console.error('Error loading recipes:', error);
    document.getElementById('titleCard').innerHTML = 
      '<div style="padding:40px;text-align:center;color:#c9733a"><h2>Error Loading Recipes</h2><p>Please ensure data/recipes.json exists</p></div>';
  }
}

// ═══════════════════════════════════════════════════════════════════
// URL ROUTING (NEW)
// ═══════════════════════════════════════════════════════════════════
function initRouter() {
  window.addEventListener('popstate', handleRoute);
  window.addEventListener('hashchange', handleRoute);
}

function handleRoute() {
  const hash = window.location.hash.substring(1);
  
  if (hash && !isNaN(hash)) {
    // Hash is a recipe ID number
    const recipeId = parseInt(hash);
    if (recipes[recipeId]) {
      showRecipeDetail(recipeId);
    }
  } else if (hash && document.getElementById(hash)) {
    // Hash is a section anchor
    goToPage('recipes');
    setTimeout(() => {
      document.getElementById(hash).scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else if (!hash) {
    // No hash, check if we should show default
    const activePage = document.querySelector('.page.active');
    if (!activePage) {
      goToPage('cover');
    }
  }
}

function navigateToRecipe(recipeId) {
  window.location.hash = recipeId;
}

function showRecipeDetail(recipeId) {
  currentRecipeId = recipeId;
  const recipe = recipes[recipeId];
  if (!recipe) return;
  
  currentServings = recipe.baseServings;
  
  // Switch to recipe detail page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-recipe-detail').classList.add('active');
  
  document.querySelectorAll('.book-tab').forEach(tab => tab.classList.remove('active'));
  
  // Render the recipe
  renderRecipe(recipeId);
  window.scrollTo(0, 0);
  
  if (navOpen) toggleNav();
}

// ═══════════════════════════════════════════════════════════════════
// RECIPE INDEX PAGE (NEW)
// ═══════════════════════════════════════════════════════════════════
function populateRecipeIndex() {
  const recipesByCategory = {};
  
  // Group recipes by category
  recipes.forEach(recipe => {
    if (!recipesByCategory[recipe.category]) {
      recipesByCategory[recipe.category] = [];
    }
    recipesByCategory[recipe.category].push(recipe);
  });
  
  // Render each category grid
  Object.entries(CATEGORIES).forEach(([categoryName, categoryInfo]) => {
    const gridElement = document.getElementById(`${categoryInfo.slug}-grid`);
    if (!gridElement) return;
    
    const categoryRecipes = recipesByCategory[categoryName] || [];
    
    gridElement.innerHTML = categoryRecipes.map(recipe => `
      <div class="recipe-card" onclick="navigateToRecipe(${recipe.id})">
        <div class="recipe-card-image" style="background-image: url('${recipe.image || 'https://via.placeholder.com/400x300/5c3d2e/ffffff?text=' + encodeURIComponent(recipe.title)}')">
          <div class="recipe-card-overlay">
            <span class="recipe-card-time">${recipe.prepTime} + ${recipe.cookTime}</span>
            <span class="recipe-card-difficulty">${recipe.difficulty}</span>
          </div>
        </div>
        <div class="recipe-card-content">
          <h4 class="recipe-card-title">${recipe.title}</h4>
          <p class="recipe-card-subtitle">${recipe.story}</p>
          <div class="recipe-card-tags">
            ${recipe.dietary.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  });
}

// ═══════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════
function setupEventListeners() {
  document.querySelectorAll('.book-tab').forEach(tab => {
    tab.addEventListener('click', () => goToPage(tab.dataset.page));
  });
  
  // Smooth scroll for anchor links
  document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════
function goToPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${pageId}`).classList.add('active');
  
  document.querySelectorAll('.book-tab').forEach(t => 
    t.classList.toggle('active', t.dataset.page === pageId)
  );
  
  window.location.hash = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  if (navOpen) toggleNav();
}

// ═══════════════════════════════════════════════════════════════════
// RECIPE NAVIGATION SIDEBAR
// ═══════════════════════════════════════════════════════════════════
function toggleNav() {
  const panel = document.getElementById('navPanel');
  const overlay = document.getElementById('overlay');
  navOpen = !navOpen;
  
  panel.classList.toggle('open', navOpen);
  overlay.classList.toggle('open', navOpen);
  document.getElementById('nav-icon-menu').style.display = navOpen ? 'none' : 'block';
  document.getElementById('nav-icon-x').style.display = navOpen ? 'block' : 'none';
  
  if (navOpen) buildNav();
}

function buildNav(filterText = '') {
  const filter = filterText.toLowerCase();
  const groups = {};
  
  recipes.forEach(recipe => {
    if (filter && 
        !recipe.title.toLowerCase().includes(filter) && 
        !recipe.category.toLowerCase().includes(filter) &&
        !recipe.cuisine.toLowerCase().includes(filter)) {
      return;
    }
    
    if (!groups[recipe.category]) groups[recipe.category] = [];
    groups[recipe.category].push(recipe);
  });
  
  const navBody = document.getElementById('navBody');
  navBody.innerHTML = Object.entries(groups)
    .map(([category, catRecipes]) => `
      <p class="nav-cat-label">${category}</p>
      ${catRecipes.map(recipe => `
        <button 
          class="nav-item ${recipe.id === currentRecipeId ? 'active' : ''}" 
          onclick="selectRecipe(${recipe.id})"
        >
          ${recipe.title}
          <span class="nav-sub">${recipe.cuisine} • ${recipe.difficulty}</span>
        </button>
      `).join('')}
    `).join('');
}

function filterNav(value) {
  buildNav(value);
}

function selectRecipe(id) {
  navigateToRecipe(id);
}

// ═══════════════════════════════════════════════════════════════════
// AMOUNT FORMATTING
// ═══════════════════════════════════════════════════════════════════
function formatAmount(baseAmount) {
  const recipe = recipes[currentRecipeId];
  const scaled = baseAmount * (currentServings / recipe.baseServings);
  
  if (scaled % 1 === 0) return scaled.toString();
  
  const whole = Math.floor(scaled);
  const frac = scaled - whole;
  
  let closest = 0.5;
  Object.keys(FRACTIONS).forEach(key => {
    if (Math.abs(key - frac) < Math.abs(closest - frac)) closest = parseFloat(key);
  });
  
  if (Math.abs(closest - frac) < 0.06) {
    return whole > 0 ? whole + FRACTIONS[closest] : FRACTIONS[closest];
  }
  
  return scaled.toFixed(2).replace(/\.?0+$/, '');
}

// ═══════════════════════════════════════════════════════════════════
// SERVINGS ADJUSTMENT
// ═══════════════════════════════════════════════════════════════════
function changeServings(delta) {
  currentServings = Math.max(1, currentServings + delta);
  renderIngredients();
  renderNutrition();
}

// ═══════════════════════════════════════════════════════════════════
// COLLAPSIBLE SECTIONS
// ═══════════════════════════════════════════════════════════════════
function toggleSection(sectionId) {
  const body = document.getElementById(`${sectionId}_body`);
  const chevron = document.getElementById(`${sectionId}_chev`);
  const isOpen = body.classList.contains('open');
  
  body.classList.toggle('open', !isOpen);
  chevron.classList.toggle('closed', isOpen);
}

// ═══════════════════════════════════════════════════════════════════
// CULTURAL INFO
// ═══════════════════════════════════════════════════════════════════
async function fetchCulture() {
  const recipe = recipes[currentRecipeId];
  const fact = document.getElementById('cultureFact');
  const btn = document.getElementById('btnCulture');
  
  fact.classList.add('visible');
  fact.innerHTML = '<p class="loading">Loading…</p>';
  btn.style.display = 'none';
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Share a brief cultural fact about the dish "${recipe.title}" from ${recipe.cuisine} cuisine. Keep it to 2-3 sentences.`
        }]
      })
    });
    
    const data = await response.json();
    const textBlock = (data.content || []).find(b => b.type === 'text');
    fact.innerHTML = `<p>${textBlock ? textBlock.text : 'This dish has deep cultural roots.'}</p>`;
  } catch (error) {
    fact.innerHTML = '<p>This beloved dish represents generations of culinary tradition.</p>';
  }
}

// ═══════════════════════════════════════════════════════════════════
// RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function renderRecipe(id) {
  currentRecipeId = id;
  const recipe = recipes[id];
  if (!recipe) return;
  
  currentServings = recipe.baseServings;
  
  renderTitleCard(recipe);
  renderMetaRow(recipe);
  renderNutrition();
  renderIngredients();
  resetCulturalBanner();
  renderInstructions(recipe);
  renderTips(recipe);
  buildNav();
}

function renderTitleCard(recipe) {
  document.getElementById('titleCard').innerHTML = `
    <div class="title-card">
      <button class="back-to-index" onclick="goToPage('recipes')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
        Back to All Recipes
      </button>
      ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" />` : ''}
      <div class="title-card-top">
        <div>
          <h2>${recipe.title}</h2>
          <p class="cat">${recipe.category}</p>
        </div>
        <div class="tags">
          ${recipe.dietary.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="story-row">
        <span class="story-icon">📖</span>
        <p class="story-text">${recipe.story}</p>
      </div>
    </div>
  `;
}

function renderMetaRow(recipe) {
  document.getElementById('metaRow').innerHTML = `
    <div class="meta-card">
      <div class="meta-icon">${ICONS.clock}</div>
      <div class="meta-label">Prep</div>
      <div class="meta-value">${recipe.prepTime}</div>
    </div>
    <div class="meta-card">
      <div class="meta-icon">${ICONS.clock}</div>
      <div class="meta-label">Cook</div>
      <div class="meta-value">${recipe.cookTime}</div>
    </div>
    <div class="meta-card">
      <div class="meta-icon">${ICONS.layers}</div>
      <div class="meta-label">Difficulty</div>
      <div class="meta-value">${recipe.difficulty}</div>
    </div>
  `;
}

function renderNutrition() {
  const recipe = recipes[currentRecipeId];
  const n = recipe.nutrition;
  
  document.getElementById('nutriBar').innerHTML = `
    <div class="nutri-label">Nutrition<span>(per serving)</span></div>
    <div class="nutri-item"><div class="nutri-val">${n.calories}</div><div class="nutri-sub">Calories</div></div>
    <div class="nutri-item"><div class="nutri-val">${n.protein}</div><div class="nutri-sub">Protein</div></div>
    <div class="nutri-item"><div class="nutri-val">${n.carbs}</div><div class="nutri-sub">Carbs</div></div>
    <div class="nutri-item"><div class="nutri-val">${n.fat}</div><div class="nutri-sub">Fat</div></div>
  `;
}

function renderIngredients() {
  const recipe = recipes[currentRecipeId];
  
  document.getElementById('secIngredients').innerHTML = `
    <button class="section-header" onclick="toggleSection('ing')">
      <span class="sec-title">🥄 Ingredients</span>
      ${ICONS.chevron.replace(/ID/g, 'ing')}
    </button>
    <div class="section-body open" id="ing_body">
      <div class="section-inner">
        <div class="servings-bar">
          <span class="srv-icon" style="color:var(--accent)">${ICONS.users}</span>
          <button class="btn-srv" onclick="changeServings(-1)">−</button>
          <span class="srv-num">${currentServings}</span>
          <button class="btn-srv" onclick="changeServings(1)">+</button>
          <span class="srv-label">servings</span>
        </div>
        ${recipe.ingredients.map(ing => `
          <div class="ing-row">
            <span class="ing-dot">•</span>
            <span>
              <span class="ing-amt">${formatAmount(ing.amount)} ${ing.unit}</span> ${ing.name}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderInstructions(recipe) {
  document.getElementById('secInstructions').innerHTML = `
    <button class="section-header" onclick="toggleSection('inst')">
      <span class="sec-title">📝 Instructions</span>
      ${ICONS.chevron.replace(/ID/g, 'inst')}
    </button>
    <div class="section-body open" id="inst_body">
      <div class="section-inner">
        ${recipe.instructions.map(inst => `
          <div class="inst-row">
            <div class="inst-num">${inst.step}</div>
            <div>
              <div class="inst-title">${inst.title}</div>
              <div class="inst-text">${inst.text}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderTips(recipe) {
  document.getElementById('secTips').innerHTML = `
    <button class="section-header" onclick="toggleSection('tips')">
      <span class="sec-title">✨ Kitchen Secrets</span>
      ${ICONS.chevron.replace(/ID/g, 'tips')}
    </button>
    <div class="section-body open" id="tips_body">
      <div class="section-inner">
        ${recipe.tips.map(tip => `
          <div class="tip-row">
            <span class="tip-emoji">✨</span>
            <p class="tip-text">${tip}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function resetCulturalBanner() {
  document.getElementById('btnCulture').style.display = 'block';
  document.getElementById('cultureFact').classList.remove('visible');
  document.getElementById('cultureFact').innerHTML = '<p></p>';
}

// ═══════════════════════════════════════════════════════════════════
// START APPLICATION
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', init);
