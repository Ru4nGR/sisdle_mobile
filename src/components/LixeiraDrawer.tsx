import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Animated,
    Pressable,
    StyleSheet,
    GestureResponderEvent,
    ScrollView,
    FlatList,
    Easing,
    PanResponderGestureState
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import LixeiraPod from 'src/components/LixeiraPod'
import LixeiraPodSmall from 'src/components/LixeiraPodSmall'
import { Lixeira, setSorted } from 'src/reducers/lixeirasSlice'
import GestureRecognizer from 'react-native-swipe-gestures'

const LixeiraDrawer : React.FC = () => {

    const dispatch = useDispatch()

    let dy = useRef(0)
    let y0 = useRef(0)
    let pageY0 = useRef(0)
    const lastPopped = useRef(0)
    let animationLock = useRef(false)
    const list = useRef<FlatList>(null)
    const y = useRef(new Animated.Value(-210)).current
    
    const [isOpen, setIsOpen] = useState(false)
    const lixeiras = useSelector((state : RootState) => state.lixeiras.sorted)

    useEffect(() => {
        list.current?.scrollToOffset({animated : true, offset : 0})
    }, [lixeiras])

    function onSelect(lixeira : Lixeira) {
        const sorted = lixeiras.slice()
        const first = sorted[0]
        sorted.splice(lastPopped.current + 1, 0, first)
        sorted.splice(0, 1)

        lastPopped.current = sorted.indexOf(lixeira)
        sorted.splice(sorted.indexOf(lixeira), 1)
        sorted.unshift(lixeira)
        dispatch(setSorted(sorted))
    }

    function open() {
        setIsOpen(true)
        Animated.timing(y, {
            toValue : 0,
            duration : 500,
            easing : Easing.out(Easing.exp),
            useNativeDriver : true
        }).start(() => {
            animationLock.current = false
            y.setValue(0)
        })
    }

    function close() {
        setIsOpen(false)
        Animated.timing(y, {
            toValue : -210,
            duration : 500,
            easing : Easing.out(Easing.exp),
            useNativeDriver : true
        }).start(() => {
            animationLock.current = false
            y.setValue(-210)
        })
    }

    function disappear() {
        Animated.timing(y, {
            toValue : -295,
            duration : 500,
            easing : Easing.out(Easing.exp),
            useNativeDriver : true
        }).start(() => {
            animationLock.current = false
            dispatch(setSorted([]))
        })
    }
    
    function onTouchMove(e : GestureResponderEvent) {
        dy.current = e.nativeEvent.pageY - pageY0.current
        if (y0.current + dy.current <= -245) {
            y.setValue(-245)
        }
        else if (y0.current + dy.current <= 0) {
            y.setValue(y0.current + dy.current)
        }
        else {
            y.setValue(0)
        }
    }

    function onTouchStart(e : GestureResponderEvent) {
        pageY0.current = e.nativeEvent.pageY
        y0.current = (y as any)._value
    }

    function onBtnOpenPress() {
        if (!animationLock.current) {
            animationLock.current = true
            if (isOpen) {
                close()
            }
            else {
                open()
            }
        }
    }

    function onTouchEnd() {
        if (animationLock.current == false) {
            const value = (y as any)._value
            if (value > -105) {
                open()
            }
            else if (value == -245) {
                disappear()
            }
            else {
                close()
            }
        }
    }

    function onSwipe(gestureName : string, gestureState : PanResponderGestureState) {
        if (Math.abs(gestureState.vy) > 0.5) {
            animationLock.current = true
            if (gestureState.vy > 0) {
                if (!isOpen) {
                    open()
                }
            }
            else {
                if (isOpen) {
                    close()
                }
                else {
                    disappear()
                }
            }
        }
    }

    return (
        <Animated.View style={[styles.container, {transform : [{translateY : y}]}]}>
            <FlatList ref={list} style={styles.list} inverted data={lixeiras.slice(1, lixeiras.length)} renderItem={({item, index}) => (
                <Pressable onPress={() => onSelect(item)} style={[styles.podWrapper, index == lixeiras.length - 2 && {marginTop : 10}]}>
                    <LixeiraPodSmall lixeira={item}/>
                </Pressable>
            )}/>
            <GestureRecognizer onSwipe={onSwipe} style={styles.handle} onTouchEnd={onTouchEnd} onTouchStart={onTouchStart} onTouchMove={onTouchMove}>
                <LixeiraPod open={isOpen} onBtnOpenPress={onBtnOpenPress} lixeira={lixeiras[0]}/>
            </GestureRecognizer>
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