import React from 'react'
import {
    Text,
    View,
    Button,
    StyleSheet,
    Pressable
} from 'react-native'
import { Lixeira } from 'src/api/lixeiras'

interface Props {
    lixeira : Lixeira,
    onButtonPress : (lixeira : Lixeira) => void,
}

const Callout : React.FC<Props> = (props) => {

    const lixeira = props.lixeira
    const onButtonPress = props.onButtonPress

    const localSize = Math.sqrt(140*35/lixeira.local.length)
    const descricaoSize = Math.sqrt(140*20/lixeira.descricao.length)

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={[styles.txtLocal, {fontSize : localSize}]}>
                    {lixeira.local}
                </Text>
                <View style={styles.separator}/>
                <Text style={styles.txtCapacity}>
                    {lixeira.capacity + '%'}
                </Text>
                <Text style={[styles.txtDescricao, {fontSize : descricaoSize}]}>
                    {lixeira.descricao}
                </Text>
                <Pressable style={styles.btnRota} onPress={() => onButtonPress(lixeira)}>
                    <Text>Rota</Text>
                </Pressable>
            </View>
            <View style={{alignItems : 'center', justifyContent: 'center'}}>
                <View style={styles.tip}/>
            </View>
        </View>
    )
}
export default Callout

const styles = StyleSheet.create({
    container : {
        flexDirection : 'row-reverse'
    },
    content : {
        padding: 8,
        width : 150,
        height : 200,
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: 'white',
        borderColor: 'rgba(0, 0, 0, 0.2)'
    },
    txtLocal : {
        textAlign : 'center',
        textAlignVertical : 'center',
        height : 35,
    },
    separator : {
        width : '100%',
        height : StyleSheet.hairlineWidth,
        backgroundColor : 'gray',
        marginVertical : 9
    },
    txtCapacity : {
        color: 'black',
        textAlign: 'center',
        textAlignVertical : 'center',
        flex : 2
    },
    txtDescricao : {
        textAlign : 'center',
        color : 'lightgray',
        height : 20,
        marginBottom : 5
    },
    btnRota : {
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#2196F3',
        flex : 1
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