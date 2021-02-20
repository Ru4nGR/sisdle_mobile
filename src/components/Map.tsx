import React, { RefObject, useEffect } from 'react'
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
    const userPosition = useSelector((state : RootState) => state.userPosition)

    useEffect(() => {
        requestLocationPermission()
        MapboxGL.setTelemetryEnabled(false)
    }, [])

    function onUserLocationUpdate(location : MapboxGL.Location) {
        dispatch(update([location.coords.longitude, location.coords.latitude]))
    }

    const routePast : GeoJSON.LineString = route != undefined && JSON.parse(JSON.stringify(route))
    const routeLeft : GeoJSON.LineString = route != undefined && JSON.parse(JSON.stringify(route))
    if (route != undefined) {
        const projection = getProjectionOnLineString(userPosition, route.coordinates.slice())

        routePast.coordinates.splice(route.coordinates.indexOf(projection.segment[1]))
        routePast.coordinates.push(projection.projection)

        routeLeft.coordinates.splice(0, route.coordinates.indexOf(projection.segment[1]))
        routeLeft.coordinates.unshift(projection.projection)

    }
    
    return (
        <MapboxGL.MapView style={{flex : 1}} onTouchStart={props.onTouchStart}>
            <MapboxGL.Camera
                followUserLocation={props.followUserLocation}
                ref={props.cameraRef}/>
            {lixeiras.map(lixeira => (
                <MarkerLixeira
                    key={lixeira.id}
                    lixeira={lixeira}/>
            ))}
            <MapboxGL.UserLocation onUpdate={onUserLocationUpdate}/>
            {route &&
                <>
                <MapboxGL.ShapeSource id="route_past_shape" shape={routePast}>
                    <MapboxGL.LineLayer layerIndex={105} id="route_past_line" style={{lineColor : 'lightgray', lineWidth : 5, lineCap : 'round', lineJoin : 'round'}}/>
                </MapboxGL.ShapeSource>
                <MapboxGL.ShapeSource id="route_left_shape" shape={routeLeft}>
                    <MapboxGL.LineLayer layerIndex={105} id="route_left_line" style={{lineColor : 'blue', lineWidth : 5, lineCap : 'round', lineJoin : 'round'}}/>
                </MapboxGL.ShapeSource>
                </>
            }
        </MapboxGL.MapView>
    )
}
export default Map