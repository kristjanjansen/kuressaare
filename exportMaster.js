var fs = require('fs')
var path = require('path')
var gs = require('geojson-stream');
var sqlite = require('spatialite');
var iconv = require('iconv-lite');

var db = new sqlite.Database('db.sqlite');
var writer = gs.stringify();

var base_osiliana = 'http://www.osiliana.ee'
var base_historic_photo = 'http://gis.kuressaare.ee:8888/failid/Ajaloolised_pildid';

var count = 0;

db.spatialite(function(err) {
 db.serialize(function() {

    writer.pipe(fs.createWriteStream('./data/out/geojson/master.geojson'))
    
    db.each("SELECT *, AsGeoJSON(Geometry) AS the_geom, AsGeoJSON(Centroid(Geometry)) AS latlon FROM buildings", function(err, row) {
      if (err) console.log(err)
     
      var f = {}
      f.type = "Feature"
      f.properties = {}
      
      // Ehitise otsing http://www.ehr.ee/v12.aspx?loc=0101&pageNr=3
      // Dokumendiotsing http://www.ehr.ee/v12.aspx?loc=0102
      // ehr_dok: 'http://www.ehr.ee/v12.aspx?loc=10000001&EhrKood_dokOtsing=106022402'

      f.properties.address = row.aadress 
      f.properties.year = row.ehit_aasta > 0 ? row.ehit_aasta : ''      
      f.properties.photo = encodeURI(row.foto_pikk)
      
      f.geometry = JSON.parse(row.the_geom)
      f.latlon = JSON.parse(row.latlon)
      
      db.each("SELECT * FROM historic_buildings WHERE aadress LIKE '%" + f.properties.address + "%' LIMIT 1", function(err, row) {
          if (err) console.log(err)
          if (row) {
            f.properties.desc = row.selgitus
            f.properties.year_historic = row.ehitusaast > 0 ? row.ehitusaast : ''
          }
        }, function() {
      /*
        f.properties.historic_photos = []
      
        db.each("SELECT * FROM historic_photos WHERE asukoht LIKE '%" + f.properties.address + "%';", function(err, row) {
          if (err) console.log(err)
          if (row) {
              var file = row.foto.split('\\')[4]
              file = file ? file.replace(/õ/g, 'o').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u') : ''
              f.properties.historic_photos.push({
                url: base_historic_photo + '/' + file,
                desc: row.selgitus,
                year: row.aasta, // @todo cleanup
                angle: row.pildistami
              })
            }
            }, function() {
        */
            db.each("SELECT * FROM osiliana_map WHERE col_0 LIKE '%" + f.properties.address + "%' LIMIT 1", function(err, row) {
              if (err) console.log(err)
              if (row && row.PK_UID !== 2) {
                f.properties.osiliana_url = path.join(base_osiliana, path.basename(row.col_3))
                f.properties.osiliana_desc = row.desc
                  .replace(/<a\b[^>]*>/ig,'<strong>')
                  .replace(/<\/a>/ig, '</strong>')
                  .replace(/\n\n<\/p>/g,'</p>\n')
                  .replace(/<h1>/g,'<h3>')
                  .replace(/<\/h1>/g,'</h3>')
              }
            }, function() {
              writer.write(f)
              count++
            })
       
            
 /*     }) */
        
        
      });
      
    }, function() { 
      writer.end()
      console.log(count)
    });
  
  
});
});



