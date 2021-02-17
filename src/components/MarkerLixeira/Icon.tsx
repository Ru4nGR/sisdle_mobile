import React from 'react'
import {
    View,
    Pressable,
    StyleSheet,
    GestureResponderEvent
} from 'react-native'
import { Lixeira } from 'src/reducers/lixeirasSlice'

interface Props {
    lixeira : Lixeira
    onPress : (event : GestureResponderEvent) => void
}

const Icon : React.FC<Props> = (props) => {

    const lixeira = props.lixeira
    const onPress = props.onPress

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
export default Icon

const styles = StyleSheet.create({
    container : {
        width : 30,
        height : 30,
        borderWidth : 1,
        borderRadius : 15,
        overflow : 'hidden',
        backgroundColor : 'white'
    }
})