import React from 'react'
import {MAPBOX_ACCESS_TOKEN} from 'sisdle_mobile/src/api/constants.js'
import MapboxGl from '@react-native-mapbox-gl/maps'

MapboxGl.setAccessToken(MAPBOX_ACCESS_TOKEN)

class Map extends React.Component {

    componentDidMount(){
        MapboxGl.setTelemetryEnabled(false)
    }

    render() {
        return (
            <MapboxGl.MapView style={{flex : 1}}/>
        )
    }
}

export default Map