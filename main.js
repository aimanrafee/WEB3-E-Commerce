/**
 * GLOBAL 2050 - Main System Logic (Sovereign OS Bridge)
 * Gabungan: PQC Wallet, Three.js Globe, & Ubuntu Node Sync.
 */

// --- 1. CONFIGURATION & GLOBALS ---
const LOCAL_NODE_IP = "http://192.168.8.102:3000"; // Mengikut IP asal anda
let temporarySeed = ""; 
let temporaryAddress = "";

const SIDEBAR_DATA = {
    'ETHICAL': {
        title: 'ES-RFS Protocol',
        badge: 'Algorithm Standard',
        body: `<p class="text-gray-400 text-sm leading-relaxed mb-8">Manual protokol kedaulatan digital yang mengutamakan privasi mutlak.</p>
               <div class="space-y-4">
                   <div class="p-4 bg-white/5 border-l-2 border-emerald-500 rounded-r">
                       <div class="text-[10px] font-bold text-emerald-500 mb-1 uppercase">Moral compass</div>
                       <div class="text-xs text-gray-300 font-light">Algoritma menapis transaksi berdasarkan impak etika global.</div>
                   </div>
               </div>`
    },
    'STANDALONE': {
        title: 'Sovereign Nodes',
        badge: 'Network Infrastructure',
        body: `<div class="mb-8">
                <div class="text-[10px] text-gray-500 uppercase mb-4 tracking-widest font-bold">Active Local Nodes</div>
                <div class="flex justify-between items-center py-3 border-b border-white/5 font-mono">
                    <span class="text-xs">Node_KL_Primary</span>
                    <span class="text-[10px] text-emerald-500 animate-pulse">ONLINE</span>
                </div>
               </div>`
    },
    'REGEN': {
        title: 'Natural Capital',
        badge: 'Regenerative Metrics',
        body: `<div class="p-6 bg-emerald-500/10 border border-emerald-500/20 mb-6 text-center rounded-xl">
                <div class="text-4xl font-light mb-2 text-white font-mono tracking-tighter">14,204</div>
                <div class="text-[9px] text-emerald-500 tracking-[0.3em] font-bold uppercase">Carbon Credits Restored</div>
               </div>`
    }
};

// --- 2. SOVEREIGN CRYPTO ENGINE (PQC SHA-512) ---

async function deriveAddressFromSeed(seed) {
    const msgUint8 = new TextEncoder().encode(seed + "PUBLIC");
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const publicKey = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return "VRT_PQC_" + publicKey.substring(0, 48).toUpperCase();
}

// --- 3. WALLET ACTIONS (JANA, VERIFIKASI, IMPORT) ---

async function createNewSovereignWallet() {
    try {
        const entropy = window.crypto.getRandomValues(new Uint8Array(32));
        temporarySeed = Array.from(entropy).map(b => b.toString(16).padStart(2, '0')).join('');
        temporaryAddress = await deriveAddressFromSeed(temporarySeed);
        
        alert("⚠️ SALIN SEED INI SEKARANG:\n\n" + temporarySeed);
        document.getElementById('seed-modal')?.classList.remove('hidden');
    } catch (err) { alert("Ralat PQC: Browser tidak menyokong."); }
}

async function verifyAndActivate() {
    const inputSeed = document.getElementById('seed-input-verify').value.trim();
    if (inputSeed === temporarySeed) {
        localStorage.setItem('vrt_address', temporaryAddress);
        localStorage.setItem('vrt_seed', temporarySeed);
        await registerWalletAtUbuntu(temporaryAddress);
        alert("✅ WALLET AKTIF!");
        closeSeedModal();
        updateWalletUI(temporaryAddress);
    } else { alert("❌ Seed tidak sepadan!"); }
}

async function processImport() {
    const inputSeed = document.getElementById('import-seed-input').value.trim();
    if (inputSeed.length < 32) return alert("Seed tidak sah.");
    const addr = await deriveAddressFromSeed(inputSeed);
    localStorage.setItem('vrt_address', addr);
    localStorage.setItem('vrt_seed', inputSeed);
    await registerWalletAtUbuntu(addr);
    updateWalletUI(addr);
    document.getElementById('import-modal')?.classList.add('hidden');
}

// --- 4. BRIDGE ENGINE (SYNC & EXECUTE) ---

async function startSovereignYieldSync() {
    const address = localStorage.getItem('vrt_address');
    if (!address) return;

    const balanceEl = document.getElementById('wallet-balance-github');
    const statusEl = document.getElementById('node-status-text');

    setInterval(async () => {
        try {
            // Sync Baki & APR dari Node Ubuntu
            const res = await fetch(`${LOCAL_NODE_IP}/api/balance/${address}`);
            const data = await res.json();
            
            if (balanceEl) balanceEl.innerText = data.balance.toFixed(8);
            if (statusEl) statusEl.innerText = `NODE ACTIVE | ADDRESS: ${address.substring(0,12)}...`;
        } catch (e) {
            if (statusEl) statusEl.innerText = "NODE OFFLINE - SYNC PAUSED";
        }
    }, 2000);
}

async function executeSovereignAction(type, details) {
    const senderAddress = localStorage.getItem('vrt_address');
    if (!senderAddress) return alert("Sila aktifkan wallet.");

    try {
        const response = await fetch(`${LOCAL_NODE_IP}/api/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: senderAddress, type, ...details, timestamp: new Date().toISOString() })
        });
        const res = await response.json();
        if (res.success) alert(`✅ ${type} Berjaya!`);
    } catch (e) { alert("Ralat Sambungan Ubuntu."); }
}

// --- 5. UI & GLOBE INITIALIZATION ---

function initGlobe() {
    const container = document.getElementById('globe-viewport');
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    const globe = new THREE.Points(
        new THREE.SphereGeometry(2.8, 80, 80),
        new THREE.PointsMaterial({ color: 0x10b981, size: 0.012, transparent: true, opacity: 0.4 })
    );
    scene.add(globe);
    camera.position.z = 8;
    
    (function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.001;
        renderer.render(scene, camera);
    })();
}

function updateWalletUI(address) {
    const setupActions = document.getElementById('wallet-setup-actions');
    const activeInfo = document.getElementById('wallet-active-info');
    const displayAddr = document.getElementById('display-address');
    
    if (setupActions) setupActions.classList.add('hidden');
    if (activeInfo) activeInfo.classList.remove('hidden');
    if (displayAddr) displayAddr.innerText = address;
    startSovereignYieldSync();
}

// --- 6. WINDOW LOAD ---
window.onload = () => {
    initGlobe();
    
    // Render Pillars
    const pillars = [
        { id: "ETHICAL", name: "Ethical Algo", img: "assets/logo-ethical.png", fallback: "⚖️", desc: "Kompas moral digital." },
        { id: "STANDALONE", name: "Stand-alone OS", img: "assets/logo-os.png", fallback: "📱", desc: "Operasi 100% offline." },
        { id: "REGEN", name: "Regenerative", img: "assets/logo-regen.png", fallback: "🌿", desc: "Impak hijau ke MYR." },
        { id: "SOVEREIGN", name: "Sovereign RWA", img: "assets/logo-rwa.png", fallback: "🔐", desc: "Aset Gold/Land." }
    ];

    const productList = document.getElementById('product-list');
    if (productList) {
        productList.innerHTML = pillars.map((p, i) => `
            <div onclick="openSidebar('${p.id}')" class="cosmos-card p-10 group cursor-pointer hover:bg-white/[0.02] border border-transparent hover:border-emerald-500/30 rounded-2xl transition-all duration-500">
                <div class="mb-8 h-14 w-14 group-hover:scale-110 transition-transform">
                     <img src="${p.img}" onerror="this.outerHTML='<div class=\'text-4xl\'>${p.fallback}</div>'">
                </div>
                <div class="text-[10px] uppercase tracking-[0.5em] text-emerald-500 mb-4 font-black">NODE_${p.id}</div>
                <h3 class="text-2xl font-medium mb-4 text-white">${p.name}</h3>
                <p class="text-[13px] text-gray-500 leading-relaxed">${p.desc}</p>
            </div>
        `).join('');
    }

    // Check existing wallet
    const savedAddress = localStorage.getItem('vrt_address');
    if (savedAddress) updateWalletUI(savedAddress);
};

// Functions for Sidebar & Modal
function openSidebar(key) { 
    const sidebar = document.getElementById('sovereign-sidebar');
    const content = document.getElementById('sidebar-dynamic-content');
    const data = SIDEBAR_DATA[key];
    if(data && content) {
        content.innerHTML = `<h2 class="text-3xl font-medium text-white">${data.title}</h2><div class="mt-8">${data.body}</div>`;
    }
    sidebar?.classList.add('open'); 
}
function closeSidebar() { document.getElementById('sovereign-sidebar')?.classList.remove('open'); }
function closeSeedModal() { document.getElementById('seed-modal')?.classList.add('hidden'); }
async function registerWalletAtUbuntu(address) {
    await fetch(`${LOCAL_NODE_IP}/api/register-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address })
    });
}
