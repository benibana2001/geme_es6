if (window.reversi === undefined) window.reversi = {};
if (window.reversi.reversi === undefined) window.reversi.reversi = {};

(() => {

    let _t = reversi.reversi;

    // Board Walk
    _t.scnBrd = (fnc) => {
        let w = _t.w, h = _t.h;// マス数を格納
        let max = w * h;// 全マスの合計数
        for (let i = 0; i < max; i++) {
            let x = i % w, y = (i / w) | 0;
            fnc(i, x, y);
        }
    };
})();
