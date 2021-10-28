# CyberVideoPlayer
A clean and functional embeddable HTML video player, hosted with Github Pages.

## Usage
Example working URL:  
https://vid.simplecyber.org/player/?src=aHR0cDovL2NvbW1vbmRhdGFzdG9yYWdlLmdvb2dsZWFwaXMuY29tL2d0di12aWRlb3MtYnVja2V0L3NhbXBsZS9CaWdCdWNrQnVubnkubXA0&autoplay

Embedding the player on your site:
```html
<iframe src="https://vid.simplecyber.org/player/?src=aHR0cDovL2NvbW1vbmRhdGFzdG9yYWdlLmdvb2dsZWFwaXMuY29tL2d0di12aWRlb3MtYnVja2V0L3NhbXBsZS9CaWdCdWNrQnVubnkubXA0&autoplay" frameborder=0 width=640 height=480>
```

This repository can be cloned if you want to add your own custom domain or make other modifications.

**Note:** If `vid.simplecyber.org` ever ceases to function, use `cybergen49.github.io/CyberVideoPlayer` instead.

## Query String Parameters
### Required
* `src=url`: The video file to play, where `url` is a base64-encoded absolute (not relative) video URL

### Optional
* `autoplay`: The video will automatically play on load
* `start=t`: The video will move to `t` seconds on load
* `script=url`: An external Javascript file to include when loading the page, where `url` is an absolute URL to a Javascript file