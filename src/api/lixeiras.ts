import { Lixeira } from 'src/reducers/lixeirasSlice'

export async function getLixeiras() : Promise<Array<Lixeira>> {
    const response = await fetch('http://localhost:3000/bin/bins')
    const json : GeoJSON.FeatureCollection = await response.json()
    return json.features.map((lixeira : GeoJSON.Feature) => {
        const newLixeira : Lixeira = {
            id : (lixeira as any)._id,
            location : lixeira.properties!.location,
            description : lixeira.properties!.description,
            capacity : lixeira.properties!.capacity,
            coordinates : (lixeira.geometry as GeoJSON.Point).coordinates,
            selected : false
        }
        return newLixeira
    })
}

export function toGeoJSON(lixeiras : Array<Lixeira>) : GeoJSON.FeatureCollection {
    const out : GeoJSON.FeatureCollection = {
        type : 'FeatureCollection',
        features : []
    }
    lixeiras.forEach(lixeira => {
        const coiso : GeoJSON.Feature = {
            type : 'Feature',
            geometry : {
                type : 'Point',
                coordinates : lixeira.coordinates
            },
            properties : {
                id : lixeira.id,
                location : lixeira.location,
                description : lixeira.description,
                capacity : lixeira.capacity.toString(),
                selected : lixeira.selected
            }
        }
        out.features.push(coiso)
    })
    return out
}