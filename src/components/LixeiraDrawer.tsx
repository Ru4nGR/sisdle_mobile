import React, { useRef, useEffect } from 'react'
import {
    View,
    Animated,
    Pressable,
    StyleSheet,
    Easing,
    GestureResponderEvent,
    PanResponder
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import LixeiraPod from './LixeiraPod'

const LixeiraDrawer : React.FC = () => {

    const y = useRef(new Animated.Value(0)).current
    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)

    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            pan.setOffset({
                x: (pan.x as any)._value,
                y: (pan.y as any)._value
            });
        },
        onPanResponderMove: Animated.event([
            null,
            { dx: pan.x, dy: pan.y }
        ], {useNativeDriver : false}),
        onPanResponderRelease: () => {
            pan.flattenOffset();
        }
    })).current;

    return (
        <Animated.View {...panResponder.panHandlers} style={[styles.container, {transform : [{translateY : pan.y}]}]}>
            <LixeiraPod lixeira={lixeiras[0]}/>
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