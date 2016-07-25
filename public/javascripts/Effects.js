function Effects(option) {

  if( !this instanceof Effects){
    return new Effects()
  }

  this.canvas = option.canvas

  this.context = this.canvas.getContext('2d')

  this.data = option.data

  this.currentEffect = 'col'
  this.effects = {
    'col': this.col,
    // 'dot': Effects.dot
  }

  this.initCanvasSize()

  var self = this
  window.addEventListener('resize', function(){
    self.initCanvasSize()
  }, false)
}

Effects.prototype.initCanvasSize = function() {

  this.width = this.canvas.width
  this.height = this.canvas.height
  
}

//将当前效果切换为特定效果
Effects.prototype.changeEffect = function(effectName) {
  this.currentEffect = 'effectName'
  this.render()
}

//为特定效果设置参数
Effects.prototype.setEffect = function(effectName, option){
  _merge(this.effects[effectName].option, option)
}



Effects.prototype.col = function() { 
  this.context.clearRect(0, 0, this.width, this.height)
  // this.context.fillStyle = '#95a5a6'
  
  var size = this.data.length
  var rectHeight = this.height/2
  var _data = [].concat(
    Array.from(this.data).reverse().splice(size / 2, size / 2),
    Array.from(this.data).splice(0, size / 2)
  )

  // var lg = this.context.createLinearGradient(0, rectHeight, 0, 0);  
  // lg.addColorStop(0, '#16a085');  
  // lg.addColorStop(1, '#bdc3c7');
  // this.context.fillStyle = lg;  

  var w = width/size

  for(var i = 0; i < size; i++){
    if( i % 2 == 0)
      continue
    
    var h = _data[i] / 256 * rectHeight
    if( i < size/2){
      h = h * 2*i/size
    }else{
      h =h * 2 * (size-i)/size
    }
    var lg = this.context.createLinearGradient(0, rectHeight, 0, 0);  
    lg.addColorStop(0, '#16a085');  
    lg.addColorStop(1, '#bdc3c7');
    this.context.fillStyle = lg;  
    this.context.fillRect(w * i, rectHeight - h, w * 1.2, h)

    var lg2 = this.context.createLinearGradient(0, this.height, 0, 0);  
    lg2.addColorStop(0, '#2c3e50');  
    lg2.addColorStop(1, '#16a085');
    this.context.fillStyle = lg2;  
    this.context.fillRect(w * i, rectHeight, w * 1.2, h)
  }
  this.context.beginPath()
  this.context.lineTo(0, rectHeight)
  this.context.lineTo(this.width, rectHeight)
  this.context.strokeStyle = "#2c3e50"
  this.context.lineWidth = 6
  this.context.stroke()
}

Effects.prototype.render = function(){
  this.effects[this.currentEffect].bind(this)()
}


// function draw(arr){
//   
//   var w = width/size

//   for(var i = 0; i < size; i++){
//     if(draw.type == "column"){
//       var h = arr[i] / 256 * height
//       context.fillRect(w * i, height - h, w * 0.6, h)
//     } else if( draw.type == 'dot' ) {
//       context.beginPath()
//       var o = Dots[i]
//       var r = arr[i] / 256 * 50
//       context.arc(o.x, o.y, r, 0, Math.PI * 2, true)
//       // context.strokeStyle = "#fff"
//       // context.stroke()
//       context.fillStyle = "#e67e22"
//       context.fill()
//     }

//   }
// }
// draw.type = "column"

//将第二个对象中的属性，添加到第一个，若有则覆盖
function _merger(obj, addOn){
  for(var key in addOn){
    obj[key] = addOn[key]
  }
  return obj
}

