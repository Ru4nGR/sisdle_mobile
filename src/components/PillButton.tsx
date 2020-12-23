import React from 'react'
import {
    View,
    StyleSheet,
    Pressable,
    GestureResponderEvent,
    ViewStyle
} from 'react-native'

interface Props {
    onPress : (event : GestureResponderEvent) => void,
    onPressIn : (event : GestureResponderEvent) => void,
    style : ViewStyle,
    onPressOut : (event : GestureResponderEvent) => void,
    onLongPress : (event : GestureResponderEvent) => void
}

class PillButton extends React.Component<Props> {

    render() {

        const onPress = this.props.onPress
        const onPressIn = this.props.onPressIn
        const width = parseFloat(this.props.style.width!.toString())
        const height = parseFloat(this.props.style.height!.toString())
        const onPressOut = this.props.onPressOut
        const onLongPress = this.props.onLongPress
        const backgroundColor = this.props.style.backgroundColor

        const style = StyleSheet.create({
            button : {
                width : width,
                height : height,
                overflow : 'hidden',
                justifyContent : 'center',
                alignItems : 'center',
                backgroundColor : backgroundColor,
                borderRadius : Math.min(width, height) / 2
            }
        })

        return (
            <View style={style.button}>
                {this.props.children}
                <Pressable
                    style={{width : '100%', height : '100%', position : 'absolute'}}
                    onPress={onPress}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    onLongPress={onLongPress}
                    android_ripple={{color : 'white'}}/>
            </View>
        )
    }
}

export default PillButton