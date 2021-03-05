import { LixeiraCollection } from 'src/reducers/lixeirasSlice'

export async function getLixeiras() : Promise<LixeiraCollection> {
    const response = await fetch('http://localhost:3000/bin/bins')
    return await response.json()
}