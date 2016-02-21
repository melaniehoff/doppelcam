var playing = false;
var button;
var capture;
var canv;
var img;
//var logo;

var showLoading = false;
var loadingIcon;
var loadingText;
var isFinished = false;

// var state = 0;


// var firstImage;


function buttonPressed() {

  /*
  if (state == 0) {
    firstImage.remove();
    state = 1;
  } else if (state == ____) {

  }*/


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


function gotNewImage(images) {

 

  isFinished = true;
  var w, h;
  var firstImage = createImg(images[0]);
  //firstImage.position(windowWidth/3.59, windowHeight/5.49);
  firstImage.position(windowWidth/3.59, windowHeight/6);
  firstImage.size(640, 493);
  firstImage.mousePressed(startOver);

  

  capture.hide();

  //image(logo, windowWidth/2-105, 20);  

   function startOver() {
    isFinished = false;
    capture.hide();
    //capture.show();
    firstImage.hide();
    showLoading = false;
  }
  
}



function setup() {
  //canv = createCanvas(windowWidth, windowHeight);
  canv = createCanvas(640, 630);
  canv.position(windowWidth/3.59, windowHeight/12);

  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  //background(0);


  // Create a DIV in P5 using the CSS stylesheet in index.html
  myLoadingDiv = createDiv(' ');
  //myLoadingDiv.class('loadingIcon');
  myLoadingDiv.class('loadingText');


}
//android video initiate
function touchStarted(){
  capture.play();
}

function windowResized() {
  resizeCanvas(640, 630);
  canv.position(windowWidth/3.59, windowHeight/12);
  firstImage.position(windowWidth/3.59, windowHeight/6);
}

function draw() {

   //image(logo, windowWidth/2-105, 20);  
   //image(textLR, windowWidth/1.3, 20); 
   //image(textRL, windowWidth/4, 20); 
  
  if (img) {

    showLoading = false;

    // to remove the captured image
    //background(0);
    
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


  // if (firstImage) {
  //   image(firstImage, ___, ____);
  // }


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










