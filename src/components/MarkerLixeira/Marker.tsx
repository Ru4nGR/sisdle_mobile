import React from 'react'
import {
    StyleSheet,
    Pressable
} from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Icon from './Icon'
import Callout from './Callout'
import { Lixeira, toggleLixeiraSelected } from 'src/reducers/lixeirasSlice'
import { useDispatch } from 'react-redux'

interface Props {
    lixeira : Lixeira
}

const Marker : React.FC<Props> = (props) => {

    const dispatch = useDispatch()

    const lixeira = props.lixeira

    function onSelect() {
        dispatch(toggleLixeiraSelected(lixeira.id))
    }

    function onDeselect() {
        dispatch(toggleLixeiraSelected(lixeira.id))
    }

    return (
        <MapboxGL.PointAnnotation onSelected={onSelect} onDeselected={onDeselect} id={lixeira.id} coordinate={lixeira.coordinates}>
            <Icon lixeira={lixeira}/>
        </MapboxGL.PointAnnotation>
    )
}
export default Marker

const styles = StyleSheet.create({
    container : {
        alignItems : 'center',
        flexDirection : 'row',
    }
})