/**
 * GLOBAL 2050 - SOVEREIGN OS SYSTEM LOGIC
 * Version: Solid-2050.Build.01 (Ultimate Edition)
 * Components: PQC Security, Three.js Starfield, Ubuntu Bridge, & RWA Ledger.
 */

// --- 1. GLOBAL CONFIGURATIONS ---
const LOCAL_NODE_IP = "http://192.168.8.102:3000";
const SYSTEM_VERSION = "2050.SOLID";
let temporarySeed = ""; 
let temporaryAddress = "";
let isNodeOnline = false;

// --- 2. EXTENDED SIDEBAR DATA (ES-RFS PROTOCOLS) ---
const SIDEBAR_DATA = {
    'ETHICAL': {
        title: 'ES-RFS: Ethical Algorithm',
        badge: 'Moral Core',
        body: `
            <div class="space-y-6">
                <p class="text-gray-400 text-sm leading-relaxed">Protokol Etika 2050 menetapkan piawaian di mana setiap transaksi ditapis melalui 'Moral Compass' digital.</p>
                <div class="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <h4 class="text-xs font-bold text-emerald-500 mb-2 uppercase">Proof of Impact (PoI)</h4>
                    <p class="text-[11px] text-gray-400">Hanya transaksi yang memberikan impak positif kepada ekosistem sosial dibenarkan melepasi lapisan konsensus.</p>
                </div>
                <div class="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 class="text-xs font-bold text-white mb-2 uppercase">Human-Centric Design</h4>
                    <p class="text-[11px] text-gray-400">Algoritma ini tidak boleh dimanipulasi oleh entiti korporat atau AI berpusat.</p>
                </div>
            </div>`
    },
    'STANDALONE': {
        title: 'Sovereign Stand-alone OS',
        badge: 'Infrastructure',
        body: `
            <div class="space-y-6">
                <div class="flex justify-between items-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div>
                        <div class="text-[10px] text-blue-400 font-black uppercase">Mesh Status</div>
                        <div class="text-xl font-mono text-white">OFFLINE-FIRST</div>
                    </div>
                    <div class="h-3 w-3 bg-blue-500 animate-ping rounded-full"></div>
                </div>
                <p class="text-gray-400 text-xs">Sistem operasi ini berfungsi 100% tanpa internet (Local Mesh). Data anda disimpan dalam storan biometrik peranti anda sendiri.</p>
                <ul class="text-[11px] text-gray-500 space-y-2">
                    <li>• No Cloud Synchronization</li>
                    <li>• Zero-Knowledge Proof Encryption</li>
                    <li>• Hardware-level Sovereignty</li>
                </ul>
            </div>`
    },
    'REGEN': {
        title: 'Regenerative Economics',
        badge: 'Natural Capital',
        body: `
            <div class="space-y-6">
                <div class="p-6 bg-gradient-to-br from-emerald-600/20 to-transparent border border-emerald-500/20 rounded-2xl text-center">
                    <div class="text-4xl font-light text-white mb-2 tracking-tighter">14,204</div>
                    <div class="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Carbon Credits Restored</div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div class="text-[10px] text-gray-500 uppercase">Biodiversity</div>
                        <div class="text-lg text-white font-mono">82.4%</div>
                    </div>
                    <div class="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div class="text-[10px] text-gray-500 uppercase">Water Purity</div>
                        <div class="text-lg text-white font-mono">94.1%</div>
                    </div>
                </div>
            </div>`
    },
    'SOVEREIGN': {
        title: 'Sovereign RWA Ledger',
        badge: 'Real World Assets',
        body: `
            <div class="space-y-4">
                <p class="text-gray-400 text-sm">Pengurusan aset fizikal (Emas, Tanah, Tenaga) yang di-tokenkan secara berdaulat.</p>
                <div class="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                    <div class="flex justify-between text-xs mb-2">
                        <span class="text-gray-400">Gold Reserve</span>
                        <span class="text-yellow-500 font-mono">1.240 kg</span>
                    </div>
                    <div class="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div class="bg-yellow-500 h-full w-[65%]"></div>
                    </div>
                </div>
                <button onclick="if(window.renderLedgerView) renderLedgerView()" class="w-full py-3 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
                    Buka Ledger Aset
                </button>
            </div>`
    }
};

// --- 3. SOVEREIGN CRYPTO ENGINE (PQC SHA-512) ---
async function deriveAddressFromSeed(seed) {
    const encoder = new TextEncoder();
    const data = encoder.encode(seed + "SOVEREIGN_2050_SALT");
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fullHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return "VRT_PQC_" + fullHash.substring(0, 48).toUpperCase();
}

// --- 4. CORE BRIDGE ENGINE (FETCH & EXECUTE) ---
async function executeSovereignAction(type, payload = {}) {
    const address = localStorage.getItem('vrt_address');
    if (!address) {
        alert("⚠️ AMARAN: Sila aktifkan Wallet Sovereign anda terlebih dahulu.");
        return;
    }

    console.log(`[Bridge] Executing ${type}...`);
    try {
        const response = await fetch(`${LOCAL_NODE_IP}/api/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: address,
                type: type,
                ...payload,
                client_ts: new Date().toISOString()
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(`✅ PROTOKOL BERJAYA: ${type}\n\nTransaction Hash: ${result.txHash || 'SECURE_OFFLINE_LOG'}`);
            syncWalletData(); 
        } else {
            alert(`❌ RALAT NODE: ${result.message || result.error}`);
        }
    } catch (error) {
        console.error("Bridge Connection Failed", error);
        alert("❌ KEGAGALAN SAMBUNGAN: Node Ubuntu tidak dapat dicapai. Sila benarkan 'Insecure Content' di Site Settings browser anda.");
    }
}

// --- 5. INDIVIDUAL BUTTON ACTIONS ---
function sendTransaction() {
    const to = prompt("Masukkan Alamat VRT Penerima:");
    const amount = prompt("Jumlah untuk dihantar:");
    if (to && amount) {
        executeSovereignAction('SEND', { to, amount: parseFloat(amount) });
    }
}

function stakeVRT() {
    const amount = prompt("Masukkan Jumlah VRT untuk Staking (119% APR):");
    if (amount) {
        executeSovereignAction('STAKE', { amount: parseFloat(amount) });
    }
}

function compoundYield() {
    if (confirm("Laksanakan Auto-Compound untuk baki terkumpul?")) {
        executeSovereignAction('COMPOUND', { strategy: 'aggressive-2050' });
    }
}

function unstakeRequest() {
    const amount = prompt("Masukkan Jumlah untuk Unstake:");
    if (amount) {
        executeSovereignAction('UNSTAKE', { amount: parseFloat(amount) });
    }
}

// --- 6. WALLET UI & SYNC ---
async function createNewSovereignWallet() {
    const entropy = window.crypto.getRandomValues(new Uint8Array(32));
    temporarySeed = Array.from(entropy).map(b => b.toString(16).padStart(2, '0')).join('');
    temporaryAddress = await deriveAddressFromSeed(temporarySeed);
    
    const seedDisplay = document.getElementById('seed-display-area');
    if (seedDisplay) seedDisplay.innerText = temporarySeed;
    
    document.getElementById('seed-modal')?.classList.remove('hidden');
    alert("⚠️ AMARAN KESELAMATAN: Sila salin Seed Phrase anda. Ia tidak akan dipaparkan lagi.");
}

async function verifyAndActivate() {
    const input = document.getElementById('seed-input-verify').value.trim();
    if (input === temporarySeed) {
        localStorage.setItem('vrt_address', temporaryAddress);
        localStorage.setItem('vrt_seed', temporarySeed);
        
        try {
            await fetch(`${LOCAL_NODE_IP}/api/register-wallet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: temporaryAddress })
            });
        } catch (e) { console.warn("Node registration skipped (offline mode)"); }

        updateWalletUI(temporaryAddress);
        closeSeedModal();
    } else {
        alert("❌ Seed tidak sah. Sila cuba lagi.");
    }
}

function updateWalletUI(address) {
    document.getElementById('wallet-setup-actions')?.classList.add('hidden');
    document.getElementById('wallet-active-info')?.classList.remove('hidden');
    const displayAddr = document.getElementById('display-address');
    if (displayAddr) displayAddr.innerText = address;
    syncWalletData();
}

async function syncWalletData() {
    const address = localStorage.getItem('vrt_address');
    if (!address) return;

    try {
        const res = await fetch(`${LOCAL_NODE_IP}/api/balance/${address}`);
        const data = await res.json();
        
        const balEl = document.getElementById('wallet-balance-github');
        if (balEl) balEl.innerText = data.balance.toFixed(8);
        
        updateNodeStatus(true);
        isNodeOnline = true;
    } catch (e) {
        updateNodeStatus(false);
        isNodeOnline = false;
    }
}

function updateNodeStatus(online) {
    const statusEls = document.querySelectorAll('#node-status-text, #footer-node-status');
    statusEls.forEach(el => {
        if (online) {
            el.innerText = "NODE ONLINE | ES-RFS SECURE";
            el.className = "text-emerald-500 font-bold uppercase tracking-tighter";
        } else {
            el.innerText = "NODE OFFLINE | LOCAL SYNC ONLY";
            el.className = "text-red-500 font-bold uppercase tracking-tighter";
        }
    });
}

// --- 7. VISUALS: THREE.JS GLOBE & STARFIELD ---
let scene, camera, renderer, globe, stars;

function initVisuals() {
    const container = document.getElementById('globe-viewport');
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Add Stars
    const starQty = 2000;
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const starVertices = [];
    for (let i = 0; i < starQty; i++) {
        starVertices.push((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Add Globe
    const geometry = new THREE.SphereGeometry(2.8, 80, 80);
    const material = new THREE.PointsMaterial({ 
        color: 0x10b981, 
        size: 0.015, 
        transparent: true, 
        opacity: 0.5,
        blending: THREE.AdditiveBlending 
    });
    globe = new THREE.Points(geometry, material);
    scene.add(globe);

    camera.position.z = 8;

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        if(globe) globe.rotation.y += 0.001;
        if(stars) stars.rotation.y -= 0.0002;
        renderer.render(scene, camera);
    }
    animate();
}

// --- 8. INITIALIZATION & NAVIGATION ---
window.onload = () => {
    console.log(`%c[SYSTEM] Booting Global 2050... v${SYSTEM_VERSION}`, "color: #10b981; font-weight: bold;");
    initVisuals();
    
    // Intersection Observer for Reveal Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Auto-sync every 5 seconds
    setInterval(syncWalletData, 5000);

    const savedAddr = localStorage.getItem('vrt_address');
    if (savedAddr) updateWalletUI(savedAddr);
};

function openSidebar(key) {
    const sidebar = document.getElementById('sovereign-sidebar');
    const content = document.getElementById('sidebar-dynamic-content');
    const data = SIDEBAR_DATA[key];
    
    if (data && content) {
        content.innerHTML = `
            <div class="animate-in fade-in slide-in-from-right-10 duration-500">
                <div class="text-[9px] text-emerald-500 tracking-[0.4em] font-black mb-2 uppercase">${data.badge}</div>
                <h2 class="text-4xl font-light text-white tracking-tighter mb-8">${data.title}</h2>
                <div class="sidebar-body">${data.body}</div>
            </div>
        `;
    }
    sidebar?.classList.add('open');
}

function closeSidebar() { document.getElementById('sovereign-sidebar')?.classList.remove('open'); }
function closeSeedModal() { document.getElementById('seed-modal')?.classList.add('hidden'); }

// --- 9. EXTRA BRIDGE HELPERS ---
function showImportUI() {
    document.getElementById('import-modal')?.classList.remove('hidden');
}

async function processImport() {
    const input = document.getElementById('import-seed-input').value.trim();
    if (input.length > 10) {
        const addr = await deriveAddressFromSeed(input);
        localStorage.setItem('vrt_address', addr);
        localStorage.setItem('vrt_seed', input);
        updateWalletUI(addr);
        document.getElementById('import-modal')?.classList.add('hidden');
        alert("✅ Wallet Dipulihkan & Diselaraskan.");
    }
}
