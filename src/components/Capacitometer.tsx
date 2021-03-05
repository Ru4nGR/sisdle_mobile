import React from 'react'
import {
    View,
    Text,
    StyleProp,
    ViewStyle,
    TextStyle
} from 'react-native'
import { Lixeira } from 'src/reducers/lixeirasSlice'

interface Props {
    lixeira : Lixeira
    style : StyleProp<ViewStyle>
    styleTxt : StyleProp<TextStyle>
}

const Capacitometer : React.FC<Props> = (props) => {

    const lixeira = props.lixeira

    return(
        <View style={props.style}>
            <View style={{
                flex : lixeira.properties.capacity,
                backgroundColor : lixeira.properties.capacity < 80 ? 'green' : 'red'
            }}/>
            <View style={{flex : 100 - lixeira.properties.capacity}}/>
            <Text style={props.styleTxt}>{lixeira.properties.capacity + '%'}</Text>
        </View>
    )
}

export default Capacitometer