import React from 'react'
import {
    PermissionsAndroid,
} from 'react-native'
import {MAPBOX_ACCESS_TOKEN} from 'src/api/constants'
import MapboxGL from '@react-native-mapbox-gl/maps'
import MarkerLixeira from 'src/components/MarkerLixeira'

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

interface Lixeira {
    id : number,
    coordinate : Array<number>,
    capacity : number
}

interface Props {
    route : any,
    lixeiras : Array<Lixeira>,
    onMarkerCalloutButtonPress : any,
    onUserLocationUpdate : any,
}

interface State {
    markers : any
}

class Map extends React.Component<Props, State> {

    constructor(props : Props){
        super(props)
        requestLocationPermission()
        this.state = {
            markers : {},
        }
    }

    togglePopup = (key : number) => {
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
                {lixeiras.map((lixeira) => (!markers[lixeira.id] &&
                    <MarkerLixeira
                        key={lixeira.id}
                        lixeira={lixeira}
                        toggleCallout={this.togglePopup}/>
                ))}
                {lixeiras.map((lixeira) => (markers[lixeira.id] &&
                    <MarkerLixeira
                        key={lixeira.id}
                        lixeira={lixeira}
                        toggleCallout={this.togglePopup}
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

export default Map