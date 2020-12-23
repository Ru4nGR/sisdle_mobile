import React from 'react'
import {
    StyleSheet,
    Pressable,
    ViewStyle,
} from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Icon from './Icon'
import Callout from './Callout'

const calloutPositions = {
    'top' : 'column-reverse',
    'bottom' : 'column',
    'left' : 'row-reverse',
    'right' : 'row'
}

interface Lixeira {
    id : number,
    coordinate : Array<number>,
    capacity : number
}

interface Props {
    lixeira : Lixeira,
    toggleCallout : (id : number) => void
    calloutOnButtonPress? : (lixeira : Lixeira) => void,
}

class Marker extends React.Component<Props> {

    render() {

        const lixeira = this.props.lixeira
        const toggleCallout = this.props.toggleCallout
        const calloutOnButtonPress = this.props.calloutOnButtonPress
        const showCallout = calloutOnButtonPress != undefined

        return (
            <MapboxGL.MarkerView id={''} anchor={showCallout ? {x : 15 / 194, y : 0.5} : {x : 0.5, y : 0.5}} coordinate={lixeira.coordinate}>
                <Pressable style={[styles.container, {width : showCallout ? 194 : 30}]}>
                    <Icon lixeira={lixeira} onPress={() => toggleCallout(lixeira.id)}/>
                    {showCallout &&
                        <Callout lixeira={lixeira} onButtonPress={calloutOnButtonPress!}/>
                    }
                </Pressable>
            </MapboxGL.MarkerView>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        alignItems : 'center',
        flexDirection : 'row',
    }
})

export default Marker