/*
var JSONStream = require('JSONStream');
fs.createReadStream('./data/in/geojson/ajaloolised_majad.geojson')
    .pipe(JSONStream.parse('*'))
    .on('data', console.log.bind(console))
*/    
    

var fs = require('fs');
var each = require('each');
var sqlite = require('spatialite');
var db = new sqlite.Database('db.sqlite');

db.spatialite(function(err) {
    if (err) throw err;
 db.serialize(function(err) {
     if (err) throw err;

     var insert = db.prepare("INSERT INTO historic_buildings2(id, aadress, ehitusaast, hoone_funk, materjal, selgitus, viide, upd_stamp, kasutaja_s, Geometry) VALUES (?, ?, ?, ?, ?, ?, ? ,?, ?, ?)");

fs.readFile('./data/in/geojson/out_historic_buildings.geojson', function(err, data) {
  
    var data = JSON.parse(data)
    if (err) throw err;  

    each(data.features)
    .on('item', function(el, idx, next) {

        insert.run(
            el.properties.id, 
            el.properties.aadress,
            el.properties.ehitusaast,
            el.properties.hoone_funk,
            el.properties.materjal,
            el.properties.selgitus,
            el.properties.viide,
            el.properties.upd_stamp,
            el.properties.kasutaja_s,
            'GeomFromGeoJSON(' + el.geometry + ')'
        );
        
      setTimeout(next, 0);
    })
    .on('end', function() {
        
        insert.finalize();        
 
    })
    
    
})

})
})