import React, { useEffect, useState } from 'react'
import {
    View,
    StyleSheet
} from 'react-native'
import Map from 'src/components/Map'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {getLixeiras, Lixeira} from 'src/api/lixeiras'
import RoutingProfileSelector from 'src/components/RoutingProfileSelector'
import {
    Route,
    RoutingProfile,
    routingProfiles,
    getRoute as APIGetRoute
} from 'src/api/rotas'
import MapboxGL from '@react-native-mapbox-gl/maps'

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

    return (
        <View style={{flex : 1}}>
            <Map
                lixeiras={lixeiras}
                onMarkerCalloutButtonPress={getRoute}
                onUserLocationUpdate={updateUserLocation} 
                route={route && route.geometry}/>
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