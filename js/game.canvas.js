if (window.game === undefined) window.game = {};
if (window.game.canvas === undefined) window.game.canvas = {};

(()=> {
    let _t = game.canvas;

    _t.scl = 1;

    _t.genCnvs = (w, h, scl) => {
        if (scl === undefined) {scl = 1}
        let cnvs = document.createElement("canvas");
        console.log(cnvs);
        cnvs.width = w * scl;// メモリ上の画素数
        cnvs.height = h * scl;
        cnvs.innerWidth = w;// Web表示
        cnvs.innerHeight = h;
        let cntx = cnvs.getContext("2d");
        return {
            cnvs: cnvs,
            cntx: cntx,
            w: w * scl,
            h: h * scl
        };
    };

    _t.initCnvs = (id, w, h, scl) => {
        _t.scl = scl;
        let c = _t.genCnvs(w, h, scl);
        let elem = document.getElementById(id);
        elem.appendChild(c.cnvs);
        return c;
    };

    // 元画像 s, 作る画像 d
    _t.getScaledImg = (img, sx, sy, sw, sh, dw, dh) => {
        let rtX = dw / sw;
        let rtY = dh / sh;

        if (rtX >= 0.5 && rtY >= 0.5) {
            let c = _t.genCnvs(dw, dh);
            c.cntx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
            return c.cnvs;// HTML5では画像もキャンバスも区別なくdrawImageで貼り付けられる
        } else {
            // 50%未満
            let w2 = (rtX < 0.5) ? Math.ceil(sw * 0.5) : dw;
            let h2 = (rtY < 0.5) ? Math.ceil(sh * 0.5) : dh;

            let c = _t.genCnvs(w2, h2);
            c.cntx.drawImage(img, sx, sy, sw, sh, 0, 0, w2, h2);
            let newImg = _t.getScaledImg(c.cnvs, 0, 0, w2, h2, dw, dh);
            return newImg;
        }
    };

    _t.pthRRct = (cntx, x, y, w, h, r) => {
        let x2 = x + w;
        let y2 = y + h;

        cntx.beginPath();
        cntx.moveTo(x + r, y);
        cntx.arcTo(x2, y,  x2, y2, r);	// 右上
        cntx.arcTo(x2, y2, x,  y2, r);	// 右下
        cntx.arcTo(x,  y2, x,  y,  r);	// 左下
        cntx.arcTo(x,  y,  x2, y,  r);	// 左上
        cntx.closePath();
    }
})();
