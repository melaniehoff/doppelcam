var playing = false;
var button;
var capture;
var canv;

var countdown = false;
var countdownDiv;
var countStartTime = 0;

var loadTime = 12;
var imageLoaded = false;

var showLoading = false;
var loadingIcon;
var loadingText;
var isFinished = false;

var firstImage;

var imageData;

var compare = false

var black;



var refresh;

function preload() {
  black = loadImage("assets/black.jpg");
}

function buttonPressed() {
  countdown = true;
  countStartTime = millis();
  imageLoaded = false;

  $('#shutter').css('display','none');
  setTimeout(function() {

  

  imageData = canv.elt.toDataURL();

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
    url: "https://doppel.camera/api/photo",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data',
    success: function(data) {
      gotNewImage(data, 0);
    },
    error: startOver
  });

  // pause the webcam
  capture.pause();
  showLoading = true;
  countdown = false;
   
}, 3000);
}

function makeTweet() {

  $('#twitter').hide();
  $('#refresh').css('display','none');
  $('#refreshGif').css('display','inline').css('user-drag','none').css('-moz-user-select','none').css('-webkit-user-drag','none');
  $('#spacer').css('display','inline').css('user-drag','none').css('-moz-user-select','none').css('-webkit-user-drag','none');
  $('#atDoppel').css('display','inline').css('user-drag','none').css('-moz-user-select','none').css('-webkit-user-drag','none');

  $('#atDoppel').click(function() {
    window.open("https://twitter.com/doppelcam", '_blank');
  });
  

  imageData = canv.elt.toDataURL();

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
    url: "https://doppel.camera/tweet",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data',
    success: function(data) {
      //gotNewImage(data, 0);
    }
  });


}

function startOver() {
    isFinished = false;
    capture.hide();
    //firstImage.hide();
    showLoading = false;
//

     $('#shutter').css('display','inline').css('user-drag','none').css('-moz-user-select','none').css('-webkit-user-drag','none');
     $('#refresh').css('display','none');
     $('#compare').css('display','none');
     $('#twitter').css('display','none');
     $('#spacer').css('display','none');
     $('#atDoppel').css('display','none');
     $('#refreshGif').css('display','none');

  capture.play();
  }

function gotNewImage(images, indexToTry) {
  //console.log(indexToTry);

  loadImage(images[indexToTry], showNewImage, function(){
    if (indexToTry < images.length - 1) {
      gotNewImage(images, indexToTry + 1);
    } else {
      imageLoaded = true;
      console.log('HEY BABY ;)');
    }
  });

}

function showNewImage(theImage) {

  firstImage = theImage;
  isFinished = true;
  compare = false;

  showLoading = false;
  capture.hide();
  $('#shutter').css('display','none');
  $('#refresh').css('display','none');
  $('#compare').css('display','inline').css('user-drag','none').css('-moz-user-select','none').css('-webkit-user-drag','none');
  $('#twitter').css('display','none');
  $('#spacer').css('display','none');
  $('#atDoppel').css('display','none');
  $('#refreshGif').css('display','none');
}

function compareImages(){
  compare = true;
  $('#shutter').css('display','none');
  $('#refresh').css('display','inline').css('user-drag','none').css('-moz-user-select','none').css('-webkit-user-drag','none');
  $('#spacer').css('display','inline').css('user-drag','none').css('-moz-user-select','none').css('-webkit-user-drag','none');
  $('#compare').css('display','none');
  $('#twitter').css('display','inline').css('user-drag','none').css('-moz-user-select','none').css('-webkit-user-drag','none');
  $('#atDoppel').css('display','none');
  $('#refreshGif').css('display','none');
}

function setup() {

  countdownDiv = createDiv(' ');
  //countdownDiv.class('countdownGif');    
  
  myLoadingDiv = createDiv(' ');
  myLoadingDiv.class('loadingText');


  canv = createCanvas(640, 480);


  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  //background(0);
  


  var buttons = createDiv("<img id='shutter' onclick='buttonPressed();' src='http://i.imgur.com/s4SC5HV.jpg'><img id='refresh' onclick='startOver();'src='http://i.imgur.com/2c9SiSL.jpg'><img id='refreshGif' onclick='startOver();' src='http://i.imgur.com/YxSFaOT.gif'><img id='spacer' style='width:50px' 'src='http://i.imgur.com/mzEeF0d.jpg'><img id='compare' onclick='compareImages();' src='http://i.imgur.com/SKGEIiE.png'><img id='twitter' onclick='makeTweet();' src='http://i.imgur.com/rZRlXKo.gif'><img id='atDoppel' src='http://i.imgur.com/y4sMkWt.png' href='https://twitter.com/doppelcam'>");
  buttons.class('container'); 


  $('#refresh').css('display','none');
  $('#compare').css('display','none');
  $('#twitter').css('display','none');
  $('#spacer').css('display','none');
  $('#atDoppel').css('display','none');
  $('#refreshGif').css('display','none');




}
// //android video initiate
// function touchStarted(){
//   capture.play();
// }



function draw() {
  background(0);
  

    image(capture, width/2-capture.width/2, height/2-capture.height/2);
  // }

  if (isFinished){
    if (compare){
      image(black, 0, 0, width, height);
      image(capture, 0, height/2 - 117, 314, 235); // 49%
      image(firstImage, width/2+6, height/2 - 117, 314, 235);
    }
    else {
      image(firstImage, 0, 0, 640, 480);
    }
  }
  
  var t = millis() - countStartTime;

  if (countdown == true) {  
    countdownDiv.style("display", "block");
    countdownDiv.class('countdownGif');

    var n = "3";
    if (t < 1000) {
      n = "3";
    } else if (t < 2000) {
      n = "2";
    } else if (t < 3000) {
      n = "1";
    }
    countdownDiv.style('background', 'url("assets/countdown' + n + '.png") center no-repeat');
  } else {
    countdownDiv.style("display", "none");
  }


  if (t > loadTime * 1000 && !imageLoaded) {
    location.reload();
  }


  if (showLoading == true) {  
    myLoadingDiv.style("display", "block");
  } else {
    myLoadingDiv.style("display", "none");
  }



}










