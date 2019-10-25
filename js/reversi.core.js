if (window.reversi === undefined) window.reversi = {};
if (window.reversi.core === undefined) window.reversi.core = {};

(() => {
    let _t = reversi.core;		// ショートカットの作成
    let _snd = resource.sound;	// ショートカットの準備

    // 同レベルのライブラリは初期化時にショートカットを作成
    let _rvs = null;
    let _rc = null;
    let _re = null;

    _t.lck = false;// クリックの排他処理

    _t.init = () => {

        _rvs = reversi.reversi;
        _rc = reversi.canvas;
        _re = reversi.effect;

        let r = [];
        r.push(resource.image.load("bg", "img/bg.png"));
        r.push(resource.image.load("_tkn0", "img/token0.png"));
        r.push(resource.image.load("_tkn1", "img/token1.png"));
        r.push(resource.sound.load("se0", "snd/se0", "se"));
        r.push(resource.sound.load("se1", "snd/se1", "se"));
        r.push(resource.sound.load("bgm0", "snd/bgm0"));
        r.push(resource.sound.load("bgm1", "snd/bgm1"));
        r.push(resource.sound.load("win", "snd/win"));
        r.push(resource.sound.load("lose", "snd/lose"));
        r.push(resource.font.load("serif ", "ArchivoBlack, serif"));

        Promise.all(r).then(() => {
            _rc.initCnvs();
            _rc.rszTkn();
            _re.init();
            _t.initClck();
            _t.strt();
            game.anim.strt();
            game.anim.add("updtCnvs", () => {
                _t.updtCnvs(false);
            });
            game.ui.init(_rc.c, {fntFmly: "ArchivoBlack"});

            // 開始表示
            _t.lck = true;// スタート開始前は盤面の置石をロック
            _t.btnStrt("Start");// スタートボタン
            _snd.playBGM("bgm1");
        });
    };

    _t.strt = () => {
        _rvs.init();		// 盤面初期化
        _t.updtCnvs(true);	// キャンバス更新
        _t.lck = false;		// クリックのロック解除
        _snd.playBGM("bgm0");
    };

    _t.updtCnvs = (needUpdt) => {
        if (needUpdt) {
            // 再描画必要
            _rc.drwBg();
            _rc.drwSqAll();
            _rc.drwTknAll(_rvs.brd);
            _rc.drwEnblSqsAll();
            _rc.drwPScrAll();
            _rc.drwPlyr();
            _rc.genCsh();
        } else {
            _rc.drwCsh();
        }
    };

    _t.btnStrt = (txt) => {
        let nm = "btnStrt";
        let w = _rc.c.w;
        let h = _rc.c.h;
        let bW = _rc.l.sqSz * 4 * 1.2;
        let bH = _rc.l.sqSz * 1.3;
        let bX = (w - bW) / 2;
        let bY = (h - bH) / 2;

        game.ui.addBtn(nm, txt, bX, bY, bW, bH, () => {
            game.ui.rmvBtn(nm);
            _t.strt();// START
        });
    };

    // クリック初期化
    _t.initClck = function () {
        let c = _rc.c;
        let l = _rc.l;
        let rng = game.core.inRng;

        c.cnvs.addEventListener("click", (e) => {
            let x = e.offsetX * game.canvas.scl;
            let y = e.offsetY * game.canvas.scl;

            // Check in the board or not
            if (!rng(x, y, l.brdX, l.brdY, l.brdW, l.brdH)) {
                return
            }

            // 何マス目かを計算
            let sqX = ((x - l.brdX) / l.sqSz) | 0;
            let sqY = ((y - l.brdY) / l.sqSz) | 0;
            _t.clckBrd(sqX, sqY);
        });
    };
})();
