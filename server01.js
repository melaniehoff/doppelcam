var https = require('https');
var http = require('http');
var Path = require('path');
var fs = require('fs');
var im = require('imagemagick');
var request = require('request');



var privateKey  = fs.readFileSync('letsencrypt/privkey.pem', 'utf8');
var certificate = fs.readFileSync('letsencrypt/fullchain.pem', 'utf8'); 


var credentials = {key: privateKey, cert: certificate};

var express         =       require("express");
var multer          =       require('multer');
var app             =       express();
var upload      =   multer({ dest: './uploads/'});
var spawn = require('child_process').spawn;
var yandex = require('./doppelcamyandex')


app.use(express.static('uploads'));
app.use('/downloaded', express.static('downloaded'));
app.use(express.static('p5_webcam'));

app.use(multer({ dest: './uploads/',
    rename: function (fieldname, filename) {
        return filename+Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  /' + file.name)

    }
}));

app.get('/old',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

///twitter
var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'f5eckA36cgvn1HZHaV02gNFSU',
  consumer_secret: '7RccRQkMHHUokhMm4gECG49p55ADmOmdC03Dtfxu93q26ZngKg',
  access_token_key: '4487942955-bFl4gEhHRBZN8dXZOjSAFJ480ZOlzjpdbb7qBXP',
  access_token_secret: '5HcMlg8fXjV7MTZJMXDaKVV7nr359XQAlxwgs3sTuuCNO'
});
 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    console.log(tweets);
  }
});

app.post('/tweet',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        var output = ''

        var uploadedUrl2 = 'http://107.170.164.22/'+res.req.files.userPhoto.name;
        var uploadedUrl1 = 'http://doppel.camera/'+res.req.files.userPhoto.name;
        console.log(uploadedUrl1);
        console.log(uploadedUrl2);

        // Load your image
        var data = require('fs').readFileSync('./uploads/'+res.req.files.userPhoto.name);

        // Make post request on media endpoint. Pass file data as media parameter
        client.post('media/upload', {media: data}, function(error, media, response){

          if (!error) {

            // If successful, a media object will be returned.
            console.log(media);

            // Lets tweet it
            var status = {
              status: 'https://doppel.camera',
              media_ids: media.media_id_string // Pass the media id string
            }

            client.post('statuses/update', status, function(error, tweet, response){
              if (!error) {
                console.log(tweet);
              }
              res.send('tweeted');
            });

          }
        });

    });
});

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        var output = ''

        var uploadedUrl2 = 'http://107.170.164.22/'+res.req.files.userPhoto.name;
        var uploadedUrl1 = 'http://doppel.camera/'+res.req.files.userPhoto.name;
        console.log(uploadedUrl1);
        console.log(uploadedUrl2);
        //make the request to yandex
        //and then return the url of the yandex photo

        yandex.get_similar(uploadedUrl1, function(out) {
            var downloadedFile = 'downloaded/' + res.req.files.userPhoto.name;
	        console.log('downloaded file', out[0], downloadedFile);



            request.get(out[0]).on('response', function(imgres) {

            //var request = http.get(out[0], function(imgres){
                var imagedata = ''
                imgres.setEncoding('binary')

                imgres.on('data', function(chunk){
                    imagedata += chunk
                })

                imgres.on('end', function(){
                    fs.writeFile(downloadedFile, imagedata, 'binary', function(err){
                        if (err) throw err
                        console.log('File saved.')
                        res.json(['https://doppel.camera/' + downloadedFile]);

                        var gifImage1 = downloadedFile;
                        var gifImage2 = "./uploads/" + res.req.files.userPhoto.name;
                        var outputFile = 'gifs/' + res.req.files.userPhoto.name + ".gif";

                        //makeGif(gifImage1, gifImage2, outputFile);


                    })
                })

            })
            
        });


        //console.log('before casper');
        // var casper = spawn('casperjs', ['doppelcam.js', uploadedUrl2])
        // casper.stdout.on('data', function(data){
        //     console.log('Output: ' + output);
        //     output += '' + data;
        //     //res.redirect('/'+res.req.files.userPhoto.name)
        // });
        // casper.stderr.on('data', function(data){
        //     console.log("error: ", data);
        // });

        // casper.on('close', function(){
        //     console.log('Finished: ' + output);
        //     res.send(output);
        // });
    });
});

function makeGif(gifImage1, gifImage2, outputFile) {

    console.log("make a gif out of these two images:");
    console.log(gifImage1);
    console.log(gifImage2);
    console.log("and store it in:" + outputFile)

    try {

        im.convert([gifImage1, '-resize', '640x480', 'temp/gifImage1'],
        function(err, stdout){
          if (err) throw err; console.log('stdout:', stdout);
        });

        im.convert([gifImage2, '-resize', '640x480', 'temp/gifImage2'],
        function(err, stdout){
          if (err) throw err; console.log('stdout:', stdout);
        });

        im.convert(['-delay','200', '-size', '640x480', 'temp/gifImage1', 'temp/gifImage2','-loop','0', outputFile],
        function(err, stdout){
          if (err) throw err;
          console.log('stdout:', stdout);
        });

    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }
}

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);

var httpServer = http.createServer(app);
httpServer.listen(80);

// app.listen(80,function(){
//     console.log("Working on port 80");
// });
