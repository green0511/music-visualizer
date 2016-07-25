
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
  //清空画布
  this.context.clearRect(0, 0, this.width, this.height)
  // this.context.fillStyle = '#95a5a6'
  
  //要绘制的柱状图的条数
  var size = this.data.length
  //每条柱的最高高度，半个屏幕
  var rectHeight = this.height/2
  //data的副本，预处理成左右对称的
  // var _data = [].concat(
  //   Array.from(this.data).reverse().splice(size / 2, size / 2),
  //   Array.from(this.data).splice(0, size / 2)
  // )

  var _data = []

  for(var i = 0; i < size; i ++){
    //偶数 数据放在后半段， 奇数数据放在前半段
    if(i % 2 == 0){
      _data.push(this.data[i])
    } else {
      _data.unshift(this.data[i])
    }
  }
  // var lg = this.context.createLinearGradient(0, rectHeight, 0, 0);  
  // lg.addColorStop(0, '#16a085');  
  // lg.addColorStop(1, '#bdc3c7');
  // this.context.fillStyle = lg;  

  //每个柱应该占的宽度（包括间隔）
  var w = width/size

  var preH = 0
  for(var i = 0; i < size; i++){
    //设定最小值

    //根据比例，取得每个柱的高度
    var h = Math.round(_data[i] / 256 * rectHeight)

    //将两端渐小的差值明显化
    if( i < size/2){
      h = h * 2*i/size
    }else{
      h =h * 2 * (size-i)/size
    }

    //闪烁效果
    if( h < 8)
      h = Math.random()>0.5?4:2

    //上方的矩形，由白到绿
    var lg = this.context.createLinearGradient(0, rectHeight, 0, 0);  
    lg.addColorStop(0, '#16a085');  
    lg.addColorStop(1, '#bdc3c7');
    this.context.fillStyle = lg;  
    this.context.fillRect(w * i, rectHeight - h, w * 0.6, h)

    //下方的矩形，由绿到深蓝
    var lg2 = this.context.createLinearGradient(0, this.height, 0, 0);  
    lg2.addColorStop(0, '#2c3e50');  
    lg2.addColorStop(1, '#16a085');
    this.context.fillStyle = lg2;  
    this.context.fillRect(w * i, rectHeight, w * 0.6, h)
  }
  //上下方的分割线 
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

//将第二个对象中的属性，添加到第一个，若有则覆盖
function _merger(obj, addOn){
  for(var key in addOn){
    obj[key] = addOn[key]
  }
  return obj
}
