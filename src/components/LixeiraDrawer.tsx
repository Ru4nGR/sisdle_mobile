import React, { useRef } from 'react'
import {
    View,
    Animated,
    Pressable,
    StyleSheet,
    GestureResponderEvent,
    ScrollView
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import LixeiraPod from 'src/components/LixeiraPod'
import LixeiraPodSmall from 'src/components/LixeiraPodSmall'

const LixeiraDrawer : React.FC = () => {

    const y = useRef(new Animated.Value(-210)).current
    let pageY0 = useRef(0).current
    let y0 = useRef(0).current
    let dy = useRef(0).current
    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)
    
    function onTouchMove(e : GestureResponderEvent) {
        dy = e.nativeEvent.pageY - pageY0
        console.log((y as any)._value)
        if (y0 + dy <= 0) {
            y.setValue(y0 + dy)
        }
        else {
            y.setValue(0)
        }
    }

    function onTouchStart(e : GestureResponderEvent) {
        pageY0 = e.nativeEvent.pageY
        y0 = (y as any)._value
    }

    return (
        <Animated.View style={[styles.container, {transform : [{translateY : y}]}]}>
            <ScrollView style={styles.list}>
                {lixeiras.map(lixeira => lixeiras.indexOf(lixeira) != 0 && (
                    <View key={lixeira.id} style={styles.podWrapper}>
                        <LixeiraPodSmall lixeira={lixeira}/>
                    </View>
                ))}
            </ScrollView>
            <Pressable style={styles.handle} onTouchStart={onTouchStart} onTouchMove={onTouchMove}>
                <LixeiraPod lixeira={lixeiras[0]}/>
            </Pressable>
        </Animated.View>
    )
}

export default LixeiraDrawer

const styles = StyleSheet.create({
    container : {

    },
    handle : {
        backgroundColor : 'white',
        borderBottomLeftRadius : 20,
        borderBottomRightRadius : 20,
        elevation : 10
    },
    list : {
        height : 210,
        flexDirection : 'column-reverse',
        backgroundColor : 'white'
    },
    podWrapper : {
        marginHorizontal : 10,
        marginBottom : 10,
        backgroundColor : 'white',
        elevation : 7,
        borderRadius : 20
    }
})