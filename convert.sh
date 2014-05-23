#!/bin/sh

rm -f data/out/geojson/*

node exportBorders.js
node exportBuildings.js
node exportHistoricBuildings.js
node exportHistoricBuildings2.js
node exportHistoricPhotos.js
node exportStreets.js
node exportWikipedia.js
node exportFlickr.js
node exportMaster2.js
