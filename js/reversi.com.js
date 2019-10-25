if (window.reversi === undefined) window.reversi = {};
if (window.reversi.com === undefined) window.reversi.com = {};

(() => {
    let _t = reversi.com;
    let _rvs = null;

    // COMの盤面評価表
    _t.tblOfPnt = [
        64, 1, 8, 4, 4, 8, 1, 64,
        1, 1, 10, 12, 12, 10, 1, 1,
        8, 10, 14, 16, 16, 14, 10, 8,
        4, 12, 16, 1, 1, 16, 12, 4,
        4, 12, 16, 1, 1, 16, 12, 4,
        8, 10, 14, 16, 16, 14, 10, 8,
        1, 1, 10, 12, 12, 10, 1, 1,
        64, 1, 8, 4, 4, 8, 1, 64
    ];

    // COMの指し手を取得
    _t.get = () => {
        _rvs = reversi.reversi;
        let res = comIn(_rvs.brd, _rvs.plyr, _rvs.enblSqs, 0);
        return res.put;
    };

    // COMの内部処理
    let comIn = (brd, plyr, enblSqs, nst) => {
        let put = null;	// 指し手 差し替えていく
        let max = -99999999;	// 現在の最大得点
        let plyrEne = 1 - plyr;
        let DRC = _rvs.DRC;
        for (let i = 0; i < enblSqs.length; i++) {
            let sq = enblSqs[i];// 石を置くことができるマス
            let pnt = _t.tblOfPnt[_rvs.XYToI(sq.x, sq.y)];// 座標から得点を取得

            // COM強化
            // 外周判定 得られる得点を算出
            let arndOut = 0, arndEne = 0;
            for (let j = 0; j < 8; j++) {
                let ln = _rvs.scnLn(brd, sq.x, sq.y, DRC[j].x, DRC[j].y);
                if (ln.ptrn.length === 0) {// 正規表現のパターンが存在しない場合は盤面の端と判断する
                    arndOut++;
                    continue;
                }
                if (DRC[j].x * DRC[j].y !== 0) continue;	// 縦横のみ 斜め方向は処理をスキップ

                // todo: CHECK 正規表現1
                let re = new RegExp("^" + plyrEne + "+(B|$)");
                if (ln.ptrn.match(re)) {
                    arndEne++;
                    continue;
                }

                // 正規表現2
                re = new RegExp("^%e+%p+%e+(B|$)"
                    .replace(/%e/g, plyrEne).replace(/%p/g, plyr));
                if (ln.ptrn.match(re)) {
                    arndEne++;
                    continue;
                }

                // 正規表現3
                re = new RegExp("^%e+%p+$"
                    .replace(/%e/g, plyrEne).replace(/%p/g, plyr));
                if (ln.ptrn.match(re)) {
                    arndEne++;
                }
            }
            if (arndOut === 3 && arndEne === 3) {
                pnt += 32
            }

            // 次手の確認
            let brdCpy = brd.concat();// 盤面を複製 Array.concat()
            _rvs.execRvrs(sq.x, sq.y, brdCpy, plyr);// コピー盤面上に裏返した状態を作成
            let enblSqsNxt = _rvs.getEnblSqs(brdCpy, plyrEne);// 自分が石を置いた状態で、敵が石を置くことのできるマスの配列を取得

            if (nst === 0) {	/* 相手の最大得点を引く */
                let res = comIn(brdCpy, plyrEne, enblSqsNxt, nst + 1);
                pnt -= res.max;// 敵にとって有利に働くマスの得点は下げる
            }
            if (nst === 1) {	/* 全滅の回避 */
                // 次番手の相手（この場合はCOM）が打てないか確認
                if (enblSqsNxt.length === 0) {
                    pnt += 64
                }
            }

            // 最大得点時の更新処理
            if (pnt > max) {
                max = pnt;// より得点の高い点数を指し手として選択
                put = sq;
            }
        }
        return {put: put, max: max};// 指し手と得点の最大値を返す
    };

    // デバッグ盤面出力
    _t.dbgOutBrd = (brd) => {
        console.log(brd.join(",").replace(/-1/g, "-").replace(/(.{16})/g, "$1\n"));
    };
})();
