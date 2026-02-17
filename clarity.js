/* clarity-js v0.8.54: https://github.com/microsoft/clarity (License: MIT) */
!function() {
    "use strict";
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
    }), e = Object.freeze({
        __proto__: null,
        get queue() { return ui },
        get start() { return oi },
        get stop() { return ci },
        get track() { return $r }
    }), n = Object.freeze({
        __proto__: null,
        get data() { return Ni },
        get start() { return Si },
        get stop() { return Ei }
    });

    /* Implementasi Fungsi Utama */
    var h = "0.8.54";
    function L(t, e) {
        if (uu()) {
            // Logik rakaman event bermula di sini
            console.log("GLOBAL_2050_LOG:", t, e);
        }
    }

    /* Bahagian Export API */
    var Pu = Object.freeze({
        __proto__: null,
        consent: function(t) { L("consent", t) },
        event: L,
        identify: function(t) { L("identify", t) },
        set: function(t, e) { L("set", {key: t, value: e}) },
        start: function(t) { 
            L("start", t);
            window.clarity.v = h;
        },
        stop: function() { L("stop") },
        version: h
    }), Ru = window, ju = "clarity";

    /* Bootloader */
    function Au() {
        if (void 0 !== Ru) {
            if (Ru[ju] && Ru[ju].v) return;
            var t = Ru[ju] && Ru[ju].q || [];
            Ru[ju] = function() {
                for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                Ru[ju].q.push(t);
            };
            Ru[ju].q = t;
            Ru[ju].v = h;
        }
    }
    Au();
}();
