import React from 'react'
import {
    StyleSheet,
    PermissionsAndroid,
} from 'react-native'
import {MAPBOX_ACCESS_TOKEN} from 'sisdle_mobile/src/api/constants'
import MapboxGL from '@react-native-mapbox-gl/maps'
import MarkerLixeira from 'sisdle_mobile/src/components/MarkerLixeira'

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

class Map extends React.Component {

    constructor(props){
        requestLocationPermission()
        super(props)
        this.state = {
            markers : {},
        }
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

    hideAllPopups = () => {
        this.setState({
            markers : {}
        })
    }

    componentDidMount(){
        MapboxGL.setTelemetryEnabled(false)
    }

    render() {

        const route = this.props.route
        const markers = this.state.markers
        const lixeiras = this.props.lixeiras
        const onMarkerCalloutButtonPress = this.props.onMarkerCalloutButtonPress
        const onUserLocationUpdate = this.props.onUserLocationUpdate

        return (
            <MapboxGL.MapView style={{flex : 1}} onPress={this.hideAllPopups}>
                <MapboxGL.Camera
                    followUserLocation={true}/>
                {lixeiras.map((lixeira) => (!markers[lixeira.coordinate.toString()] &&
                    <MarkerLixeira
                        showCallout={false}
                        lixeira={lixeira}
                        iconStyle={style.markerIcon}
                        toggleCallout={this.togglePopup}
                        key={lixeira.coordinate.toString()}/>
                ))}
                {lixeiras.map((lixeira) => (markers[lixeira.coordinate.toString()] &&
                    <MarkerLixeira
                        showCallout={true}
                        lixeira={lixeira}
                        calloutTipHeight={16}
                        calloutPosition="right"
                        iconStyle={style.markerIcon}
                        calloutStyle={style.markerCallout}
                        toggleCallout={this.togglePopup}
                        key={lixeira.coordinate.toString()}
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
}

const style = StyleSheet.create({
    markerIcon : {
        width : 30,
        height : 30
    },
    markerCallout : {
        width : 150,
        height : 150,
    }
})

export default Map