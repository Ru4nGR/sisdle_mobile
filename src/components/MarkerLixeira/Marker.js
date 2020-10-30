import React from 'react'
import {
    StyleSheet,
    Pressable
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

class Marker extends React.Component {

    render() {

        const lixeira = this.props.lixeira
        const showCallout = this.props.showCallout
        const minWidth = this.props.iconStyle.width
        const minHeight = this.props.iconStyle.height
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

                width = Math.max(minWidth, style.callout.width)
                height = minHeight + style.callout.height + calloutTipHeight

                anchor = {
                    x : 0.5,
                    y : 1 - (style.icon.height / (2 * height))
                }
            }
            else if (calloutPosition === 'bottom') {

                width = Math.max(minWidth, style.callout.width)
                height = minHeight + style.callout.height + calloutTipHeight

                anchor = {
                    x : 0.5,
                    y : style.icon.height / (2 * height)
                }
            }
            else if (calloutPosition === 'left') {

                width = minWidth + style.callout.width + calloutTipHeight
                height = Math.max(minHeight, style.callout.height)

                anchor = {
                    x : 1 - (style.icon.width / (2 * width)),
                    y : 0.5
                }
            }
            else if (calloutPosition === 'right') {

                width = minWidth + style.callout.width + calloutTipHeight
                height = Math.max(minHeight, style.callout.height)

                anchor = {
                    x : style.icon.width / (2 * width),
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
            <MapboxGL.MarkerView anchor={anchor} coordinate={lixeira.coordinate}>
                <Pressable style={style.container}>
                    <Icon
                        style={style.icon}
                        lixeira={lixeira}
                        onPress={() => toggleCallout(lixeira.coordinate.toString())}/>
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