import React, { useRef, useEffect } from 'react'
import {
    View,
    Animated,
    Pressable,
    StyleSheet,
    Easing,
    GestureResponderEvent
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import LixeiraPod from './LixeiraPod'

const LixeiraDrawer : React.FC = () => {

    const y = useRef(new Animated.Value(0)).current
    let pageY0 = useRef(0).current
    let y0 = useRef(0).current
    let dy = useRef(0).current
    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)
    
    function onTouchMove(e : GestureResponderEvent) {
        dy = e.nativeEvent.pageY - pageY0
        y.setValue(y0 + dy)
    }

    function onPressIn(e : GestureResponderEvent) {
        pageY0 = e.nativeEvent.pageY
        y0 = (y as any)._value
    }

    return (
        <Animated.View style={[styles.container, {transform : [{translateY : y}]}]}>
            <LixeiraPod onTouchStart={onPressIn} onTouchMove={onTouchMove} lixeira={lixeiras[0]}/>
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
    }
})