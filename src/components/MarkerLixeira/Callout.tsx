import React from 'react'
import {
    Text,
    View,
    Button,
    StyleSheet
} from 'react-native'

interface Lixeira {
    id : number,
    capacity : number,
    coordinate : Array<number>
}

interface Props {
    lixeira : Lixeira,
    onButtonPress : (lixeira : Lixeira) => void,
}

const Callout : React.FC<Props> = (props) => {

    const lixeira = props.lixeira
    const onButtonPress = props.onButtonPress

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

const styles = StyleSheet.create({
    container : {
        flexDirection : 'row-reverse'
    },
    content : {
        padding: 8,
        width : 150,
        height : 150,
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: 'white',
        justifyContent : 'space-around',
        borderColor: 'rgba(0, 0, 0, 0.2)'
    },
    capacity : {
        color: 'black',
        textAlign: 'center',
    },
    tip : {
        marginRight: -2,
        borderTopWidth: 8,
        borderLeftWidth: 0,
        borderRightWidth: 16,
        borderBottomWidth: 8,
        borderRightColor: 'white',
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
    }
})

export default Callout