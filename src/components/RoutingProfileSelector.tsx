import React, { useState } from 'react'
import {
    View,
    Pressable,
    StyleSheet,
    GestureResponderEvent
} from 'react-native'
import {RoutingProfile} from 'src/api/rotas'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface Props {
    selected : RoutingProfile,
    btnCancel : boolean,
    onChange : (option : string) => void,
    onBtnCancelPress : (event : GestureResponderEvent) => void
}

const icons = {
    [RoutingProfile.Driving] : '',
    [RoutingProfile.Walking] : 'directions-walk',
    [RoutingProfile.Cycling] : 'directions-bike',
    [RoutingProfile.DrivingTraffic] : 'directions-car'
}

const PillSelector : React.FC<Props> = (props) => {

    const [showOptions, setShowOptions] = useState(false)

    function toggleOptions() {
        setShowOptions(prevShowOptions => !prevShowOptions)
    }

    function select(value : RoutingProfile) {
        props.onChange(value)
        toggleOptions()
    }
    
    const selected = props.selected
    const btnCancel = props.btnCancel
    const onBtnCancelPress = props.onBtnCancelPress

    return (
        <View style={styles.container}>
            <Pressable style={styles.selection} onPress={toggleOptions}>
                <Icon name={icons[selected]} style={styles.iconOption}/>
            </Pressable>
            {showOptions &&
                <>
                <Pressable style={styles.btnOption} onPress={() => select(RoutingProfile.DrivingTraffic)}>
                    <Icon name='directions-car' style={styles.iconOption}/>
                </Pressable>
                <Pressable style={styles.btnOption} onPress={() => select(RoutingProfile.Walking)}>
                    <Icon name='directions-walk' style={styles.iconOption}/>
                </Pressable>
                <Pressable style={styles.btnOption} onPress={() => select(RoutingProfile.Cycling)}>
                    <Icon name='directions-bike' style={styles.iconOption}/>
                </Pressable>
                </>
            }
            {btnCancel &&
                <Pressable style={styles.btnOption} onPress={onBtnCancelPress}>
                    <Icon style={styles.iconOption}name='close'/>
                </Pressable>
            }
        </View>
    )
}
export default PillSelector

const styles = StyleSheet.create({
    container : {
        borderRadius : 25,
        flexDirection : 'column-reverse',
        backgroundColor : 'lightgray'
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