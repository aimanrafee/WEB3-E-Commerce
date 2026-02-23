/**
 * GLOBAL 2050 - Sovereign OS Full Stack
 * Gabungan PQC Security, Three.js Globe, & Ubuntu Bridge
 */

const LOCAL_NODE_IP = "http://192.168.8.102:3000";
let temporarySeed = ""; 

// --- 1. CRYPTO ENGINE ---
async function deriveAddressFromSeed(seed) {
    const msgUint8 = new TextEncoder().encode(seed + "PUBLIC");
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return "VRT_PQC_" + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 48).toUpperCase();
}

// --- 2. WALLET OPERATIONS ---
async function createNewSovereignWallet() {
    const entropy = window.crypto.getRandomValues(new Uint8Array(32));
    temporarySeed = Array.from(entropy).map(b => b.toString(16).padStart(2, '0')).join('');
    const addr = await deriveAddressFromSeed(temporarySeed);
    alert("⚠️ SIMPAN SEED INI:\n\n" + temporarySeed);
    document.getElementById('seed-modal')?.classList.remove('hidden');
}

async function verifyAndActivate() {
    const input = document.getElementById('seed-input-verify').value.trim();
    if (input === temporarySeed) {
        localStorage.setItem('vrt_address', await deriveAddressFromSeed(input));
        localStorage.setItem('vrt_seed', input);
        updateWalletUI(localStorage.getItem('vrt_address'));
        alert("✅ Wallet Aktif!");
    } else { alert("❌ Seed Salah!"); }
}

// --- 3. BRIDGE ENGINE (The "Master" Function) ---
async function executeSovereignAction(type, details = {}) {
    const address = localStorage.getItem('vrt_address');
    if (!address) return alert("Sila aktifkan wallet.");
    try {
        const res = await fetch(`${LOCAL_NODE_IP}/api/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: address, type, ...details })
        });
        const data = await res.json();
        if (data.success) alert(`✅ ${type} Berjaya!`);
    } catch (e) { alert("Node Offline!"); }
}

// --- 4. UI & THREE.JS GLOBE ---
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
    
    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    animate();
}

// --- 5. INITIALIZATION ---
window.onload = () => {
    initGlobe();
    // Render Dashboard Logic...
    const pillars = [
        { id: "ETHICAL", name: "Ethical Algo", desc: "Kompas moral digital." },
        { id: "STANDALONE", name: "Stand-alone OS", desc: "Operasi 100% offline." },
        { id: "REGEN", name: "Regenerative", desc: "Impak hijau ke MYR." },
        { id: "SOVEREIGN", name: "Sovereign RWA", desc: "Aset Gold/Land." }
    ];
    document.getElementById('product-list').innerHTML = pillars.map(p => `
        <div onclick="openSidebar('${p.id}')" class="cosmos-card p-10 cursor-pointer border border-white/5 rounded-2xl hover:border-emerald-500/50 transition-all">
            <h3 class="text-2xl text-white">${p.name}</h3>
            <p class="text-gray-500">${p.desc}</p>
        </div>
    `).join('');
};
