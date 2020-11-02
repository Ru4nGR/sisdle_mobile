import React, { Component } from 'react'
import {
    View,
    StyleSheet
} from 'react-native'
import Map from 'sisdle_mobile/src/components/Map'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {getLixeiras} from 'sisdle_mobile/src/api/lixeiras'
import PillSelector from 'sisdle_mobile/src/components/PillSelector'
import {getRoute, routingProfiles} from 'sisdle_mobile/src/api/rotas'

const lixeiras = getLixeiras()

const options = {
    [routingProfiles.drivingTraffic] : <Icon name="directions-car" size={30}/>,
    [routingProfiles.walking] : <Icon name="directions-walk" size={30}/>,
    [routingProfiles.cycling] : <Icon name="directions-bike" size={30}/>
}

class MapScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            routingProfile : routingProfiles.drivingTraffic
        }
    }

    updateUserLocation = (location) => {
        this.setState({
            userLocation : [location.coords.longitude, location.coords.latitude]
        })
    }

    getRoute = async (lixeira) => {
        const route = await getRoute(this.state.routingProfile, this.state.userLocation, lixeira.coordinate)
        this.setState({
            selectedLixeira : lixeira,
            route : route,
            hasRoute : true
        })
    }

    onRoutingProfileChanged = (value) => {
        this.setState({
            routingProfile : value
        })
        if (this.state.route) {
            this.getRoute(this.state.selectedLixeira)
        }
    }

    render() {
        return (
            <View style={{flex : 1}}>
                <Map
                    lixeiras={lixeiras}
                    onMarkerCalloutButtonPress={this.getRoute}
                    onUserLocationUpdate={this.updateUserLocation} 
                    route={this.state.route && this.state.route.geometry}/>
                <View style={style.selectorContainer}>
                    <PillSelector
                        selected={this.state.routingProfile}
                        options={options}
                        style={style.selector}
                        buttonStyle={style.selectorButton}
                        onChange={this.onRoutingProfileChanged}
                        selectionColor='#2196F3'/>
                </View>
            </View>
        )
    }
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