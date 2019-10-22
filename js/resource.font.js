if (window.resource === undefined) window.resource = {};
if (window.resource.font === undefined) window.resource.font = {};

(() => {
    let _t = resource.font;
    _t.load = (f1, f2) => {
        let c = game.canvas.genCnvs(1, 1);// canvasに描画される文字の横幅を調べるにはcanvasの二次元コンテキストが必要
        let tryCnt = 0;
        let trymax = 30;
        let chckTxt = "abcdefg";
        let fntNm = f1.length > f2.length ? f1 : f2;

        // Webフォントの読み込みを監視する
        let func = (resolve, reject) => {
            let f = () => {
                // 異常系: 試行回数が上限を超えた際はresolve()を実行
                if (tryCnt++ >= trymax) {
                    let msg = "err fnt: " + fntNm;
                    console.log(msg);
                    resolve(msg);
                    return;// setTimeoutを実行しないためにreturnする
                }

                // フォントをcanvasにセットしてwidthを取得。
                c.cntx.font = "32px " + f1;
                let mt1 = c.cntx.measureText(chckTxt).width;
                c.cntx.font = "32px " + f2;// cはチェック用に作成したcanvasのため描画に使用せずGCへと回る
                let mt2 = c.cntx.measureText(chckTxt).width;
                console.log("fnt compare: ", mt1, mt2);
                // 正常系: フォントのwidthが異なる場合はフォントのリロードが完了されたとみなしresolve()を実行
                if (mt1 !== mt2) {
                    let msg = "load fnt: " + fntNm;
                    console.log(msg);
                    resolve(msg);
                    return;// setTimeoutを実行しないためにreturnする
                }
                setTimeout(f, 100);
            };
            //
            f();
        };
        return new Promise(func);
    };

})();
