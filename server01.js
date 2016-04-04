
var https = require('https');
var http = require('http');
var Path = require('path');
var fs = require('fs');

var request = require('request');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });


// var privateKey  = fs.readFileSync('/etc/letsencrypt/live/doppel.camera/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/doppel.camera/fullchain.pem', 'utf8');


// var credentials = {key: privateKey, cert: certificate};

var express         =       require("express");
var multer          =       require('multer');
var app             =       express();
var upload      =   multer({ dest: './uploads/'});
var spawn = require('child_process').spawn;
var yandex = require('./doppelcamyandex')

// doing this because: http://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters-in-express
var bodyParser = require('body-parser')

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


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
   // console.log(tweets);
  }
});

app.post('/tweet',function(req,res){
    upload(req,res,function(err) {
        if(err) {
           // console.log(err);
            return res.end("Error uploading file.");
        }
        var output = ''

        var uploadedUrl2 = 'http://107.170.164.22/'+res.req.files.userPhoto.name;
        var uploadedUrl1 = 'http://doppel.camera/'+res.req.files.userPhoto.name;
        //console.log(uploadedUrl1);
       // console.log(uploadedUrl2);

        // Load your image
        if (req.headers.referer.split('/')[3] == 'bigscreen'){
          imageMagick('./uploads/'+res.req.files.userPhoto.name).rotate('black', "-90<").write('./uploads/'+res.req.files.userPhoto.name, function (err) {
            if (!err){
              var data = require('fs').readFileSync('./uploads/'+res.req.files.userPhoto.name);
              tweet(data);
              console.log('1');
              res.send('tweeted');
            }
          });
        }else{
          var data = require('fs').readFileSync('./uploads/'+res.req.files.userPhoto.name);
          tweet(data);
          res.send('tweeted');
        }
    });
});
var tweet = function(data){
    client.post('media/upload', {media: data}, function(error, media, response){

    if (!error) {

      // If successful, a media object will be returned.
     // console.log(media);

      // Lets tweet it
      var status = {
        status: 'https://doppel.camera',
        media_ids: media.media_id_string // Pass the media id string
      }

      client.post('statuses/update', status, function(error, tweet, response){
        if (!error) {
         // console.log(tweet);
        }

      });

    }
  });
}



app.post('/tweetWithImagemagick', function(req, res) {
  console.log("THIS IS NEWNEWNEW: IS THE SERVER AND WE ARE TWEETING WITH IMAGEMAGICK");
  console.log(req.body.blobname);

  composeImage(req.body.blobname, function (err, filename) {
    if(err) {
      console.log ("didn't work");
      console.log (err);
    } else {
      console.log ("yeah workeD: our new filename = " + filename)
      console.log ("u r h0tt")

      var data = require('fs').readFileSync(filename);
      tweet(data);
      console.log('tweeted with Imagemagick');
      res.send('tweeted with Imagemagick');


    }
  });

});


var tweet = function(data){
    client.post('media/upload', {media: data}, function(error, media, response){

    if (!error) {

      // If successful, a media object will be returned.
     // console.log(media);

      // Lets tweet it
      var status = {
        status: 'https://doppel.camera',
        media_ids: media.media_id_string // Pass the media id string
      }

      client.post('statuses/update', status, function(error, tweet, response){
        if (!error) {
         // console.log(tweet);
        }

      });

    }
  });
}


app.post('/app/api/photo',function(req,res){

  timestamp = new Date();
  
  console.log(1);
  var raw = new Buffer(req.body.image.file_data.toString(), 'base64')
  
  fs.writeFile('./uploads/'+timestamp.getTime()+'.png', raw, function (err) {
    if (err){
      console.log('photo upload error');
    }else{
      df = './uploads/'+timestamp.getTime()+'.png'
      url = 'http://www.artdelicorp.com/wp-content/uploads/2016/03/9.jpg';
      
      yandex.get_similar(url, function(out){
        saveDoppel(out[0],df,function(doppel){
          res.json({"url":url});
        });
      })
      
    }
  })

})
app.post('/api/photo',function(req,res){
     console.log('hello');
     upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        var output = ''

        var uploadedUrl2 = 'http://107.170.164.22/'+res.req.files.userPhoto.name;
        var uploadedUrl1 = 'http://doppel.camera/'+res.req.files.userPhoto.name;


        yandex.get_similar(uploadedUrl1, function(out) {
          var downloadedFile = 'downloaded/' + res.req.files.userPhoto.name;
          console.log(json.stringify(out));
          console.log('downloaded file', out[0], downloadedFile);
          saveDoppel(out[0],downloadedFile,function(doppel){
            res.json("doppel");
          });
         
          
        });
    });
});

function saveDoppel(dp,df,cb){
  request.get(dp).on('response', function(imgres) {
    
    var imagedata = ''
    
    imgres.setEncoding('binary')

    imgres.on('data', function(chunk){
        imagedata += chunk
    })

    imgres.on('end', function(){
        fs.writeFile(df, imagedata, 'binary', function(err){
          if (err){
            console.log(err);
             throw err
          }
            console.log('File saved.')
            str = 'https://doppel.camera/' + df;
            ar = [str];
            console.log("ar: "+ar);
            cb(ar);
        })
      })
  
  })
  
}

function composeImage(blobname, callback) {

  imageMagick('uploads/' + blobname)
    .rotate("black", "90")
    .resize(450, 600)
    .write('temp/' + blobname, function(){


      imageMagick('downloaded/' + blobname)
        .resize(450, 600, "!")
        .montage('temp/' + blobname)
          .gravity('west')
        .geometry('x600+5+0')
        .background('#000000')
        .write('compared/' + blobname, function(err){

          callback(err, 'compared/' + blobname);

          // upload to twitter here

        });


    });
}


// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(443);

// var httpServer = http.createServer(app);
// httpServer.listen(3000);

app.listen(3000,function(){
    console.log("Working on port 80");
});
