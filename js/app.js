var intro = new cdb.core.Template({
  template: $('#template_intro').html(),
  type: 'mustache'
})

var sidebar = new cdb.core.Template({
  template: $('#template_sidebar').html(),
  type: 'mustache'
})

var sql = new cartodb.SQL({
  user: 'kristjanjansen'
})

var map = L.map('map', {
  zoomControl: true,
  center: [58.2521, 22.4854],
  zoom: 16,
  attributionControl: false
});

function main() {

    $('#sidebar').html(intro.render());

    L.tileLayer('http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png', {
      attribution: 'Mapbox'
    }).addTo(map);

    cartodb.createLayer(
      map, 
      'http://kristjanjansen.cartodb.com/api/v2/viz/3a8eff2e-58fd-11e3-b16b-a5971feaabf3/viz.json', 
      {infowindow: true}
      )
            .addTo(map)
            .on('done', function(layer) {

             layer.setInteraction(true);
             layer.setInteractivity(['cartodb_id', 'aadress']);
             
             var sublayer = layer.getSubLayer(0);
              
             layer.on('featureClick', function(e, pos, latlng, data) {
               map.setZoom(20);
               map.panTo(pos); 
                                   
               getSidebar(data.cartodb_id);
             });
             
              layer.on('featureOver', function(e, pos, latlng, data) {

                popup = L.popup({
                  minWidth: 20,
                  closeButton:false,
                  zoomAnimation: false,
                  })
                    .setLatLng(pos)
                    .setContent(data.aadress)
                    .openOn(map);
              });
      
             layer.on('error', function(err) {
               console.log('error: ' + err);
             });
             
           }).on('error', function() {
             console.log.log("some error occurred");
           });
         
     }
    
    
    function getSidebar(cartodb_id) {
            
      sql.execute("SELECT * FROM buildings WHERE cartodb_id = {{ cartodb_id }}", {
        cartodb_id: cartodb_id
      }).done(function(data) {
        data = data.rows[0]
        
      if (data.ehit_aasta == 0) data.ehit_aasta = null
    
      sql.execute("SELECT * FROM historic_photos WHERE asukoht LIKE '%{{ aadress }}%'", {
        aadress: data.aadress
      }).done(function(new_data) {
        if (new_data.rows) {
          data.fotod = new_data.rows.map(function(item) {
            item.selgitus = item.selgitus ? item.selgitus.replace(/Ã¶/g, 'ö').replace(/Ã¤/g, 'ä').replace(/Ã/g, 'Ä').replace(/Ãµ/g, 'õ').replace(/Ã¼/g, 'ü').replace(/Ã¾/g, 'sh') : null
            return item
          })
        }
        sql.execute("SELECT * FROM historic_buildings WHERE aadress LIKE '%{{ aadress }}%'", {
          aadress: data.aadress
        }).done(function(new_data) {
          if (new_data.rows[0]) {
            data.selgitus = new_data.rows[0].selgitus
            data.hoone_funk = new_data.rows[0].hoone_funk
          }

          sql.execute("SELECT b.cartodb_id, w.url, w.text FROM buildings AS b, wikipedia AS w WHERE b.cartodb_id = {{ id }} AND ST_Intersects(b.the_geom, w.the_geom)", {
            id: data.cartodb_id
          }).done(function(new_data) {
            if (new_data.rows[0]) {
              data.url = new_data.rows[0].url
              data.text = new_data.rows[0].text
            }
            $('#sidebar').html(sidebar.render({
              data: data
            }))
          })

        })

      })
      
    })
    
  }
    


window.onload = main;
