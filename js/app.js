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
//                interactivity: ['aadress','foto_pikk','ehit_aasta','seisukord','selgitus','hoone_funk']
              },   
              {
                sql: '\
                SELECT\
                  l.*,\
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
//                interactivity: ['aadress','foto_pikk','ehit_aasta','seisukord','selgitus','hoone_funk','url','text']
              },
              {
                sql: '\
                SELECT\
                  l.*\
                FROM\
                  linna_majad_2 AS l\
                ',
                cartocss: '#layer { polygon-fill: #f00; polygon-opacity: 0.5; line-opacity:0; }',
                interactivity: ['cartodb_id', 'aadress','foto_pikk','ehit_aasta','seisukord']
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

                var sql = new cartodb.SQL({ user: 'kika' })

                var sl2 = layer.getSubLayer(2);
              
                sl2.setInteraction(true);
              
                sl2.on('featureClick', function(e, pos, pixel, data) {  
                  if (data.ehit_aasta == 0) data.ehit_aasta = null        
              
              
                    sql.execute("SELECT * FROM vanalinna_fotod WHERE asukoht LIKE '%{{ aadress }}%'", { aadress: data.aadress })
                    .done(function(new_data) {
                      if (new_data.rows) {
                        data.fotod = new_data.rows
                      }
                       sql.execute("SELECT * FROM ajaloolised_hooned_2 WHERE aadress LIKE '%{{ aadress }}%'", { aadress: data.aadress })
                          .done(function(new_data) {
                            console.log(new_data)
                            if (new_data.rows[0]) {
                              data.selgitus = new_data.rows[0].selgitus
                              data.hoone_funk = new_data.rows[0].hoone_funk
                            }

                            sql.execute("SELECT l.cartodb_id, w.url, w.text FROM linna_majad AS l, kuressaare_wikipedia_3 AS w WHERE l.cartodb_id = {{ id }} AND ST_Intersects(l.the_geom, w.the_geom)", { id: data.cartodb_id })
                               .done(function(new_data) {
                                 if (new_data.rows[0]) {
                                   data.url = new_data.rows[0].url
                                   data.text = new_data.rows[0].text                                    
                                 }
                                 $('#sidebar').html(sidebar.render({data: data}))
                               })

                          })
  
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
