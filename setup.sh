#!/bin/sh

rm db.sqlite ;
rm data/out/shp/* ;

cd data/in/shp ;

ogr2ogr -t_srs EPSG:4326 out_buildings.shp Linna_majad.shp ;
ogr2ogr -t_srs EPSG:4326 out_historic_buildings.shp kuressaare.shp ;
ogr2ogr -t_srs EPSG:4326 out_roads.shp Kur_teed.shp ;
ogr2ogr -t_srs EPSG:4326 out_historic_borders.shp Vanad_piirid.shp ;
ogr2ogr -t_srs EPSG:4326 out_historic_photos.shp vanalinna_fotod.shp ;
ogr2ogr -t_srs EPSG:4326 out_borders.shp SHP_KATASTER.shp ;

cd ../geojson

ogr2ogr -t_srs EPSG:4326 -f "GeoJSON" historic_buildings.geojson ajaloolised_majad.geojson ;

cd ../../..


cp data/in/xls/Lossi_aadressid.xls data/out/xls/osiliana_map.xls

mv data/in/shp/out* data/out/shp/. ;
#mv data/in/geojson/out* data/out/geojson/. ;

echo ".loadshp ./data/out/shp/out_buildings buildings latin1" | spatialite db.sqlite ;
echo ".loadshp ./data/out/shp/out_historic_buildings historic_buildings latin1" | spatialite db.sqlite ;
echo ".loadshp ./data/out/shp/out_roads roads latin1" | spatialite db.sqlite ;
echo ".loadshp ./data/out/shp/out_historic_borders historic_borders latin1" | spatialite db.sqlite ;
echo ".loadshp ./data/out/shp/out_historic_photos historic_photos latin1" | spatialite db.sqlite ;
echo ".loadshp ./data/out/shp/out_borders borders latin1" | spatialite db.sqlite ;
echo ".loadxl  ./data/out/xls/osiliana_map.xls osiliana_map" | spatialite db.sqlite ;

node exportOsiliana.js

cat historic_buildings2.sql | spatialite db.sqlite