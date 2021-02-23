import React from 'react'
import {
    View,
    Pressable,
    StyleSheet,
    PermissionsAndroid
} from 'react-native'
import Sorter from 'src/components/Sorter'
import RoutingProfileSelector from 'src/components/RoutingProfileSelector'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { Lixeira, setSorted } from 'src/reducers/lixeirasSlice'
import { RootState } from 'src/reducers'
import { requestLocationPermission } from 'src/reducers/locationPermissionSlice'

interface Props {
    onSort : () => void
    onCenterOnUserPress : () => void
}

const ControllLayer : React.FC<Props> = (props) => {

    const dispatch = useDispatch()

    const permission = useSelector((state : RootState) => state.locationPermission.data)

    function onSort(lixeiras : Array<Lixeira>) {
        dispatch(setSorted(lixeiras))
        props.onSort()
    }

    function onBtnCenterOnUserLocation() {
        if (permission == PermissionsAndroid.RESULTS.GRANTED) {
            props.onCenterOnUserPress()
        }
        else {
            dispatch(requestLocationPermission())
        }
    }

    return (
        <View style={styles.controlLayer}>
            <View>
                <RoutingProfileSelector/>
            </View>
            <View>
                <Sorter onSort={onSort}/>
            </View>
            <Pressable onPress={onBtnCenterOnUserLocation} style={styles.btnCenterOnUserLocation}>
                <Icon name='gps-fixed' style={styles.iconCenterOnUserLocation}/>
            </Pressable>
        </View>
    )
}

export default ControllLayer

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