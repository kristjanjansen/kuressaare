var fs = require('fs')
var sqlite = require('spatialite');

var db = new sqlite.Database('db.sqlite');

var update = db.prepare("UPDATE historic_buildings SET selgitus = ? WHERE id = ?");

db.spatialite(function(err) {
 db.serialize(function() {

    
    db.each("SELECT id FROM historic_buildings", function(err, row) {
      if (err) console.log(err)

      insert.run('blah', id)
      
    }, function() { 
        
        insert.finalize()
    
    });
  
  
});
});



