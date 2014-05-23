var path = require('path')
var sqlite = require('spatialite');

var request = require('request');
var cheerio = require('cheerio');

var iconv = require('iconv-lite');


var db = new sqlite.Database('db.sqlite');

var baseurl = 'http://www.osiliana.ee'

db.spatialite(function(err) {
 db.serialize(function() {
    db.run("ALTER TABLE osiliana_map ADD COLUMN desc TEXT;")
    db.each("SELECT * FROM osiliana_map", function(err, row) {
     var url = baseurl + '/' + path.basename(row.col_3)
    
   //  console.log(url)
    
     request({url: url}, function (e, r, b) {
       if (!e && r.statusCode == 200) {
         var $ = cheerio.load(b);
         var contents = $('#sisu').html()
        // contents = iconv.decode(contents, 'iso-8859-1')
         db.run("UPDATE osiliana_map SET desc = ? WHERE col_0 = ?", contents, row.col_0)
          
       }
     });

    }, function() { 
    });
  
  
});
});



