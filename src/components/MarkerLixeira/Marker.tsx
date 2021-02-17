import React from 'react'
import {
    StyleSheet,
    Pressable
} from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Icon from './Icon'
import Callout from './Callout'
import { Lixeira } from 'src/reducers/lixeirasSlice'

interface Props {
    lixeira : Lixeira,
    toggleCallout : (id : string) => void
    calloutOnButtonPress? : (lixeira : Lixeira) => void,
}

const Marker : React.FC<Props> = (props) => {

    const lixeira = props.lixeira
    const toggleCallout = props.toggleCallout
    const calloutOnButtonPress = props.calloutOnButtonPress

    const showCallout = calloutOnButtonPress != undefined

    return (
        <MapboxGL.MarkerView id={lixeira.id} anchor={showCallout ? {x : 15 / 194, y : 0.5} : {x : 0.5, y : 0.5}} coordinate={lixeira.coordinate}>
            <Pressable style={[styles.container, {width : showCallout ? 194 : 30}]}>
                <Icon lixeira={lixeira} onPress={() => toggleCallout(lixeira.id)}/>
                {showCallout &&
                    <Callout lixeira={lixeira}/>
                }
            </Pressable>
        </MapboxGL.MarkerView>
    )
}
export default Marker

const styles = StyleSheet.create({
    container : {
        alignItems : 'center',
        flexDirection : 'row',
    }
})