
_id('inputGo').addEventListener('click', function() {
    this.blur();
    let url = _id('inputUrl').value;
    _id('embedCont').innerHTML = `
    <div id="embedCard">
        <iframe src="https://vid.simplecyber.org/player/?src=${btoa(url)}"
            allow="autoplay; fullscreen"
            frameborder=0
            id="videoPlayer"
        >
    </div>
    `;
    _id('embedCont').innerHTML += `
    <div style="height: 15px"></div>
    <div class="row no-gutters">
        <div class="col-auto-sm">
            <button id="copyUrl" class="button">Copy player URL</button>
        </div>
        <div class="col-auto-sm">
            <button id="copyIframe" class="button">Copy embed code</button>
        </div>
    </div>
    `;
    _id('copyUrl').addEventListener('click', function() {
        copyText(_id('videoPlayer').src);
    });
    _id('copyIframe').addEventListener('click', function() {
        copyText(`<iframe id="videoPlayer" src="https://vid.simplecyber.org/player/?src=${btoa(url)}" allow="autoplay; fullscreen" frameborder=0>`);
    });
});