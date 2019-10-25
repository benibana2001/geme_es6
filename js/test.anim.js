"use strict";

// ライブラリ用のオブジェクトの作成
if (window.test === undefined) window.test = {};
if (window.test.anim === undefined) window.test.anim = {};

(() => {
	let _t = test.anim;	// ショートカットの作成

	// 変数の初期化

	// テスト1
	_t.tst1 = function() {
		game.anim.add("dbg1", (tm) => {
			console.log(tm.dif);
		});
		game.anim.add("dbg2", (tm) => {
			let c = reversi.canvas.c;
			c.cntx.save();
			c.cntx.translate(tm.sum / 20 % 10, tm.sum / 20 % 10);

			reversi.canvas.drwTkn(3, 3, 0);
			reversi.canvas.drwTkn(4, 3, 1);
			reversi.canvas.drwTkn(3, 4, 1);
			reversi.canvas.drwTkn(4, 4, 0);

			c.cntx.restore();
		});
		game.anim.strt();

		setTimeout(() => {game.anim.rmv("dbg1")}, 1000);
		setTimeout(() => {game.anim.stp()}, 2000);
	};

})();
