// Remote Controls Worker for creating blank WAV files of arbitrary duration

var sampleRate = 3000; // minimum sample rate supported across browsers

this.onmessage = function(e) {
  if (e.data && e.data.action && e.data.action == 'createBlankWAV') {
    createBlankWAV(e.data.length || 60);
  }
}

function createBlankWAV(length) {
  var dataview = encodeWAV(length);
  var blankWavBlob = new Blob([dataview], {
    type: 'audio/wav'
  });
  this.postMessage(blankWavBlob);
}

function writeString(view, offset, string) {
  for (var i = 0, l = string.length; i < l; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(length) {
  var buffer = new ArrayBuffer(44 + (length * sampleRate));
  var view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + (length * sampleRate), true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count (1) */
  view.setUint16(22, 1, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate, true);
  /* block align */
  view.setUint16(32, 1, true);
  /* bits per sample */
  view.setUint16(34, 8, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, length * sampleRate, true);

  var offset = 44;
  var writeCount = sampleRate / 8;

  for (var i = 0; i < length; i++) {
    for (var j = 0; j < writeCount; j++) {
      // Write in 64-bit blocks (despite bits per sample being 8-bits)
      // This speeds up the blank wav stream writing process considerably
      view.setFloat64(offset, 0x00, true);
      offset += 8; // move write pointer forward 64 bits
    }
  }

  return view;
}
