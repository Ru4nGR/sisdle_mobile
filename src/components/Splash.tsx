import React from 'react'
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text
} from 'react-native'

const Splash : React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.txt}>SISDLE</Text>
            <ActivityIndicator size='large' color='#2196F3'/>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        position : 'absolute',
        width : '100%',
        height : '100%',
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : 'white'
    },
    txt : {
        position : 'absolute',
        top : '25%',
        fontSize : 50,
        opacity : 0.1
    }
})

export default Splash