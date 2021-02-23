import React, { useRef, useState } from 'react'
import {
    View,
    Animated,
    Pressable,
    StyleSheet,
    GestureResponderEvent,
    ScrollView,
    FlatList
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
    const lixeiras = useSelector((state : RootState) => state.lixeiras.sorted)
    const [open, setOpen] = useState(false)
    
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

    function onBtnOpenPress() {
        if (open) {
            setOpen(false)
            y.setValue(-210)
        }
        else {
            setOpen(true)
            y.setValue(0)
        }
    }

    function onTouchEnd() {
        const value = (y as any)._value
        if (value > -105) {
            setOpen(true)
            y.setValue(0)
        }
        else {
            setOpen(false)
            y.setValue(-210)
        }
    }

    return (
        <Animated.View style={[styles.container, {transform : [{translateY : y}]}]}>
            <FlatList style={styles.list} inverted data={lixeiras.slice(1, lixeiras.length)} renderItem={({item, index}) => (
                <View style={[styles.podWrapper, index == lixeiras.length - 2 && {marginTop : 10}]}>
                    <LixeiraPodSmall lixeira={item}/>
                </View>
            )}/>
            <Pressable style={styles.handle} onTouchEnd={onTouchEnd} onTouchStart={onTouchStart} onTouchMove={onTouchMove}>
                <LixeiraPod open={open} onBtnOpenPress={onBtnOpenPress} lixeira={lixeiras[0]}/>
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