import React from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import {
    Text,
    View,
    Button,
    StyleSheet
} from 'react-native'

interface Positions {
    [key : string] : 'column' | 'column-reverse' | 'row' | 'row-reverse'
}

const positions : Positions = {
    'top' : 'column',
    'bottom' : 'column-reverse',
    'left' : 'row',
    'right' : 'row-reverse'
}

interface Style {
    [key : string] : StyleProp<ViewStyle> | StyleProp<TextStyle>
}

interface Lixeira {
    id : number,
    coordinate : Array<number>,
    capacity : number
}

interface Props {
    lixeira : Lixeira,
    position : 'top' | 'bottom' | 'left' | 'right',
    tipHeight : number,
    onButtonPress : (lixeira : Lixeira) => void,
    style : ViewStyle
}

class Callout extends React.Component<Props> {

    render (){

        const lixeira = this.props.lixeira
        const position = this.props.position
        const tipHeight = this.props.tipHeight
        const onButtonPress = this.props.onButtonPress

        let style : Style = {
            container : {
                flexDirection : positions[position],
            },
            content: {
                padding: 8,
                borderWidth: 1,
                borderRadius: 3,
                backgroundColor: 'white',
                width : this.props.style.width,
                justifyContent : 'space-around',
                height : this.props.style.height,
                borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            capacity: {
                color: 'black',
                textAlign: 'center',
            },
            tip : {}
        }

        if (position === 'top') {
            style.tip = {
                marginTop: -2,

                borderTopWidth: tipHeight,
                borderRightWidth: 8,
                borderLeftWidth: 8,
                borderBottomWidth: 0,

                borderTopColor: 'white',
                borderRightColor: 'transparent',
                borderLeftColor: 'transparent',
                borderBottomColor: 'transparent',
                backgroundColor: 'transparent',
            }
        }
        else if (position === 'bottom') {
            style.tip = {
                marginBottom: -2,

                borderBottomWidth: tipHeight,
                borderRightWidth: 8,
                borderLeftWidth: 8,
                borderTopWidth: 0,

                borderBottomColor: 'white',
                borderRightColor: 'transparent',
                borderLeftColor: 'transparent',
                borderTopColor: 'transparent',
                backgroundColor: 'transparent',
            }
        }
        else if (position === 'left') {
            style.tip = {
                marginLeft: -2,

                borderLeftWidth: tipHeight,
                borderBottomWidth: 8,
                borderTopWidth: 8,
                borderRightWidth: 0,

                borderLeftColor: 'white',
                borderBottomColor: 'transparent',
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                backgroundColor: 'transparent',
            }
        }
        else if (position === 'right') {
            style.tip = {
                marginRight: -2,

                borderRightWidth: tipHeight,
                borderBottomWidth: 8,
                borderTopWidth: 8,
                borderLeftWidth: 0,

                borderRightColor: 'white',
                borderBottomColor: 'transparent',
                borderTopColor: 'transparent',
                borderLeftColor: 'transparent',
                backgroundColor: 'transparent',
            }
        }

        style = StyleSheet.create(style as StyleSheet.NamedStyles<ViewStyle | TextStyle>)

        return (
            <View style={style.container}>
                <View style={style.content}>
                    <Text style={style.capacity}>{lixeira.capacity + '%'}</Text>
                    <Button title='Rota' onPress={() => onButtonPress(lixeira)}/>
                </View>
                <View style={{alignItems : 'center', justifyContent: 'center'}}>
                    <View style={style.tip}/>
                </View>
            </View>
        )
    }
}

export default Callout