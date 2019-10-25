if (window.reversi === undefined) window.reversi = {};
if (window.reversi.effect === undefined) window.reversi.effect = {};

(() => {
    let _t = reversi.effect;	// ショートカットの作成
    let _ga = game.anim;		// ショートカットの作成

    let _rvs = null;	// ショートカットの準備
    let _rc = null;		// ショートカットの準備

    // Initialize
    _t.init = function () {
        _rvs = reversi.reversi;	// ショートカットの作成
        _rc = reversi.canvas;	// ショートカットの作成
    };

    // 石置き
    _t.putTkn = () => {
        let tmStrt = _ga.tm.sum;// 処理開始時間
        let tmMax = 250;// エフェクトの処理にかかる時間
        let nm = "putTkn";

        let put = _rvs.put;// 石を置いた位置の座標
        let plyr = _rvs.plyrOld;// すでに手番が写っているので
        let cntx = _rc.c.cntx;
        let img = resource.image.imgs["tkn" + plyr];
        let r = _rc.xyToReal(put.x, put.y);
        let hlfSz = _rc.l.sqSz / 2;

        // アニメ追加
        let f = (resolve, reject) => {
            _ga.add(nm, () => {
                let tmDif = _ga.tm.sum - tmStrt;
                if (tmDif < tmMax) {// Maxを超えたら終了 todo: タイム処理要確認
                    // アニメ処理
                    cntx.save();
                    cntx.translate(r.x + hlfSz, r.y + hlfSz);// 石の回転エフェクトのために原点を石の中央に移動
                    for (let i = 1; i <= 4; i++) {// 残像の描画
                        cntx.globalAlpha = 0.25 * i;// 半透明の度合いを変更
                        cntx.rotate(Math.PI * 0.25 * i * tmDif / tmMax);
                        cntx.drawImage(img, -hlfSz, -hlfSz);
                    }
                    cntx.restore();
                } else {
                    _ga.rmv(nm);
                    resolve();
                }
            });
        };
        return new Promise(f);
    };

    // 盤面変更
    _t.chngBrd = function () {
        let tmStrt = _ga.tm.sum;// 開始時間
        let tmMax = 750;// エフェクト終了までの時間
        let nm = "chngBrd";

        let put = _rvs.put;
        let plyr = _rvs.plyrOld;
        let tkns = _rvs.revTkns;
        let cntx = _rc.c.cntx;
        let hlfSz = _rc.l.sqSz / 2;

        // アニメ追加
        let f = (resolve, reject) => {
            _ga.add(nm, () => {
                let tmDif = _ga.tm.sum - tmStrt;
                let rt = tmDif / tmMax;// アニメーションの進行度合
                let rtSz = Math.sin(Math.PI * rt);// 拡大・縮小のアニメーションに使用 サインカーブの値から 0 < x < 1 の値変化を使用する
                if (tmDif < tmMax) {
                    // アニメ処理
                    _rc.drwTkn(put.x, put.y, plyr);	// 石を置く

                    // 石の裏返りを描画
                    cntx.save();
                    cntx.globalAlpha = rt;// グラデーションで石の裏返り変化を表現
                    for (let i = 0; i < tkns.length; i++) {
                        _rc.drwTkn(tkns[i].x, tkns[i].y, plyr);
                    }
                    cntx.restore();

                    // 演出
                    for (let i = 0; i < tkns.length; i++) {
                        let r = _rc.xyToReal(tkns[i].x, tkns[i].y);// 裏返る石の座標
                        cntx.save();
                        cntx.strokeStyle = game.core.rtRGB(
                            255, 32, 32, 32, 192, 255, rt);// 移行時の色を作成
                        cntx.lineWidth = hlfSz * 0.4;
                        cntx.globalAlpha = 0.8;
                        cntx.translate(r.x + hlfSz, r.y + hlfSz);
                        cntx.rotate(Math.PI * 5 * rt);
                        let sz = hlfSz * 1.5 * rtSz;
                        cntx.strokeRect(-sz, -sz, sz * 2, sz * 2);
                        cntx.restore();
                    }
                } else {
                    _ga.rmv(nm);
                    resolve();
                }
            });
        };
        return new Promise(f);
    };

    _t.msg = (txt) => {
        let tmStrt = _ga.tm.sum;// アニメーション処理の開始時間
        let tmMax = 750;// アニメーションが行われる時間の長さ
        let nm = "msg";

        let cntx = _rc.c.cntx;
        let l = _rc.l;
        let w = _rc.c.w;
        let h = _rc.c.h;
        let cX = w / 2;
        let cY = h / 2;

        let f = (resolve, reject) => {
            _ga.add(nm, () => {
                let tmDif = _ga.tm.sum - tmStrt;// 現在のsumから開始時のtimeを引く
                // todo: 動作 要確認
                let rtX = tmDif * 3 > tmMax ? 0 : 1 - (tmDif * 3 / tmMax);
                let rtA = Math.sin(Math.PI * tmDif / tmMax);

                if (tmDif < tmMax) {
                    // Animation
                    cntx.save();
                    cntx.textAlign = "center";
                    cntx.textBaseline = "middle";
                    cntx.strokeStyle = "#fff";
                    cntx.fillStyle = "#000";
                    cntx.lineWidth = l.fntSz / 10;
                    cntx.font = l.fntSz * 2 + "px '" + l.fntFmly + "'";

                    cntx.globalAlpha = rtA;
                    for (let i = -1; i <= 1; i += 2) {// マイナスとプラス テキスト登場位置 画面右手or左手
                        cntx.strokeText(txt, cX + w * rtX * i, cY);
                        cntx.fillText(txt, cX + w * rtX * i, cY);
                    }
                    cntx.restore();

                } else {// 最大時間を超えたら終了
                    _ga.rmv(nm);
                    console.log("DO RESOLVE");
                    resolve();
                }
            });
        };

        return new Promise(f);
    };

})();
