import React, { useRef, useState } from 'react'
import {
    View,
    Pressable,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native'
import {RoutingProfile} from 'src/api/routes'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import { clear, setProfile, Status } from 'src/reducers/routeSlice'

const icons = {
    [RoutingProfile.Driving] : '',
    [RoutingProfile.Walking] : 'directions-walk',
    [RoutingProfile.Cycling] : 'directions-bike',
    [RoutingProfile.DrivingTraffic] : 'directions-car'
}

const PillSelector : React.FC = () => {

    const dispatch = useDispatch()

    const status = useSelector((state : RootState) => state.route.status)
    const profile = useSelector((state : RootState) => state.route.profile)
    const [isOpen, setIsOpen] = useState(false)
    const y = useRef(new Animated.Value(50)).current

    function toggleOptions() {
        if (isOpen) {
            setIsOpen(false)
            Animated.timing(y, {
                toValue : 50,
                duration : 500,
                useNativeDriver : true,
                easing : Easing.out(Easing.exp)
            }).start()
        }
        else {
            setIsOpen(true)
            Animated.timing(y, {
                toValue : 200,
                duration : 500,
                useNativeDriver : true,
                easing : Easing.out(Easing.exp)
            }).start()
        }
    }

    function select(value : RoutingProfile) {
        dispatch(setProfile(value))
        toggleOptions()
    }

    function onBtnCancelPress() {
        dispatch(clear())
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.containerOptions, {transform : [{translateY : y}]}]}>
                {status === Status.Fulfilled &&
                    <Pressable style={styles.btnOption} onPress={onBtnCancelPress}>
                        <Icon style={styles.iconOption} name='close'/>
                    </Pressable>
                }
                <Pressable style={styles.btnOption} onPress={() => select(RoutingProfile.Walking)}>
                    <Icon name='directions-walk' style={styles.iconOption}/>
                </Pressable>
                <Pressable style={styles.btnOption} onPress={() => select(RoutingProfile.Cycling)}>
                    <Icon name='directions-bike' style={styles.iconOption}/>
                </Pressable>
                <Pressable style={styles.btnOption} onPress={() => select(RoutingProfile.DrivingTraffic)}>
                    <Icon name='directions-car' style={styles.iconOption}/>
                </Pressable>
                <View style={styles.filler}/>
            </Animated.View>
            <Pressable style={styles.selection} onPress={toggleOptions}>
                <Icon name={icons[profile]} style={styles.iconOption}/>
            </Pressable>
        </View>
    )
}
export default PillSelector

const styles = StyleSheet.create({
    container : {
        overflow : 'hidden',
        borderRadius : 25
    },
    containerOptions : {
        backgroundColor : 'lightgray',
        borderRadius : 25,
    },
    filler : {
        width : 50,
        height : 50
    },
    selection : {
        width : 50,
        height : 50,
        borderRadius : 25,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : '#2196F3'
    },
    btnOption : {
        width : 50,
        height : 50,
        borderRadius : 25,
        alignItems : 'center',
        justifyContent : 'center'
    },
    iconOption : {
        fontSize : 30,
        color : 'white'
    }
})