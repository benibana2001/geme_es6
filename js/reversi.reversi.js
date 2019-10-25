if (window.reversi === undefined) window.reversi = {};
if (window.reversi.reversi === undefined) window.reversi.reversi = {};

(() => {

    let _t = reversi.reversi;

    // 変数の初期化
    _t.w = _t.h = 8;

    // Board Walk
    _t.scnBrd = (fnc) => {
        let w = _t.w, h = _t.h;// マス数を格納
        let max = w * h;// 全マスの合計数
        for (let i = 0; i < max; i++) {
            let x = i % w, y = (i / w) | 0;
            fnc(i, x, y);
        }
    };

    _t.drwPScrAll = () => {
        _t.drwPScr(0, _rvs.scr[0]);
        _t.drwPScr(1, _rvs.scr[1]);
    };

    _t.drwPScr = (plyr, scr) => {
        let l = _t.l;
        let lScr = l.pScr[plyr];
        let nm = ["YOU", "COM"][plyr];
        scr = ("0" + scr).substr(-2);

        _cntx.textAlign = IScr.algn;
        _cntx.textBaseline = "middle";
        _cntx.fillStyle = "#000";
        _cntx.font = l.fntSz + "px '" + l.fntFmly + "'";
        _cntx.fillText(nm + scr, lScr.x, lScr.y, lScr.w);
    };
})();
