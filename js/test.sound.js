"use strict";

// ライブラリ用のオブジェクトの作成
if (window.test === undefined) window.test = {};
if (window.test.sound === undefined) window.test.sound = {};

(() => {
    let _t = test.sound;	// ショートカットの作成

    // 変数の初期化

    // 開始/停止
    _t.plyStp = () => {
        let c = reversi.canvas.c;
        let cnt = 0;
        c.cnvs.addEventListener("click", (e) => {
            if (cnt === 0) resource.sound.play("se0-0");
            else resource.sound.stop("se0-0");
            cnt = 1 - cnt;
        });
    };

    // ループ開始/停止
    _t.plyLoopStp = () => {
        let c = reversi.canvas.c;
        let cnt = 0;
        c.cnvs.addEventListener("click", (e) => {
            if (cnt === 0) resource.sound.playLoop("se0-0");
            else resource.sound.stop("se0-0");
            cnt = 1 - cnt;
        });
    };

    // 開始/一時停止
    _t.plyPause = () => {
        let c = reversi.canvas.c;
        let cnt = 0;
        c.cnvs.addEventListener("click", (e) => {
            if (cnt === 0) resource.sound.play("bgm0");
            else resource.sound.pause("bgm0");
            cnt = 1 - cnt;
        });
    };

    // SE開始
    _t.plySe = () => {
        let c = reversi.canvas.c;
        c.cnvs.addEventListener("click" , (e) => {
            resource.sound.playSE("se0");
        });
    };

    // BGM開始/切り替え
    _t.plyBGM = () => {
        let c = reversi.canvas.c;
        let cnt = 0;
        c.cnvs.addEventListener("click", (e) => {
            if (cnt === 0) resource.sound.playBGM("bgm0");
            else resource.sound.playBGM("bgm1");
            cnt = 1 - cnt;
        });
    };

})();
