if (window.resource === undefined) window.resource = {};
if (window.resource.image === undefined) window.resource.image = {};

(() => {
    let _t = resource.image;

    _t.imgs = {};

    _t.load = (nm, url) => {
        return new Promise((resolve, reject) => {
            let img = _t.imgs[nm] = new Image();
            img.onload = (() => {
                let msg = "load img: " + nm;
                console.log(msg);
                resolve(msg);
            });
            img.src = url;
        });
    }
})();
