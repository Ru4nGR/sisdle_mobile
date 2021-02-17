import React, { RefObject, useEffect, useState } from 'react'
import {
    GestureResponderEvent,
    PermissionsAndroid,
} from 'react-native'
import {MAPBOX_ACCESS_TOKEN} from 'src/api/constants'
import MapboxGL from '@react-native-mapbox-gl/maps'
import MarkerLixeira from 'src/components/MarkerLixeira'
import { useDispatch, useSelector } from 'react-redux'
import { update } from 'src/reducers/userPositionSlice'
import { RootState } from 'src/reducers'
import { deselectAllLixeiras } from 'src/reducers/lixeirasSlice'
import { getProjectionOnLineString } from 'src/utils/complicatedGeometry'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)

const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("ok");
        }
        else {
            console.log("negado");
        }
    }
    catch (err) {
        console.warn(err);
    }
}

interface Props {
    followUserLocation : boolean
    cameraRef : RefObject<MapboxGL.Camera>
    onTouchStart : (event : GestureResponderEvent) => void
}

const Map : React.FC<Props> = (props) => {

    const dispatch = useDispatch()

    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)
    const route = useSelector((state : RootState) => state.route.data)
    const status = useSelector((state : RootState) => state.route.status)
    const userPosition = useSelector((state : RootState) => state.userPosition)

    useEffect(() => {
        requestLocationPermission()
        MapboxGL.setTelemetryEnabled(false)
    }, [])

    function onPress() {
        dispatch(deselectAllLixeiras())
    }

    function onUserLocationUpdate(location : MapboxGL.Location) {
        dispatch(update([location.coords.longitude, location.coords.latitude]))
    }

    const routeLeft : GeoJSON.LineString = route != undefined && JSON.parse(JSON.stringify(route))
    if (route != undefined) {
        const projection = getProjectionOnLineString(userPosition, routeLeft.coordinates.slice())
        routeLeft.coordinates.splice(0, routeLeft.coordinates.indexOf(projection.segment[1]))
        routeLeft.coordinates.unshift(projection.projection)
    }
    
    return (
        <MapboxGL.MapView style={{flex : 1}} onTouchStart={props.onTouchStart} onPress={onPress}>
            <MapboxGL.Camera
                followUserLocation={props.followUserLocation}
                ref={props.cameraRef}/>
            {lixeiras.map(lixeira => (
                <MarkerLixeira
                    key={lixeira.id}
                    lixeira={lixeira}/>
            ))}
            {route &&
                <MapboxGL.ShapeSource id="route_shape" shape={routeLeft}>
                    <MapboxGL.LineLayer id="route_line" style={{lineColor : 'blue', lineWidth : 3}}/>
                </MapboxGL.ShapeSource>
            }
            <MapboxGL.UserLocation onUpdate={onUserLocationUpdate}/>
        </MapboxGL.MapView>
    )
}
export default Map