import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    StyleSheet,
    Pressable,
    ActivityIndicator
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import { Lixeira } from 'src/reducers/lixeirasSlice'
import { loadRoute, Status } from 'src/reducers/routeSlice'

interface Props {
    lixeira : Lixeira
}

const Callout : React.FC<Props> = (props) => {

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
            dispatch(loadRoute({
                start : userLocation,
                finish : lixeira.coordinates,
            }))
            setStatus(Status.Pending)
        }
    }

    const localSize = Math.sqrt(140*35/lixeira.location.length)
    const descricaoSize = Math.sqrt(140*20/lixeira.description.length)

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={[styles.txtLocation, {fontSize : localSize}]}>
                    {lixeira.location}
                </Text>
                <View style={styles.separator}/>
                <Text style={styles.txtCapacity}>
                    {lixeira.capacity + '%'}
                </Text>
                <Text style={[styles.txtDescription, {fontSize : descricaoSize}]}>
                    {lixeira.description}
                </Text>
                <Pressable style={styles.btnRoute} onPress={onBtnRoutePress}>
                    {status === Status.Idle &&
                        <Text style={{color : 'white'}}>Rota</Text>
                    }
                    {status === Status.Pending &&
                        <ActivityIndicator color='white'/>
                    }
                </Pressable>
            </View>
            <View style={{alignItems : 'center', justifyContent: 'center'}}>
                <View style={styles.tip}/>
            </View>
        </View>
    )
}
export default Callout

const styles = StyleSheet.create({
    container : {
        flexDirection : 'row-reverse'
    },
    content : {
        padding: 8,
        width : 150,
        height : 200,
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: 'white',
        borderColor: 'rgba(0, 0, 0, 0.2)'
    },
    txtLocation : {
        textAlign : 'center',
        textAlignVertical : 'center',
        height : 35,
    },
    separator : {
        width : '100%',
        height : StyleSheet.hairlineWidth,
        backgroundColor : 'gray',
        marginVertical : 9
    },
    txtCapacity : {
        color: 'black',
        textAlign: 'center',
        textAlignVertical : 'center',
        flex : 2
    },
    txtDescription : {
        textAlign : 'center',
        color : 'lightgray',
        height : 20,
        marginBottom : 5
    },
    btnRoute : {
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#2196F3',
        flex : 1
    },
    tip : {
        marginRight: -2,
        borderTopWidth: 8,
        borderLeftWidth: 0,
        borderRightWidth: 16,
        borderBottomWidth: 8,
        borderRightColor: 'white',
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
    }
})