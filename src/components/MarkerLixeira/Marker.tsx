import React from 'react'
import {
    StyleSheet,
} from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Icon from './Icon'
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
        <MapboxGL.PointAnnotation
            id={lixeira.id}
            onSelected={onSelect}
            onDeselected={onDeselect}
            coordinate={lixeira.coordinates}>
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