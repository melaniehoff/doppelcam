$(document).ready(function(){

  var width = 500;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream
  var streaming = false;
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var startbutton = document.getElementById('startbutton');

  $('.photo.container').css('display', 'none');
  
  function startup() {
    clearphoto();
  }

  navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

  navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
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
      takepicture();
      ev.preventDefault();
    }, false);

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
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
    formData.append('userPhoto', imageFile);

    $.ajax({
      //url: "http://107.170.164.22/api/photo",
      url: "http://doppel.camera/api/photo",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      enctype: 'multipart/form-data',
      success: function(data) {
        
      },
      error: console.log('hello')
    });

  }
})