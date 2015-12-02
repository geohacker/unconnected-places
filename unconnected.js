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
                for (var j = 0; j < osmLength; j++) {
                    var newFeature = osm.features[j];
                    if (newFeature.geometry.type === 'LineString') {
                        var prop = newFeature.properties.highway || null;
                        if (prop && (prop === 'trunk' || prop === 'primary' || prop === 'secondary' || prop === 'tertiary')) {
                            unconnected = false;
                            break;
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