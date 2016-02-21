var playing = false;
var staticTv;
var button;
var capture;
var canv;
var img;

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
  formData.append('userPhoto', imageFile)

  $.ajax({
    url: "http://107.170.164.22/api/photo",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data',
    success: gotNewImage
  });

  // httpPost("http://107.170.164.22/api/photo", {
  //   files: {userPhoto: imageFile}
  // }, gotNewImage);
}

function gotNewImage(images) {
  //images 0
  img = loadImage(images[0]);
  print(images);

  // success / fail
  // if (fail) check next one
}

function setup() {
  canv = createCanvas(windowWidth, windowHeight);

  capture = createCapture(VIDEO);
  capture.size(640, 480);
  //capture.position(398, 203);
  capture.hide();
  background(0);
}

function draw() {
  
  
  if (img) {
    // to remove the captured image
    background(0);
    // check P/L
    var w, h;
    if (img.width > img.height) {
      // Landscape
      w = capture.width;
      h = capture.width*img.height/img.width;
    } else if (img.height >= img.width) {
      // P
      w = capture.height*img.width/img.height;
      h = capture.height;
    }
    // display visually similar image
    image(img, width/2 - w/2, height/2 - h/2);
  } else {
    // show the captured image from the webcam
    image(capture, width/2-capture.width/2, height/2-capture.height/2);
  }
  

  // get the position of the botton
  var size = 50; 
  var posx = width/2;
  var posy = height/2+capture.height/2 + size/2 + 50;
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

}








