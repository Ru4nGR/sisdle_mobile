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
    showCallout : boolean,
    iconStyle : ViewStyle,
    toggleCallout : (id : number) => void
    calloutPosition : 'top' | 'bottom' | 'left' | 'right',
    calloutTipHeight : number,
    calloutOnButtonPress : (lixeira : Lixeira) => void,
    calloutStyle : ViewStyle
}

class Marker extends React.Component<Props> {

    render() {

        const lixeira = this.props.lixeira
        const showCallout = this.props.showCallout
        const minWidth = parseFloat(this.props.iconStyle.width!.toString())
        const minHeight = parseFloat(this.props.iconStyle.height!.toString())
        const toggleCallout = this.props.toggleCallout
        const calloutPosition = this.props.calloutPosition
        const calloutTipHeight = this.props.calloutTipHeight
        const calloutOnButtonPress = this.props.calloutOnButtonPress
        
        let width
        let height
        let anchor

        let style = {
            icon : this.props.iconStyle,
            callout : this.props.calloutStyle,
            container : {}
        }

        if (showCallout){
            if (calloutPosition === 'top') {

                width = Math.max(minWidth, parseFloat(style.callout.width!.toString()))
                height = minHeight + parseFloat(style.callout.height!.toString()) + calloutTipHeight

                anchor = {
                    x : 0.5,
                    y : 1 - (parseFloat(style.icon.height!.toString()) / (2 * height))
                }
            }
            else if (calloutPosition === 'bottom') {

                width = Math.max(minWidth, parseFloat(style.callout.width!.toString()))
                height = minHeight + parseFloat(style.callout.height!.toString()) + calloutTipHeight

                anchor = {
                    x : 0.5,
                    y : parseFloat(style.icon.height!.toString()) / (2 * height)
                }
            }
            else if (calloutPosition === 'left') {

                width = minWidth + parseFloat(style.callout.width!.toString()) + calloutTipHeight
                height = Math.max(minHeight, parseFloat(style.callout.height!.toString()))

                anchor = {
                    x : 1 - (parseFloat(style.icon.width!.toString()) / (2 * width)),
                    y : 0.5
                }
            }
            else if (calloutPosition === 'right') {

                width = minWidth + parseFloat(style.callout.width!.toString()) + calloutTipHeight
                height = Math.max(minHeight, parseFloat(style.callout.height!.toString()))

                anchor = {
                    x : parseFloat(style.icon.width!.toString()) / (2 * width),
                    y : 0.5
                }
            }
        }
        else {
            width = minWidth
            height = minHeight
            anchor = {
                x : 0.5,
                y : 0.5
            }
        }

        style.container = {
            width : width,
            height : height,
            alignItems : 'center',
            flexDirection : calloutPositions[calloutPosition]
        }

        style = StyleSheet.create(style)

        return (
            <MapboxGL.MarkerView id={''} anchor={anchor} coordinate={lixeira.coordinate}>
                <Pressable style={style.container}>
                    <Icon
                        style={style.icon}
                        lixeira={lixeira}
                        onPress={() => toggleCallout(lixeira.id)}/>
                    {this.props.showCallout &&
                        <Callout
                            style={style.callout}
                            lixeira={lixeira}
                            position={calloutPosition}
                            tipHeight={calloutTipHeight}
                            onButtonPress={calloutOnButtonPress}/>
                    }
                </Pressable>
            </MapboxGL.MarkerView>
        )
    }
}

export default Marker