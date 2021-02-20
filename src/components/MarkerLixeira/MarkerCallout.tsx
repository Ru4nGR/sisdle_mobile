import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Callout from 'src/components/MarkerLixeira/Callout'
import { Lixeira } from 'src/reducers/lixeirasSlice'

interface Props {
    lixeira : Lixeira
}

const MarkerCallout : React.FC<Props> = (props) => {
    return (
        <MapboxGL.MarkerView id={props.lixeira.id} anchor={{x : -0.1, y : 0.5}} coordinate={props.lixeira.coordinates}>
            <Pressable style={styles.container}>
                <Callout lixeira={props.lixeira}/>
            </Pressable>
        </MapboxGL.MarkerView>
    )
}

export default MarkerCallout

const styles = StyleSheet.create({
    container : {
        width : 164,
        height : 200,
    }
})