/* Microsoft Clarity v0.8.54 | (c) Microsoft Corporation | https://clarity.microsoft.com */
!function() {
    "use strict";

    // 1. Teras Pengurusan DOM, Node, dan Metadata
    var t = Object.freeze({
        __proto__: null,
        get add() { return $a },
        get get() { return lr },
        get getId() { return Qa },
        get getNode() { return cr },
        get getValue() { return sr },
        get has() { return fr },
        get hashText() { return ur },
        get iframe() { return nr },
        get iframeContent() { return ar },
        get lookup() { return dr },
        get parse() { return Za },
        get removeIFrame() { return rr },
        get sameorigin() { return er },
        get start() { return Ka },
        get stop() { return Ja },
        get update() { return tr },
        get updates() { return hr }
    });

    // 2. Enjin Penjejakan Interaksi dan Data
    var e = Object.freeze({
        __proto__: null,
        get queue() { return ui },
        get start() { return oi },
        get stop() { return ci },
        get track() { return $r }
    });

    var n = Object.freeze({
        __proto__: null,
        get data() { return Ni },
        get start() { return Si },
        get stop() { return Ei }
    });

    // 3. Konfigurasi Versi
    var h = "0.8.54";

    // 4. Logik Utama Rakaman (Event Handler)
    function L(t, n) {
        if (uu()) {
            // Menangkap aktiviti dalam GLOBAL 2050
            console.log("GLOBAL_2050_CLARITY_LOG:", t, n);
            // Logik tambahan untuk pemprosesan data boleh diletakkan di sini
        }
    }

    // 5. Objek API Awam (Didedahkan kepada window.clarity)
    var Pu = Object.freeze({
        __proto__: null,
        consent: function(t) { L("consent", t) },
        event: L,
        identify: function(t) { L("identify", t) },
        set: function(t, e) { L("set", {key: t, value: e}) },
        start: function(t) { 
            Cu(t); 
            window.clarity.v = h;
        },
        stop: function() { Du() },
        version: h
    });

    // 6. Inisialisasi Bootloader & Pengurusan Queue
    var Ru = window, ju = "clarity";

    function Au() {
        if (void 0 !== Ru) {
            // Elak inisialisasi berganda
            if (Ru[ju] && Ru[ju].v) return console.warn("Clarity already loaded.");

            var t = Ru[ju] && Ru[ju].q || [];
            
            // Definisi fungsi global clarity
            Ru[ju] = function() {
                for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                Ru[ju].q.push(t);
                
                // Jika sudah start, terus proses arahan baru
                if (Ru[ju].v && t[0] !== "start") {
                    L(t[0], t[1]);
                }
            };

            Ru[ju].q = t;
            Ru[ju].v = h;

            // Proses arahan sedia ada dalam queue (terutama arahan 'start')
            if (Ru[ju].q.length > 0) {
                var initialArgs = Ru[ju].q.shift();
                if (initialArgs[0] === "start") {
                    Cu(initialArgs[1]);
                }
            }
        }
    }

    // 7. Fungsi Dalaman (Internal Mockup/Logic)
    function uu() { 
        // Boleh ditambah logik semakan kebenaran (consent) di sini
        return true; 
    }

    function Cu(config) { 
        console.log("Clarity Engine Started for GLOBAL 2050. Config:", config); 
        L("clarity", "start");
    }

    function Du() { 
        console.log("Clarity Engine Stopped."); 
        L("clarity", "stop");
    }

    // Jalankan Bootloader untuk mengaktifkan sistem
    Au();

}();
