var STATE_LOAD = 0
var STATE_PLAY = 1
var STATE_PAUSE = 2

function ApplicationManager(option){

  if( !this instanceof ApplicationManager){
    return new ApplicationManager()
  }

  //期望格式： ["a.mp3", "b.mp3" ... ]
  this.audioList = option.list
  this.index = 0

  this.canvas = option.canvas
  this.context = this.canvas.getContext('2d')

  this.audio = new Audio()

  this.xhr = new XMLHttpRequest()

  this.onPlayCallback = null

  //对音频的控制
  this.mv = new MusicVisualizer({
    size: 128,
    audio: this.audio
  })
  //对特效的控制
  this.em = new Effects({
    canvas: this.canvas,
    data: this.mv.getFreqByteData()
  })
  if( option.autoNext == undefined )
    this.autoNext = true
  else
    this.autoNext = !!option.autoNext 
  if( this.autoNext ){
    var self = this
    this.audio.addEventListener('ended', function(){
      self.next()
    })
  }
}

ApplicationManager.prototype.load = function( callback ) {
  this.state = STATE_LOAD
  //要加载的音频
  console.log(this)
  var currentAudio = this.audioList[this.index]

  //已经加载过 直接调用回调
  if( currentAudio.arraybuffer){  
    callback(currentAudio.arraybuffer)
    return 
  }

  //未加载， 取消正在执行的请求，并发起新的 ajax 请求
  this.xhr.abort()
  this.xhr.open('GET', currentAudio.url)
  this.xhr.responseType = 'arraybuffer'
  var self = this;

  //定义成功后的回调
  this.xhr.onload = function(){ 
    //缓存起来
    currentAudio.arraybuffer = self.xhr.response
    //调用回调，传入 arraybuffer
    callback(this.response)
  }

  this.xhr.onerror = function(){
    alert('加载音频失败')
  }
  this.xhr.send()
}

ApplicationManager.prototype.play = function( index ) {

  if( index != undefined ){
    this.setCurrentAudio(index)
  }
  //开始播放
  // this.load( function( arraybuffer ){
  //   console.log(0)
  //   this.state = STATE_PLAY
  //   this.mv.arraybuffer  = arraybuffer
  //   this.mv.play()
  // })

  this.state = STATE_PLAY
  this.audio.src = this.audioList[this.index]
  // this.audio.play()
  this.mv.play()

  this.onPlayCallback(this.audioList[this.index])
  this.render()
}

ApplicationManager.prototype.next = function() {
  if( this.index < this.audioList.length - 1 ){
    this.index ++
  } else {
    this.index = 0
  }

  this.play() 
}

ApplicationManager.prototype.pause = function() {
  //暂停
  this.state = STATE_PAUSE
}

ApplicationManager.prototype.setCurrentAudio = function(index) {
  if( index > this.audioList.length || index < 0)
    return
  this.index = index
}

ApplicationManager.prototype.changeVolume = function(percentage) {
  this.mv.changeVolume(percentage)
}

ApplicationManager.prototype.render = function() {
  var self = this
  window.requestAnimationFrame(function(){
    self.em.data = self.mv.getFreqByteData()
    self.em.render()
    window.requestAnimationFrame(self.render.bind(self))
  })
}

ApplicationManager.prototype.onPlay = function( callback ){
  this.onPlayCallback = callback
}
