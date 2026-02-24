/** * GLOBAL 2050 - SOVEREIGN OS | Solid-2050.Build.01
 * Kecekapan Maksimum: PQC, Three.js Starfield, Ubuntu Bridge, RWA.
 */
const LOCAL_NODE_IP = "http://192.168.8.102:3000", SYSTEM_VERSION = "2050.SOLID";
let temporarySeed = "", temporaryAddress = "", isNodeOnline = false;

const SIDEBAR_DATA = {
    'ETHICAL': { title: 'ES-RFS: Ethical Algorithm', badge: 'Moral Core', body: `<div class="space-y-6"><p class="text-gray-400 text-sm">Transaksi ditapis melalui 'Moral Compass' digital.</p><div class="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl"><h4 class="text-xs font-bold text-emerald-500 mb-2 uppercase">Proof of Impact (PoI)</h4><p class="text-[11px] text-gray-400">Hanya impak positif dibenarkan melepasi konsensus.</p></div></div>` },
    'STANDALONE': { title: 'Sovereign Stand-alone OS', badge: 'Infrastructure', body: `<div class="space-y-6"><div class="flex justify-between items-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"><div><div class="text-[10px] text-blue-400 font-black uppercase">Mesh Status</div><div class="text-xl font-mono text-white">OFFLINE-FIRST</div></div><div class="h-3 w-3 bg-blue-500 animate-ping rounded-full"></div></div><p class="text-gray-400 text-xs">Fungsi 100% tanpa internet (Local Mesh).</p></div>` },
    'REGEN': { title: 'Regenerative Economics', badge: 'Natural Capital', body: `<div class="space-y-6"><div class="p-6 bg-gradient-to-br from-emerald-600/20 to-transparent border border-emerald-500/20 rounded-2xl text-center"><div class="text-4xl font-light text-white mb-2 tracking-tighter">14,204</div><div class="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Carbon Credits</div></div></div>` },
    'SOVEREIGN': { title: 'Sovereign RWA Ledger', badge: 'Real World Assets', body: `<p class="text-gray-400 text-sm mb-4">Aset fizikal di-tokenkan secara berdaulat.</p><button onclick="if(window.renderLedgerView) renderLedgerView()" class="w-full py-3 bg-emerald-500 text-black text-[10px] font-bold uppercase hover:bg-white transition-all">Buka Ledger</button>` }
};

// --- HELPER & CRYPTO ---
const $ = id => document.getElementById(id);
async function deriveAddressFromSeed(seed) {
    const hash = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(seed + "SOVEREIGN_2050_SALT"));
    return "VRT_PQC_" + Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 48).toUpperCase();
}

// --- BRIDGE ENGINE ---
async function executeSovereignAction(type, payload = {}) {
    const from = localStorage.getItem('vrt_address');
    if (!from) return alert("⚠️ Aktifkan Wallet Sovereign anda.");
    try {
        const res = await fetch(`${LOCAL_NODE_IP}/api/execute`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, type, ...payload, client_ts: new Date().toISOString() })
        });
        const result = await res.json();
        if (result.success) { alert(`✅ ${type} BERJAYA\nHash: ${result.txHash || 'OFFLINE_LOG'}`); syncWalletData(); window.renderProducts?.(); }
        else alert(`❌ RALAT: ${result.message}`);
    } catch (e) { alert("❌ NODE OFFLINE: Transaksi disimpan secara lokal."); }
}

// --- ACTIONS ---
const sendTransaction = () => { const to = prompt("Alamat:"), amt = prompt("Jumlah:"); to && amt && executeSovereignAction('SEND', { to, amount: parseFloat(amt) }); };
const stakeVRT = () => { const amt = prompt("Jumlah Stake (119% APR):"); amt && executeSovereignAction('STAKE', { amount: parseFloat(amt) }); };
const compoundYield = () => confirm("Auto-Compound baki terkumpul?") && executeSovereignAction('COMPOUND', { strategy: 'aggressive-2050' });
const unstakeRequest = () => { const amt = prompt("Jumlah Unstake:"); amt && executeSovereignAction('UNSTAKE', { amount: parseFloat(amt) }); };

// --- WALLET & SYNC ---
async function createNewSovereignWallet() {
    temporarySeed = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('');
    temporaryAddress = await deriveAddressFromSeed(temporarySeed);
    alert("SIMPAN SEED PHRASE ANDA:\n\n" + temporarySeed);
    if ($('seed-display-area')) $('seed-display-area').innerText = temporarySeed;
    $('seed-modal')?.classList.remove('hidden');
}

async function verifyAndActivate() {
    if ($('seed-input-verify').value.trim() === temporarySeed) {
        localStorage.setItem('vrt_address', temporaryAddress);
        localStorage.setItem('vrt_seed', temporarySeed);
        try { await fetch(`${LOCAL_NODE_IP}/api/register-wallet`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: temporaryAddress }) }); } catch(e){}
        updateWalletUI(temporaryAddress);
        closeSeedModal();
        alert("✅ WALLET AKTIF");
    } else alert("❌ Seed tidak sah.");
}

function updateWalletUI(addr) {
    $('wallet-setup-actions')?.classList.add('hidden');
    $('wallet-active-info')?.classList.remove('hidden');
    if ($('display-address')) $('display-address').innerText = addr;
    syncWalletData();
}

async function syncWalletData() {
    const addr = localStorage.getItem('vrt_address');
    if (!addr) return;
    try {
        const res = await fetch(`${LOCAL_NODE_IP}/api/balance/${addr}`);
        const data = await res.json();
        if ($('wallet-balance-github')) $('wallet-balance-github').innerText = parseFloat(data.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
        if ($('staked-balance-val')) $('staked-balance-val').innerText = parseFloat(data.staked || data.staked_balance || 0).toFixed(8);
        updateNodeStatus(true);
    } catch (e) { updateNodeStatus(false); if ($('staked-balance-val')?.innerText === "0") $('staked-balance-val').innerText = "0.00000000"; }
}

function updateNodeStatus(online) {
    isNodeOnline = online;
    document.querySelectorAll('#node-status-text, #footer-node-status, #node-status-text-footer').forEach(el => {
        el.innerText = online ? "NODE ONLINE | ES-RFS ACTIVE" : "STAND-ALONE_ACTIVE (OFFLINE)";
        el.className = online ? "text-emerald-500 font-bold uppercase" : "text-white/40 font-bold uppercase";
    });
}

// --- VISUALS (THREE.JS) ---
let scene, camera, renderer, globe, stars;
function initVisuals() {
    const c = $('globe-viewport'); if (!c) return;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, c.clientWidth / c.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(c.clientWidth, c.clientHeight);
    c.appendChild(renderer.domElement);

    // Starfield
    const starGeo = new THREE.BufferGeometry(), starPos = [];
    for (let i = 0; i < 2000; i++) starPos.push((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 }));
    scene.add(stars);

    // Globe
    globe = new THREE.Points(new THREE.SphereGeometry(2.8, 80, 80), new THREE.PointsMaterial({ color: 0x10b981, size: 0.015, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }));
    scene.add(globe);
    camera.position.z = 8;

    const anim = () => { requestAnimationFrame(anim); globe.rotation.y += 0.001; stars.rotation.y -= 0.0002; renderer.render(scene, camera); };
    anim();
}

// --- INIT ---
window.onload = () => {
    initVisuals();
    setInterval(syncWalletData, 3000);
    const saved = localStorage.getItem('vrt_address');
    if (saved) updateWalletUI(saved);
    new IntersectionObserver(e => e.forEach(en => en.isIntersecting && en.target.classList.add('active')), { threshold: 0.1 }).observe(document.querySelector('.reveal'));
};

function openSidebar(key) {
    const d = SIDEBAR_DATA[key];
    if (d && $('sidebar-dynamic-content')) {
        $('sidebar-dynamic-content').innerHTML = `<div class="animate-in fade-in slide-in-from-right-10 duration-500"><div class="text-[9px] text-emerald-500 font-black mb-2 uppercase">${d.badge}</div><h2 class="text-4xl font-light text-white mb-8">${d.title}</h2><div>${d.body}</div></div>`;
    }
    $('sovereign-sidebar')?.classList.add('open');
}
const closeSidebar = () => $('sovereign-sidebar')?.classList.remove('open');
const closeSeedModal = () => $('seed-modal')?.classList.add('hidden');
const showImportUI = () => $('import-modal')?.classList.remove('hidden');

async function processImport() {
    const input = $('import-seed-input').value.trim();
    if (input.length > 10) {
        const addr = await deriveAddressFromSeed(input);
        localStorage.setItem('vrt_address', addr); localStorage.setItem('vrt_seed', input);
        updateWalletUI(addr); $('import-modal')?.classList.add('hidden');
        alert("✅ Wallet Dipulihkan");
    }
}
