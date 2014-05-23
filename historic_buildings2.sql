BEGIN;
CREATE TABLE "historic_buildings2" (
"PK_UID" INTEGER PRIMARY KEY AUTOINCREMENT,
"id" INTEGER,
"aadress" TEXT,
"ehitusaast" INTEGER,
"hoone_funk" TEXT,
"materjal" TEXT,
"selgitus" TEXT,
"viide" TEXT,
"upd_stamp" TEXT,
"kasutaja_s" TEXT);
COMMIT;
SELECT AddGeometryColumn('historic_buildings2', 'Geometry', 4326, 'POLYGON', 'XY');
