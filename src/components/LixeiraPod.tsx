import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    GestureResponderEvent
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import { Lixeira } from 'src/reducers/lixeirasSlice'
import { loadRoute, Status } from 'src/reducers/routeSlice'
import Draggable from 'react-native-draggable'
import Capacitometer from 'src/components/Capacitometer'

interface Props {
    lixeira : Lixeira
    onTouchMove : (event : GestureResponderEvent) => void
    onTouchStart : (event : GestureResponderEvent) => void
}

const LixeiraPod : React.FC<Props> = (props) => {

    const dispatch = useDispatch()

    const routeStatus = useSelector((state : RootState) => state.route.status)
    const userLocation = useSelector((state : RootState) => state.userPosition)
    const [status, setStatus] = useState(Status.Idle)
    const lixeira = props.lixeira

    useEffect(() => {
        if (routeStatus != Status.Pending) {
            setStatus(Status.Idle)
        }
    }, [routeStatus])

    function onBtnRoutePress() {
        if (routeStatus != Status.Pending) {
            console.log('press')
            dispatch(loadRoute({
                start : userLocation,
                finish : lixeira.coordinates,
            }))
            setStatus(Status.Pending)
        }
    }

    return (
        <Pressable onTouchStart={props.onTouchStart} onTouchMove={props.onTouchMove} style={styles.container}>
            <View style={styles.content}>
                <Pressable onPress={onBtnRoutePress} style={styles.btnRoute}>
                    {status === Status.Idle &&
                        <Icon style={styles.iconRoute} name='directions'/>
                    }
                    {status === Status.Pending &&
                        <ActivityIndicator color='white'/>
                    }
                </Pressable>
                <View style={{flex : 1}}>
                    <Text style={styles.txtLocation}>{lixeira.location}</Text>
                    <Text style={styles.txtDescription}>{lixeira.description}</Text>
                </View>
                <Pressable style={styles.btnOpenDrawer}>
                    <Icon style={styles.iconOpenDrawer} name='keyboard-arrow-down'/>
                </Pressable>
            </View>
            <Capacitometer lixeira={lixeira} style={styles.capacitometer} styleTxt={styles.txtCapacitometer}/>
        </Pressable>
    )
}

export default LixeiraPod

const styles = StyleSheet.create({
    container : {
        width : Dimensions.get('screen').width,
        height : 85,
        backgroundColor : 'white',
        borderBottomLeftRadius : 20,
        borderBottomRightRadius : 20,
        overflow : 'hidden'
    },
    capacitometer : {
        flex : 1,
        flexDirection : 'row'
    },
    txtCapacitometer : {
        position : 'absolute',
        bottom : 0,
        width : '100%',
        textAlign : 'center',
        fontSize : 12
    },
    content : {
        position : 'absolute',
        width : '100%',
        height : 70,
        backgroundColor : 'white',
        borderBottomLeftRadius : 20,
        borderBottomRightRadius : 20,
        elevation : 20,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        paddingHorizontal : 10
    },
    txtLocation : {
        flex : 2,
        textAlign : 'center',
        textAlignVertical : 'center',
        fontSize : 17
    },
    btnRoute : {
        width : 50,
        height : 50,
        backgroundColor : '#2196F3',
        borderRadius : 25,
        justifyContent : 'center',
        alignItems : 'center',
    },
    iconRoute : {
        fontSize : 30,
        color : 'white'
    },
    txtDescription : {
        color : 'gray',
        fontSize : 10,
        position : 'absolute',
        width : '100%',
        bottom : 0,
        height : 20,
        textAlign : 'center',
        textAlignVertical : 'center',
    },
    btnOpenDrawer : {
        width : 50,
        height : 50,
        justifyContent : 'center',
        alignItems : 'center',
    },
    iconOpenDrawer : {
        fontSize : 30
    }
})