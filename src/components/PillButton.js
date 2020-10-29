import React from 'react'
import {
    View,
    StyleSheet,
    Pressable
} from 'react-native'

class PillButton extends React.Component {

    render() {

        const onPress = this.props.onPress
        const onPresIn = this.props.onPresIn
        const width = this.props.style.width
        const height = this.props.style.height
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
                    onPresIn={onPresIn}
                    onPresOut={onPressOut}
                    onLongPress={onLongPress}
                    android_ripple={{color : 'white'}}/>
            </View>
        )
    }
}

export default PillButton