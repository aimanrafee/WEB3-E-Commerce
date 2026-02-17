/**
 * GLOBAL 2050 - SOVEREIGN ASSET ENGINE
 * Fokus: Logik Ekonomi, Penyimpanan Data LocalStorage, & MYR Currency.
 * Versi: 1.0.4 (Full MYR Integration)
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
// Aset yang dimiliki akan menghasilkan profit kecil secara automatik setiap saat
setInterval(() => {
    // Kadar keuntungan: Gold (5%) + Land (15%)
    const profitRate = (userAssets.gold * 0.05) + (userAssets.land * 0.15);
    
    if (profitRate > 0) {
        // Simulasi profit per saat: Kadar tahunan dibahagi dengan 3600 (untuk simulasi pantas)
        userAssets.dividends += (profitRate / 3600); 
        saveAssets();
        updateTickerUI();
    }
}, 1000);

// 3. Fungsi Simpan Data
function saveAssets() {
    localStorage.setItem('es_rfs_assets', JSON.stringify(userAssets));
}

// 4. Fungsi Pembelian Aset (Sistem MYR)
function purchaseAsset(type, amount, cost) {
    const assetNames = {
        'gold': 'Gold Bullion LOT',
        'land': 'Regenerative Land Sector'
    };

    if (confirm(`Sahkan protokol perolehan ${amount} unit ${assetNames[type]} dengan nilai RM ${cost.toLocaleString()}?`)) {
        userAssets[type] += amount;
        
        // Bonus permulaan segera (0.1% daripada nilai pembelian)
        userAssets.dividends += (cost * 0.001); 
        
        saveAssets();
        alert("Transaksi Berjaya: Aset RWA telah dikunci dalam Sovereign Node anda.");
        renderLedgerView();
    }
}

// 5. Fungsi Reset (Untuk Testing)
function resetSovereignNode() {
    if (confirm("AMARAN: Ini akan memadam semua rekod aset dalam Node ini. Teruskan?")) {
        userAssets = { gold: 0, land: 0, carbon_credits: 0, dividends: 0.0, last_update: Date.now() };
        saveAssets();
        renderLedgerView();
    }
}

// 6. Kemaskini Paparan Dividen Sahaja (Bahagian Ticker)
function updateTickerUI() {
    const ticker = document.getElementById('profit-ticker');
    if (ticker) {
        // Update menggunakan format RM (2026 Sovereign Standard)
        ticker.innerText = `RM ${userAssets.dividends.toFixed(4)}`;
    }
}

// 7. Fungsi Render Utama UI Ledger
function renderLedgerView() {
    const content = document.getElementById('sidebar-dynamic-content');
    if (!content) return;

    content.innerHTML = `
        <div data-type="ledger-view" class="animate-in fade-in slide-in-from-right-5 duration-700">
            <div class="mb-10">
                <div class="text-[9px] text-emerald-500 tracking-[0.4em] font-bold mb-4 uppercase">Asset Management</div>
                <h2 class="text-3xl font-medium tracking-tighter text-white leading-none">Sovereign Ledger</h2>
            </div>
            
            <div class="space-y-4 mb-8">
                <div class="p-5 bg-white/5 border border-white/10 rounded-xl group hover:border-emerald-500/50 transition-all duration-500">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Physical Gold (RWA)</div>
                            <div class="text-xl font-medium text-white">${userAssets.gold} <span class="text-[10px] text-gray-400">UNIT</span></div>
                        </div>
                        <div class="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <button onclick="purchaseAsset('gold', 1, 1500)" 
                        class="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all transform active:scale-95">
                        Beli Gold LOT (RM 1,500)
                    </button>
                </div>

                <div class="p-5 bg-white/5 border border-white/10 rounded-xl group hover:border-emerald-500/50 transition-all duration-500">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Regen Land Capital</div>
                            <div class="text-xl font-medium text-white">${userAssets.land} <span class="text-[10px] text-gray-400">HEKTAR</span></div>
                        </div>
                        <div class="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a3.375 3.375 0 013.375 3.375V15.5" />
                            </svg>
                        </div>
                    </div>
                    <button onclick="purchaseAsset('land', 0.5, 3500)" 
                        class="w-full py-3 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all transform active:scale-95">
                        Pajak Tanah (RM 3,500)
                    </button>
                </div>
            </div>

            <div class="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl relative overflow-hidden group">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                </div>
                <div class="text-[8px] text-gray-400 uppercase tracking-[0.3em] mb-1 font-bold">Total Community Profit (MYR)</div>
                
                <div id="profit-ticker" class="text-3xl font-light text-white font-mono tracking-tighter">
                    RM ${userAssets.dividends.toFixed(4)}
                </div>
                
                <div class="flex items-center gap-2 mt-4">
                    <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                    <div class="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Sovereign Yield Active</div>
                </div>
            </div>

            <button onclick="resetSovereignNode()" class="mt-12 w-full py-2 text-[8px] text-gray-600 uppercase tracking-[0.4em] hover:text-red-500 transition-colors">
                [ Reset Node Data ]
            </button>
        </div>
    `;
}
