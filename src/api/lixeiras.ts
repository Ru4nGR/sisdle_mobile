import { Lixeira } from 'src/reducers/lixeirasSlice'

export interface APILixeira {
    id : string,
    local : string,
    capacity : number
    local_id : string,
    latitude : string,
    longitude : string,
    descricao : string,
    tempo_info : string,
    profundidade : string,
    coordinate : Array<number>,
}

export async function getLixeiras() : Promise<Array<Lixeira>> {
    const response = await fetch('http://api.ifprinteligente.com.br/sisdle/rest.php/trash')
    const json = await response.json()
    return json.map((lixeira : APILixeira) => {
        const newLixeira : Lixeira = {
            id : lixeira.id,
            location : lixeira.local,
            description : lixeira.descricao,
            capacity : parseFloat(lixeira.profundidade),
            coordinates : [parseFloat(lixeira.longitude), parseFloat(lixeira.latitude)],
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