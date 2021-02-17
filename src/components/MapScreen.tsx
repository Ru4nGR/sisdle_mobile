import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    StyleSheet,
    Pressable,
    Text
} from 'react-native'
import Map from 'src/components/Map'
import Sorter from 'src/components/Sorter'
import { deselectAllLixeiras, Lixeira, loadLixeiras, setLixeiras, Status, toggleLixeiraSelected } from 'src/reducers/lixeirasSlice'
import RoutingProfileSelector from 'src/components/RoutingProfileSelector'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import Splash from './Splash'

const MapScreen : React.FC = () => {

    const dispatch = useDispatch()

    const status = useSelector((state : RootState) => state.lixeiras.status)
    const error = useSelector((state : RootState) => state.lixeiras.error)
    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)

    const [sorted, setSorted] = useState(false)
    const [followUserLocation, setFollowUserLocation] = useState(true)

    const camera = useRef<MapboxGL.Camera>(null)

    useEffect(() => {
        if (status === Status.Idle) {
            dispatch(loadLixeiras())
        }
    }, [])

    useEffect(() => {
        if (sorted) {
            camera.current?.flyTo(lixeiras[0].coordinates, 1000)
            setTimeout(() => {
                dispatch(toggleLixeiraSelected(lixeiras[0].id))
            }, 1000);
            setSorted(false)
        }
    }, [sorted])

    function onSort(lixeiras : Array<Lixeira>) {
        dispatch(setLixeiras(lixeiras))
        dispatch(deselectAllLixeiras())
        setFollowUserLocation(false)
        setSorted(true)
    }

    return (
        <View style={{flex : 1}}>
            {status === Status.Fulfilled && 
                <>
                <Map
                    cameraRef={camera}
                    onTouchStart={() => setFollowUserLocation(false)}
                    followUserLocation={followUserLocation}/>
                <View style={styles.controlLayer}>
                    <View>
                        <RoutingProfileSelector/>
                    </View>
                    <View>
                        <Sorter onSort={onSort}/>
                    </View>
                    <Pressable onPress={() => setFollowUserLocation(true)} style={styles.btnCenterOnUserLocation}>
                        <Icon name='gps-fixed' style={styles.iconCenterOnUserLocation}/>
                    </Pressable>
                </View>
                </>
            }
            {status === Status.Pending &&
                <Splash/>
            }
            {status === Status.Rejected &&
                <Text style={{flex : 1, textAlign : 'center', textAlignVertical : 'center'}}>{error}</Text>
            }
        </View>
    )
}
export default MapScreen

const styles = StyleSheet.create({
    controlLayer : {
        bottom : 0,
        width : '100%',
        position : 'absolute',
        marginVertical : 30,
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        alignItems : 'flex-end'
    },
    filler : {
        width : 50,
        height : 50,
    },
    btnCenterOnUserLocation : {
        width : 50,
        height : 50,
        borderRadius : 25,
        backgroundColor : '#2196F3',
        justifyContent : 'center',
        alignItems : 'center'
    },
    iconCenterOnUserLocation : {
        fontSize : 30,
        color : 'white'
    }
})