import React from 'react'
import {
    View,
    StyleSheet, Pressable
} from 'react-native'

let style

class IconLixeira extends React.Component {
    constructor(props){
        super(props)

        const width = this.props.style.width
        const height = this.props.style.height

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

        const onPress = this.props.onPress
        const width = this.props.style.width
        const capacity = this.props.capacity

        return (
            <Pressable onPress={onPress} style={style.icon}>
                <View style={{
                    width : width,
                    flex : 100 - capacity,
                    backgroundColor : 'white'
                }}/>
                <View style={{
                    width : width,
                    flex : capacity,
                    backgroundColor : capacity < 80 ? 'green' : 'red'
                }}/>
            </Pressable>
        )
    }
}

export default IconLixeira