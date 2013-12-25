var fs = require('fs')
var gs = require('geojson-stream');
var sqlite = require('spatialite');

var db = new sqlite.Database('db.sqlite');
var writer = gs.stringify();


db.spatialite(function(err) {
 db.serialize(function() {

    writer.pipe(fs.createWriteStream('./data/out/geojson/historic_photos.geojson'))
    
    db.each("SELECT asukoht, aasta, AsGeoJSON(Geometry) AS the_geom FROM historic_photos", function(err, row) {
      if (err) console.log(err)

      var f = {}
      f.type = "Feature"
      f.properties = {}
      f.properties.address = row.asukoht 
      f.properties.year = row.aasta      
      f.geometry = JSON.parse(row.the_geom)
      writer.write(f)
      
    }, function() { 
      writer.end() 
    });
  
  
});
});



