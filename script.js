// Basic launcher framework (framework-only)
// Edit `tiles` array to add/modify tiles.
// Each tile: {id, title, category, description, url, target}
// If url is null, modal shows placeholder info.

const tiles = [
  { id:'t1', title:'Placeholder Game 1', category:'games', description:'Click to open a game or replace with your link.', url:null },
  { id:'t2', title:'Dino (example)', category:'games', description:'A demo placeholder that opens a built-in page.', url:'https://chromedino.com/' },
  { id:'t3', title:'Calculator', category:'apps', description:'Placeholder app tile.', url:null },
  { id:'t4', title:'Extras — Info', category:'extras', description:'Extra resources and links.', url:null },
  { id:'t5', title:'2048 (example)', category:'games', description:'External 2048 demo.', url:'https://play2048.co/' }
];

const total = tiles.length;
const loadingText = document.getElementById('loadingText');
const splash = document.getElementById('splash');
const grid = document.getElementById('tileGrid');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

function createTile(t) {
  const el = document.createElement('button');
  el.className = 'tile';
  el.setAttribute('data-category', t.category);
  el.dataset.id = t.id;
  el.innerHTML = `
    <div>
      <div class="title">${escapeHtml(t.title)}</div>
      <div class="meta">${escapeHtml(t.category)}</div>
    </div>
    <div class="desc">${escapeHtml(t.description)}</div>
  `;
  el.addEventListener('click', () => {
    if (t.url) {
      // open in new tab for external links
      window.open(t.url, '_blank', 'noopener');
    } else {
      showModal(t);
    }
  });
  return el;
}

function populate() {
  tiles.forEach((t, i) => {
    const tileEl = createTile(t);
    grid.appendChild(tileEl);
    // update loading progress
    loadingText.textContent = `Loading ${i+1}/${total}`;
  });

  // finish
  setTimeout(() => {
    loadingText.textContent = 'Loaded';
    hideSplash();
  }, 600);
}

function hideSplash() {
  if (!splash) return;
  splash.style.opacity = '0';
  setTimeout(()=> splash.remove(), 300);
}

function showModal(tile) {
  modalContent.innerHTML = `
    <h2>${escapeHtml(tile.title)}</h2>
    <p>${escapeHtml(tile.description)}</p>
    <p><small>Category: ${escapeHtml(tile.category)}</small></p>
    <p><em>This is a placeholder tile. To change behavior, edit script.js and add a URL for direct opening.</em></p>
  `;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// nav filtering
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filt = btn.dataset.filter;
    applyFilter(filt);
  });
});

function applyFilter(f) {
  const children = grid.children;
  for (let ch of children) {
    const cat = ch.dataset.category;
    ch.style.display = (f === 'all' || cat === f) ? '' : 'none';
  }
}

// copy main link behavior (Make A Link)
document.getElementById('copyMainLink').addEventListener('click', async () => {
  const link = location.href;
  try {
    await navigator.clipboard.writeText(link);
    flashMsg('Main link copied!');
  } catch {
    prompt('Copy this link manually:', link);
  }
});

function flashMsg(msg) {
  const d = document.createElement('div');
  d.textContent = msg;
  d.style.position = 'fixed';
  d.style.right = '16px';
  d.style.bottom = '16px';
  d.style.padding = '10px 14px';
  d.style.background = 'linear-gradient(90deg, rgba(255,77,77,0.12), rgba(255,77,77,0.06))';
  d.style.borderRadius = '10px';
  d.style.border = '1px solid rgba(255,255,255,0.04)';
  document.body.appendChild(d);
  setTimeout(()=> d.remove(), 1800);
}

// theme toggle (simple light/dark override)
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = 'Light';
  } else {
    document.documentElement.setAttribute('data-theme','light');
    themeToggle.textContent = 'Dark';
  }
});

// escape helper
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

// small init
document.addEventListener('DOMContentLoaded', ()=> {
  populate();
  // show a short splash if JS loads slowly
  setTimeout(()=> splash && (loadingText.textContent = `Loaded`), 2000);
});
