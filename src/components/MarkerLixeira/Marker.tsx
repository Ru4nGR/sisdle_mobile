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
    lixeira : Lixeira
}

const Marker : React.FC<Props> = (props) => {

    const lixeira = props.lixeira

    return (
        <MapboxGL.MarkerView id={lixeira.id} anchor={lixeira.selected ? {x : 15 / 194, y : 0.5} : {x : 0.5, y : 0.5}} coordinate={lixeira.coordinates}>
            <Pressable style={[styles.container, {width : lixeira.selected ? 194 : 30}]}>
                <Icon lixeira={lixeira}/>
                {lixeira.selected &&
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