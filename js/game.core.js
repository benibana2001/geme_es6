if (window.game === undefined) window.game = {};
if (window.game.core === undefined) window.game.core = {};

(function () {
    let _t = game.core;

    _t.ua = {};
    _t.ua.pc = ! window.navigator.userAgent.match(/iphone | ipad | android | windows Phone/i);

    // PRIVATE
    _t.getWinW = () => {
        return window.innerWidth
    };

    // PRIVATE
    _t.getWinH = () => {
        return window.innerHeight
    };

    _t.getFitSz = (w, h) => {
        let winW = _t.getWinW();
        let winH = _t.getWinH();

        let resW, resH;
        if (w / h >= winW / winH) {
            resW = winW;
            resH = (h * winW / w) | 0;
        } else {
            resW = (w * winH / h) | 0;
            resH = winH;
        }
        let obj = {
            w: resW,
            h: resH
        };
        return obj;
    };

    _t.inRng = (cX, cY, x, y, w, h) => {
        if (cX < x || x + w <= cX) return false;
        if (cY < y || y + h <= cY) return false;
        return true;
    };

    _t.rtRGB = (r0, g0, b0, r1, g1, b1, rt) => {
        if (rt < 0) rt = 0;
        if (rt > 1) rt = 1;
        let r2 = (r0 * (1 - rt) + r1 * rt) | 0;
        let g2 = (g0 * (1 - rt) + g1 * rt) | 0;
        let b2 = (b0 * (1 - rt) + b1 * rt) | 0;
        let s = "rgb(" + r2 + ", " + g2 + ", " + b2 + ")";
        return s;
    }
})();
