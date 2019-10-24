if (window.reversi === undefined) window.reversi = {};
if (window.reversi.canvas === undefined) window.reversi.canvas = {};

(() => {
    let _t = reversi.canvas;
    let _gcnvs = game.canvas;
    let _gcr = game.core;
    let _imgs = resource.image.imgs;

    let _rvs = null;

    let _cntx = null;
    let _sqSz = null;

    _t.c = null;// canvas object
    _t.l = {// layout object
        sqSz: 0,//square size
        brdX: 0, brdY: 0,//board
        brdW: 0, brdH: 0,
        pScr: [
            {x: 0, y: 0, w: 0, align: "left"},// Player Score
            {x: 0, y: 0, w: 0, align: "right"}// Player Score
        ],
        fntSz: 0,
        fntFmly: "ArchivoBlack"
    };

    _t.initCnvs = () => {
        _rvs = reversi.reversi;

        // initialize canvas object
        let id = "reversi";
        let sz = _gcr.getFitSz(10, 11);
        let scl = 1;
        if (sz.w <= 600) scl = 2;
        let c = _t.c = _gcnvs.initCnvs(id, sz.w, sz.h, scl);
        _cntx = c.cntx;

        // initialize canvas layout
        let w = c.w, h = c.h, l = _t.l;
        l.sqSz = (c.w * 0.1) | 0;// 人マスの幅は盤面の10%とする
        l.brdW = l.sqSz * _rvs.w;// _rvs.w はマスの数 8を想定
        l.brdH = l.sqSz * _rvs.h;
        l.brdX = ((w - l.brdW) / 2) | 0;// X位置は盤面の中央になるよう計算 ボード描画の基準とする
        l.brdY = l.sqSz * 2;
        l.pScr[0].x = l.brdX;// Playe1のスコアの位置は左端
        l.pScr[1].x = l.brdX + l.brdW;
        l.pScr[0].y = l.pScr[1].y = l.sqSz * 1;
        l.pScr[0].w = l.pScr[1].w = l.brdW * 0.35;
        l.fntSz = l.sqSz * 0.9;
        _sqSz = l.sqSz;
    };

    _t.drwBg = () => {
        _cntx.fillStyle = _cntx.createPattern(_imgs.bg, "repeat");
        _cntx.fillRect(0, 0, _t.c.w, _t.c.h);
    };

    _t.drwSqAll = () => {
        let l = _t.l;

        // 盤面領域の描画
        _cntx.fillStyle = "#000";
        _gcnvs.fllMrgnRct(_cntx, l.brdX, l.brdY, l.brdW, l.brdH, -2);

        // マス描画
        _rvs.scnBrd((i, x, y) => {
            _t.drwSq(x, y);
        });
    };

    // 盤面XYを座標XYに変換
    _t.xyToReal = (x, y) => {
        let rX = _t.l.brdX + _sqSz * x;// 左上の座標に対してxマス分の幅の長さを加算
        let rY = _t.l.brdY + _sqSz * y;
        return {x: rX, y: rY};
    };

    // 一マス描画
    _t.drwSq = (x, y) => {
        let r = _t.xyToReal(x, y);
        let mOut = 1, mIn = 2;// Margin Out, Margin In
        if (_sqSz >= 60) mOut = 2;// 盤面が大きい場合はマージンを広めに設定する

        // マスの描画
        _cntx.fillStyle = "#000";
        _cntx.fillRect(r.x, r.y, _sqSz, _sqSz);// 人マスを黒く塗りつぶし

        _cntx.fillStyle = "#ffb900";
        _gcnvs.fllMrgnRct(_cntx, r.x, r.y, _sqSz, _sqSz, mOut);
    };
})();
