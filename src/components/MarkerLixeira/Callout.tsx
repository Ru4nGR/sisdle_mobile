import React from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import {
    Text,
    View,
    Button,
    StyleSheet
} from 'react-native'

interface Lixeira {
    id : number,
    coordinate : Array<number>,
    capacity : number
}

interface Props {
    lixeira : Lixeira,
    onButtonPress : (lixeira : Lixeira) => void,
}

class Callout extends React.Component<Props> {

    render (){

        const lixeira = this.props.lixeira
        const onButtonPress = this.props.onButtonPress

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.capacity}>{lixeira.capacity + '%'}</Text>
                    <Button title='Rota' onPress={() => onButtonPress(lixeira)}/>
                </View>
                <View style={{alignItems : 'center', justifyContent: 'center'}}>
                    <View style={styles.tip}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flexDirection : 'row-reverse'
    },
    content : {
        padding: 8,
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: 'white',
        width : 150,
        justifyContent : 'space-around',
        height : 150,
        borderColor: 'rgba(0, 0, 0, 0.2)'
    },
    capacity : {
        color: 'black',
        textAlign: 'center',
    },
    tip : {
        marginRight: -2,
        borderRightWidth: 16,
        borderBottomWidth: 8,
        borderTopWidth: 8,
        borderLeftWidth: 0,
        borderRightColor: 'white',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        backgroundColor: 'transparent',
    }
})

export default Callout