var fs = require('fs')
var gs = require('geojson-stream');
var sqlite = require('spatialite');

var db = new sqlite.Database('db.sqlite');
var writer = gs.stringify();


db.spatialite(function(err) {
 db.serialize(function() {

    writer.pipe(fs.createWriteStream('./data/out/geojson/buildings.geojson'))
    
    db.each("SELECT aadress, ehit_aasta, AsGeoJSON(Geometry) AS the_geom, AsGeoJSON(Centroid(Geometry)) AS latlon FROM buildings", function(err, row) {
      if (err) console.log(err)

      var f = {}
      f.type = "Feature"
      f.properties = {}
      f.properties.address = row.aadress 
      f.properties.year = row.ehit_aasta      
      //f.properties.latlon = row.latlon.coordinates     
      f.geometry = JSON.parse(row.the_geom)
      writer.write(f)
      
    }, function() { 
      writer.end() 
    });
  
  
});
});



