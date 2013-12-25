var fs = require('fs');
var GeoJSON = require('geojson');
flickr = require('flickr').Flickr;
var each = require('each');

client = new flickr('4fec0a33818e25678bc2fe53a81c9c52', 'd478a596bb6aaaf4');

var rows = []

client.executeAPIRequest("flickr.photos.search",{tags: "kuressaare", has_geo: true, per_page: 250, page: 2, extras: 'geo'}, false, function(err, r) {
  var i = 0
  each(r.photos.photo)
  .on('item', function(item, index, next) {
      var row = {}
      row.name = item.title
      row.lat = item.latitude
      row.lng = item.longitude
      row.url = 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg'      
      rows.push(row)
      setTimeout(next, 0);
  })
  .on('end', function() {
    GeoJSON.parse(rows, {Point: ['lat', 'lng']}, function(geojson) {
      fs.writeFileSync('data/out/geojson/flickr.geojson', JSON.stringify(geojson))
    });
  })
})
