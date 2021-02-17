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
            coordinates : [parseFloat(lixeira.longitude), parseFloat(lixeira.latitude)]
        }
        return newLixeira
    })
}