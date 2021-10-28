
# CyberVideoPlayer
A clean and functional embeddable HTML video player, hosted with Github Pages.

## Features
* A sleek, mobile-friendly design with rounded elements and blurred backgrounds
* Keyboard shortcuts:
    * `Space`: Play/pause the video
    * `F`: Toggle fullscreen
    * `M`: Toggle mute
    * `Left arrow`: Skip back 10 seconds
    * `Right arrow`: Skip forward 10 seconds

## Usage
Example working URL:  
https://cybergen49.github.io/CyberVideoPlayer/player/?src=aHR0cDovL2NvbW1vbmRhdGFzdG9yYWdlLmdvb2dsZWFwaXMuY29tL2d0di12aWRlb3MtYnVja2V0L3NhbXBsZS9CaWdCdWNrQnVubnkubXA0&autoplay

Embedding the player on your site:
```html
<!-- `width` and `height` can be changed here to suit your needs, or removed entirely to style with CSS -->
<!-- Be sure to replace `src` with your own link -->
<iframe src="https://cybergen49.github.io/CyberVideoPlayer/player/?src=aHR0cDovL2NvbW1vbmRhdGFzdG9yYWdlLmdvb2dsZWFwaXMuY29tL2d0di12aWRlb3MtYnVja2V0L3NhbXBsZS9CaWdCdWNrQnVubnkubXA0&autoplay"
        frameborder=0
        width=640
        height=480
>
```

You can replace `cybergen49.github.io/CyberVideoPlayer` with `vid.simplecyber.org` for a shorter URL. That domain won't work if you clone or download the repository.

This repository is a template, so it's easy to clone it for yourself if you want to make changes or use your own domain.

## Query String Parameters
### Required
* `src=url`: The video file to play, where `url` is a base64-encoded absolute (not relative) video URL

### Optional
* `autoplay`: The video will automatically play on load
* `start=t`: The video will move to `t` seconds on load
* `script=url`: An external Javascript file to include when loading the page, where `url` is an absolute URL to a Javascript file

## Changelog
### 1.0.0 - 2021-10-27
* Initial release
    * I developed the bulk of this project over the past day or so, before creating this repository. It wasn't until I had the idea of hosting the player on Github Pages that I decided to make it it's own repo.