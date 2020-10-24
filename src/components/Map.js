import React from 'react'
import {
    StyleSheet
} from 'react-native'
import {MAPBOX_ACCESS_TOKEN} from 'sisdle_mobile/src/api/constants'
import MapboxGL from '@react-native-mapbox-gl/maps'
import {getLixeiras} from 'sisdle_mobile/src/api/lixeiras'
import MarkerLixeira from 'sisdle_mobile/src/components/MarkerLixeira'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)
const lixeiras = getLixeiras()

class Map extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            markers : {}
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
        return (
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
                            capacity={lixeira.properties.capacity}/>
                    }
                })}
            </MapboxGL.MapView>
        )
    }
}

const style = StyleSheet.create({
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