import React, { useEffect, useRef } from 'react'
import {
    StyleSheet,
    View
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
    const ref = useRef<MapboxGL.PointAnnotation>(null)

    useEffect(() => {
        ref.current?.refresh()
    }, [sorted])

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
            ref={ref}
            onSelected={onSelect}
            onDeselected={onDeselect}
            coordinate={lixeira.coordinates}>
            <View style={[styles.halo, {backgroundColor : sorted.indexOf(lixeira) == 0 ? 'yellow' : 'transparent'}]}>
                <Icon lixeira={lixeira}/>
            </View>
        </MapboxGL.PointAnnotation>
    )
}
export default Marker

const styles = StyleSheet.create({
    halo : {
        width : 40,
        height : 40,
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 20
    }
})