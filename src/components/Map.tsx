import React, { useEffect, useState } from 'react'
import {
    PermissionsAndroid,
} from 'react-native'
import {MAPBOX_ACCESS_TOKEN} from 'src/api/constants'
import MapboxGL from '@react-native-mapbox-gl/maps'
import MarkerLixeira from 'src/components/MarkerLixeira'
import { Lixeira } from 'src/api/lixeiras'

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
    route : any,
    lixeiras : Array<Lixeira>,
    onMarkerCalloutButtonPress : any,
    onUserLocationUpdate : any,
}

class Markers {
    [key : string] : boolean
}

const Map : React.FC<Props> = (props) => {

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

    useEffect(() => {
        requestLocationPermission()
        MapboxGL.setTelemetryEnabled(false)
    }, [])

    const route = props.route
    const lixeiras = props.lixeiras
    const onMarkerCalloutButtonPress = props.onMarkerCalloutButtonPress
    const onUserLocationUpdate = props.onUserLocationUpdate

    return (
        <MapboxGL.MapView style={{flex : 1}} onPress={hideAllPopups}>
            <MapboxGL.Camera
                followUserLocation={true}/>
            {lixeiras.map((lixeira) => (!markers[lixeira.id] &&
                <MarkerLixeira
                    key={lixeira.id}
                    lixeira={lixeira}
                    toggleCallout={togglePopup}/>
            ))}
            {lixeiras.map((lixeira) => (markers[lixeira.id] &&
                <MarkerLixeira
                    key={lixeira.id}
                    lixeira={lixeira}
                    toggleCallout={togglePopup}
                    calloutOnButtonPress={onMarkerCalloutButtonPress}/>
            ))}
            <MapboxGL.UserLocation onUpdate={onUserLocationUpdate}/>
            {route &&
                <MapboxGL.ShapeSource id="route" shape={route}>
                    <MapboxGL.LineLayer id="line1" style={{lineColor : 'blue', lineWidth : 3}}/>
                </MapboxGL.ShapeSource>
            }
        </MapboxGL.MapView>
    )
}

export default Map