var playing = false;
var button;
var capture;
var canv;
var img;

var gotTheImage = false;
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

function gotNewImage(images) {
  //images 0
  //img = loadImage(images[0]);
  var timage = createImg(images[0]);
  timage.position(100,100);
  


  //timage.hide();
  //img = timage;
  //image(timage, 0,0);
  //image(image,0,0);
  // for (var i=0; i<images.length; i++) {
  //   if(gotTheImage == false) { // if we do not have a usable image... 
  //     //loadImage(images[i], checkImage); // cycle through the array of images.
  //     var image = createImg(images[i]);

  //   } else { // if we have the image already, bypass the loadImage in the for loop
  //     print("did not get the image");
  //     // do nothing
  //   }
  // }


}

function checkImage(_img) {

  if (gotTheImage == false) { // if we do not have the image ...
    if (_img.width > 0) { // check to see if the current image in the array is valid...
      print("found good image");
      img = _img;
      gotTheImage = true; // if it is a usable image, set the boolean to true
    }
  }
}




function setup() {
  canv = createCanvas(windowWidth, windowHeight);

  capture = createCapture(VIDEO);
  capture.size(640, 480);
  //capture.position(398, 203);
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
  


  
  if (img) {

    showLoading = false;

    // to remove the captured image
    background(0);
    // check P/L
    // var w, h;
    // if (img.width > img.height) {
    //   // Landscape
    //   w = capture.width;
    //   h = capture.width*img.height/img.width;
    // } else if (img.height >= img.width) {
    //   // P
    //   w = capture.height*img.width/img.height;
    //   h = capture.height;
    // }
    // // display visually similar image
    // image(img, width/2 - w/2, height/2 - h/2, w, h);

    //image(img,0,0);
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










