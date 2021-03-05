import { Lixeira } from 'src/reducers/lixeirasSlice'

export async function getLixeiras() : Promise<Array<Lixeira>> {
    const response = await fetch('http://localhost:3000/bin/bins')
    const json : GeoJSON.FeatureCollection = await response.json()
    return json.features.map((lixeira : GeoJSON.Feature) => {
        const newLixeira : Lixeira = {
            id : (lixeira as any)._id,
            type : 'Feature',
            geometry : {
                type : 'Point',
                coordinates : (lixeira.geometry as GeoJSON.Point).coordinates,
            },
            properties : {
                location : lixeira.properties!.location,
                description : lixeira.properties!.description,
                capacity : lixeira.properties!.capacity,
                selected : false
            }
        }
        return newLixeira
    })
}