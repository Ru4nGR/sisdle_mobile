import React from 'react'
import {
    StyleSheet,
    PermissionsAndroid,
    View
} from 'react-native'
import {MAPBOX_ACCESS_TOKEN} from 'sisdle_mobile/src/api/constants'
import MapboxGL from '@react-native-mapbox-gl/maps'
import {getLixeiras} from 'sisdle_mobile/src/api/lixeiras'
import {getRoute, routingProfiles} from 'sisdle_mobile/src/api/rotas'
import MarkerLixeira from 'sisdle_mobile/src/components/MarkerLixeira'
import PillSelector from 'sisdle_mobile/src/components/PillSelector'
import Icon from 'react-native-vector-icons/MaterialIcons'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)
const lixeiras = getLixeiras()

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

class Map extends React.Component {

    constructor(props){
        requestLocationPermission()
        super(props)
        this.state = {
            markers : {},
            routingProfile : routingProfiles.drivingTraffic
        }
    }

    getRoute = async (destinationLocation) => {
        console.log(destinationLocation)
        console.log(this.state.userLocation)
        const route = await getRoute(this.state.routingProfile, this.state.userLocation, destinationLocation)
        this.setState({
            destinationLocation : destinationLocation,
            route : route,
            hasRoute : true
        })
    }

    updateUserLocation = (location) => {
        this.setState({
            userLocation : [location.coords.longitude, location.coords.latitude]
        })
    }

    togglePopup = (key) => {
        this.setState((state) => {
            let markers = state.markers
            markers[key] = !markers[key]
            return {
                markers : markers
            }
        })
    }

    onRoutingProfileChanged = (value) => {
        this.setState({
            routingProfile : value
        })
        if (this.state.route) {
            this.getRoute(this.state.destinationLocation)
        }
    }

    hideAllPopups = () => {
        this.setState({
            markers : {}
        })
    }

    componentDidMount(){
        MapboxGL.setTelemetryEnabled(false)
    }

    render() {
        return (
            <View style={{flex : 1}}>
                <MapboxGL.MapView style={{flex : 1}} onPress={this.hideAllPopups}>
                    {lixeiras.features.map((lixeira) => {
                        const coordinate = lixeira.geometry.coordinates
                        if (!this.state.markers[coordinate.toString()]) {
                            return <MarkerLixeira
                            showPopup={false}
                                coordinate={coordinate}
                                key={coordinate.toString()}
                                iconStyle={style.markerIcon}
                                togglePopup = {this.togglePopup}
                                capacity={lixeira.properties.capacity}/>
                        }
                    })}
                    {lixeiras.features.map((lixeira) => {
                        const coordinate = lixeira.geometry.coordinates
                        if (this.state.markers[coordinate.toString()]) {
                            return <MarkerLixeira
                                showPopup={true}
                                popupTipHeight={16}
                                popupPosition="right"
                                coordinate={coordinate}
                                key={coordinate.toString()}
                                iconStyle={style.markerIcon}
                                popupStyle={style.markerPopup}
                                togglePopup = {this.togglePopup}
                                popupOnButtonPress={this.getRoute}
                                capacity={lixeira.properties.capacity}/>
                            }
                        })}
                    <MapboxGL.UserLocation onUpdate={this.updateUserLocation}/>
                    {this.state.hasRoute &&
                        <MapboxGL.ShapeSource id="route" shape={this.state.route.geometry}>
                            <MapboxGL.LineLayer id="line1" style={{lineColor : 'blue', lineWidth : 3}}/>
                        </MapboxGL.ShapeSource>
                    }
                </MapboxGL.MapView>
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

const options = {
    [routingProfiles.drivingTraffic] : <Icon name="directions-car" size={30}/>,
    [routingProfiles.walking] : <Icon name="directions-walk" size={30}/>,
    [routingProfiles.cycling] : <Icon name="directions-bike" size={30}/>
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
    markerIcon : {
        width : 30,
        height : 30
    },
    markerPopup : {
        width : 150,
        height : 150,
    }
})

export default Map