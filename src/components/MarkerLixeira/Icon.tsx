import React from 'react'
import {
    View,
    StyleSheet, Pressable, ViewStyle, GestureResponderEvent, StyleProp
} from 'react-native'

interface Lixeira {
    capacity : number
}

interface Props {
    lixeira : Lixeira,
    onPress : (event : GestureResponderEvent) => void
}

class Icon extends React.Component<Props> {

    render() {

        const lixeira = this.props.lixeira
        const onPress = this.props.onPress

        return (
            <Pressable onPress={onPress} style={styles.container}>
                <View style={{flex : 100 - lixeira.capacity}}/>
                <View style={{
                    flex : lixeira.capacity,
                    backgroundColor : lixeira.capacity < 80 ? 'green' : 'red'
                }}/>
            </Pressable>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        width : 30,
        height : 30,
        borderRadius : 15,
        overflow : 'hidden',
        borderWidth : 1,
        backgroundColor : 'white'
    }
})

export default Icon