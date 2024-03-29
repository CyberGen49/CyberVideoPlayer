
# CyberVideoPlayer
A clean and functional embeddable HTML video player, hosted with Github Pages.

![CyberVideoPlayer Social Image](https://cdn.discordapp.com/attachments/798468240606363678/905652445655474227/CyberVideoPlayer_Repo_Promo.png)

## Features
* A sleek, mobile-friendly design with rounded elements and blurred backgrounds
* Toggle loop, change playback speed, and more all from a custom right-click context menu, even on mobile (tap and hold)
* Automatic saving and restoration of progress on videos at least 5 minutes long
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
Try out [the embed generator](https://cybergen49.github.io/CyberVideoPlayer/generator) to get a feel for CyberVideoPlayer with your own videos.

Example working URL:  
<https://cybergen49.github.io/CyberVideoPlayer/player/?src=aHR0cDovL2NvbW1vbmRhdGFzdG9yYWdlLmdvb2dsZWFwaXMuY29tL2d0di12aWRlb3MtYnVja2V0L3NhbXBsZS9CaWdCdWNrQnVubnkubXA0&autoplay>

Embedding the player on your site:
```html
<!-- `width` and `height` can be changed here to suit your needs, or removed entirely to style with CSS -->
<!-- Be sure to replace `src` with your own link -->
<iframe src="https://cybergen49.github.io/CyberVideoPlayer/player/?src=aHR0cDovL2NvbW1vbmRhdGFzdG9yYWdlLmdvb2dsZWFwaXMuY29tL2d0di12aWRlb3MtYnVja2V0L3NhbXBsZS9CaWdCdWNrQnVubnkubXA0&autoplay"
        allow="autoplay; fullscreen"
        frameborder=0
        width=384
        height=216
        id="videoPlayer"
>
```

Without allowing autoplay, the player might have trouble autoplaying the video if the user doesn't interact with it first. Without allowing fullscreen, all fullscreen functionality will cease to function.

`cybergen49.github.io/CyberVideoPlayer` can be replaced with `vid.simplecyber.org` for a shorter URL, but only in this specific repository (meaning it won't work if you clone, download, etc.)

This repository is a template, so it's easy to clone it for yourself if you want to make changes or use your own domain.

## Query string parameters
These parameters control various aspects of the player. Pass them after the main URL and a question mark (?), and separate each parameter with an ampersand (&). Parameters without an equal sign don't need a value.

### Required
* `src=url`: The video file to play, where `url` is a base64-encoded absolute (not relative) video URL

### Optional
* `autoplay`: The video will automatically play on load
* `start=t`: The video will move to `t` seconds on load
* `noDownload`: Removes the Download button
* `noCopyUrl`: Removes the 'Copy video URL' context menu option
* `noRestore`: Prevents video progress from being saved and restored

### Error icons
* Struck-through Wifi Icon
    * A network error occurred
* Struck through circle
    * No `src` was provided
    * Something went wrong while decoding the base64 string passed with the `src` parameter
    * An unknown error occurred
* Struck-through greater/less than symbols
    * An error occurred while decoding the video file for playback
* Circled question mark
    * The provided video URL is of an unsupported format

## Reading data from the player
CyberVideoPlayer allows for its parent site to access some video information. Use the following Javascript on your site to read and save data sent from the player:
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

Note that the player only sends data as it changes, so you shouldn't rely on a property existing at any given time. The use of `Object.assign()` allows us to update the `videoData` object with the most up-to-date data and use it elsewhere.

## Sending commands to the player
In addition to reading data from the player, you can also send it commands to control it. Use the following Javascript to send a command to the player.
```js
// Replace 'videoPlayer' with the ID of your <iframe>
var player = document.getElementById("videoPlayer");
// Build the command
var msg = {'cmd': 'pause'};
// Send the message
player.contentWindow.postMessage(msg, '*');
```

### Commands
* `{'cmd': 'play'}`: Plays the video
* `{'cmd': 'pause'}`: Pauses the video
* `{'cmd': 'time', 'time': t}`: Changes the current time of the video, where `t` is a number of seconds

## Changelog
Hotfix commits to the repo aren't mentioned here.

### 1.7.1 - 2021-11-16
* Updated the vertical alignment of mobile controls

### 1.7.0 - 2021-11-08
* Fixed sometimes misbehaving double-tap left and right to jump
* Now the control bars and buttons are rounded rectangles instead of circles/pills
* Added a menu option to copy the video URL

### 1.6.0 - 2021-11-06
* Now the 'fit to screen' option is only shown when the player is fullscreen
* Moved a lot of the menu options to buttons shown at the top left and right of the player
    * The 'fit to screen' button is only displayed while in fullscreen

### 1.5.0 - 2021-11-05
* Added a fade-in animation when the player loads
* Removed the `noBackground` and `script` parameters
* Made indicators properly display on mobile in place of the big play/pause button
* Added more diverse error icons (see above)
* Added a 'fit to screen' option that sets the video to cover all extra space
* Added a refresh option

### 1.4.0 - 2021-11-04
* Added a context menu option to disable blur effects
* Reorganized some files
* Created the embed generator (find the link above)
* Added OpenGraph meta tags to all pages

### 1.3.1 - 2021-11-03
* Bug fixes and minor improvements
* Made the vertical hit area for the progress bar larger
* Made it so a video's progress is deleted if it ends
* Now the player will scan through and delete all video progress entries that haven't been updated in the last 7 days

### 1.3.0 - 2021-11-02
* Made playback speed persistent (saved to and loaded from LocalStorage)
* Added the saving of video progress to LocalStorage, and videos longer than a set (undetermined) amount of time will have their progress automatically restored on load

### 1.2.0 - 2021-10-31
* Added double tap to jump on mobile (left and right)
* Added a custom context menu with more options like looping and playback speed
* Fixed showing all buffer points in the progress bar
* Added a loading spinner to indicate buffering
* Added the ability to access some video data from the parent site (when embedding)
* Added the ability to send commands to the player from the parent site

### 1.1.0 - 2021-10-30
* Further refinement
* Updated the fullscreen functionality to hide system navigation elements like the Android navigation bar

### 1.0.0 - 2021-10-27
* Initial release
    * I developed the bulk of this project over the past day or so, before creating this repository. It wasn't until I had the idea of hosting the player on Github Pages that I decided to make it it's own repo.