import React, { useState } from 'react'
import {
    View,
    Pressable,
    StyleSheet
} from 'react-native'

interface Props {
    options : any,
    selected : any,
    onChange : (option : string) => void
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

    return (
        <View style={styles.container}>
            <Pressable style={styles.selection} onPress={toggleOptions}>
                {icons[selected]}
            </Pressable>
            {showOptions && options.map((option) => (
                <Pressable key={option} style={styles.option} onPress={() => select(option)}>
                    {icons[option]}
                </Pressable>
            ))}
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
    option : {
        width : 50,
        height : 50,
        borderRadius : 25,
        alignItems : 'center',
        justifyContent : 'center'
    }
})