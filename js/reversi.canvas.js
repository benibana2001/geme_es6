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
            {x: 0, y: 0, w: 0, algn: "left"},// Player Score
            {x: 0, y: 0, w: 0, algn: "right"}// Player Score
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

        _cntx.fillStyle = "#fff05b";
        _gcnvs.fllMrgnRct(_cntx, r.x, r.y, _sqSz - mIn, _sqSz - mIn, mOut);

        _cntx.fillStyle = "#086319";
        let rct = _gcnvs.fllMrgnRct(_cntx, r.x, r.y, _sqSz, _sqSz, mOut + mIn);// 緑四角形の情報を保持
        let w = rct.w, h = rct.h;

        // GREEN SAVE
        _cntx.save();
        _cntx.globalAlpha = 0.1;
        _cntx.fillStyle = "#0eb32d";

        // 平行四辺形を二つ描画する
        _cntx.save();
        _cntx.translate(rct.x, rct.y);// 原点を移動 緑四角形の左上角へ
        _gcnvs.fllPth(_cntx, w * 0.4, 0, w * 0.1, h, w * 0.6, h, w * 0.9, 0);
        _cntx.restore();

        _cntx.save();
        _cntx.translate(rct.x, rct.y);// 原点を移動 緑四角形の左上角へ
        _gcnvs.fllPth(_cntx, 0, h * 0.1, w, h * 0.4, w, h * 0.9, 0, h * 0.6);
        _cntx.restore();

        // GREEN RESTORE
        _cntx.restore();

    };

    // Resize Stone
    _t.rszTkn = () => {
        for (let i = 0; i < 2; i++) {
            let tkn = _imgs["_tkn" + i];
            _imgs["tkn" + i] = game.canvas.getScaledImg(
                tkn, 0, 0, tkn.width, tkn.height, _sqSz, _sqSz
            );
        }
    };

    // Draw a Stone
    _t.drwTkn = (x, y, p) => {// p: Each Player
        if (p < 0 || 1 < p) return;// Players are always 1.

        let r = _t.xyToReal(x, y);
        _cntx.drawImage(_imgs["tkn" + p], r.x, r.y);
    };

    _t.drwTknAll = (brd) => {// brd: 盤面の配列
        _rvs.scnBrd((i, x, y) => {
            _t.drwTkn(x, y, brd[i]);
        });
    };

    _t.drwPScrAll = () => {
        _t.drwPScr(0, _rvs.scr[0]);
        _t.drwPScr(1, _rvs.scr[1]);
    };

    _t.drwPScr = (plyr, scr) => {
        let l = _t.l;
        let lScr = l.pScr[plyr];
        let nm = ["あなた", "キャット"][plyr];
        scr = ("0" + scr).substr(-2);

        _cntx.textAlign = lScr.algn;
        _cntx.textBaseline = "middle";
        _cntx.fillStyle = "#000";
        _cntx.font = l.fntSz + "px '" + l.fntFmly + "'";
        _cntx.fillText(nm + scr, lScr.x, lScr.y, lScr.w);
    };

    _t.drwPlyr = () => {
        let l = _t.l;
        let hlfSz = _sqSz / 2;// Tokenの半分サイズ

        _cntx.save();
        _cntx.translate(_t.c.cnvs.width / 2, l.pScr[0].y);

        for (let i = 0; i < 2; i++) {
            let drc = [-1, 1][i];// x軸方向 盤面のセンターを原点と取ったので Playe1, 2はそれぞれプラスマイナスで方向を表せる
            _cntx.fillStyle = i === _rvs.plyr ? "#c00" : "#aaa";

            _cntx.beginPath();
            _cntx.arc(hlfSz * drc, 0, hlfSz, 0, Math.PI * 2, false);
            _cntx.closePath();
            _cntx.fill();

            // Draw Stones
            _cntx.drawImage(_imgs["tkn" + i], hlfSz * drc - hlfSz, - hlfSz);
        }
        _cntx.restore();
    };

    _t.drwEnblSqs = (x, y) => {
		let r = _t.xyToReal(x, y);
		_cntx.save();
		_cntx.fillStyle = "#f00";
		_cntx.globalAlpha = 0.66;
		_gcnvs.fllMrgnRct(_cntx, r.x, r.y, _sqSz, _sqSz, 2);
		_cntx.restore();
	};

    _t.drwEnblSqsAll = () => {
        let sqs = _rvs.enblSqs;
        for (var i = 0; i < sqs.length; i ++) {
            _t.drwEnblSqs(sqs[i].x, sqs[i].y);
        }
    };

    // Generate Cache
    _t.genCsh = () => {
        let c = _imgs["cshBg"];// キャッシュが未作成の場合はundefinedが格納される
        if (!c) {
            c = _imgs["cshBg"] = _gcnvs.genCnvs(_t.c.w, _t.c.h);
        }
        c.cntx.drawImage(_t.c.cnvs, 0, 0);
    };

    // Draw Cache
    _t.drwCsh = () => {
        _cntx.drawImage(_imgs.cshBg.cnvs, 0, 0);
    };
})();
