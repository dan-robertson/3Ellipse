var canvas;
var ctx;
var pix;                        //The size of 1px in current transform

var stringLength = 2.0;
var trianglePoints = [[0.1,0.1],[0.5,0.4],[0.8,0.1],[0.5,0.5]];
var tpToMove = 0;
var pointsTested = [];//array of [x,y].

function randomPoint(){//returns a random vector in [0,1]^2 (uniform)
  return [Math.random(), Math.random()];
}

function transformContext(){
  let scale = Math.min(canvas.width, canvas.height);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  pix = 1/scale;
  ctx.lineWidth = pix;
}


function drawTrianglePoints(){
  ctx.save();
  for(let i = 0; i<3; i++){
    let [x,y] = trianglePoints[i];
    ctx.beginPath();
    ctx.arc(x, y, 5 * pix, 0, 2*Math.PI, false);
    ctx.fillStyle = tpToMove==i ? "#500" : "#000";
    ctx.fill();
  }
  ctx.restore();
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

function drawTestedPoints(){
  ctx.save();
  for(let i = 0; i < pointsTested.length; i++){
    let [x,y] = pointsTested[i];
    ctx.beginPath();
    ctx.arc(x, y, pix, 0, 2*Math.PI, false);
    ctx.fillStyle = "#0000ff";
    ctx.fill();
  }
  ctx.restore();
}

function perimeter(vertices){
  let p = vertices[vertices.length - 1];
  let l = 0;
  for(let i = 0; i<vertices.length; i++){
    let q = vertices[i];
    let dx = q[0] - p[0];
    let dy = q[1] - p[1];
    l+=Math.sqrt(dx*dx + dy*dy);
    p = q;
  }
  return l;
}

function testNewPoint(){
  let r = randomPoint();
  trianglePoints[3] = r;
  let p = perimeter(d3.geom.hull(trianglePoints)) <= stringLength;
  if(p) pointsTested.push(r);
}

function testPoints(n){
  for(let i = 0; i<n; i++)
    testNewPoint();
}

function simplifyTestedPoints(){
  pointsTested = d3.geom.hull(pointsTested);
}

function draw(){
  canvas.width = canvas.width;
  transformContext();
  drawTestedPoints();
  drawTriangleLines();
  drawTrianglePoints();
  testPoints(1000);
  simplifyTestedPoints();

  window.requestAnimationFrame(draw);
}

//used to convert from canvas to normal coords
function canvasToCoords(canvasx, canvasy){
  return [canvasx * pix, canvasy * pix];
}


window.addEventListener("load", function(){
  canvas = document.getElementById("c");
  ctx = canvas.getContext("2d");

  canvas.addEventListener("mousedown", function(e){
    let c = canvasToCoords(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    if(e.button === 0){
      trianglePoints[tpToMove]=c;
      pointsTested=[];
    } else {
      trianglePoints[3] = c;
      stringLength = perimeter(trianglePoints);
      pointsTested=[];
    }
  });
  canvas.addEventListener("mouseup", function(e){
    tpToMove = (tpToMove + 1) % 3;
  });

  window.requestAnimationFrame(draw);
});
