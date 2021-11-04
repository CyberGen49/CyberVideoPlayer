
// Check if we're in an iframe
var isIframe = (window.location !== window.parent.location);

// Initialize settings stored in LocalStorage
var data = JSON.parse(localStorage.getItem('settings'));
if (data === null) data = {};
// Initialize saved video progress stored in LocalStorage
var progSave = JSON.parse(localStorage.getItem('progress'));
if (progSave === null) progSave = {};
// Prune old entries from video progress
var progSaveKeys = Object.keys(progSave);
var progSaveEntriesDeleted = 0;
progSaveKeys.forEach((k) => {
    let p = progSave[k];
    if ((Date.now()-p.created) > (1000*60*60*24*7)) {
        delete progSave[k];
        progSaveEntriesDeleted++;
    }
});
if (progSaveEntriesDeleted > 0) {
    console.log(`${progSaveEntriesDeleted} old saved progress entries have been deleted`);
}

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

// Get element coordinates and dimensions
function _getX(id) {
    return document.getElementById(id).getBoundingClientRect().x;
}
function _getY(id) {
    return document.getElementById(id).getBoundingClientRect().y;
}
function _getX2(id) {
    return document.getElementById(id).getBoundingClientRect().right;
}
function _getY2(id) {
    return document.getElementById(id).getBoundingClientRect().bottom;
}
function _getW(id) {
    return document.getElementById(id).getBoundingClientRect().width;
}
function _getH(id) {
    return document.getElementById(id).getBoundingClientRect().height;
}

// Returns the value of a CSS media query
function mediaQuery(query) {
    return window.matchMedia(query).matches;
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

// Show a dropdown menu
var timeoutShowDropdown = [];
var timeoutHideDropdown = [];
var dropdownVisible = false;
function showDropdown(id, data, anchorId = null) {
    resetControlTimeout()
    // Create the dropdown element
    if (!_id(`dropdown-${id}`)) {
        _id("body").insertAdjacentHTML('beforeend', `
            <div id="dropdownArea-${id}" class="dropdownHitArea" style="display: none;"></div>
            <div id="dropdown-${id}" class="dropdown acrylic" style="display: none; opacity: 0">
        `);
        _id(`dropdownArea-${id}`).addEventListener("click", function() { hideDropdown(id) });
        _id(`dropdownArea-${id}`).addEventListener("contextmenu", function(e) { e.preventDefault(); });
    }
    // Set initial element properties
    _id(`dropdownArea-${id}`).style.display = "none";
    _id(`dropdown-${id}`).classList.remove("ease-in-out-100ms");
    _id(`dropdown-${id}`).style.display = "none";
    _id(`dropdown-${id}`).style.opacity = 0;
    _id(`dropdown-${id}`).style.marginTop = "5px";
    _id(`dropdown-${id}`).style.height = "";
    _id(`dropdown-${id}`).style.top = -1000;
    _id(`dropdown-${id}`).style.left = -1000;
    _id(`dropdown-${id}`).innerHTML = "";
    // Add items to the dropdown
    data.forEach(item => {
        switch (item.type) {
            case 'header':
                _id(`dropdown-${id}`).insertAdjacentHTML('beforeend', `
                    <div class="dropdownHeader">${item.text}</div>
                `);
                break;
            case 'item':
                _id(`dropdown-${id}`).insertAdjacentHTML('beforeend', `
                    <div id="dropdown-${id}-${item.id}" class="dropdownItem row no-gutters">
                        <div id="dropdown-${id}-${item.id}-icon" class="col-auto dropdownItemIcon material-icons">${item.icon}</div>
                        <div class="col dropdownItemName">${item.text}</div>
                    </div>
                `);
                if (item.disabled) {
                    _id(`dropdown-${id}-${item.id}`).classList.add("disabled");
                } else {
                    _id(`dropdown-${id}-${item.id}`).addEventListener("click", item.action);
                    _id(`dropdown-${id}-${item.id}`).addEventListener("click", function() { hideDropdown(id) });
                }
                break;
            case 'sep':
                _id(`dropdown-${id}`).insertAdjacentHTML('beforeend', `
                    <div class="dropdownSep"></div>
                `);
                break;
        }
    });
    // Show the dropdown
    console.log(`Showing dropdown "${id}"`);
    _id(`dropdownArea-${id}`).style.display = "block";
    _id(`dropdown-${id}`).style.display = "block";
    // Position the dropdown
    let windowW = window.innerWidth;
    let windowH = window.innerHeight;
    let elW = _getW(`dropdown-${id}`);
    let elH = _getH(`dropdown-${id}`);
    let anchorX = window.mouseX;
    let anchorY = window.mouseY;
    if (anchorId !== null) {
        anchorX = _getX(anchorId);
        anchorY = _getY(anchorId);
    }
    // Adaptive X
    if (windowW <= elW) anchorX = 0;
    else if ((anchorX+elW) > (windowW-25)) {
        anchorX = (anchorX-((anchorX+elW)-(windowW-25)));
    }
    // Adaptive Y
    if (anchorX < 0) anchorX = 0;
    if (windowH <= elH) anchorY = 0;
    else if ((anchorY+elH) > (windowH-25)) {
        anchorY = (anchorY-((anchorY+elH)-(windowH-25)));
    }
    if (anchorY < 0) anchorY = 0;
    // Set CSS
    _id(`dropdown-${id}`).style.top = `${anchorY}px`;
    _id(`dropdown-${id}`).style.left = `${anchorX}px`;
    console.log(`${elW} - ${elH} -- ${(windowW-anchorX)}`);
    // Check for height and scrolling
    let elY = _getY(`dropdown-${id}`);
    if ((elY+elH) > windowH-20) {
        _id(`dropdown-${id}`).style.height = `calc(100% - ${elY}px - 20px)`;
    } else {
        _id(`dropdown-${id}`).style.height = "";
    }
    try {
        clearTimeout(window.timeoutShowDropdown[id]);
    } catch (error) {}
    window.timeoutShowDropdown[id] = setTimeout(() => {
        _id(`dropdown-${id}`).classList.add("ease-in-out-100ms");
        _id(`dropdown-${id}`).style.opacity = 1;
        _id(`dropdown-${id}`).style.marginTop = "10px";
        window.dropdownVisible = true;
    }, 50);
    return `dropdown-${id}`;
}

// Hide an existing dropdown
function hideDropdown(id) {
    resetControlTimeout()
    console.log(`Hiding dropdown "${id}"`);
    _id(`dropdownArea-${id}`).style.display = "none";
    _id(`dropdown-${id}`).style.marginTop = "15px";
    _id(`dropdown-${id}`).style.opacity = 0;
    window.dropdownVisible = false;
    try {
        clearTimeout(window.timeoutHideDropdown[id]);
    } catch (error) {}
    window.timeoutHideDropdown[id] = setTimeout(() => {
        _id(`dropdown-${id}`).style.display = "none";
    }, 200);
}

// Get the video object
var vid = _id('vid');

// Add a 'playing' attribute to the video object
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});

// Toggles the video between playing and paused
// We throw some extra timeouts in here to make extra sure that things actually happen
const togglePlayPause = function() {
    if (!window.vidCanPlay) return;
    if (vid.playing) {
        vid.pause();
        setTimeout(() => { vid.pause(); }, 50);
        showBigIndicator('pause');
    } else {
        vid.play();
        setTimeout(() => { vid.play(); }, 50);
        showBigIndicator('play_arrow');
    }
    resetControlTimeout();
}

// Toggles mute
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

// Flashes a big centered icon
var bigIndicatorTimeout;
const showBigIndicator = function(icon, persist = false, id = 'bigIndicator') {
    if (!persist && !window.vidCanPlay) return;
    clearTimeout(window.bigIndicatorTimeout);
    _id(id).innerHTML = icon;
    _id(id).style.opacity = 0;
    _id(id).style.display = "";
    window.bigIndicatorTimeout = setTimeout(() => {
        _id(id).style.opacity = 1;
        if (!persist) {
            window.bigIndicatorTimeout = setTimeout(() => {
                _id(id).style.opacity = 0;
                window.bigIndicatorTimeout = setTimeout(() => {
                    _id(id).style.display = "none";
                }, 300);
            }, 300);
        }
    }, 50);
}

// Handle hiding and showing the controls
var controlsTimeout;
var controlsVisible = true;
const resetControlTimeout = function(timeout = 3000) {
    clearTimeout(controlsTimeout);
    _id('body').style.cursor = 'initial';
    _id('controls').classList.add('visible');
    _id('loadingSpinner').style.paddingBottom = '';
    // This small timeout makes sure other functions have time to react
    // to controls not being visible before they're marked as visible
    setTimeout(() => {
        window.controlsVisible = true;
    }, 50);
    window.controlsTimeout = setTimeout(() => {
        if (vid.playing && !window.dropdownVisible) {
            _id('body').style.cursor = 'none';
            _id('controls').classList.remove('visible');
            _id('loadingSpinner').style.paddingBottom = '0px';
            window.controlsVisible = false;
        }
    }, timeout);
}

// Update stored settings
const updateSettingsStore = function() {
    localStorage.setItem('settings', JSON.stringify(window.data));
    console.log('Saved updated settings to LocalStorage');
}

// Update stored video progress
const updateProgStore = function() {
    if ($_GET('noRestore') === null) {
        if (!vid.ended) {
            window.progSave[vid.src] = {};
            window.progSave[vid.src].time = Math.round(vid.currentTime);
            window.progSave[vid.src].created = Date.now();
        } else {
            delete window.progSave[vid.src];
            console.log(`Deleted video progress because the video has ended`);
        }
        localStorage.setItem('progress', JSON.stringify(window.progSave));
        console.log(`Saved video progress data`);
        window.lastTime = vid.currentTime;
    }
}

// Do this stuff when the video can start playing
var started = false;
vid.addEventListener('canplay', function() {
    document.title = decodeURIComponent(vid.src.substring(vid.src.lastIndexOf('/')+1));
    if (!window.started) {
        if ($_GET('start') > 0) {
            vid.currentTime = $_GET('start');
        } else if ($_GET('noRestore') === null) {
            // If this video has saved progress
            let savedProg = (typeof progSave[vid.src] !== 'undefined');
            // If the video is longer than 5 minutes
            let notTooShort = (vid.duration > (60*5));
            // Put all the conditions together
            if (savedProg && notTooShort) {
                // Restore the video's progress
                vid.currentTime = progSave[vid.src].time;
                console.log(`Video progress restored to ${vid.currentTime}`);
            }
        }
        window.started = true;
    }
    _id('loadingSpinner').style.opacity = 0;
});
// Do this stuff when the video's duration changes
vid.addEventListener('durationchange', function() {
    _id('duration').innerHTML = secondsFormat(vid.duration);
    _id('progressSliderInner').max = Math.ceil(vid.duration);
    window.top.postMessage({'duration': vid.duration}, '*');
    window.vidCanPlay = true;
});
// Do this stuff when the video's progress changes
var lastTime = 0;
vid.addEventListener('timeupdate', function() {
    if (!window.vidScrubbing) {
        _id('progressTime').innerHTML = secondsFormat(vid.currentTime);
        _id('progressFakeFront').style.width = `${(Math.ceil(vid.currentTime)/Math.ceil(vid.duration))*100}%`;
        _id('progressSliderInner').value = Math.ceil(vid.currentTime);
    }
    if (vid.currentTime > (window.lastTime+3)
      || vid.currentTime < (window.lastTime-3))
        updateProgStore();
    window.top.postMessage({'time': vid.currentTime}, '*');
});
// Do this stuff when the video buffers more data
vid.addEventListener('progress', function() {
    let ranges = vid.buffered.length;
    let duration = vid.duration;
    let html = '';
    for (i = 0; i < ranges; i++) {
        let start = vid.buffered.start(i);
        let end = vid.buffered.end(i);
        //console.log(`Buffer ${i} starts at ${start} and ends at ${end}`);
        html += `<div class="bufferPoint" style="left: ${(start/duration)*100}%; width: ${((end-start)/duration)*100}%"></div>`;
    }
    _id('bufferPoints').innerHTML = html;
});
// Do this stuff if the video fails to load
vid.addEventListener('error', function() {
    window.vidCanPlay = false;
    showBigIndicator('videocam_off', true);
    _id('playPauseBig').innerHTML = 'videocam_off';
    _id('loadingSpinner').style.opacity = 0;
    window.top.postMessage({'failed': true}, '*');
    resetControlTimeout();
});
// Do this stuff when the video ends
vid.addEventListener('ended', function() {
    updateProgStore();
});

// Handle play/pause buttons
_id('playPause').addEventListener('click', function() {
    resetControlTimeout();
    if (!window.controlsVisible) return;
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

// Handle the volume button
_id('volume').addEventListener('click', function() {
    resetControlTimeout();
    if (!window.controlsVisible) return;
    toggleMute();
});

// Handle toggling fullscreen
_id('fullscreen').addEventListener('click', function() {
    resetControlTimeout();
    if (!window.controlsVisible) return;
    if (document.fullscreenElement !== null)
        document.exitFullscreen();
    else
        document.documentElement.requestFullscreen({ navigationUI: 'hide' });
});
document.onfullscreenchange = function() {
    if (document.fullscreenElement !== null)
        _id('fullscreen').innerHTML = 'fullscreen_exit';
    else
        _id('fullscreen').innerHTML = 'fullscreen';
}

// Handle jumping back and forward in time
_id('backward').addEventListener('click', function() {
    resetControlTimeout();
    _id('progressTime').innerHTML = secondsFormat(vid.currentTime-10);
    vid.currentTime = (vid.currentTime-10);
    showBigIndicator('replay_10');
    if (mediaQuery("(pointer: coarse)"))
        showBigIndicator('replay_10', false, 'bigIndicatorSmLeft');
});
_id('forward').addEventListener('click', function() {
    resetControlTimeout();
    _id('progressTime').innerHTML = secondsFormat(vid.currentTime+10);
    vid.currentTime = (vid.currentTime+10);
    if (vid.currentTime == vid.duration)
        vid.currentTime = (vid.currentTime-0.25);
    showBigIndicator('forward_10');
    if (mediaQuery("(pointer: coarse)"))
        showBigIndicator('forward_10', false, 'bigIndicatorSmRight');
});

// Handle the progress slider
var vidScrubbing = false;
_id('progressSliderInner').addEventListener('mousedown', function() {
    resetControlTimeout();
    if (!window.controlsVisible) return;
    window.vidScrubbing = true;
    console.log("Video scrubbing started");
});
_id('progressSliderInner').addEventListener('input', function() {
    resetControlTimeout();
    if (!window.controlsVisible) return;
    vid.currentTime = this.value;
    _id('progressTime').innerHTML = secondsFormat(this.value);
    _id('progressFakeFront').style.width = `${(Math.round(this.value)/Math.ceil(vid.duration))*100}%`;
});
_id('progressSliderInner').addEventListener('mouseup', function() {
    resetControlTimeout();
    if (!window.controlsVisible) return;
    window.vidScrubbing = false;
    console.log("Video scrubbing finished");
});
_id('controlBar').addEventListener('mousemove', function() {
    resetControlTimeout();
});

// Handle re-showing the controls on desktop
_id('playPauseHitArea').addEventListener('mousemove', function() {
    resetControlTimeout();
});
// Handle showing/hiding the controls with a tap on mobile
_id('controlsMobile').addEventListener('click', function() {
    if (window.controlsVisible) {
        resetControlTimeout(100);
    } else {
        resetControlTimeout();
    }
});

// Handle jumping forward and backward on mobile with a double tap
var mobJump = {
    'left': 0,
    'right': 0
}
_id('mobHitLeft').addEventListener('click', function(e) {
    if ((Date.now()-window.mobJump.left) < 400) {
        e.preventDefault();
        _id('backward').click();
    }
    window.mobJump.left = Date.now();
    window.mobJump.right = 0;
});
_id('mobHitRight').addEventListener('click', function(e) {
    if ((Date.now()-window.mobJump.right) < 400) {
        e.preventDefault();
        _id('forward').click();
    }
    window.mobJump.right = Date.now();
    window.mobJump.left = 0;
});

// Handle showing a loading spinner if the video is buffering
// Based on an answer from this StackOverflow question:
// https://stackoverflow.com/questions/21399872/how-to-detect-whether-html5-video-has-paused-for-buffering
var checkInterval = 50.0;
var lastPlayPos = 0;
var currentPlayPos = 0;
var bufferingDetected = false;
var bufferSpinnerInterval;
function checkBuffering() {
    currentPlayPos = vid.currentTime;
    
    var offset = (checkInterval - 20) / 1000;
    
    if (!bufferingDetected && currentPlayPos < (lastPlayPos + offset) && !vid.paused) {
        console.log("Video buffering...");
        clearInterval(bufferSpinnerInterval);
        window.bufferSpinnerInterval = setInterval(() => {
            _id('loadingSpinner').style.opacity = 1;
        }, 250);
        bufferingDetected = true;
        window.top.postMessage({'status': 'buffering'}, '*');
    }
    
    if (bufferingDetected && currentPlayPos > (lastPlayPos + offset) && !vid.paused) {
        console.log("Buffering finished");
        clearInterval(bufferSpinnerInterval);
        _id('loadingSpinner').style.opacity = 0;
        bufferingDetected = false;
        window.top.postMessage({'status': 'playing'}, '*');
    }
    lastPlayPos = currentPlayPos;
}
setInterval(checkBuffering, checkInterval);

// Handle keyboard shortcuts
document.addEventListener('keydown', function(event) {
    resetControlTimeout();
    setTimeout(() => {
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
    }, 50);
});

// Handle the custom context menu
document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    try {
        hideDropdown('speed');
    } catch (error) {}
    let data = [];
    data.push({
        'disabled': !window.vidCanPlay,
        'type': 'item',
        'id': 'loop',
        'text': (() => {
            if (vid.loop) return "Turn off loop"
            else return "Turn on loop"
        })(),
        'icon': 'loop',
        'action': () => {
            if (vid.loop) vid.loop = false;
            else vid.loop = true;
        }
    });
    data.push({
        'disabled': !window.vidCanPlay,
        'type': 'item',
        'id': 'backward',
        'text': 'Jump backward 10s',
        'icon': 'replay_10',
        'action': () => { _id('backward').click(); }
    });
    data.push({
        'disabled': !window.vidCanPlay,
        'type': 'item',
        'id': 'forward',
        'text': 'Jump forward 10s',
        'icon': 'forward_10',
        'action': () => { _id('forward').click(); }
    });
    data.push({
        'disabled': !window.vidCanPlay,
        'type': 'item',
        'id': 'speed',
        'text': 'Playback speed...',
        'icon': 'speed',
        'action': () => {
            const setPlaybackRate = function(rate) {
                vid.playbackRate = rate;
                window.data.playbackRate = rate;
                updateSettingsStore();
                console.log(`Changed playback rate to ${rate}`);
            }
            showDropdown('speed', [{
                'type': 'item', 'id': '10', 'text': '0.1x', 'icon': 'check',
                'action': () => { setPlaybackRate(0.1) }
            }, {
                'type': 'item', 'id': '25', 'text': '0.25x', 'icon': 'check',
                'action': () => { setPlaybackRate(0.25) }
            }, {
                'type': 'item', 'id': '50', 'text': '0.5x', 'icon': 'check',
                'action': () => { setPlaybackRate(0.5) }
            }, {
                'type': 'item', 'id': '75', 'text': '0.75x', 'icon': 'check',
                'action': () => { setPlaybackRate(0.75) }
            }, {
                'type': 'item', 'id': '100', 'text': 'Normal', 'icon': 'check',
                'action': () => { setPlaybackRate(1) }
            }, {
                'type': 'item', 'id': '125', 'text': '1.25x', 'icon': 'check',
                'action': () => { setPlaybackRate(1.25) }
            }, , {
                'type': 'item', 'id': '150', 'text': '1.5x', 'icon': 'check',
                'action': () => { setPlaybackRate(1.5) }
            }, {
                'type': 'item', 'id': '200', 'text': '2x', 'icon': 'check',
                'action': () => { setPlaybackRate(2) }
            }, {
                'type': 'item', 'id': '300', 'text': '3x', 'icon': 'check',
                'action': () => { setPlaybackRate(3) }
            }, {
                'type': 'item', 'id': '500', 'text': '5x', 'icon': 'check',
                'action': () => { setPlaybackRate(5) }
            }, {
                'type': 'item', 'id': '1000', 'text': '10x', 'icon': 'check',
                'action': () => { setPlaybackRate(10) }
            }], 'dropdown-main');
            let ids = [10, 25, 50, 75, 100, 125, 150, 200, 300, 500, 1000];
            ids.forEach((id) => {
                try {
                    _id(`dropdown-speed-${id}-icon`).style.opacity = 0;
                } catch (error) {}
            });
            _id(`dropdown-speed-${Math.round(vid.playbackRate*100)}-icon`).style.opacity = 1;
        }
    });
    data.push({'type': 'sep'});
    data.push({
        'disabled': true,
        'type': 'item',
        'id': 'cast',
        'text': 'Cast (Not implemented)',
        'icon': 'cast'
    });
    if (isIframe || $_GET('noDownload') === null) data.push({'type': 'sep'});
    if (isIframe) data.push({
        'type': 'item',
        'id': 'open',
        'text': 'Open player in new tab...',
        'icon': 'open_in_new',
        'action': () => {
            window.open(`${window.location.href}&start=${vid.currentTime}`, '_blank'); 
            vid.pause();
        }
    });
    if ($_GET('noDownload') === null) data.push({
        'disabled': !window.vidCanPlay,
        'type': 'item',
        'id': 'download',
        'text': 'Download video',
        'icon': 'download',
        'action': () => { window.open(vid.src, '_blank'); }
    });
    data.push({'type': 'sep'});
    data.push({
        'type': 'item',
        'id': 'about',
        'text': 'CyberVideoPlayer...',
        'icon': 'public',
        'action': () => { window.open("https://github.com/CyberGen49/CyberVideoPlayer", '_blank'); }
    });
    showDropdown('main', data);
}, false)

// Save the cursor's current position so we can reference it elsewhere
window.addEventListener("mousemove", function(event) {
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
});

// Handle dynamically updating button icons
var dynamicButtonInterval = setInterval(() => {
    if (vid.playing) {
        window.top.postMessage({'status': 'playing'}, '*');
        _id('playPause').innerHTML = 'pause';
        _id('playPauseBig').innerHTML = 'pause';
    } else if (vid.ended) {
        window.top.postMessage({'status': 'finished'}, '*');
        _id('playPause').innerHTML = 'replay';
        _id('playPauseBig').innerHTML = 'replay';
        resetControlTimeout();
    } else {
        window.top.postMessage({'status': 'paused'}, '*');
        _id('playPause').innerHTML = 'play_arrow';
        _id('playPauseBig').innerHTML = 'play_arrow';
    }

    if (vid.muted) {
        _id('volume').innerHTML = 'volume_off';
    } else {
        _id('volume').innerHTML = 'volume_up';
    }
}, 250);

// Handle loading the video file
var vidCanPlay = false;
if ($_GET('src')) {
    try {
        vid.src = atob($_GET('src')).replace('"', '');
        if (data.playbackRate)
            vid.playbackRate = data.playbackRate;
        if ($_GET('autoplay') !== null) vid.play();
    } catch (error) {
        showBigIndicator('block', true);
        _id('playPauseBig').innerHTML = 'block';
        _id('playPauseBig').classList.add('disabled');
        window.top.postMessage({'failed': true}, '*');
    }
}

// Handle loading a custom script
if ($_GET('script')) {
    try {
        let script = atob($_GET('script')).replace('"', '');
        _id('body').insertAdjacentHTML('beforeend', `
            <script src="${script}"></script>
        `);
    } catch (error) {}
}

// Make the background transparent if requested
if ($_GET('noBackground') !== null) {
    _id('body').style.background = "rgba(0, 0, 0, 0)";
}

// Process messages from the parent
window.onmessage = function(e) {
    let data = e.data;
    if (data.cmd == 'play') vid.play();
    if (data.cmd == 'pause') vid.pause();
    if (data.cmd == 'time') vid.currentTime = data.time;
};