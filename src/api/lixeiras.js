const MATINHOS_LNG_MIN = -48.55553627
const MATINHOS_LAT_MIN = -25.79989118
const MATINHOS_LNG_MAX = -48.53373528
const MATINHOS_LAT_MAX = -25.81565424

function getLixeiras(){
    const DELTA_LNG = MATINHOS_LNG_MAX - MATINHOS_LNG_MIN
    const DELTA_LAT = MATINHOS_LAT_MAX - MATINHOS_LAT_MIN

    let out = {
        'type' : 'FeatureCollection',
        'features' : []
    }

    for(let i = 0; i < 10; i++){
        out.features.push({
            'type' : 'Feature',
            'geometry' : {
                'type' : 'Point',
                'coordinates' : [
                    Math.random() * DELTA_LNG + MATINHOS_LNG_MIN,
                    Math.random() * DELTA_LAT + MATINHOS_LAT_MIN
                ]
            },
            'properties' : {
                'capacity' : Math.floor(Math.random() * 101)
            }
        })
    }

    return out
}

export {getLixeiras}