// var sidebar = Mustache.parse($('#template_sidebar').html())

var oldmap = {
  'Lossi 1': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 1_28.jpg',
  'Lossi 2': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 2, Lasteaia 1)_66.jpg', 
  'Lossi 3': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 3_63.jpg', 
  'Lossi 4': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 4,(2)_67.jpg', 
  'Lossi 5': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 5,7_65.jpg', 
  'Lossi 6': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 6;(Lasteaia 7)_68-2.jpg', 
//  'Lossi 2': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 6_68.jpg', 
  'Lossi 8': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 8, 10; (Põik 1, 1a, 3)_72.jpg', 
  'Lossi 10': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 8, 10_138.jpg', 
  'Lossi 9': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 9; (Raua 2)_69.jpg', 
  'Lossi 11': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 11_70.jpg', 
  'Lossi 12': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 12, 12a, 12b;( Pikk 1, 1b, 1c)_73.jpg', 
  'Lossi 13': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 13, 15, 17; A.Kitzbergi 2_71.jpg', 
  'Lossi 15': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 13, 15, 17_583.jpg',
  'Lossi 14': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 14_76.jpg',
  'Lossi 16': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 16_609.jpg',
  'Lossi 17': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 17_583-2.jpg',
  'Lossi 19': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 19_74.jpg',
  'Lossi 21': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 21; (Kitsas 13)_75.jpg',
  'Lossi 23': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 23; (Kitsas 16)_77.jpg',
  'Lossi 25': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 25; (Kitsas 18)_78.jpg',
  'Lossi 27': 'http://gis.kuressaare.ee:8888/failid/ajaloolised_krundiplaanid/Lossi 27_579.jpg' 
}


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
          fillOpacity: 1,
          });
        
        currLayer = e.layer
        
        map.panTo([f.latlon.coordinates[1],f.latlon.coordinates[0]]); 
        map.setZoom(19);
        
        for (key in oldmap) {
          if (key == f.properties.address) {
            f.properties.oldmap_url = encodeURI(oldmap[key])
            console.log(f.properties.oldmap_url)
          }
        }
        if (f.properties.osiliana_desc) f.properties.osiliana_desc = f.properties.osiliana_desc.replace(/\ufffd/g, 'a')
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
           fillColor: '#433',
           fillOpacity: 0.3,
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
