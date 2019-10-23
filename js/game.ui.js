if (window.game === undefined) window.game = {};
if (window.game.ui === undefined) window.game.ui = {};

(() => {
    let _t = game.ui;

    let _ga = null;
    let _gcnvs = null;

    _t.c = {};// canvas系オブジェクト
    _t.l = {// レイアウト系オブジェクト
        fntFmly: ""
    };
    _t.fncs = {};

    _t.init = (c, l) => {
        _ga = game.anim;
        _gcnvs = game.canvas;
        Object.assign(_t.c, c);
        Object.assign(_t.l, l);
    };

    _t.addBtn = (nm, txt, x, y, w, h, cb) => {
        let cntx = _t.c.cntx;
        let m = w * 0.05;
        m = m < 4 ? 4 : m;
        let fntSz = (h - m * 2) | 0;
        let isHover = false;
        let scl = _gcnvs.scl;

        _ga.add(nm, () => {
            cntx.save();

            cntx.fillStyle = isHover ? "#222" : "#000";
            _gcnvs.pthRRct(cntx, x, y, w, h, m);
            cntx.fill();

            cntx.fillStyle = isHover ? "#888" : "#fff";
            _gcnvs.pthRRct(cntx, x + 2, y + 2, w - 4, h - 4, m - 2);
            cntx.fill();

            cntx.fillStyle = isHover ? "#fff" : "#000";
            cntx.textAlign = "center";
            cntx.textBaseline = "middle";
            cntx.font = fntSz + "px '" + _t.l.fntFmly + "'j";
            cntx.fillText(txt, x + w * 0.5, y + h * 0.5, w - m * 2);

            cntx.restore();
        });

        let fncClck = (e) => {
            if (game.core.inRng(e.offsetX * scl, e.offsetY * scl, x, y, w, h)) {
                cb();
            }
        };

        let fncMMv = (e) => {
            isHover = game.core.inRng(e.offsetX * scl, e.offsetY * scl, x, y, w, h);
        };
        let fncMlv = (e) => {isHover = false};

        _t.c.cnvs.addEventListener("click", fncClck);
        _t.c.cnvs.addEventListener("mouseleave", fncMlv);
        _t.c.cnvs.addEventListener("mousemove", fncMMv);

        _t.fncs[nm + ":click"] = fncClck;
        _t.fncs[nm + ":mousemove"] = fncMMv;
        _t.fncs[nm + ":mouseleave"] = fncMlv;
    };

    _t.rmvBtn = (nm) => {
        _ga.rmv(nm);

        _t.c.cnvs.removeEventListener("click", _t.fncs[nm + ":click"]);
        _t.c.cnvs.removeEventListener("mouseleave", _t.fncs[nm + ":mouseleave"]);
        _t.c.cnvs.removeEventListener("mousemove", _t.fncs[nm + ":mousemove"]);

        delete _t.fncs[nm + ":click"];
        delete _t.fncs[nm + ":mousemove"];
        delete _t.fncs[nm + ":mouseleave"];
    }

})();
