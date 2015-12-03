var turf = require('turf');

module.exports = function(data, tile, writeData, done) {
    // console.log(data);
    var osm = data.osm.osm;
    var point;
    var osmLength = osm.features.length;
    var unconnectedPlaces = [];

    for (var i = 0; i < osmLength; i++) {
        var unconnected = true;
        var feature = osm.features[i];
        if (feature.geometry.type === 'Point') {
            if (feature.properties.hasOwnProperty('place') && (feature.properties.place === 'town' ||  feature.properties.place === 'city')) {

                // apply a buffer
                var buffer = turf.buffer(feature, 1, 'kilometers');
                for (var j = 0; j < osmLength; j++) {
                    var newFeature = osm.features[j];
                    if (newFeature.geometry.type === 'LineString') {
                        var prop = newFeature.properties.highway || null;

                        if (prop && (prop === 'trunk' || prop === 'primary' || prop === 'secondary' || prop === 'tertiary')) {

                            // convert line to collection of points
                            var linePoints = lineToPoints(newFeature);

                            // see if it is in the buffer
                            var pointsWithin = turf.within(linePoints, buffer);

                            // break if it is.
                            if (pointsWithin.features.length > 0) {
                                unconnected = false;
                                break;
                            }
                        }
                    }
                }

                if (unconnected) {
                    unconnectedPlaces.push(feature);
                }
            }

        }
    }
    done(null, unconnectedPlaces);
};

function lineToPoints(line) {
  var points = line.geometry.coordinates.map(function(coord) {
    return {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': coord
      }
    };
  });
  return turf.featurecollection(points);
}