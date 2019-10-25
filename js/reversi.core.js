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
        // r.push(resource.sound.load("bgm0", "snd/bgm0"));
        // r.push(resource.sound.load("bgm1", "snd/bgm1"));
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

    // 盤面クリック時の処理
    _t.clckBrd = (x, y) => {
        if (_t.lck) return;// ロック時は何もしない
        if (_rvs.getPTyp() === _rvs.PTYP.com) return;// COMプレイ時は何もしない

        // 石置き処理
        let res = _rvs.putTkn(x, y);// 石が置けない場合はfalseが戻る
        if (res) {
            _t.lck = true;// クリックをロック
            _t.doRev();// 裏返し処理
        }
    };

    // 裏返し処理
    _t.doRev = () => {
        _snd.playSE("se0");
        _re.putTkn().then(() => {
            _t.playSERev();// 裏返りSE 裏返った石の数で効果音は変わる
            return _re.chngBrd();
        }).then(() => {
            _t.updt();
        });
    };

    // 裏返しSE
    _t.playSERev = () => {
        let max = _rvs.revTkns.length;// 裏返る石の数
        if (max > _snd.seMax) max = _snd.seMax;// 同時発音数のチェック
        for (let i = 0; i < max; i ++) {// 効果音の再生時間をずらす
            setTimeout(() => {
                _snd.playSE("se1");
            }, 50 * i);
        }
    };

    // 更新
    _t.updt = () => {
        _t.updtCnvs(true);// キャンバス更新 キャッシュを使用せず再描画

        // 終了判定
        if (_rvs.isEnd) {
            // 結果計算
            let msg = "LOSE", bgm = "lose";
            if (_rvs.scr[0] >  _rvs.scr[1]) msg = "WIN"; bgm = "win";
            if (_rvs.scr[0] === _rvs.scr[1]) msg = "DRAW";

            // エフェクト
            _re.msg("END").then(() => {
                // 終了時サウンド
                _snd.playBGM(bgm,() => {
                    _snd.playBGM("bgm1");
                    _t.btnStrt("Start");	// 開始ボタン
                });
                _re.msg(msg);// メッセージ表示(WIN or LOSE)
            });
            return;
        }

        // スキップが必要か確認
        if (_rvs.enblSqs.length === 0) {
            _re.msg("SKIP").then(() => {
                _rvs.skp();
                _t.updt();
            });
            return;
        }

        // COMか確認
        if (_rvs.getPTyp() === _rvs.PTYP.com) {
            setTimeout(() => {
                // 石置き処理
                let put = reversi.com.get();// COMの指し手を取得
                _rvs.putTkn(put.x, put.y);
                _t.doRev();// 裏返し処理
            }, 250);
            return;
        }

        // スキップやCOMがなければロック解除
        _t.lck = false;
    };
})();
