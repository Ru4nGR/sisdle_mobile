import React, { useEffect, useState } from 'react'
import {
    View,
    StyleSheet
} from 'react-native'
import Map from 'src/components/Map'
import {getLixeiras, Lixeira} from 'src/api/lixeiras'
import RoutingProfileSelector from 'src/components/RoutingProfileSelector'
import {
    Route,
    RoutingProfile,
    routingProfiles,
    getRoute as APIGetRoute
} from 'src/api/rotas'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { getOrtogonalProjection, magnitude, isOnSegment } from 'src/utils/complicatedGeometry'

const MapScreen : React.FC = () => {

    const [route, setRoute] = useState<Route | undefined>(undefined)
    const [lixeiras, setLixeiras] = useState<Array<Lixeira> | undefined>(undefined)
    const [userLocation, setUserLocation] = useState<Array<number> | undefined>(undefined)
    const [selectedLixeira, setSelectedLixeira] = useState<Lixeira | undefined>(undefined)
    const [routingProfile, setRoutingProfile] = useState<RoutingProfile>(routingProfiles.drivingTraffic)

    useEffect(() => {
        getLixeiras().then((lixeiras : any) => {
            setLixeiras(lixeiras)
        })
    }, [])

    function updateUserLocation(location : MapboxGL.Location) {
        setUserLocation([location.coords.longitude, location.coords.latitude])
    }

    async function getRoute(lixeira : any) {
        if (userLocation != undefined) {
            const route = await APIGetRoute(routingProfile, userLocation, lixeira.coordinate)
            setSelectedLixeira(lixeira)
            setRoute(route)
        }
    }

    function onRoutingProfileChanged(value : any) {
        setRoutingProfile(value)
        if (route) {
            getRoute(selectedLixeira)
        }
    }

    let projection
    let newRoute = route && JSON.parse(JSON.stringify(route))
    if (route != undefined && userLocation != undefined) {
        const projections = []
        for (let j = 1; j < route.geometry.coordinates.length; j++) {
            const i = j - 1
            const result = getOrtogonalProjection(
                route.geometry.coordinates[i],
                route.geometry.coordinates[j],
                userLocation
            )
            if (isOnSegment(route.geometry.coordinates[i], route.geometry.coordinates[j], result)) {
                projections.push({
                    projection : result,
                    segment : [route.geometry.coordinates[i], route.geometry.coordinates[j]]
                })
            }
        }
        const closestPoint = [...route.geometry.coordinates].sort((a, b) => 
            magnitude([a[0] - userLocation[0], a[1] - userLocation[1]]) - magnitude([b[0] - userLocation[0], b[1] - userLocation[1]])
        )[0]
        projections.push({
            projection : closestPoint,
            segment : [closestPoint, route.geometry.coordinates[route.geometry.coordinates.indexOf(closestPoint) + 1]]
        })
        projections.sort((a, b) => {
            const da = magnitude([a.projection[0] - userLocation[0], a.projection[1] - userLocation[1]])
            const db = magnitude([b.projection[0] - userLocation[0], b.projection[1] - userLocation[1]])
            return da - db
        })
        projection = projections[0]
        newRoute.geometry.coordinates.splice(0, route.geometry.coordinates.indexOf(projection.segment[1]))
        newRoute.geometry.coordinates.unshift(projection.projection)
    }

    return (
        <View style={{flex : 1}}>
            <Map
                lixeiras={lixeiras}
                onMarkerCalloutButtonPress={getRoute}
                onUserLocationUpdate={updateUserLocation} 
                route={newRoute?.geometry}/>
            <View style={styles.selector}>
                <RoutingProfileSelector
                    btnCancel={route != undefined}
                    onBtnCancelPress={() => setRoute(undefined)}
                    selected={routingProfile}
                    onChange={onRoutingProfileChanged}/>
            </View>
        </View>
    )
}
export default MapScreen

const styles = StyleSheet.create({
    selector : {
        position : 'absolute',
        margin : 10
    }
})