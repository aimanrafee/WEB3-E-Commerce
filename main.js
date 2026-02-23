/**
 * GLOBAL 2050 - Sovereign OS Full Stack (v.Solid-2050)
 * Integrated: PQC Wallet, ES-RFS Protocols, Three.js Globe, & Ubuntu Sync.
 */

// --- 1. CONFIGURATION ---
const LOCAL_NODE_IP = "http://192.168.8.102:3000"; 
let temporarySeed = ""; 
let temporaryAddress = "";

// --- 2. DATA: SOVEREIGN PROTOCOLS (ES-RFS) ---
const SIDEBAR_DATA = {
    'ETHICAL': {
        title: 'ES-RFS Protocol',
        badge: 'Algorithm Standard',
        body: `
            <p class="text-gray-400 text-sm mb-6">Manual kedaulatan digital 2050 yang menapis transaksi berdasarkan impak etika mutlak.</p>
            <div class="space-y-4">
                <div class="p-4 bg-white/5 border-l-2 border-emerald-500 rounded-r">
                    <div class="text-[10px] font-bold text-emerald-500 mb-1 uppercase">Moral Compass</div>
                    <div class="text-xs text-gray-300">Algoritma menapis transaksi mengikut impak sosial global.</div>
                </div>
                <div class="p-4 bg-white/5 border-l-2 border-blue-500 rounded-r">
                    <div class="text-[10px] font-bold text-blue-500 mb-1 uppercase">Privacy Layer</div>
                    <div class="text-xs text-gray-300">Enkripsi SHA-512 memastikan identiti anda tidak boleh dijejak oleh pihak ketiga.</div>
                </div>
            </div>`
    },
    'STANDALONE': {
        title: 'Sovereign Nodes',
        badge: 'Offline Infrastructure',
        body: `
            <div class="mb-6">
                <div class="text-[10px] text-gray-500 uppercase mb-4 tracking-widest font-bold">Active Local Mesh</div>
                <div class="flex justify-between items-center py-3 border-b border-white/5 font-mono">
                    <span class="text-xs">Node_KL_Primary</span>
                    <span class="text-[10px] text-emerald-500 animate-pulse">ONLINE</span>
                </div>
            </div>
            <div class="p-6 bg-blue-500/10 border border-blue-500/20 text-center rounded-lg">
                <div class="text-2xl font-bold text-white tracking-tighter">100% OFFLINE CAPABLE</div>
            </div>`
    },
    'REGEN': {
        title: 'Natural Capital',
        badge: 'Regenerative Metrics',
        body: `
            <div class="p-6 bg-emerald-500/10 border border-emerald-500/20 mb-6 text-center rounded-xl">
                <div class="text-4xl font-light mb-2 text-white font-mono tracking-tighter">14,204</div>
                <div class="text-[9px] text-emerald-500 tracking-[0.3em] font-bold uppercase">Carbon Credits Restored</div>
            </div>
            <p class="text-xs text-gray-500 italic text-center">Data disinkronkan secara real-time dengan unit MYR melalui pasaran hijau.</p>`
    }
};

// --- 3. CRYPTO ENGINE (PQC SHA-512) ---
async function deriveAddressFromSeed(seed) {
    const msgUint8 = new TextEncoder().encode(seed + "PUBLIC");
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const publicKey = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return "VRT_PQC_" + publicKey.substring(0, 48).toUpperCase();
}

// --- 4. WALLET MANAGEMENT ---
async function createNewSovereignWallet() {
    try {
        const entropy = window.crypto.getRandomValues(new Uint8Array(32));
        temporarySeed = Array.from(entropy).map(b => b.toString(16).padStart(2, '0')).join('');
        temporaryAddress = await deriveAddressFromSeed(temporarySeed);
        alert("⚠️ PROTOKOL KESELAMATAN: Salin Seed Phrase ini!\n\n" + temporarySeed);
        document.getElementById('seed-modal')?.classList.remove('hidden');
    } catch (err) { alert("Sistem tidak menyokong PQC."); }
}

async function verifyAndActivate() {
    const input = document.getElementById('seed-input-verify').value.trim();
    if (input === temporarySeed) {
        localStorage.setItem('vrt_address', temporaryAddress);
        localStorage.setItem('vrt_seed', temporarySeed);
        await registerWalletAtUbuntu(temporaryAddress);
        updateWalletUI(temporaryAddress);
        closeSeedModal();
        alert("✅ WALLET AKTIF!");
    } else { alert("❌ Seed tidak sepadan."); }
}

async function processImport() {
    const input = document.getElementById('import-seed-input').value.trim();
    if (input.length < 32) return alert("Seed tidak sah.");
    const addr = await deriveAddressFromSeed(input);
    localStorage.setItem('vrt_address', addr);
    localStorage.setItem('vrt_seed', input);
    await registerWalletAtUbuntu(addr);
    updateWalletUI(addr);
    document.getElementById('import-modal')?.classList.add('hidden');
}

// --- 5. BRIDGE ACTIONS (STAKE, COMPOUND, SEND, UNSTAKE) ---
async function executeSovereignAction(type, details) {
    const sender = localStorage.getItem('vrt_address');
    if (!sender) return alert("Sila aktifkan wallet.");

    try {
        const response = await fetch(`${LOCAL_NODE_IP}/api/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: sender, type, ...details, timestamp: new Date().toISOString() })
        });
        const res = await response.json();
        if (res.success) alert(`✅ Protokol ${type} Berjaya!`);
        else alert("Ralat: " + res.message);
    } catch (e) { alert("Ralat Sambungan Ubuntu Node."); }
}

// Fungsi Manual Satu-Per-Satu
function sendTransaction() {
    const to = prompt("Alamat Penerima:");
    const amount = prompt("Jumlah VRT:");
    if (to && amount) executeSovereignAction('SEND', { to, amount: parseFloat(amount) });
}

function stakeVRT() {
    const amount = prompt("Jumlah untuk Stake (APR 119%):");
    if (amount) executeSovereignAction('STAKE', { amount: parseFloat(amount) });
}

function compoundYield() {
    executeSovereignAction('COMPOUND', { note: "Manual Compound" });
}

function unstakeRequest() {
    const amount = prompt("Jumlah untuk Unstake:");
    if (amount) executeSovereignAction('UNSTAKE', { amount: parseFloat(amount) });
}

// --- 6. SYNC & UI ENGINE ---
async function registerWalletAtUbuntu(address) {
    try {
        await fetch(`${LOCAL_NODE_IP}/api/register-wallet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
        });
    } catch (e) { console.log("Registrasi gagal (Node Offline)"); }
}

function startSovereignYieldSync() {
    const balanceEl = document.getElementById('wallet-balance-github');
    const statusEl = document.getElementById('node-status-text');
    const addr = localStorage.getItem('vrt_address');

    setInterval(async () => {
        if (!addr) return;
        try {
            const res = await fetch(`${LOCAL_NODE_IP}/api/balance/${addr}`);
            const data = await res.json();
            if (balanceEl) balanceEl.innerText = data.balance.toFixed(8);
            if (statusEl) statusEl.innerText = `NODE ACTIVE | ADDRESS: ${addr.substring(0,12)}...`;
        } catch (e) {
            if (statusEl) statusEl.innerText = "NODE OFFLINE - SYNC PAUSED";
        }
    }, 2000);
}

function updateWalletUI(address) {
    document.getElementById('wallet-setup-actions')?.classList.add('hidden');
    document.getElementById('wallet-active-info')?.classList.remove('hidden');
    const display = document.getElementById('display-address');
    if (display) display.innerText = address;
    startSovereignYieldSync();
}

// --- 7. VISUALS: THREE.JS GLOBE ---
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

// --- 8. SYSTEM BOOT ---
window.onload = () => {
    initGlobe();
    
    const pillars = [
        { id: "ETHICAL", name: "Ethical Algo", img: "assets/logo-ethical.png", fallback: "⚖️", desc: "Kompas moral digital." },
        { id: "STANDALONE", name: "Stand-alone OS", img: "assets/logo-os.png", fallback: "📱", desc: "Operasi 100% offline." },
        { id: "REGEN", name: "Regenerative", img: "assets/logo-regen.png", fallback: "🌿", desc: "Impak hijau ke MYR." },
        { id: "SOVEREIGN", name: "Sovereign RWA", img: "assets/logo-rwa.png", fallback: "🔐", desc: "Aset Gold/Land." }
    ];

    const list = document.getElementById('product-list');
    if (list) {
        list.innerHTML = pillars.map(p => `
            <div onclick="openSidebar('${p.id}')" class="cosmos-card p-10 group cursor-pointer border border-transparent hover:border-emerald-500/30 rounded-2xl transition-all duration-500">
                <div class="mb-8 h-14 w-14">
                     <img src="${p.img}" onerror="this.outerHTML='<div class=\'text-4xl\'>${p.fallback}</div>'">
                </div>
                <div class="text-[10px] uppercase tracking-[0.5em] text-emerald-500 mb-4 font-black">NODE_${p.id}</div>
                <h3 class="text-2xl font-medium mb-4 text-white">${p.name}</h3>
                <p class="text-[13px] text-gray-500">${p.desc}</p>
            </div>
        `).join('');
    }

    const saved = localStorage.getItem('vrt_address');
    if (saved) updateWalletUI(saved);
};

// --- 9. NAVIGATION ---
function openSidebar(key) {
    const sidebar = document.getElementById('sovereign-sidebar');
    const content = document.getElementById('sidebar-dynamic-content');
    const data = SIDEBAR_DATA[key];
    if (data && content) {
        content.innerHTML = `<h2 class="text-3xl font-medium text-white">${data.title}</h2><div class="mt-8">${data.body}</div>`;
    }
    sidebar?.classList.add('open');
}
function closeSidebar() { document.getElementById('sovereign-sidebar')?.classList.remove('open'); }
function closeSeedModal() { document.getElementById('seed-modal')?.classList.add('hidden'); }
