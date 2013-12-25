// var sidebar = Mustache.parse($('#template_sidebar').html())

var map = L.map('map', {
  zoomControl: true,
  center: [58.2521, 22.4854],
  zoom: 16,
  attributionControl: false
});

function main() {

    function popUp(f,l) {
      
      l.on('click', function() {
        $('#sidebar').html(Mustache.render($('#template_sidebar').html(), f.properties));
        console.log(f)
      })
      
      l.on('mouseover', function() {
        l.bindPopup((Mustache.render($('#template_popup').html(), f.properties)));
      })

      /*
        var out = [];
        if (f.properties){
            for(key in f.properties){
                out.push(key+": "+f.properties[key]);
            }
            l.bindPopup(out.join("<br />"));
        }
      */
            
    }
    
    $('#sidebar').html(Mustache.render($('#template_intro').html()));

    var base = new L.tileLayer('http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png', {
      attribution: 'Mapbox'
    }).addTo(map);


    var master = new L.GeoJSON.AJAX('../data/in/geojson/master.geojson', {onEachFeature: popUp,
         style: {
           color: '#040',
           weight: 1
         }
       })
       .addTo(map)
/*       
    var historic_buildings = new L.GeoJSON.AJAX('../data/in/geojson/historic_buildings.geojson', {
      style: {
        color: '#004',
        weight: 1
      }
      })
      
    var historic_photos = new L.GeoJSON.AJAX('../data/in/geojson/historic_photos.geojson', {
      style: {
      }
    })
        
    var streets = new L.GeoJSON.AJAX('../data/in/geojson/streets.geojson', {
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
