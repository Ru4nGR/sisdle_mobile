import React, { useEffect, useState } from 'react'
import {
    View,
    StyleSheet
} from 'react-native'
import Map from 'src/components/Map'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {getLixeiras} from 'src/api/lixeiras'
import PillSelector from 'src/components/PillSelector'
import {getRoute as APIGetRoute, routingProfiles} from 'src/api/rotas'

const options = {
    [routingProfiles.drivingTraffic] : <Icon name="directions-car" size={30}/>,
    [routingProfiles.walking] : <Icon name="directions-walk" size={30}/>,
    [routingProfiles.cycling] : <Icon name="directions-bike" size={30}/>
}

const MapScreen : React.FC = () => {

    const [routingProfile, setRoutingProfile] = useState(routingProfiles.drivingTraffic)
    const [lixeiras, setLixeiras] = useState(new Array())
    const [userLocation, setUserLocation] = useState(new Array())
    const [selectedLixeira, setSelectedLixeira] = useState(null)
    const [route, setRoute] = useState(null)
    const [hasRoute, setHasRoute] = useState(false)

    useEffect(() => {
        getLixeiras().then((lixeiras : any) => {
            setLixeiras(lixeiras)
        })
    }, [])

    function updateUserLocation(location : any) {
        setUserLocation([location.coords.longitude, location.coords.latitude])
    }

    async function getRoute(lixeira : any) {
        const route = await APIGetRoute(routingProfile, userLocation, lixeira.coordinate)
        setSelectedLixeira(lixeira)
        setRoute(route)
        setHasRoute(true)
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
            <View style={style.selectorContainer}>
                <PillSelector
                    options={options}
                    selected={routingProfile}
                    onChange={onRoutingProfileChanged}/>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    selectorContainer : {
        position : 'absolute',
        margin : 10
    },
    selector : {
        flexDirection : 'row',
        backgroundColor : 'lightgrey'
    },
    selectorButton : {
        width : 50,
        height : 50,
        backgroundColor : 'lightgrey'
    },
})

export default MapScreen