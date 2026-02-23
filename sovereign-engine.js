/**
 * GLOBAL 2050 - SOVEREIGN ASSET ENGINE
 * Fokus: Logik Ekonomi, Penyimpanan Data LocalStorage, & MYR Currency.
 * Versi: 1.0.6 (Solid 2050 Production)
 */

// 1. Inisialisasi Data dari LocalStorage
let userAssets = JSON.parse(localStorage.getItem('es_rfs_assets')) || {
    gold: 0,
    land: 0,
    carbon_credits: 0,
    dividends: 0.0,
    last_update: Date.now()
};

// 2. Real-time Profit Ticker (Simulasi Pertumbuhan Dividen)
setInterval(() => {
    // Kadar keuntungan simulasi: Gold (5%) + Land (15%)
    const profitRate = (userAssets.gold * 0.05) + (userAssets.land * 0.15);
    
    if (profitRate > 0) {
        // Simulasi profit per saat (dibahagi 3600 untuk kadar sejam)
        userAssets.dividends += (profitRate / 3600); 
        saveAssets();
        updateTickerUI();
    }
}, 1000);

// 3. Fungsi Simpan Data
function saveAssets() {
    localStorage.setItem('es_rfs_assets', JSON.stringify(userAssets));
}

// 4. Fungsi Pembelian Aset dengan Fasa Enkripsi & Loading
async function purchaseAsset(type, amount, cost) {
    const assetNames = {
        'gold': 'Gold Bullion LOT',
        'land': 'Regenerative Land Sector'
    };

    const modal = document.getElementById('protocol-modal');
    const modalContent = document.getElementById('protocol-modal-content');
    const titleEl = document.getElementById('protocol-title');
    const descEl = document.getElementById('protocol-desc');
    const btnConfirm = document.getElementById('protocol-confirm');
    const btnCancel = document.getElementById('protocol-cancel');

    // Jika modal tiada dalam HTML, gunakan fallback prompt
    if (!modal) {
        if (confirm(`Sahkan perolehan ${amount} unit ${assetNames[type]} dengan nilai RM ${cost.toLocaleString()}?`)) {
            executeTransaction(type, amount, cost);
        }
        return;
    }

    btnConfirm.style.display = 'block';
    btnCancel.style.display = 'block';
    titleEl.innerText = `Perolehan ${assetNames[type]}`;
    descEl.innerText = `Sahkan protokol perolehan ${amount} unit dengan nilai RM ${cost.toLocaleString()}? Aset akan didaftarkan secara kekal dalam ledger anda.`;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('opacity-100');
        modalContent?.classList.remove('scale-95');
        modalContent?.classList.add('scale-100');
    }, 10);

    return new Promise((resolve) => {
        btnConfirm.onclick = async () => {
            btnConfirm.style.display = 'none';
            btnCancel.style.display = 'none';
            titleEl.innerHTML = `<span class="animate-pulse text-emerald-500">Encrypting Node...</span>`;
            
            const steps = [
                "Hashing RWA Metadata...", 
                "Securing Private Key...", 
                "Finalizing Offline Ledger...",
                "Node Synchronization Complete."
            ];

            for (let i = 0; i < steps.length; i++) {
                descEl.innerText = steps[i];
                await new Promise(r => setTimeout(r, 800)); 
            }
            
            closeProtocolModal();
            executeTransaction(type, amount, cost);
            resolve(true);
        };
        
        btnCancel.onclick = () => {
            closeProtocolModal();
            resolve(false);
        };
    });
}

function closeProtocolModal() {
    const modal = document.getElementById('protocol-modal');
    if (!modal) return;
    modal.classList.remove('opacity-100');
    setTimeout(() => modal.classList.add('hidden'), 500);
}

// 4b. Pelaksanaan Transaksi
function executeTransaction(type, amount, cost) {
    userAssets[type] += amount;
    userAssets.dividends += (cost * 0.001); // Bonus 0.1%
    saveAssets();
    
    renderLedgerView();
    renderProducts(); // Update butang di dashboard
    syncWithMainUI();
}

// 5. Reset Node
function resetSovereignNode() {
    if (confirm("AMARAN: Padam semua rekod aset secara kekal?")) {
        userAssets = { gold: 0, land: 0, carbon_credits: 0, dividends: 0.0, last_update: Date.now() };
        saveAssets();
        renderLedgerView();
        renderProducts();
        syncWithMainUI();
    }
}

// 6. UI Updates
function updateTickerUI() {
    const ticker = document.getElementById('profit-ticker');
    if (ticker) ticker.innerText = `RM ${userAssets.dividends.toFixed(4)}`;
    
    const mainBal = document.getElementById('wallet-balance-github');
    if (mainBal) mainBal.innerText = userAssets.dividends.toFixed(8);
}

function syncWithMainUI() {
    const balEl = document.getElementById('wallet-balance-github');
    if (balEl) balEl.innerText = userAssets.dividends.toFixed(8);
}

// 7. Render Product List (Dashboard) - SUPAYA BUTANG MUNCUL DI TENAH
function renderProducts() {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) return;

    productContainer.innerHTML = `
        <div class="bg-white/5 border border-white/10 p-8 rounded-3xl reveal">
            <div class="text-[9px] text-emerald-500 font-black mb-4 uppercase tracking-widest">Physical Asset</div>
            <h3 class="text-2xl font-bold mb-2 text-white leading-none">Gold Bullion LOT</h3>
            <p class="text-gray-400 text-xs mb-8">Emas fizikal 999.9 yang disimpan dalam peti besi berdaulat.</p>
            <div class="text-xl font-mono text-white mb-6">RM 1,500.00</div>
            <button onclick="purchaseAsset('gold', 1, 1500)" class="w-full py-4 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all">
                Dapatkan Lot Emas
            </button>
        </div>

        <div class="bg-white/5 border border-white/10 p-8 rounded-3xl reveal delay-1">
            <div class="text-[9px] text-blue-500 font-black mb-4 uppercase tracking-widest">Real Estate</div>
            <h3 class="text-2xl font-bold mb-2 text-white leading-none">Regen Land Sector</h3>
            <p class="text-gray-400 text-xs mb-8">Pajakan tanah regeneratif untuk pemulihan ekosistem.</p>
            <div class="text-xl font-mono text-white mb-6">RM 3,500.00</div>
            <button onclick="purchaseAsset('land', 0.5, 3500)" class="w-full py-4 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                Pajak 0.5 Hektar
            </button>
        </div>
    `;
}

// 8. Render Sidebar Ledger
function renderLedgerView() {
    const content = document.getElementById('sidebar-dynamic-content');
    if (!content) return;

    content.innerHTML = `
        <div class="p-8 animate-in fade-in slide-in-from-right-5 duration-700">
            <div class="mb-10">
                <div class="text-[9px] text-emerald-500 tracking-[0.4em] font-bold mb-2 uppercase">Asset Management</div>
                <h2 class="text-3xl font-medium tracking-tighter text-white leading-none">Sovereign Ledger</h2>
            </div>
            
            <div class="space-y-4 mb-8">
                <div class="p-5 bg-white/5 border border-white/10 rounded-xl">
                    <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Gold Inventory</div>
                    <div class="text-xl font-medium text-white">${userAssets.gold.toFixed(2)} UNIT</div>
                </div>
                <div class="p-5 bg-white/5 border border-white/10 rounded-xl">
                    <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Land Holdings</div>
                    <div class="text-xl font-medium text-white">${userAssets.land.toFixed(2)} HEKTAR</div>
                </div>
            </div>

            <div class="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <div class="text-[8px] text-gray-400 uppercase tracking-widest mb-1">Live Profit (MYR)</div>
                <div id="profit-ticker" class="text-3xl font-mono text-white">RM ${userAssets.dividends.toFixed(4)}</div>
            </div>

            <button onclick="resetSovereignNode()" class="mt-12 w-full text-[8px] text-gray-600 uppercase tracking-widest hover:text-red-500">[ Format Node ]</button>
        </div>
    `;
}

// Jalankan render awal
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateTickerUI();
});
