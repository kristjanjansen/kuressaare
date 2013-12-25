var fs = require('fs')
var gs = require('geojson-stream');
var sqlite = require('spatialite');

var db = new sqlite.Database('db.sqlite');
var writer = gs.stringify();


db.spatialite(function(err) {
 db.serialize(function() {

    writer.pipe(fs.createWriteStream('./data/out/geojson/streets.geojson'))
    
   db.each("SELECT *, AsGeoJSON(Geometry) AS the_geom FROM roads", function(err, row) {
      if (err) console.log(err)
      var f = {}
      f.type = "Feature"
      f.properties = {}
      f.properties.streetname = row.TEENIMI 
      f.geometry = JSON.parse(row.the_geom)
      writer.write(f)
      
    }, function() { 
      writer.end() 
    });
  
  
});
});



