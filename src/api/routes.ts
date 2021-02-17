import {MAPBOX_ACCESS_TOKEN} from 'src/api/constants'

export interface Route {
    geometry : GeoJSON.LineString
}

export enum RoutingProfile {
    Driving = 'driving',
    Walking = 'walking',
    Cycling = 'cycling',
    DrivingTraffic = 'driving-traffic'
}

export async function getRoute(start : Array<number>, finish : Array<number>, profile : RoutingProfile) {
    try {
        let response = await fetch (
            "https://api.mapbox.com/directions/v5/mapbox/" +
            `${profile}/` +
            `${start.toString()};${finish.toString()}` +
            "?geometries=geojson" +
            `&access_token=${MAPBOX_ACCESS_TOKEN}`
        )
        let json = await response.json()
        console.log(json)
        return json.routes[0]
    }
    catch (error) {
        console.log(error);
    }
}