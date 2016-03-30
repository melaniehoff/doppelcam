var request = require('request');
var cheerio = require('cheerio');

var base_url = 'https://yandex.ru/images/search?rpt=imageview&img_url=';
var re = /img_url=(.*?)&rpt=/;


var url = 'http://107.170.164.22:3000/chino1448317021600.jpg';

get_similar(url, finished);

function finished(imgs) {
  console.log(imgs);
}


function get_similar(source_url, cb) {
  request.get(base_url+encodeURIComponent(source_url), function(error, response, body){
    //request.get(base_url+source_url, function(error, response, body){
    console.log('yandex1')
    if (error) {
      console.error(error);
      cb([]);
      return false;
       
    }

    console.log(base_url+source_url);

    var out = [];

    var $ = cheerio.load(body);

    var links = $('.similar__link').each(function(i, el) {
      var href = $(el).attr('href');
      var matches = re.exec(href);
      console.log(matches);
      if (matches.length == 2) {
        var img_url = decodeURIComponent(matches[1]);
        out.push(img_url);
      }
    });

    cb(out);

  });
}


module.exports.get_similar = get_similar;


// get_similar("http://artdelicorp.com/img/goya.jpg", 
//     function(out) { 
//       console.log(out); 
//   });




// use like this:
// get_similar('http://i.imgur.com/qkHA0Ja.jpg', function(data){
//   console.log(data);
// });