(function(window) {

  var RemoteControls = function(length, callback) {
    var self = this;

    self.domElement = document.createElement("audio");
    self.domElement.controls = false;
    self.domElement.remotecontrols = true;
    self.domElement.title = document.title;

    self.domElement.style.width = "1px";
    self.domElement.style.height = "1px";

    self.wavBlob = null;

    setupRemoteControlMethods(self);
    setupRemoteControlEventHandlers(self);

    var worker = new Worker('remotecontrols_worker.js');

    worker.onmessage = function(e) {
      self.wavBlob = e.data;
      var wavUrl = URL.createObjectURL(self.wavBlob);

      self.domElement.src = wavUrl;

      callback.call(self); // ready!

      // clean-up our web worker
      worker.terminate();
    };

    worker.postMessage({
      'action': 'createBlankWAV',
      'length': length || 60
    });
  };

  function setupRemoteControlMethods(scope) {
    scope.start = function() {
      scope.domElement.play();
    };
    scope.pause = function() {
      scope.domElement.pause();
    };
    // etc
  }

  function setupRemoteControlEventHandlers(scope) {
    var availableEvents = [
      ["playing", "started"],
      ["play", "playbuttonpressed"],
      ["pause", "pausebuttonpressed"],
      ["seeked", "seekchange"],
      ["volumechange", "volumechange"],
      ["previous", "previousbuttonpressed"],
      ["next", "nextbuttonpressed"],
      ["ended", "ended"]
    ];

    for(var i = 0, l = availableEvents.length; i < l; i++) {
      setupEventHandler(scope, availableEvents[i]);
    }
  }

  function setupEventHandler(scope, eventNames) {
    scope.domElement.addEventListener(eventNames[0], function(evt) {
      // Fire at 'on...' based event listeners if they exist
      if(scope["on" + eventNames[1]] != undefined) {
        scope["on" + eventNames[1]].call(scope, evt);
      }
      // Otherwise fire toward all registered event listeners (TODO)
    }, false);
  }

  window.RemoteControls = RemoteControls;

})(window);
