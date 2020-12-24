export interface Lixeira {
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

export async function getLixeiras(){
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