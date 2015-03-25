## Using remote control events for arbitrary (non-media) purposes

This library allows web developers to obtain low-level access to remote control events to control any kind of web content such as Flash-based media, presentations, slide shows or Web Audio API content _based on the assumption that platform-level media focus can be obtained via `HTMLMediaElement` objects_ (related discussion: [WHATWG Media Keys and Media Focus](https://github.com/whatwg/media-keys)).

#### Usage

To obtain low-level access to remote control events from a web page you can do the following:

1. Create a new `RemoteControls` object with the required duration for remote control focus and a callback to be run when the object has been fully initialized:

``` javascript
var controls = new RemoteControls(300, readyCallback);
```

2. Start the `RemoteControls` object when you are ready to obtain remote controls focus:


``` javascript
function readyCallback() {
  controls.start();
}
```

3. Listen for remote control events and wire these up to your web content however you wish:

``` javascript
controls.onstarted = function() {};
controls.onplaybuttonpressed = function() {};
controls.onpausebuttonpressed = function() {};
// etc ... for 'seekchange', 'volumechange', 'previousbuttonpressed'
// and 'nextbuttonpressed' events
controls.onended = function() {};
```

4. Use the remote control events to drive whatever web content you wish such as Web Audio API content, Flash-based media, presentations or slide shows.


#### How it works under the hood

We create a dummy &lt;audio&gt; element and generate a silent WAV file of any length on the client-side to playback using JavaScript. Producing this silent WAV is very inexpensive to do client-side in this way.

Once that dummy media object obtains media focus (if it can do so on the current platform) then media key events dispatched toward that object (from any connected remote control hardware and software) will be propagated toward the page to be used to control any content in any way.

#### Compatibility

At the time of writing **only iOS** supports any level of integration with hardware and software based remote control events from web content. Therefore, this code works best (and currently only on) iOS devices.