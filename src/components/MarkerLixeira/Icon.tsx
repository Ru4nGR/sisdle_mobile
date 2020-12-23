import React from 'react'
import {
    View,
    StyleSheet, Pressable, ViewStyle, GestureResponderEvent, StyleProp
} from 'react-native'

interface Lixeira {
    capacity : number
}

interface Props {
    style : ViewStyle,
    lixeira : Lixeira,
    onPress : (event : GestureResponderEvent) => void
}

interface Style {
    [key : string] : StyleProp<ViewStyle>
}

let style : Style

class Icon extends React.Component<Props> {
    constructor(props : Props){
        super(props)

        const width = parseFloat(this.props.style.width!.toString())
        const height = parseFloat(this.props.style.height!.toString())

        style = StyleSheet.create({
            icon : {
                width : width,
                height : height,
                borderWidth : 1,
                overflow : 'hidden',
                flexDirection : 'column',
                borderRadius : Math.max(width, height) / 2,
            }
        })
    }

    render() {

        const lixeira = this.props.lixeira
        const onPress = this.props.onPress
        const width = this.props.style.width

        return (
            <Pressable onPress={onPress} style={style.icon}>
                <View style={{
                    width : width,
                    flex : 100 - lixeira.capacity,
                    backgroundColor : 'white'
                }}/>
                <View style={{
                    width : width,
                    flex : lixeira.capacity,
                    backgroundColor : lixeira.capacity < 80 ? 'green' : 'red'
                }}/>
            </Pressable>
        )
    }
}

export default Icon