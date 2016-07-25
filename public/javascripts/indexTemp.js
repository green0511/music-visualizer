var type = $('#type li')

var list = $('#list li')
var Dots = []

var container = $('#canvas-container')[0]
var canvas = document.createElement("canvas")
container.appendChild(canvas)
var context = canvas.getContext("2d")

var height = 0
var width = 0
var size = 128
var mv = new MusicVisualizer({
  size: size,
  visualizer: draw
})

function $(s){
  return document.querySelectorAll(s)
}

function unSelectList(){
  list.forEach( function (item) {
    item.className = ""
  })
}

list.forEach( function (item) {
  item.onclick = function () { 
    unSelectList()
    this.className = "selected"
    mv.play("/media/" + this.getAttribute("data-name"))
  }
} )

$("#volume")[0].onchange = function(){
  mv.changeVolume(this.value/this.max)
}
$("#volume")[0].onchange()

function resize(){
  canvas.height = height = container.clientHeight
  canvas.width = width = container.clientWidth
  var linear = context.createLinearGradient(0, 0, 0, height)
  linear.addColorStop(0, "red")
  linear.addColorStop(0.5, "yellow")
  linear.addColorStop(1, "green")
  context.fillStyle = linear
  getDots()
}

resize()

window.onresize = resize

function draw(arr){
  context.clearRect(0, 0, width, height)
  var w = width/size

  for(var i = 0; i < size; i++){
    if(draw.type == "column"){
      var h = arr[i] / 256 * height
      context.fillRect(w * i, height - h, w * 0.6, h)
    } else if( draw.type == 'dot' ) {
      context.beginPath()
      var o = Dots[i]
      var r = arr[i] / 256 * 50
      context.arc(o.x, o.y, r, 0, Math.PI * 2, true)
      // context.strokeStyle = "#fff"
      // context.stroke()
      context.fillStyle = "#e67e22"
      context.fill()
    }

  }
}
draw.type = "column"


function random(m, n){
  return Math.round(Math.random() * (n - m) + m)
}
function getDots(){
  Dots = []
  for(var i = 0; i < size; i++){
    var x = random(0, width)
    var y = random(0, height)
    var color = "rgba("+ random(0, 255) + "," + random(0, 255) + ", " + random(0, 255) + ")"
    Dots.push({
      x: x,
      y: y,
      color: color
    })
  }
}


function unSelectType(){
  type.forEach( function (item) {
    item.className = ""
  })
}

type.forEach( function (item) {
  item.onclick = function () { 
    unSelectType()
    this.className = "selected"
    draw.type = this.getAttribute("data-type")
  }
} )


