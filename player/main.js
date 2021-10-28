
// Shorthand function for document.getElementById()
function _id(id) {
    return document.getElementById(id);
}

// Adds leading characters to a string to match a specified length
function addLeadingZeroes(string, newLength = 2, char = "0") {
    return string.toString().padStart(newLength, char);
}

// Returns a formatted interpretation of a number of seconds
function secondsFormat(secs) {
    secs = Math.round(secs);
    let hours = 0;
    let mins = 0;
    if (secs < 60) {
        return `0:${addLeadingZeroes(secs, 2)}`;
    } else if (secs < 3600) {
        mins = Math.floor(secs/60);
        secs = secs-(mins*60);
        return `${mins}:${addLeadingZeroes((secs), 2)}`;
    } else {
        mins = Math.floor(secs/60);
        hours = Math.floor(mins/60);
        mins = mins-(hours*60);
        secs = Math.floor(secs-(mins*60)-(hours*60*60));
        return `${hours}:${addLeadingZeroes((mins), 2)}:${addLeadingZeroes((secs), 2)}`;
    }
}

// Get a query string parameter
function $_GET(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    try {
        return decodeURIComponent(results[2].replace(/\+/g, '%20'));
    } catch {
        console.log(`Failed to decode "${results[2]}"`);
        return null;
    }
}

var vid = _id('vid');

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});

const togglePlayPause = function() {
    if (!window.vidCanPlay) return;
    if (vid.playing) {
        vid.pause();
        showBigIndicator('pause');
    } else {
        vid.play();
        showBigIndicator('play_arrow');
    }
    resetControlTimeout();
}

const toggleMute = function() {
    if (!window.vidCanPlay) return;
    if (vid.muted) {
        vid.muted = false;
        showBigIndicator('volume_up');
    } else {
        vid.muted = true;
        showBigIndicator('volume_off');
    }
    resetControlTimeout();
}

var bigIndicatorTimeout;
const showBigIndicator = function(icon, persist = false) {
    if (!persist && !window.vidCanPlay) return;
    clearTimeout(window.bigIndicatorTimeout);
    _id('bigIndicator').innerHTML = icon;
    _id('bigIndicator').style.opacity = 0;
    _id('bigIndicator').style.display = "";
    window.bigIndicatorTimeout = setTimeout(() => {
        _id('bigIndicator').style.opacity = 1;
        if (!persist) {
            window.bigIndicatorTimeout = setTimeout(() => {
                _id('bigIndicator').style.opacity = 0;
                window.bigIndicatorTimeout = setTimeout(() => {
                    _id('bigIndicator').style.display = "none";
                }, 300);
            }, 300);
        }
    }, 50);
}

_id('playPause').addEventListener('click', function() {
    togglePlayPause();
});
_id('playPauseHitArea').addEventListener('click', function() {
    togglePlayPause();
});
_id('playPauseBig').addEventListener('click', function(e) {
    if (window.controlsVisible) {
        e.stopPropagation();
        togglePlayPause();
    }
});
_id('volume').addEventListener('click', function() {
    toggleMute();
});
_id('fullscreen').addEventListener('click', function() {
    _id('vidContainer').requestFullscreen();
    if (document.fullscreenElement !== null)
        document.exitFullscreen();
    else
        _id('vidContainer').requestFullscreen();
});
document.onfullscreenchange = function() {
    if (document.fullscreenElement !== null)
        _id('fullscreen').innerHTML = 'fullscreen_exit';
    else
        _id('fullscreen').innerHTML = 'fullscreen';
}
_id('backward').addEventListener('click', function() {
    vid.currentTime = (vid.currentTime-10);
    showBigIndicator('replay_10');
});
_id('forward').addEventListener('click', function() {
    vid.currentTime = (vid.currentTime+10);
    vid.currentTime = (vid.currentTime-0.25);
    showBigIndicator('forward_10');
});
vid.addEventListener('durationchange', function() {
    _id('duration').innerHTML = secondsFormat(vid.duration);
    _id('progressSliderInner').max = Math.ceil(vid.duration);
});
vid.addEventListener('timeupdate', function() {
    if (!window.vidScrubbing) {
        _id('progressTime').innerHTML = secondsFormat(vid.currentTime);
        _id('progressFakeFront').style.width = `${(Math.round(vid.currentTime)/Math.ceil(vid.duration))*100}%`;
        _id('progressSliderInner').value = Math.round(vid.currentTime);
    }
});
var vidScrubbing = false;
var vidScrubbingState;
_id('progressSliderInner').addEventListener('mousedown', function() {
    vidScrubbingState = vid.playing;
    window.vidScrubbing = true;
    vid.pause();
});
_id('progressSliderInner').addEventListener('input', function() {
    vid.currentTime = this.value;
    _id('progressTime').innerHTML = secondsFormat(this.value);
    _id('progressFakeFront').style.width = `${(Math.round(this.value)/Math.ceil(vid.duration))*100}%`;
    resetControlTimeout();
});
_id('progressSliderInner').addEventListener('mouseup', function() {
    window.vidScrubbing = false;
    if (vidScrubbingState) vid.play();
});
vid.addEventListener('progress', function() {
    let ranges = vid.buffered.length;
    let duration = vid.duration;
    for (i = 0; i < ranges; i++) {
        let start = vid.buffered.start(i);
        let end = vid.buffered.end(i);
        //console.log(`Buffer ${i} starts at ${start} and ends at ${end}`);
        let html = '';
        html += `<div class="bufferPoint" style="left: ${(start/duration)*100}%; width: ${((end-start)/duration)*100}%"></div>`;
        _id('bufferPoints').innerHTML = html;
    }
});
var controlsTimeout;
var controlsVisible = true;
const resetControlTimeout = function(timeout = 3000) {
    clearTimeout(controlsTimeout);
    _id('controls').classList.add('visible');
    window.controlsVisible = true;
    window.controlsTimeout = setTimeout(() => {
        if (vid.playing) _id('controls').classList.remove('visible');
        window.controlsVisible = false;
    }, timeout);
}
_id('playPauseHitArea').addEventListener('mousemove', function() {
    resetControlTimeout();
});
_id('controlsMobile').addEventListener('click', function() {
    if (window.controlsVisible) {
        resetControlTimeout(100);
    } else {
        resetControlTimeout();
    }
});
vid.addEventListener('error', function() {
    window.vidCanPlay = false;
    showBigIndicator('videocam_off', true);
});
vid.addEventListener('canplay', function() {
    document.title = decodeURIComponent(vid.src.substring(vid.src.lastIndexOf('/')+1));
    if ($_GET('start') > 0) vid.currentTime = $_GET('start');
    if ($_GET('autoplay') !== null) vid.play();
});

//_id('vidContainer').addEventListener('keydown', function(event) {
document.addEventListener('keydown', function(event) {
    resetControlTimeout();
    switch (event.code) {
        case 'Space':
            togglePlayPause();
            break;
        case 'ArrowLeft':
            _id('backward').click();
            break;
        case 'ArrowRight':
            _id('forward').click();
            break;
        case 'KeyF':
            _id('fullscreen').click();
            break;
        case 'KeyM':
            _id('volume').click();
            break;
    }
});

var playPauseInterval = setInterval(() => {
    if (vid.playing) {
        _id('playPause').innerHTML = 'pause';
        _id('playPauseBig').innerHTML = 'pause';
    } else if (vid.ended) {
        _id('playPause').innerHTML = 'replay';
        _id('playPauseBig').innerHTML = 'replay';
    } else {
        _id('playPause').innerHTML = 'play_arrow';
        _id('playPauseBig').innerHTML = 'play_arrow';
    }

    if (vid.muted) {
        _id('volume').innerHTML = 'volume_off';
    } else {
        _id('volume').innerHTML = 'volume_up';
    }
}, 250);

var vidCanPlay = false;
if ($_GET('src')) {
    vidCanPlay = true;
    try {
        vid.src = atob($_GET('src')).replace('"', '');
        vid.load();
    } catch (error) {
        var vidCanPlay = false;
    }
}
if (!vidCanPlay) showBigIndicator('block', true);

if ($_GET('script')) {
    try {
        let script = atob($_GET('script')).replace('"', '');
        _id('body').insertAdjacentHTML('beforeend', `
            <script src="${script}"></script>
        `);
    } catch (error) {}
}