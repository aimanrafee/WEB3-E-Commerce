/**
 * Inisialisasi Analitik GLOBAL 2050
 * Memastikan data dirakam walaupun dalam mod Offline
 */

(function() {
    // ID Projek anda (Boleh diletakkan apa-apa string untuk pembangunan tempatan)
    const PROJECT_ID = "global2050_smart_algo";

    if (window.clarity) {
        window.clarity("start", {
            projectId: PROJECT_ID,
            upload: "https://x.clarity.ms/collect", // Alamat penghantaran data
            expire: 365,
            cookies: ["_clck", "_clsk"],
            lean: false // Set true jika mahu penjejakan minima
        });

        // Tag khas untuk projek GLOBAL 2050 anda
        window.clarity("set", "edition", "GLOBAL_2050_OFFLINE_V1");
        window.clarity("set", "algorithm", "SMART_SYNC_ACTIVE");
        
        console.log("GLOBAL 2050 Analytics: System Initialized.");
    } else {
        console.error("GLOBAL 2050 Analytics: clarity.js not found.");
    }
})();
