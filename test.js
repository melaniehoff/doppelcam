var im = require('imagemagick');


im.convert(['-delay','200','-size','640x480','p5_webcam/assets/logo.jpg','p5_webcam/assets/mary.jpg','-loop','0','animation.gif'],
function(err, stdout){
  if (err) throw err;
  console.log('stdout:', stdout);
});

var ffmpeg = require('ffmpeg');

try {
	var process = new ffmpeg('animation.gif');
	process.then(function (video) {
		
		video
		.addCommand('-f','gif')
		.save('animation.mp4', function (error, file) {
			console.log(error);
			if (!error)
				console.log('Video file: ' + file);
		});

	}, function (err) {
		console.log('Error: ' + err);
	});
} catch (e) {
	console.log(e.code);
	console.log(e.msg);
}