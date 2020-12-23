interface Lixeira {
    id : string,
    local_id : string,
    descricao : string,
    profundidade : string,
    tempo_info : string,
    latitude : string,
    longitude : string,
    local : string,
    coordinate : Array<number>,
    capacity : number
}

async function getLixeiras(){
    const response = await fetch('http://api.ifprinteligente.com.br/sisdle/rest.php/trash')
    const json = await response.json()
    return json.map((lixeira : Lixeira) => ({
        id : lixeira.id,
        local_id : lixeira.local_id,
        descricao : lixeira.descricao,
        profundidade : lixeira.profundidade,
        tempo_info : lixeira.tempo_info,
        latitude : lixeira.latitude,
        longitude : lixeira.longitude,
        local : lixeira.local,
        coordinate : [parseFloat(lixeira.longitude), parseFloat(lixeira.latitude)],
        capacity : parseFloat(lixeira.profundidade)
    }))
}

export {getLixeiras}