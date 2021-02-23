import React, { useRef, useEffect } from 'react'
import {
    View,
    Animated,
    Pressable,
    StyleSheet,
    Easing,
    GestureResponderEvent,
    Dimensions,
    ScrollView
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import LixeiraPod from './LixeiraPod'

const LixeiraDrawer : React.FC = () => {

    const y = useRef(new Animated.Value(-250)).current
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
                        <LixeiraPod lixeira={lixeira}/>
                    </View>
                ))}
            </ScrollView>
            <Pressable onTouchStart={onTouchStart} onTouchMove={onTouchMove}>
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
        width : 50,
        height : 50,
        backgroundColor : 'green'
    },
    list : {
        height : 250,
        flexDirection : 'column-reverse',
        paddingTop : 10,
        backgroundColor : 'gray'
    },
    podWrapper : {
        marginHorizontal : 10,
        marginBottom : 10
    }
})