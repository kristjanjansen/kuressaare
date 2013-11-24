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



function main() {

    $('#sidebar').html(intro.render())

    var map = L.map('map', {
      zoomControl: true,
      center: [58.2521, 22.4854],
      zoom: 16,
      attributionControl: false
    });

    L.tileLayer('http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png', {
      attribution: 'Mapbox'
    }).addTo(map);

    cartodb.createLayer(map, {
      user_name: 'kristjanjansen',
      type: 'cartodb',
      sublayers: [{
        sql: 'SELECT * FROM buildings',
        cartocss: '#layer { polygon-fill: #998f84; polygon-opacity: 0.9; line-opacity:0; }',
        interactivity: ['cartodb_id', 'aadress', 'foto_pikk', 'ehit_aasta', 'seisukord']
      }, {
        sql: 'SELECT * FROM wikipedia',
        cartocss: '#layer { marker-width: 18; marker-file: url("http://upload.wikimedia.org/wikipedia/commons/8/8f/W-circle.svg"); }'
      }]
    }, {
      cartodb_logo: false
    }).addTo(map).done(function(layer) {
      var sl = layer.getSubLayer(0);
      sl.setInteraction(true);
      sl.on('featureClick', function(e, pos, pixel, data) {
        getSidebar(data)
      });

/* 
      var sl3 = layer.getSubLayer(3);
      sl3.setInteraction(true);
      sl3.on('featureClick', function(e, pos, pixel, data) {  
        $('#sidebar').html(sidebar.render({data: data}))
      });                                 
*/

    });

    }
    
    
    
    
function getSidebar(data) {

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
}


window.onload = main;
