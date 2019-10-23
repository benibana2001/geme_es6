if (window.game === undefined) window.game = {};
if (window.game.anim === undefined) window.game.anim = {};

(() => {
    let _t = window.game.anim;

    _t.rqstAnmFrm = (cb) => {
        let id = (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (cb) {
                return window.setTimeout(cb, 1000 / 60);
            }
        )(cb);
        return id;
    };

    _t.cnclAnmFrm = (id) => {
        (window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            window.clearTimeout)
        (id)
    };

    _t.anmId = null;
    _t.updtArr = [];// {nm: name, func; Function}
    _t.tm = {sum: 0, old: null, now: 0, diff: 0};

    _t.strt = () => {
        let anmFnc = () => {
            _t.updt();
            _t.anmId = _t.rqstAnmFrm(anmFnc);
        };
        anmFnc();
    };

    _t.stp = () => {
        if (_t.anmId == null) return;
        _t.cnclAnmFrm(_t.anmId);
    };

    _t.updt = () => {
        _t.tm.now = new Date();
        _t.tm.diff = _t.tm.old == null ? 0 : (_t.tm.now - _t.tm.old);
        _t.tm.sum += _t.tm.diff;
        _t.tm.old = _t.tm.now;

        for (var i = 0; i < _t.updtArr.length; i++) {
            _t.updtArr[i].fnc(_t.tm);
        }
    };

    _t.add = (nm, fnc) => {
        _t.updtArr.push({nm: nm, fnc: fnc});
    };

    _t.rmv = (nm) => {
        for (let i = _t.updtArr.length - 1; i >= 0; i--) {
            if (nm === _t.updtArr[i].nm) _t.updtArr.splice(i, 1);
        }
    };

})();

