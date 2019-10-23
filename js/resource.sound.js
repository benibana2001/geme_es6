if (window.resource === undefined) window.resource = {};
if (window.resource.sound === undefined) window.resource.sound = {};

(() => {
    let _t = resource.sound;

    _t.canUse = null;
    _t.canOgg = false;
    _t.canMp3 = false;
    _t.ext = "";
    _t.timeout = 3000;

    _t.snds = {};// 読み込んだオブジェクトを格納
    _t.seMax = 8;// SEの同時発音数
    _t.bgmNow = null;// 現在再生中のbgm名

    // アロー関数の場合は危険か
    let Sound = function () {
        this.audio = null;// サウンドファイルを登録
        this.seNow = 0;// SEの場合 現在流しているSEの番号
    };

    _t.init = () => {
        if (_t.canUse != null) return;

        try {
            // Audioの使用可否をチェック
            let audio = new Audio("");
            _t.canOgg = audio.canPlayType("audio/ogg") === "maybe";
            _t.canMp3 = audio.canPlayType("audio/mpeg") === "maybe";
        } catch (e) {
        }
        _t.canUse = _t.canOgg || _t.canMp3;
        _t.ext = _t.canOgg ? ".ogg" : (_t.canMp3 ? ".mpe" : "");
        if (!game.core.ua.pc) _t.canUse = false;//モバイル時は不可
    };

    _t.load = (nm, url, type) => {
        _t.init();

        let f = (resolve, reject) => {
            if (_t.canUse === false) {
                // 音声が使用できない場合
                let msg = "cannot use snd: " + nm;
                console.log(msg);
                resolve(msg);
            }

            if (type !== "se") {
                // 音楽(BGM)の場合
                let id = setTimeout(() => {
                    // タイムアウト発生時の処理
                    _t.snds[nm].audio = undefined;
                    let msg = "timeout snd: " + nm;
                    console.log(msg);
                    resolve(msg);
                }, _t.timeout);

                _t.snds[nm] = new Sound();
                _t.snds[nm].audio = new Audio("");
                _t.snds[nm].audio.preload = "auto";// サウンドファイルの自動読み込みをON
                _t.snds[nm].audio.src = url + _t.ext;

                // プレロード準備完了時の処理
                // todo: resource.sound.js:66 Uncaught (in promise) TypeError: eAudio.addEventListener is not a function
                let eAudio = document.getElementsByTagName(_t.snds[nm].audio);
                eAudio.addEventListener("error", (event) => {
                    _t.snds[nm].audio = undefined;
                    let msg = "err snd: " + nm;
                    console.log(msg);
                    resolve(msg);
                    clearTimeout(id);
                });
                eAudio.addEventListener("canplaythrough", (event) => {
                    let msg = "load snd: " + nm;
                    console.log(msg);
                    resolve(msg);
                    clearTimeout(id);
                })
            } else {
                // SEの場合は、SEが重複再生可能なように複数読み込んでおく
                _t.snds[nm] = new Sound();
                let arr = [];
                for (let i = 0; i < _t.seMax; i++) {
                    arr.push(_t.load(nm + "-" + i, url));
                }
                Promise.all(arr).then(() => {
                    resolve();
                });
            }
        };
        return new Promise(f);
    };

    _t.chckUnbl = (nm) => {
        if (_t.canUse === false) return true;
        if (_t.snds[nm] === undefined) return true;
        return false;
    };

    _t.rstCurTm = (aud, cmd) => {
        if (cmd) aud[cmd]();
        aud.currentTime = 0;
        // オーディをの頭出しが聞かない場合はloadを実行
        if (aud.currentTime !== 0) aud.load();
    };

    _t.play = (nm, cb) => {
        if (_t.chckUnbl(nm)) return;

        let aud = _t.snds[nm].audio;
        // 巻き戻し
        if (aud.currentTime >= aud.duration) {
            _t.rstCurTm(aud, "pause"); // 一度停止をしてからリセット
        }
        // ループしないようにしておく
        if (typeof aud.loop == "boolean") aud.loop = false;// デバイスによりloopの値が異なる
        // 再生終了時に行うコールバックの設定
        let eAudio = document.getElementsByTagName(aud);
        eAudio.removeEventListener("ended");
        if (typeof cb == "function") {
            eAudio.addEventListener("ended", cb);
        }
        aud.play();
    };

    _t.playLoop = (nm) => {
        if (_t.chckUnbl(nm)) return;

        let aud = _t.snds[nm].audio;

        if (aud.currentTime >= aud.duration) {
            _t.rstCurTm(aud, "pause");
        }

        if (typeof aud.loop == "boolean") {
            aud.loop = true;
        } else {
            let eAudio = document.getElementsByTagName(audio);
            eAudio.removeEventListener("ended");
            eAudio.addEventListener("ended", () => {
                _t.rstCurTm(aud, "play");
            })
        }
        aud.play();
    };

    _t.pause = (nm) => {
        if (_t.chckUnbl(nm)) return;
        _t.snds[nm].audio.pause();
    };

    _t.stop = (nm) => {
        if (_t.chckUnbl(nm)) return;

        let aud = _t.snds[nm].audio;
        let eAudio = document.getElementsByTagName(aud);
        eAudio.removeEventListener("ended");
        _t.rstCurTm(aud, "pause");// 再生位置を0にする
    };

    _t.vol = (nm, vol) => {
        if (_t.chckUnbl(nm)) return;
        _t.snds[nm].audio.volume = vol;// 0 ~ 1.0
    };

    _t.playSE = (nm) => {
        if (_t.chckUnbl(nm)) return;

        let snd = _t.snds[nm];
        _t.play(nm + "-" + snd.seNow);
        snd.seNow = (snd.seNow + 1) % _t.seMax;
    };

    _t.playBGM = (nm, cb) => {
        if (_t.chckUnbl(nm)) return;

        if (nm !== _t.bgmNow) {
            _t.stop(_t.bgmNow);
        }

        if (cb) {
            _t.play(nm, cb)
        } else _t.playLoop(nm);
    }
})();
