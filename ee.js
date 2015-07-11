var canvas;
var ctx;
var pix;                        //The size of 1px in current transform

var trianglePoints = [[0.1,0.1],[0.5,0.4],[0.8,0.1]];

function transformContext(){
  let scale = Math.min(canvas.width, canvas.height);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  pix = 1/scale;
  ctx.lineWidth = pix;
}


function drawTrianglePoints(){
  for(let i = 0; i<3; i++){
    let [x,y] = trianglePoints[i];
    ctx.beginPath();
    ctx.arc(x, y, 5 * pix, 0, 2*Math.PI, false);
    ctx.fill();
  }
}

function drawTriangleLines(){
  ctx.beginPath()
  let [x,y] = trianglePoints[2];
  ctx.moveTo(x,y)
  for(let i = 0; i<3; i++){
    let [x,y] = trianglePoints[i];
    ctx.lineTo(x,y)
  }
  ctx.stroke();
}

function draw(){
  canvas.width = canvas.width;
  transformContext();
  drawTriangleLines();
  drawTrianglePoints();

  window.requestAnimationFrame(draw);
}

window.addEventListener("load", function(){
  canvas = document.getElementById("c");
  ctx = canvas.getContext("2d");
  window.requestAnimationFrame(draw);
});
