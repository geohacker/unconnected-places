var TileReduce = require('tile-reduce');
var turf = require('turf');

var opts = {
  zoom: 15,
  bbox: [72.334, 7.068, 89.539, 16.973],
  sources: [
    {
      name: 'osm',
      mbtiles: __dirname+'/../tile-reduce-processors/latest.planet.mbtiles',
    }
  ],
  map: __dirname+'/unconnected.js'
};

var matched = turf.featurecollection([]);

var tilereduce = TileReduce(opts);

tilereduce.on('reduce', function(result) {
  // console.log(err);
  matched.features = matched.features.concat(result);
});

tilereduce.on('end', function(error){
  console.log(JSON.stringify(matched));
});