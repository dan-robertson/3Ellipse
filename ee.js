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

const pointNormDist = d3.random.normal(0,0.1);
function goodRandomPoint(){
  if(pointsTested.length == 0){
    return randomPoint();
  }else{
    let i = Math.floor(Math.random() * pointsTested.length);
    let [x,y] = pointsTested[i];
    return [x + pointNormDist(), y + pointNormDist()];
  }
}

function clearCanvas(){
  ctx.save();
  ctx.fillStyle="#ffffff";
  ctx.beginPath();
  ctx.rect(0,0,1,1);
  ctx.fill();
  ctx.restore();
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
    ctx.fillStyle = tpToMove==i ? "#f00" : "#000";
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
  if (pointsTested.length < 3) return;
  ctx.save();
  let [x,y] = pointsTested[pointsTested.length - 1];
  ctx.beginPath();
  ctx.moveTo(x,y);
  for(let i = 0; i < pointsTested.length; i++){
    let [x,y] = pointsTested[i];
    ctx.lineTo(x,y);
  }
  ctx.strokeStyle="#0000ff";
  ctx.stroke();
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
  let r = goodRandomPoint();
  trianglePoints[3] = r;
  let p = perimeter(d3.geom.hull(trianglePoints)) <= stringLength;
  if(p) pointsTested.push(r);
}

function testOldPoint(r){
  trianglePoints[3] = r;
  let p = perimeter(d3.geom.hull(trianglePoints)) <= stringLength;
  if(p) pointsTested.push(r);
}

function testPoints(n){
  for(let i = 0; i<n; i++)
    testNewPoint();
}

function testOldPoints(){
  let pt = pointsTested;
  pointsTested = [];
  for(let i = 0; i<pt.length; i++)
    testOldPoint(pt[i]);
}

function simplifyTestedPoints(){
  pointsTested = d3.geom.hull(pointsTested);
}

var rptest = 3000;
const targetframemillis = 15;
function draw(start){
  testPoints(rptest);
  simplifyTestedPoints();

  clearCanvas()
  if(start % 1000 < 20)
    transformContext();
  
  drawTestedPoints();
  drawTriangleLines();
  drawTrianglePoints();

  window.requestAnimationFrame(draw);
  let d = window.performance.now() - start;
  if(d>0 && d < 500){//d is in milliseconds
    rptest = Math.min(Math.ceil(rptest * targetframemillis / d), 10000);
  }
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
      testOldPoints();
    } else {
      trianglePoints[3] = c;
      stringLength = perimeter(d3.geom.hull(trianglePoints));
      testOldPoints();
    }
  });
  canvas.addEventListener("mousemove", function(e){
    if(e.buttons && e.button === 0){
      let c = canvasToCoords(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      trianglePoints[tpToMove]=c;
      testOldPoints();
    }
  });
  canvas.addEventListener("mouseup", function(e){
    if(e.button ===0)
      tpToMove = (tpToMove + 1) % 3;
  });

  window.requestAnimationFrame(draw);
});
