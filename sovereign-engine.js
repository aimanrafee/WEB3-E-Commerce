// sovereign-engine.js

// 1. Inisialisasi Data dari LocalStorage
let userAssets = JSON.parse(localStorage.getItem('es_rfs_assets')) || {
    gold: 0,
    land: 0,
    carbon_credits: 0,
    dividends: 0.0
};

// 2. Fungsi Pembelian Aset
function purchaseAsset(type, amount, cost) {
    if (confirm(`Sahkan protokol perolehan ${amount} unit ${type}?`)) {
        userAssets[type] += amount;
        userAssets.dividends += (amount * 0.05); // Simulasi profit 5%
        localStorage.setItem('es_rfs_assets', JSON.stringify(userAssets));
        alert("Transaksi Berjaya: Aset telah dikunci dalam Sovereign Node anda.");
        renderLedgerView();
    }
}

// 3. Fungsi Render UI Ledger
function renderLedgerView() {
    const content = document.getElementById('sidebar-dynamic-content');
    if (!content) return;

    content.innerHTML = `
        <div data-type="ledger-view" class="animate-in fade-in duration-700">
            <div class="mb-10">
                <div class="text-[9px] text-emerald-500 tracking-[0.4em] font-bold mb-4 uppercase">Asset Management</div>
                <h2 class="text-3xl font-medium tracking-tighter">Sovereign Ledger</h2>
            </div>
            
            <div class="space-y-4 mb-8">
                <div class="p-4 bg-white/5 border border-white/10 rounded group hover:border-emerald-500/50 transition-all">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[10px] text-gray-500 uppercase font-bold">Physical Gold (RWA)</span>
                        <span class="text-emerald-500 text-xs font-mono">${userAssets.gold} UNIT</span>
                    </div>
                    <button onclick="purchaseAsset('gold', 1, 2500)" 
                        class="w-full py-2 bg-white text-black text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                        Beli Gold LOT
                    </button>
                </div>

                <div class="p-4 bg-white/5 border border-white/10 rounded group hover:border-emerald-500/50 transition-all">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[10px] text-gray-500 uppercase font-bold">Regen Land</span>
                        <span class="text-emerald-500 text-xs font-mono">${userAssets.land} HEKTAR</span>
                    </div>
                    <button onclick="purchaseAsset('land', 0.5, 5000)" 
                        class="w-full py-2 border border-white/20 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                        Pajak Tanah
                    </button>
                </div>
            </div>

            <div class="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <div class="text-[8px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Estimated Community Profit (LOT)</div>
                <div class="text-3xl font-light text-white font-mono">$${userAssets.dividends.toFixed(2)}</div>
                <div class="flex items-center gap-2 mt-3">
                    <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div class="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter">ES-RFS Protocol Active</div>
                </div>
            </div>
        </div>
    `;
}
