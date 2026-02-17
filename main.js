/**
 * GLOBAL 2050 - Main System Logic
 * Terdiri daripada: UI Navigation, Three.js Globe, dan Authentication.
 */

// --- DATA SIDEBAR (Static Data) ---
const SIDEBAR_DATA = {
    'ETHICAL': {
        title: 'ES-RFS Protocol',
        badge: 'Algorithm Standard',
        body: `
            <p class="text-gray-400 text-sm leading-relaxed mb-8">Manual protokol kedaulatan digital yang mengutamakan privasi mutlak dan integritas data tanpa pihak ketiga.</p>
            <div class="space-y-4">
                <div class="p-4 bg-white/5 border-l-2 border-emerald-500">
                    <div class="text-[10px] font-bold text-emerald-500 mb-1 uppercase">Moral compass</div>
                    <div class="text-xs text-gray-300">Algoritma yang menapis transaksi berdasarkan impak etika.</div>
                </div>
                <div class="p-4 bg-white/5 border-l-2 border-blue-500">
                    <div class="text-[10px] font-bold text-blue-500 mb-1 uppercase">Data Sovereignty</div>
                    <div class="text-xs text-gray-300">Setiap bait data dimiliki sepenuhnya oleh pemilik Node.</div>
                </div>
            </div>`
    },
    'STANDALONE': {
        title: 'Sovereign Nodes',
        badge: 'Network Infrastructure',
        body: `
            <div class="mb-8">
                <div class="text-[10px] text-gray-500 uppercase mb-4 tracking-widest">Active Global Nodes</div>
                <div class="flex justify-between items-center py-3 border-b border-white/5">
                    <span class="text-xs">Node_KL_Primary</span>
                    <span class="text-[10px] text-emerald-500">ONLINE</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-white/5">
                    <span class="text-xs">Node_Borneo_Safe</span>
                    <span class="text-[10px] text-emerald-500">ONLINE</span>
                </div>
            </div>
            <div class="p-6 bg-blue-500/10 border border-blue-500/20 text-center rounded-lg">
                <div class="text-xs uppercase mb-1 text-blue-400 font-bold">Local Mesh Network</div>
                <div class="text-2xl font-bold text-white">100% SECURE</div>
            </div>`
    },
    'REGEN': {
        title: 'Natural Capital',
        badge: 'Regenerative Metrics',
        body: `
            <div class="p-6 bg-emerald-500/10 border border-emerald-500/20 mb-6 text-center rounded-lg">
                <div class="text-4xl font-light mb-2 text-white font-mono">14,204</div>
                <div class="text-[9px] text-emerald-500 tracking-[0.3em] font-bold uppercase">Carbon Credits Restored</div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-white/5 text-center rounded border border-white/5">
                    <div class="text-lg text-white">82%</div>
                    <div class="text-[8px] text-gray-500 uppercase font-bold">Biodiversity</div>
                </div>
                <div class="p-4 bg-white/5 text-center rounded border border-white/5">
                    <div class="text-lg text-white">12.5k</div>
                    <div class="text-[8px] text-gray-500 uppercase font-bold">Water Purity</div>
                </div>
            </div>`
    }
};

// --- NAVIGATION & SIDEBAR LOGIC ---
function openSidebar(key) {
    const sidebar = document.getElementById('sovereign-sidebar');
    const content = document.getElementById('sidebar-dynamic-content');
    
    if (!sidebar || !content) return;

    if (key === 'SOVEREIGN' && typeof renderLedgerView === 'function') {
        // Panggil logik kewangan dari sovereign-engine.js
        renderLedgerView();
    } else {
        const data = SIDEBAR_DATA[key];
        if (data) {
            content.innerHTML = `
                <div class="mb-12 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div class="text-[9px] text-emerald-500 tracking-[0.4em] font-bold mb-4 uppercase">${data.badge}</div>
                    <h2 class="text-3xl font-medium tracking-tighter text-white">${data.title}</h2>
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
        await new Promise(r => setTimeout(r, 800));
        
        if (stepEl) {
            stepEl.classList.add('bg-emerald-500', 'border-emerald-500', 'shadow-[0_0_15px_rgba(16,185,129,0.6)]');
        }
    }

    setTimeout(() => {
        modal.classList.remove('opacity-100');
        setTimeout(() => {
            modal.classList.add('hidden');
            // Buka Ledger secara automatik selepas pengaktifan
            openSidebar('SOVEREIGN');
        }, 700);
    }, 1000);
}

// --- THREE.JS GLOBE (Visual Background) ---
function initGlobe() {
    const container = document.getElementById('globe-viewport');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Glob menggunakan warna Emerald untuk tema MYR Berdaulat
    const globe = new THREE.Points(
        new THREE.SphereGeometry(2.5, 64, 64),
        new THREE.PointsMaterial({ 
            color: 0x10b981, 
            size: 0.015, 
            transparent: true, 
            opacity: 0.35 
        })
    );
    scene.add(globe);
    
    camera.position.z = 7; 
    camera.position.x = 1.2;

    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.0008;
        globe.rotation.x += 0.0002;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// --- RENDER PILLARS (Home Cards) ---
const pillars = [
    { id: "ETHICAL", name: "Ethical Algo", img: "assets/logo-ethical.png", fallback: "⚖️", desc: "Kompas moral digital. Melindungi data dan privasi mutlak pengguna." },
    { id: "STANDALONE", name: "Stand-alone OS", img: "assets/logo-os.png", fallback: "📱", desc: "Operasi 100% offline. Kedaulatan penuh tanpa Cloud pusat." },
    { id: "REGEN", name: "Regenerative", img: "assets/logo-regen.png", fallback: "🌿", desc: "Algoritma pemulihan alam. Menukar impak hijau kepada nilai ekonomi." },
    { id: "SOVEREIGN", name: "Sovereign RWA", img: "assets/logo-rwa.png", fallback: "🔐", desc: "Pengurusan aset dunia nyata (MYR) yang sah dan berdaulat." }
];

// --- SYSTEM INITIALIZATION ---
window.onload = () => {
    initGlobe();
    
    const productList = document.getElementById('product-list');
    if (productList) {
        productList.innerHTML = pillars.map((p, i) => `
            <div onclick="openSidebar('${p.id}')" class="cosmos-card p-10 group reveal delay-${i+1} cursor-pointer">
                <div class="mb-6 h-12 w-12 opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                     <img src="${p.img}" alt="${p.name}" class="w-full h-full object-contain shadow-glow" 
                          onerror="this.outerHTML='<div class=\'text-3xl\'>${p.fallback}</div>'">
                </div>
                
                <div class="text-[9px] uppercase tracking-[0.4em] text-emerald-500 mb-3 font-bold">ES-RFS_${p.id}</div>
                <h3 class="text-xl font-medium mb-4 text-white">${p.name}</h3>
                <p class="text-xs text-gray-500 mb-10 font-light leading-relaxed h-12">${p.desc}</p>
                <div class="pt-8 border-t border-white/5 text-[9px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                    Akses Unit MYR
                </div>
            </div>
        `).join('');
    }
    
    // Intersection Observer untuk animasi reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { 
            if (e.isIntersecting) {
                e.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};
