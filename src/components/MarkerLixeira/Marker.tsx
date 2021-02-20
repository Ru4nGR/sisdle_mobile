import React from 'react'
import {
    StyleSheet,
    Pressable
} from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Icon from './Icon'
import Callout from './Callout'
import { Lixeira, selectLixeira } from 'src/reducers/lixeirasSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/reducers'

interface Props {
    lixeira : Lixeira
}

const Marker : React.FC<Props> = (props) => {

    const dispatch = useDispatch()

    const lixeira = props.lixeira
    const sorted = useSelector((state : RootState) => state.lixeiras.sorted)

    function onSelect() {
        dispatch(selectLixeira(lixeira.id))
    }

    function onDeselect() {
        if (sorted.indexOf(lixeira) == 0) {
            dispatch(selectLixeira(lixeira.id))
        }
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