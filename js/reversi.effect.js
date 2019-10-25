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
