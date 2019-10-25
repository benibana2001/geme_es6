if (window.reversi === undefined) window.reversi = {};
if (window.reversi.reversi === undefined) window.reversi.reversi = {};

(() => {

    let _t = reversi.reversi;

    // 変数の初期化
    _t.BLNK = -1;// 空白マス 石のあるマスはプレイヤー番号
    _t.PTYP = {man: "MAN", com: "COM"};// プレイヤー種類
    _t.DRC = [// 方向
        {x: 0, y: -1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1},
        {x: 0, y: 1}, {x: -1, y: 1}, {x: -1, y: 0}, {x: -1, y: -1}];

    _t.w = _t.h = 8;
    _t.brd = [];// マスの状態を全て格納
    _t.plyr = 0;
    _t.plyrOld = 1;
    _t.pTypArr = [_t.PTYP.man, _t.PTYP.com];// man, com
    _t.put = {};// 最終置き位置のx,y座標
    _t.revTkns = [];// 裏返った石配列 x,yの位置情報を格納したオブジェクトが入る

    _t.scr = [0, 0];// 獲得石数
    _t.enblSqs = [];// 配置可能マス配列
    _t.isEnd = false;// 終了フラグ

    _t.init = () => {
        _t.plyr = 0;
        _t.plyrOld = 1;
        _t.put = {};// 最終置き位置
        _t.revTkns = [];// 裏返った石配列

        _t.scnBrd((i) => {
            _t.brd[i] = _t.BLNK;// 全てのマスを空にする
        });
        // 最初の置石４つ
        _t.brd[_t.XYToI(3, 3)] = _t.brd[_t.XYToI(4, 4)] = 0;
        _t.brd[_t.XYToI(3, 4)] = _t.brd[_t.XYToI(4, 3)] = 1;

        //test.reversi.comSkp(_t);	// デバッグ COM スキップ
        //test.reversi.endWin(_t);	// デバッグ 終了 勝利
        //test.reversi.endLose(_t);	// デバッグ 終了 敗北
        //test.reversi.endDraw(_t);	// デバッグ 終了 引き分け
        //test.reversi.dbgArnd(_t);	// デバッグ 周囲判定
        //test.reversi.dbg1(_t);	// デバッグ1
        //test.reversi.dbg2(_t);	// デバッグ2

        // ゲーム終了判定
        _t.enblSqs = _t.getEnblSqs(_t.brd, _t.plyr);
        let enblSqs2 = _t.getEnblSqs(_t.brd, 1 - _t.plyr);
        _t.isEnd = _t.enblSqs.length === 0 && enblSqs2.length === 0;// どちらも石を置けない

        _t.scr[0] = _t.clcScr(0, _t.brd);// 獲得石数P0
        _t.scr[1] = _t.clcScr(1, _t.brd);// 獲得石数P1
    };

    // Board Walk
    _t.scnBrd = (fnc) => {
        let w = _t.w, h = _t.h;
        let max = w * h;
        for (let i = 0; i < max; i++) {
            let x = i % w, y = (i / w) | 0;
            fnc(i, x, y);
        }
    };

    // XY座標から要素の位置を求める
    _t.XYToI = (x, y) => {
        if (x < 0 || y < 0) return undefined;
        if (x >= _t.w || y >= _t.h) return undefined;
        return (x + y * _t.w) | 0;// 配列位置を求める
    };

    // Board Walk
    _t.scnBrd = (fnc) => {
        let w = _t.w, h = _t.h;// マス数を格納
        let max = w * h;// 全マスの合計数
        for (let i = 0; i < max; i++) {
            let x = i % w, y = (i / w) | 0;
            fnc(i, x, y);
        }
    };

    _t.clcScr = (p, brd) => {
        let cnt = 0;
        _t.scnBrd(function (i) {
            if (brd[i] === p) cnt++// マスの値とプレイヤー番号が等しい時
        });
        return cnt;
    };

    // 1列走査
    _t.scnLn = (brd, x, y, dX, dY) => {
        let ptrn = "", arr = [];// 正規表現のパターンとする
        for (let m = 1; ; m++) {
            let cX = x + dX * m;
            let cY = y + dY * m;
            let i = _t.XYToI(cX, cY);
            if (i === undefined) break;// 盤面からはみ出ている場合

            let sq = brd[i];
            if (sq === _t.BLNK) {
                ptrn += "B"
            } else {
                ptrn += sq
            }
            arr.push({x: cX, y: cY});
        }
        return {ptrn: ptrn, arr: arr};
    };

    // 配置可能マス配列の取得
    _t.getEnblSqs = (brd, plyr) => {
        let res = [];
        let plyrEne = 1 - plyr;
        _t.scnBrd((i, x, y) => {
            if (brd[i] !== _t.BLNK) return;// ブランクでないマスは配置不可能

            for (let j = 0; j < 8; j++) {
                let ln = _t.scnLn(brd, x, y, _t.DRC[j].x, _t.DRC[j].y);
                let re = new RegExp("^" + plyrEne + "+" + plyr);
                if (ln.ptrn.match(re)) {
                    res.push({x: x, y: y});
                    return;
                }
            }
        });
        return res;
    };

    // 石置き処理
    _t.putTkn = (x, y) => {
        // 石置き可能かの判定
        for (let i = 0; i < _t.enblSqs.length; i++) {
            let eSq = _t.enblSqs[i];
            if (eSq.x === x && eSq.y === y) {
                // 石置き後盤面の作成
                _t.put = {x: x, y: y};// 最終置き位置
                _t.execRvrs(x, y, _t.brd, _t.plyr);// 裏返し処理
                nxt();
                return true;// 石置き可能
            }
        }
        return false;// 石置き不能
    };

    // 進行処理
    let nxt = () => {
        _t.plyrOld = _t.plyr;
        _t.plyr = 1 - _t.plyr;

        _t.enblSqs = _t.getEnblSqs(_t.brd, _t.plyr);// 置ける石の配列の取得
        let enblSqs2 = _t.getEnblSqs(_t.brd, 1 - _t.plyr);
        _t.isEnd = _t.enblSqs.length === 0 && enblSqs2.length === 0;// 両者とも石を置けない場合

        _t.scr[0] = _t.clcScr(0, _t.brd);	// 獲得石数P0
        _t.scr[1] = _t.clcScr(1, _t.brd);	// 獲得石数P1
    };

    _t.execRvrs = (x, y, brd, plyr) => {
        _t.revTkns = [];// 裏返った石配列
        let plyrEne = 1 - plyr;

        for (let i = 0; i < 8; i++) {
            let ln = _t.scnLn(brd, x, y, _t.DRC[i].x, _t.DRC[i].y);
            let re = new RegExp("^(" + plyrEne + "+)" + plyr);
            let m = ln.ptrn.match(re);
            if (m == null) continue;// 置けるマスがなかった場合は次の処理へ
            for (let j = 0; j < m[1].length; j++) {
                brd[_t.XYToI(ln.arr[j].x, ln.arr[j].y)] = plyr;
                _t.revTkns.push(ln.arr[j]);
            }
        }
        brd[_t.XYToI(x, y)] = plyr;// 開始マスを変更
    };

    // Skip 手をさせない場合
    _t.skp = () => {
        nxt();
    };

    _t.getPTyp = () => {
        return _t.pTypArr[_t.plyr]
    };

})();
