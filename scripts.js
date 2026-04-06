/* ════════════════════════════════════════
   EUROCAR FINDER — scripts.js (index)
   ════════════════════════════════════════ */

/* ── Theme: auto by hour, overridable ── */
const html = document.documentElement;
const tbtn = document.getElementById('themeBtn');

function setTheme(t) {
  html.setAttribute('data-theme', t);
  tbtn.textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('ecf-theme', t);
}

(function initTheme() {
  const s = localStorage.getItem('ecf-theme');
  if (s) { setTheme(s); return; }
  const h = new Date().getHours();
  setTheme(h >= 6 && h < 20 ? 'light' : 'dark');
})();

tbtn.addEventListener('click', () =>
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
);

/* ════════════════════════════════════════
   BRAND CONFIG
   — bc: background for the stripe (color OR gradient, NO trailing semicolon)
   — logo: path to the brand logo file inside assets/brands/
   ════════════════════════════════════════ */
const BRANDS = {
  bmw:         { bc: 'linear-gradient(180deg, #1c69d4 0%, #003c78 50%, #e32618 100%)', logo: 'bmw.png' },
  audi:        { bc: '#bb0a14',  logo: 'audi.png' },
  mercedes:    { bc: '#9a9a9a',  logo: 'mercedes.png' },
  volkswagen:  { bc: '#1e3a8a',  logo: 'volkswagen.png' },
  seat:        { bc: '#e30613',  logo: 'seat.png' },
  toyota:      { bc: '#eb0a1e',  logo: 'toyota.png' },
  ford:        { bc: '#003087',  logo: 'ford.png' },
  renault:     { bc: 'linear-gradient(180deg, #f1c400 0%, #e0b800 100%)', logo: 'renault.png' },
  peugeot:     { bc: '#0a3161',  logo: 'peugeot.png' },
  opel:        { bc: '#fbbf24',  logo: 'opel.png' },
  skoda:       { bc: '#4ba82e',  logo: 'skoda.png' },
  fiat:        { bc: '#c41230',  logo: 'fiat.png' },
  'alfa romeo':{ bc: '#8b0000',  logo: 'alfaromeo.png' },
  lancia:      { bc: '#1a237e',  logo: 'lancia.png' },
  tesla:       { bc: '#cc0000',  logo: 'tesla.png' },
  volvo:       { bc: 'linear-gradient(180deg, #003057 0%, #005082 100%)', logo: 'volvo.png' },
  jaguar:      { bc: '#6b7280',  logo: 'jaguar.png' },
  'land rover':{ bc: '#005a2b',  logo: 'landrover.png' },
  citroën:     { bc: '#c8102e',  logo: 'citroen.png' },
  citroen:     { bc: '#c8102e',  logo: 'citroen.png' },
};

function getBrand(name) {
  return BRANDS[name.toLowerCase()] || { bc: 'var(--accent)', logo: null };
}

/* ── Source portals per country ── */
const PORTALS = {
  DE: 'Mobile.de',
  FR: 'Le Bon Coin',
  ES: 'Coches.net',
  IT: 'AutoScout24',
  GB: 'AutoTrader',
  NL: 'Marktplaats',
  PL: 'OtoMoto',
  BE: 'AutoScout24',
  SE: 'Blocket',
  PT: 'Standvirtual',
};

/* ── Countries ── */
const COUNTRIES = {
  ES:{n:'España',      f:'🇪🇸'},
  DE:{n:'Alemania',    f:'🇩🇪'},
  FR:{n:'Francia',     f:'🇫🇷'},
  IT:{n:'Italia',      f:'🇮🇹'},
  GB:{n:'Reino Unido', f:'🇬🇧'},
  NL:{n:'Países Bajos',f:'🇳🇱'},
  PL:{n:'Polonia',     f:'🇵🇱'},
  BE:{n:'Bélgica',     f:'🇧🇪'},
  SE:{n:'Suecia',      f:'🇸🇪'},
  PT:{n:'Portugal',    f:'🇵🇹'},
};

/* ════════════════════════════════════════
   BUILD CARD HTML
   ════════════════════════════════════════ */
function buildCard(v) {
  const country  = v.country ? COUNTRIES[v.country.code] : null;
  const countryCode = v.country ? v.country.code : '';
  const brand    = getBrand(v.brand);
  const portal   = PORTALS[countryCode] || 'Portal europeo';
  const price    = v.price_eur.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const km       = v.mileage.toLocaleString('es-ES');
  const fuel     = v.fuel_type.replace('electrico', 'eléctrico').replace('hibrido', 'híbrido');
  const trans    = v.transmission === 'automatico' ? '⚙️ Auto' : '⚙️ Manual';

  // Brand logo or fallback text
  const logoHtml = brand.logo
    ? `<img class="car-brand-logo"
           src="assets/brands/${brand.logo}"
           alt="${v.brand}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
        >
       <span class="car-brand-fallback" style="display:none">${v.brand}</span>`
    : `<span class="car-brand-fallback">${v.brand}</span>`;

  return `
    <a class="car-card" href="vehicle.html?id=${v.id}" style="--bc: ${brand.bc}">
      <div class="car-thumb fuel-${v.fuel_type}">
        ${logoHtml}
        <span class="bf bf-${v.fuel_type}">${fuel}</span>
        ${country ? `<span class="badge-country">${country.f} ${country.n}</span>` : ''}
        <span class="badge-source">${portal}</span>
      </div>
      <div class="car-body">
        <div class="car-make">${v.brand}</div>
        <div class="car-name">${v.model} · ${v.year}</div>
        <div class="car-specs">
          <span>📍 ${v.city}</span>
          <span>🛣️ ${km} km</span>
          <span>${trans}</span>
        </div>
        <div class="car-price-row">
          <div>
            <div class="car-price">${price}</div>
            <div class="car-hint">Precio en origen · ver importación →</div>
          </div>
          <span class="car-arrow">Ver →</span>
        </div>
      </div>
      <div class="car-foot">
        <span>${v.seller_name || '—'}</span>
        <span class="seller-tag">${v.seller_type === 'profesional' ? '🏢 Concesionario' : '👤 Particular'}</span>
      </div>
    </a>`;
}

/* ════════════════════════════════════════
   SEARCH — redirects to results.html
   ════════════════════════════════════════ */
function doSearch() {
  const params = new URLSearchParams();
  const fields = {
    brand:        document.getElementById('s-brand').value.trim(),
    country:      document.getElementById('s-country').value,
    fuel_type:    document.getElementById('s-fuel').value,
    price_min:    document.getElementById('s-pmin').value,
    price_max:    document.getElementById('s-pmax').value,
    year_min:     document.getElementById('s-ymin').value,
    year_max:     document.getElementById('s-ymax').value,
    transmission: document.getElementById('s-trans').value,
  };
  Object.entries(fields).forEach(([k, v]) => { if (v) params.set(k, v); });
  window.location.href = 'results.html?' + params.toString();
}

// Enter key triggers search
document.querySelectorAll('.search-box input, .search-box select')
  .forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); }));

/* ════════════════════════════════════════
   LOAD FEATURED VEHICLES (index preview)
   ════════════════════════════════════════ */
async function loadFeatured() {
  // Si estamos en local (sin servidor), no intentar la API
  // y dejar las tarjetas de previsualización hardcoded
  const isLocal = window.location.protocol === 'file:' ||
                  window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1';

  if (isLocal) {
    document.getElementById('stat-v').textContent = '26';
    document.getElementById('res-count').textContent = 'Previsualización local — conecta AWS para ver datos reales';
    return; // no tocar el grid, dejar las tarjetas hardcoded
  }

  const grid = document.getElementById('cars-grid');
  try {
    const data = await fetch('/api/vehicles/search').then(r => r.json());
    document.getElementById('stat-v').textContent = data.total;
    document.getElementById('res-count').textContent = `${data.total} vehículo${data.total !== 1 ? 's' : ''} disponibles`;
    const featured = data.vehicles.slice(0, 6);
    if (!featured.length) {
      grid.innerHTML = '<div class="state">No hay vehículos disponibles.</div>';
      return;
    }
    grid.innerHTML = featured.map(buildCard).join('');
  } catch (e) {
    // En producción si falla la API, mostrar error
    grid.innerHTML = '<div class="state">No se pudieron cargar los vehículos.</div>';
  }
}

/* ════════════════════════════════════════
   COUNTRIES GRID
   ════════════════════════════════════════ */
function renderCountries() {
  document.getElementById('countries-grid').innerHTML =
    Object.entries(COUNTRIES).map(([code, c]) => `
      <a class="cc" href="results.html?country=${code}">
        <span class="cc-flag">${c.f}</span>
        <div>
          <div class="cc-name">${c.n}</div>
          <div class="cc-link">Ver vehículos →</div>
        </div>
      </a>`).join('');
}

/* ════════════════════════════════════════
   INIT
   ════════════════════════════════════════ */
loadFeatured();
renderCountries();
