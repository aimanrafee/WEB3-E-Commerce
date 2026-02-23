/**
 * GLOBAL 2050 - Main System Logic
 * Terdiri daripada: UI Navigation, Three.js Globe, Authentication, dan Ubuntu Bridge.
 */

// --- LABEL: GITHUB PAGES - CONNECTION CONFIG ---
// Masukkan IP Ubuntu Server anda di sini
const LOCAL_NODE_IP = "http://IP_ADDRESS_UBUNTU_ANDA:3000"; 

// --- DATA SIDEBAR (Static Data) ---
const SIDEBAR_DATA = {
    'ETHICAL': {
        title: 'ES-RFS Protocol',
        badge: 'Algorithm Standard',
        body: `
            <p class="text-gray-400 text-sm leading-relaxed mb-8">Manual protokol kedaulatan digital yang mengutamakan privasi mutlak dan integritas data tanpa pihak ketiga.</p>
            <div class="space-y-4">
                <div class="p-4 bg-white/5 border-l-2 border-emerald-500 rounded-r">
                    <div class="text-[10px] font-bold text-emerald-500 mb-1 uppercase">Moral compass</div>
                    <div class="text-xs text-gray-300 font-light">Algoritma yang menapis transaksi berdasarkan impak etika global.</div>
                </div>
                <div class="p-4 bg-white/5 border-l-2 border-blue-500 rounded-r">
                    <div class="text-[10px] font-bold text-blue-500 mb-1 uppercase">Data Sovereignty</div>
                    <div class="text-xs text-gray-300 font-light">Setiap bait data disimpan secara offline dalam storan biometrik anda.</div>
                </div>
            </div>`
    },
    'STANDALONE': {
        title: 'Sovereign Nodes',
        badge: 'Network Infrastructure',
        body: `
            <div class="mb-8">
                <div class="text-[10px] text-gray-500 uppercase mb-4 tracking-widest font-bold">Active Local Nodes</div>
                <div class="flex justify-between items-center py-3 border-b border-white/5 font-mono">
                    <span class="text-xs">Node_KL_Primary</span>
                    <span class="text-[10px] text-emerald-500 animate-pulse">ONLINE</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-white/5 font-mono">
                    <span class="text-xs">Node_Borneo_Safe</span>
                    <span class="text-[10px] text-emerald-500 animate-pulse">ONLINE</span>
                </div>
            </div>
            <div class="p-6 bg-blue-500/10 border border-blue-500/20 text-center rounded-lg shadow-inner">
                <div class="text-[9px] uppercase mb-1 text-blue-400 font-black tracking-[0.2em]">Local Mesh Network</div>
                <div class="text-2xl font-bold text-white tracking-tighter">100% SECURE</div>
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
            <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-white/5 text-center rounded-lg border border-white/5">
                    <div class="text-lg text-white font-mono">82%</div>
                    <div class="text-[8px] text-gray-500 uppercase font-black">Biodiversity</div>
                </div>
                <div class="p-4 bg-white/5 text-center rounded-lg border border-white/5">
                    <div class="text-lg text-white font-mono">12.5k</div>
                    <div class="text-[8px] text-gray-500 uppercase font-black">Water Purity</div>
                </div>
            </div>`
    }
};

// --- NAVIGATION & SIDEBAR LOGIC ---
function openSidebar(key) {
    const sidebar = document.getElementById('sovereign-sidebar');
    const content = document.getElementById('sidebar-dynamic-content');
    
    if (!sidebar || !content) return;
    content.scrollTop = 0;

    if (key === 'SOVEREIGN') {
        // Alihkan terus ke Dashboard Ubuntu anda jika di klik
        window.open(LOCAL_NODE_IP, '_blank');
    } else {
        const data = SIDEBAR_DATA[key];
        if (data) {
            content.innerHTML = `
                <div class="mb-12 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div class="text-[9px] text-emerald-500 tracking-[0.4em] font-bold mb-4 uppercase">${data.badge}</div>
                    <h2 class="text-3xl font-medium tracking-tighter text-white leading-none">${data.title}</h2>
                    <div class="mt-8">${data.body}</div>
                </div>
            `;
        }
    }
    sidebar.classList.add('open');
}

function closeSidebar() {
    const sidebar = document.getElementById('sovereign-sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

// --- AUTH LOGIC (NODE ACTIVATION) ---
async function activateNode(nodeId) {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    const steps = ['E', 'S', 'R', 'FS'];
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('opacity-100'), 10);

    for (let s of steps) {
        const msgEl = document.getElementById('auth-msg');
        const stepEl = document.getElementById(`step-${s}`);
        if (msgEl) msgEl.innerText = `Establishing ${s} Protocol...`;
        await new Promise(r => setTimeout(r, 600));
        if (stepEl) {
            stepEl.classList.add('bg-emerald-500', 'border-emerald-500', 'shadow-[0_0_20px_rgba(16,185,129,0.8)]');
        }
    }

    setTimeout(() => {
        modal.classList.remove('opacity-100');
        setTimeout(() => {
            modal.classList.add('hidden');
            // Selepas aktivasi, buka Dashboard Ubuntu
            window.open(LOCAL_NODE_IP, '_blank');
        }, 500);
    }, 800);
}

// --- THREE.JS GLOBE ---
function initGlobe() {
    const container = document.getElementById('globe-viewport');
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    const globe = new THREE.Points(
        new THREE.SphereGeometry(2.8, 80, 80),
        new THREE.PointsMaterial({ color: 0x10b981, size: 0.012, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending })
    );
    scene.add(globe);
    camera.position.z = 8; camera.position.x = 1.5;
    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.0005;
        globe.rotation.z += 0.0001;
        renderer.render(scene, camera);
    }
    animate();
}

// --- LABEL: GITHUB PAGES - CONNECTION LOGIC ---
async function syncWithUbuntuNode() {
    try {
        const response = await fetch(`${LOCAL_NODE_IP}/api/wallet`);
        const data = await response.json();
        
        console.log("Connected to Ubuntu Node:", data.address);
        
        // Kemaskini elemen baki jika anda telah menambah ID ini di index.html GitHub
        const balanceEl = document.getElementById('wallet-balance-github');
        if(balanceEl) balanceEl.innerText = data.balance;

    } catch (error) {
        console.warn("Sovereign Node Offline at:", LOCAL_NODE_IP);
    }
}

// --- SYSTEM INITIALIZATION ---
window.onload = () => {
    initGlobe();
    syncWithUbuntuNode(); // Jalankan sync saat load
    setInterval(syncWithUbuntuNode, 10000); // Re-sync setiap 10 saat

    const pillars = [
        { id: "ETHICAL", name: "Ethical Algo", img: "assets/logo-ethical.png", fallback: "⚖️", desc: "Kompas moral digital. Menapis transaksi berdasarkan impak etika mutlak." },
        { id: "STANDALONE", name: "Stand-alone OS", img: "assets/logo-os.png", fallback: "📱", desc: "Operasi 100% offline. Kedaulatan penuh tanpa Cloud atau pihak ketiga." },
        { id: "REGEN", name: "Regenerative", img: "assets/logo-regen.png", fallback: "🌿", desc: "Sistem pemulihan alam. Menukar impak hijau kepada nilai ekonomi MYR." },
        { id: "SOVEREIGN", name: "Sovereign RWA", img: "assets/logo-rwa.png", fallback: "🔐", desc: "Pengurusan aset dunia nyata (MYR) yang disahkan melalui protokol ES-RFS." }
    ];

    const productList = document.getElementById('product-list');
    if (productList) {
        productList.innerHTML = pillars.map((p, i) => `
            <div onclick="openSidebar('${p.id}')" class="cosmos-card p-10 group reveal delay-${i+1} cursor-pointer hover:bg-white/[0.02] transition-all duration-500 border border-transparent hover:border-white/10 rounded-2xl">
                <div class="mb-8 h-14 w-14 opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                     <img src="${p.img}" alt="${p.name}" class="w-full h-full object-contain" onerror="this.outerHTML='<div class=\'text-4xl\'>${p.fallback}</div>'">
                </div>
                <div class="text-[10px] uppercase tracking-[0.5em] text-emerald-500 mb-4 font-black">NODE_${p.id}</div>
                <h3 class="text-2xl font-medium mb-4 text-white tracking-tight">${p.name}</h3>
                <p class="text-[13px] text-gray-500 mb-12 font-light leading-relaxed h-12 overflow-hidden">${p.desc}</p>
                <div class="pt-8 border-t border-white/5 flex items-center justify-between group-hover:border-emerald-500/30 transition-colors">
                    <span class="text-[9px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-emerald-500">Akses Unit MYR</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        `).join('');
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};
