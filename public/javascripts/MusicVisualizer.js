MusicVisualizer.audioContext = new (window.AudioContext ||window.webkitAudioContext || window.mozAudioContext)();
var STATE_FREE = 0
var STATE_PLAY = 1
var STATE_PAUSE = 2
var STATE_STOP = 3

function MusicVisualizer(option) {

  this.source = null;

  this.audio = option.audio
  this.size = option.size || 128;
  
  this.audioSource = MusicVisualizer.audioContext.createMediaElementSource(this.audio);

  this.gainNode = MusicVisualizer.audioContext[MusicVisualizer.audioContext.createGain?'createGain':'createGainNode']();
  this.analyser = MusicVisualizer.audioContext.createAnalyser()
  this.delayNode = MusicVisualizer.audioContext.createDelay(179);

  this.audioSource.connect(this.analyser)
  this.analyser.connect(this.delayNode)

  this.delayNode.connect(this.gainNode)
  this.gainNode.connect(MusicVisualizer.audioContext.destination)

  this.analyser.fftSize = this.size * 2

  this.arraybuffer = null

  this.state = STATE_FREE
}

MusicVisualizer.prototype.getFreqByteData = function(){
  var freqByteData = new Uint8Array(this.analyser.frequencyBinCount)
  this.analyser.getByteFrequencyData(freqByteData)
  return freqByteData
}

// MusicVisualizer.prototype.decode = function(){
//   var self = this
//   MusicVisualizer.audioContext.decodeAudioData(this.arraybuffer, function(buffer){
//      self.bufferSource.buffer = buffer;
//   }, function(err){
//     console.log(err);
//   })
// }

MusicVisualizer.prototype.play = function() {

  if(this.state = STATE_PLAY)
    this.stop
  this.state = STATE_PLAY
  this.audio.play()
  
}

MusicVisualizer.prototype.stop = function() {
  this.state = STATE_STOP
  this.audio.pause()
  // this.bufferSource[this.bufferSource.stop?'stop':'noteOff'](0);
}

MusicVisualizer.prototype.changeVolume = function(percent) {
  this.gainNode.gain.value = percent * percent;
}

MusicVisualizer.prototype.visualize = function() {
  var arr = new Uint8Array(this.analyser.frequencyBinCount);
  
  var requestAnimationFrame = window.requestAnimationFrame 
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame ;

    var self = this;
    function v(){
      self.analyser.getByteFrequencyData(arr);
      self.visualizer(arr);
      requestAnimationFrame(v);
    }
   requestAnimationFrame(v);
}