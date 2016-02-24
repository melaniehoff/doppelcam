 var cd;
 var og;
$(document).ready(function(){

  var width = 500;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream
  var streaming = false;
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var startbutton = document.getElementById('startbutton');

  $('.photo.container').css('display', 'none');
  

  navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

  navigator.getMedia({
        video: true,
        audio: false
      },function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );
  
  video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
    
        if (isNaN(height)) {
          height = width / (4/3);
        }
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

  startbutton.addEventListener('click', function(ev){
      initpicture();
      ev.preventDefault();
    }, false);

  
  function startup() {clearphoto();}

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  function initpicture(){
    $('#startbutton').css('display','none');
    $('.loading').css('display','block')
    var i=3;
    var myTimer = window.setInterval(function(){
      countdown(i);
      i--;
    }, 750);
   if (i == 0){
    window.clearInterval(myTimer);
   }
  }
  function countdown(i){
   
    if (i == 0){
      takepicture();
    }else if( i < 0 ){
       $('.loading').css('background-image', "url(/assets/loadingText04.gif")
    }else{
      $('.loading').css('background-image', "url(/assets/countdown"+i+".png")
    }
  }

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      $('.video.container').css("display","none");
      $('#canvas').css("opacity","1");
      $('.photo.container').css('display', 'block');  
    } else {
      clearphoto();
    }
    sendPhoto()
  }
  
  function gotNewImage(images, indexToTry) {
  //console.log(indexToTry);
    var i = indexToTry;
    if (indexToTry < images.length - 1) {
      gotNewImage(images, indexToTry + 1);
    } else {
      vid = $('video');
      $('.photo.container').css("display",'none');
      $('.compare.container').css("display",'block');
      $('.compare img').attr("src",images[i]);
      $('.compare img').css("height",vid.width());
      $('.compare img').css("width",vid.height());

    }
  
  }

  function sendPhoto(){

    imageData = canvas.toDataURL();

    var blobBin = atob(imageData.split(',')[1]);
    var array = [];
    for (var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    var imageFile = new Blob([new Uint8Array(array)], {
      type: 'image/png'
    });
    
    var formData = new FormData();
    // formData.append('userPhoto', imageFile);
    formData.append('userPhoto', imageFile);


    $.ajax({
      url: "https://doppel.camera/api/photo",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      enctype: 'multipart/form-data',
      success: function(data) {
        gotNewImage(data, 0)
      },
        error: gotNewImage(["http://artdelicorp.com/img2/pattern.png"], 0);
    });

  }
})