import { Lixeira } from 'src/reducers/lixeirasSlice'

export async function getLixeiras() : Promise<Array<Lixeira>> {
    const response = await fetch('http://api.ifprinteligente.com.br/sisdle/rest.php/trash')
    const json = await response.json()
    return json.map((lixeira : Lixeira) => ({
        id : lixeira.id,
        local : lixeira.local,
        local_id : lixeira.local_id,
        latitude : lixeira.latitude,
        longitude : lixeira.longitude,
        descricao : lixeira.descricao,
        tempo_info : lixeira.tempo_info,
        profundidade : lixeira.profundidade,
        capacity : parseFloat(lixeira.profundidade),
        coordinate : [parseFloat(lixeira.longitude), parseFloat(lixeira.latitude)]
    }))
}