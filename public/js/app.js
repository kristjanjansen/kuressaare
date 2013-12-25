// var sidebar = Mustache.parse($('#template_sidebar').html())

var map = L.map('map', {
  zoomControl: true,
  center: [58.2521, 22.4854],
  zoom: 16,
  attributionControl: false
});

var currLayer = {}

function main() {

    function popUp(f,l) {
      
      l.on('click', function(e) {
        console.log(e)
        
        if (currLayer) master.resetStyle(currLayer);
        
        e.layer.setStyle({
            weight: 3
          });
        
        currLayer = e.layer
        
        map.panTo([f.latlon.coordinates[1],f.latlon.coordinates[0]]); 
        map.setZoom(19);
        
        $('#sidebar').html(Mustache.render($('#template_sidebar').html(), f.properties));
        //console.log(f)
      })
      
      /*
      
      l.on('mouseover', function() {
        popup = L.popup({
          minWidth: 20,
          closeButton:false,
          zoomAnimation: false,
          })
            .setLatLng([f.latlon.coordinates[1],f.latlon.coordinates[0]])
            .setContent(f.properties.address)
            .openOn(map);   
      });
      
      */
            
    }
    
    $('#sidebar').html(Mustache.render($('#template_intro').html()));

    var base = new L.tileLayer('http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png', {
      attribution: 'Mapbox'
    }).addTo(map);


    var master = new L.GeoJSON.AJAX('../data/out/geojson/master.geojson', {onEachFeature: popUp,
         style: {
           color: '#433',
           opacity: 1,
           weight: 0
         }
       })
       .addTo(map)
/*       
    var historic_buildings = new L.GeoJSON.AJAX('../data/out/geojson/historic_buildings.geojson', {
      style: {
        color: '#004',
        weight: 1
      }
      })
      
    var historic_photos = new L.GeoJSON.AJAX('../data/out/geojson/historic_photos.geojson', {
      style: {
      }
    })
        
    var streets = new L.GeoJSON.AJAX('../data/out/geojson/streets.geojson', {
      style: {
        weight: 12,
        opacity: 0.1
      }
    })

    L.control.layers(null, {
      'Historic buildings': historic_buildings,
      'Historic photos': historic_photos,
      'Streets': streets,
    })
    .addTo(map);
*/
   
  }
    


window.onload = main;
