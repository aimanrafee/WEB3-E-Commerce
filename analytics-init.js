/**
 * Inisialisasi Analitik GLOBAL 2050
 * Memastikan data dirakam walaupun dalam mod Offline
 * Versi: 1.0.1 (Stability Patch)
 */

(function() {
    // ID Projek untuk pembangunan tempatan/global
    const PROJECT_ID = "global2050_smart_algo";

    // Pastikan DOM sedia sebelum memulakan penjejakan
    document.addEventListener('DOMContentLoaded', () => {
        if (window.clarity) {
            window.clarity("start", {
                projectId: PROJECT_ID,
                upload: "https://x.clarity.ms/collect",
                expire: 365,
                cookies: ["_clck", "_clsk"],
                lean: false 
            });

            // Tag khas untuk identiti projek GLOBAL 2050
            window.clarity("set", "edition", "GLOBAL_2050_OFFLINE_V1");
            window.clarity("set", "algorithm", "SMART_SYNC_ACTIVE");
            
            // Rekodkan status node semasa permulaan (Online/Offline)
            const isOnline = navigator.onLine ? "ONLINE" : "OFFLINE";
            window.clarity("set", "network_status", isOnline);
            
            console.log("%c[ANALYTICS] Global 2050 System Initialized.", "color: #3b82f6; font-weight: bold;");
        } else {
            // Jika Clarity tidak dimuatkan (biasanya dalam mod offline tegar), 
            // kita rekodkan secara senyap di konsol sahaja.
            console.warn("[ANALYTICS] Clarity.js not found. Running in stealth mode.");
        }
    });
})();
