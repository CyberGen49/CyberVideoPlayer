
# CyberVideoPlayer
A clean and functional embeddable HTML video player, hosted with Github Pages.

## Features
* A sleek, mobile-friendly design with rounded elements and blurred backgrounds
* Toggle loop, change playback speed, and more all from a custom right-click context menu, even on mobile (tap and hold)
* Keyboard shortcuts:
    * `Space`: Play/pause the video
    * `F`: Toggle fullscreen
    * `M`: Toggle mute
    * `Left arrow`: Skip back 10 seconds
    * `Right arrow`: Skip forward 10 seconds
* Mobile shortcuts:
    * `Double-tap left`: Skip back 10 seconds
    * `Double-tap right`: Skip forward 10 seconds

## Usage
Example working URL:  
<https://cybergen49.github.io/CyberVideoPlayer/player/?src=aHR0cDovL2NvbW1vbmRhdGFzdG9yYWdlLmdvb2dsZWFwaXMuY29tL2d0di12aWRlb3MtYnVja2V0L3NhbXBsZS9CaWdCdWNrQnVubnkubXA0&autoplay>

Embedding the player on your site:
```html
<!-- `width` and `height` can be changed here to suit your needs, or removed entirely to style with CSS -->
<!-- Be sure to replace `src` with your own link -->
<iframe src="https://cybergen49.github.io/CyberVideoPlayer/player/?src=aHR0cDovL2NvbW1vbmRhdGFzdG9yYWdlLmdvb2dsZWFwaXMuY29tL2d0di12aWRlb3MtYnVja2V0L3NhbXBsZS9CaWdCdWNrQnVubnkubXA0&autoplay"
        allowfullscreen
        frameborder=0
        width=640
        height=480
>
```

You can replace `cybergen49.github.io/CyberVideoPlayer` with `vid.simplecyber.org` for a shorter URL. That domain won't work if you clone or download the repository.

This repository is a template, so it's easy to clone it for yourself if you want to make changes or use your own domain.

## Query string parameters
These parameters control various aspects of the player. Pass them after the main URL and a question mark (?), and separate each parameter with an ampersand (&). Parameters without an equal sign don't need a value.

### Required
* `src=url`: The video file to play, where `url` is a base64-encoded absolute (not relative) video URL

### Optional
* `autoplay`: The video will automatically play on load
* `start=t`: The video will move to `t` seconds on load
* `script=url`: An external Javascript file to include when loading the page, where `url` is an absolute URL to a Javascript file
* `noBackground`: Makes the page background transparent, so if the player is embedded at an aspect ratio not matching that of the video, the parent site's background will show through instead of just being black.
* `noDownload`: Removes the Download context menu option

## Reading data from the player
CyberVideoPlayer allows for its parent site to access some video information. Use the following Javascript in your site to read and save data sent from the player:
```js
// Save messages from the player
var videoData = {};
window.onmessage = function(e) {
    // Update the videoData object
    Object.assign(window.videoData, e.data);
    // Log the most up to date data to the console
    console.log(videoData); 
};
```

### Properties
* `failed`: `true` if the video has failed to load
* `status`: `playing`, `paused`, `finished`, or `buffering`
* `time`: The current video position in seconds
* `duration`: The total video duration in seconds

Note that the player only sends data as it changes, so you shouldn't rely on a property existing at any given time. The use of `Object.assign()` allows us to update the `videoData` object with the most up to date data and use it elsewhere.

## Changelog
### 1.2.0 - 2021-10-31
* Added double tap to jump on mobile (left and right)
* Added a custom context menu with more options like looping and playback speed
* Fixed showing all buffer points in the progress bar
* Added a loading spinner to indicate buffering
* Added the ability to access some video data from the parent site (when embedding)

### 1.1.0 - 2021-10-30
* Further refinement
* Updated the fullscreen functionality to hide system navigation elements like the Android navigation bar

### 1.0.0 - 2021-10-27
* Initial release
    * I developed the bulk of this project over the past day or so, before creating this repository. It wasn't until I had the idea of hosting the player on Github Pages that I decided to make it it's own repo.