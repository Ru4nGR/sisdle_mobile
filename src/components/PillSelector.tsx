import React, { useState } from 'react'
import {
    View,
    Pressable,
    StyleSheet,
    GestureResponderEvent
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface Props {
    options : any,
    selected : any,
    btnCancel : boolean,
    onChange : (option : string) => void,
    onBtnCancelPress : (event : GestureResponderEvent) => void
}

const PillSelector : React.FC<Props> = (props) => {

    const [showOptions, setShowOptions] = useState(false)

    function toggleOptions() {
        setShowOptions(prevShowOptions => !prevShowOptions)
    }

    function select(value : any) {
        props.onChange(value)
        toggleOptions()
    }
    
    const icons = props.options
    const selected = props.selected
    const options = Object.keys(props.options) 
    const btnCancel = props.btnCancel
    const onBtnCancelPress = props.onBtnCancelPress

    return (
        <View style={styles.container}>
            <Pressable style={styles.selection} onPress={toggleOptions}>
                {icons[selected]}
            </Pressable>
            {showOptions && options.map((option) => (
                <Pressable key={option} style={styles.btnOption} onPress={() => select(option)}>
                    {icons[option]}
                </Pressable>
            ))}
            {btnCancel &&
                <Pressable style={styles.btnOption} onPress={onBtnCancelPress}>
                    <Icon size={30} name='close'/>
                </Pressable>
            }
        </View>
    )
}
export default PillSelector

const styles = StyleSheet.create({
    container : {
        borderRadius : 25,
        flexDirection : 'row',
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
    }
})