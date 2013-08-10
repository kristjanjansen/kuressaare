  function main() {

    var intro = new cdb.core.Template({
      template: $('#template_intro').html(),
      type: 'mustache'
    })
    
    var sidebar = new cdb.core.Template({
      template: $('#template_sidebar').html(),
      type: 'mustache'
    })
    
    $('#sidebar').html(intro.render())

        var map = L.map('map', { 
          zoomControl: true,
          center: [58.2527, 22.4872],
          zoom: 16,
          attributionControl: false
        });

        L.tileLayer('http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png', {
          attribution: 'Mapbox'
        }).addTo(map);

        cartodb.createLayer(map, {
              user_name: 'kika',
              type: 'cartodb',
              sublayers: [
              {
                sql: '\
                SELECT\
                  l.*\
                FROM\
                  linna_majad_2 AS l\
                ',
                cartocss: '#layer { polygon-fill: #c9bcad; polygon-opacity: 0.5; line-opacity:0; }',
                interactivity: ['aadress','foto_pikk','ehit_aasta','seisukord']
              },
              {
                sql: '\
                SELECT\
                  l.*,\
                  a.selgitus,\
                  a.hoone_funk\
                FROM\
                  linna_majad_2 AS l\
                JOIN ajaloolised_hooned_2 AS a ON (l.aadress = a.aadress)\
                WHERE\
                 ST_Intersects(l.the_geom,a.the_geom)\
                ',
                cartocss: '#layer { polygon-fill:#998f84; polygon-opacity: 1; line-opacity:0; line-color: #000;}',
                interactivity: ['aadress','foto_pikk','ehit_aasta','seisukord','selgitus','hoone_funk']
              },   
              {
                sql: '\
                SELECT\
                  l.*,\
                  a.selgitus,\
                  a.hoone_funk,\
                  w.text,\
                  w.url\
                FROM\
                  kuressaare_wikipedia_3 AS w,\
                  linna_majad_2 AS l\
                JOIN ajaloolised_hooned_2 AS a ON (l.aadress = a.aadress)\
                WHERE\
                 ST_Intersects(l.the_geom,w.the_geom)\
                ',
                cartocss: '#layer { polygon-fill:#544; polygon-opacity: 1; line-opacity:0; line-color: #000;}',
                interactivity: ['aadress','foto_pikk','ehit_aasta','seisukord','selgitus','hoone_funk','url','text']
              },
   /*         {
              sql: '\
              SELECT\
                v.*\
              FROM\
                vanalinna_fotod AS v\
              ',
              cartocss: '#layer { marker-fill: #000; marker-opacity: 0.5; marker-line-color: #fff; marker-line-width: 0; marker-line-opacity: 0.5; marker-width: 9;  }',
              interactivity: ['foto','aasta','asukoht','selgitus']
              }              
  */            ]
            },{cartodb_logo: false})
            .addTo(map)
            .done(function(layer) {

              var sl0 = layer.getSubLayer(0);
              sl0.setInteraction(true);
              sl0.on('featureClick', function(e, pos, pixel, data) {  
                if (data.ehit_aasta == 0) data.ehit_aasta = null
                $('#sidebar').html(sidebar.render({data: data}))
              });
                              
                var sl1 = layer.getSubLayer(1);
                sl1.setInteraction(true);
                sl1.on('featureClick', function(e, pos, pixel, data, idx) {              
                 if (data.ehit_aasta == 0) data.ehit_aasta = null     
                 $('#sidebar').html(sidebar.render({data: data}))
                                 
                });
                
                var sl2 = layer.getSubLayer(2);
                sl2.setInteraction(true);
                sl2.on('featureClick', function(e, pos, pixel, data) {  
                  if (data.ehit_aasta == 0) data.ehit_aasta = null        

                  var sql = new cartodb.SQL({ user: 'kika' })
                    .execute("SELECT * FROM vanalinna_fotod WHERE asukoht LIKE '%{{ aadress }}%'", { aadress: data.aadress })
                    .done(function(new_data) {
                      if (new_data.rows) data.fotod = new_data.rows
                      $('#sidebar').html(sidebar.render({data: data}))
                    })
                    .error(function(errors) {
                        $('#sidebar').html(sidebar.render({data: data}))
                    })
                    
                });

/*                var sl3 = layer.getSubLayer(3);
                sl3.setInteraction(true);
                sl3.on('featureClick', function(e, pos, pixel, data) {  
                  $('#sidebar').html(sidebar.render({data: data}))
                });                                 
 */                                              
            });

          }

window.onload = main;
