import React from 'react'
import {
    View,
    StyleSheet, Pressable
} from 'react-native'

let style

class Icon extends React.Component {
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