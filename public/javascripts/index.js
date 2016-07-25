var audioUl = $("#list")[0]

var container = $('#canvas-container')[0]
var canvas = document.createElement("canvas")
container.appendChild(canvas)

var btn = $(".menu")[0]
var body = $("body")[0]
//打开/关闭菜单
btn.onclick = function(){
  if(body.className == ""){
    resize()
    body.className = "open"
  } else {
    body.className = ""
  }
}

function resize(){
  canvas.height = height = container.clientHeight
  canvas.width = width = container.clientWidth
}
resize()
window.onresize = resize

var audioList  = Array.prototype.map.call( $("#list li"), function( li ){
  return li.getAttribute("data-name")
})

var application = new ApplicationManager({
  list: audioList,
  canvas: canvas,
  autoNext: true
})
application.onPlay(function( name ){
  removeSlectedClass("#list")
  // $("#list li").forEach( function(li){
  //   if( li.getAttribute('data-name') == name )
  //     li.className = "selected"
  // })

  forEach($("#list li"), function(li){
    if( li.getAttribute('data-name') == name )
      li.className = "selected"
  })
})

audioUl.addEventListener('click', function(event){
  btn.onclick()
  removeSlectedClass("#list")
  e = event.target || e.srcElement
  // e.className = "selected"
  application.play(e.getAttribute("data-index"))
}, false)

$("#volume")[0].onchange = function(){
  application.changeVolume(this.value/this.max)
} 
$("#volume")[0].onchange()


function $(selector) {
  return document.querySelectorAll(selector)
}
//移除 ul 所有的 li 的 class 属性
function removeSlectedClass(ulSelector){
  // $(ulSelector + " li").forEach( function(li){
  //   li.className = ""
  // } )
  forEach($(ulSelector + " li"), function(item){
    item.className = ""
  })
}

function forEach(array, callback){
  for(var i = 0; i < array.length; i++){
    callback(array[i])
  }
  return array
}