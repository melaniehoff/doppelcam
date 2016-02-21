var playing = false;
var button;
var capture;
var canv;
var img;
var logo;

var showLoading = false;
var loadingIcon;


function buttonPressed() {

  var imageData = canv.elt.toDataURL();

  var blobBin = atob(imageData.split(',')[1]);
  var array = [];
  for (var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  var imageFile = new Blob([new Uint8Array(array)], {
    type: 'image/png'
  });
  
  var formData = new FormData();
  formData.append('userPhoto', imageFile);

  $.ajax({
    //url: "http://107.170.164.22/api/photo",
    url: "http://doppel.camera/api/photo",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data',
    success: gotNewImage
  });



  // pause the webcam
  capture.pause();
  showLoading = true;
  



}

function preload() {
  logo = loadImage("assets/logo.jpg");
}

function gotNewImage(images) {

  var w, h;
  var firstImage = createImg(images[0]);
  firstImage.position(75,115);
  firstImage.size(width-150,height-150);
  capture.hide();

  image(logo, windowWidth/2-105, 20);  
  
}



function setup() {
  canv = createCanvas(windowWidth, windowHeight);

  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  background(0);


  // Create a DIV in P5 using the CSS stylesheet in index.html
  myLoadingDiv = createDiv(' ');
  myLoadingDiv.class('loadingIcon');


}
//android video initiate
function touchStarted(){
  capture.play();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {

   image(logo, windowWidth/2-105, 20);  
  
  if (img) {

    showLoading = false;

    // to remove the captured image
    background(0);
    
  } else {
    // show the captured image from the webcam
    image(capture, width/2-capture.width/2, height/2-capture.height/2);
  }
  

  // get the position of the button
  var size = 50; 
  var posx = width/2;
  var posy = height/2+capture.height/2 + size/2 + 25;
  var innerColor = color(255);
  // get the distance between mouseXY and the button
  var distance = dist(mouseX, mouseY, posx, posy);
  if (distance < size/2 && mouseIsPressed ) {
    buttonPressed();
    innerColor = color(100);
  }

  // draw outer first
  noStroke();
  fill(255);
  ellipse(posx, posy, size, size);
  // draw inner
  stroke(0);
  strokeWeight(2);
  fill( innerColor );
  ellipse(posx, posy, size*0.8, size*0.8);



  if (showLoading == true) {  
    myLoadingDiv.style("display", "block");
  } else {
    myLoadingDiv.style("display", "none");
  }



}










