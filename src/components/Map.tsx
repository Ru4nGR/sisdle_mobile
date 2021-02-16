import React, { RefObject, useEffect, useState } from 'react'
import {
    GestureResponderEvent,
    PermissionsAndroid,
} from 'react-native'
import {MAPBOX_ACCESS_TOKEN} from 'src/api/constants'
import MapboxGL from '@react-native-mapbox-gl/maps'
import MarkerLixeira from 'src/components/MarkerLixeira'
import { Lixeira } from 'src/reducers/lixeirasSlice'
import { useDispatch } from 'react-redux'
import { update } from 'src/reducers/userPositionSlice'

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
    route? : GeoJSON.LineString,
    lixeiras? : Array<Lixeira>,
    followUserLocation : boolean
    cameraRef : RefObject<MapboxGL.Camera>
    onTouchStart : (event : GestureResponderEvent) => void
    onMarkerCalloutButtonPress : (lixeira : Lixeira) => void,
}

class Markers {
    [key : string] : boolean
}

const Map : React.FC<Props> = (props) => {

    const dispatch = useDispatch()

    const [markers, setMarkers] = useState(new Markers())

    function togglePopup(key : string) {
        setMarkers(prevMarkers => {
            prevMarkers[key] = !prevMarkers[key]
            return prevMarkers
        })
    }

    function hideAllPopups() {
        setMarkers({})
    }

    function onUserLocationUpdate(location : MapboxGL.Location) {
        dispatch(update([location.coords.longitude, location.coords.latitude]))
    }

    useEffect(() => {
        requestLocationPermission()
        MapboxGL.setTelemetryEnabled(false)
    }, [])

    const route = props.route
    const lixeiras = props.lixeiras
    const onMarkerCalloutButtonPress = props.onMarkerCalloutButtonPress
    
    return (
        <MapboxGL.MapView style={{flex : 1}} onTouchStart={props.onTouchStart} onPress={hideAllPopups}>
            <MapboxGL.Camera
                followUserLocation={props.followUserLocation}
                ref={props.cameraRef}/>
            {lixeiras != undefined && lixeiras.map((lixeira) => (!markers[lixeira.id] &&
                <MarkerLixeira
                    key={lixeira.id}
                    lixeira={lixeira}
                    toggleCallout={togglePopup}/>
                ))}
            {lixeiras != undefined && lixeiras.map((lixeira) => (markers[lixeira.id] &&
                <MarkerLixeira
                    key={lixeira.id}
                    lixeira={lixeira}
                    toggleCallout={togglePopup}
                    calloutOnButtonPress={onMarkerCalloutButtonPress}/>
                ))}
            {route &&
                <MapboxGL.ShapeSource id="route_shape" shape={route}>
                    <MapboxGL.LineLayer id="route_line" style={{lineColor : 'blue', lineWidth : 3}}/>
                </MapboxGL.ShapeSource>
            }
            <MapboxGL.UserLocation onUpdate={onUserLocationUpdate}/>
        </MapboxGL.MapView>
    )
}
export default Map