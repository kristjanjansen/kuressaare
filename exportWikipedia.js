var fs = require('fs');

var cheerio = require('cheerio')
var request = require('request')
var GeoJSON = require('geojson');

var rows = []

request({url:'http://toolserver.org/~dispenser/cgi-bin/locateCoord.py?dbname=coord_etwiki&lon=22.485086&lat=58.253203&range_km=5'}, function(err,req,body) {

$ = cheerio.load(body)
$('.wikitable tr').each(function(i, item) {
  var title = $(item).find('td').eq(7).text()
  if (title && title !=='[empty string]') {
    var row = {}
    row.name = title
    row.url = 'http:' + $($(item).find('td').eq(7).html()).attr('href')
    row.lat = parseFloat($(item).find('td').eq(0).text())
    row.lng = parseFloat($(item).find('td').eq(1).text())
    rows.push(row)   
  }
})

GeoJSON.parse(rows, {Point: ['lat', 'lng']}, function(geojson) {
  fs.writeFileSync('data/out/geojson/wikipedia.geojson', JSON.stringify(geojson))
});

})

// http://et.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=P%C3%B5lluvahi_maja&rvparse=1