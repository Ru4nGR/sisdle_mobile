import React from 'react'
import {
    StyleSheet,
    Pressable
} from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import IconLixeira from './IconLixeira'
import PopupLixeira from './PopupLixeira'

const popupPositions = {
    'top' : 'column-reverse',
    'bottom' : 'column',
    'left' : 'row-reverse',
    'right' : 'row'
}

class MarkerLixeira extends React.Component {

    render() {

        const capacity = this.props.capacity
        const showPopup = this.props.showPopup
        const coordinate = this.props.coordinate
        const togglePopup = this.props.togglePopup
        const minWidth = this.props.iconStyle.width
        const minHeight = this.props.iconStyle.height
        const popupPosition = this.props.popupPosition
        const popupTipHeight = this.props.popupTipHeight
        
        let width
        let height
        let anchor

        let style = {
            icon : this.props.iconStyle,
            popup : this.props.popupStyle,
            container : {}
        }

        if (showPopup){
            if (popupPosition === 'top') {

                width = Math.max(minWidth, style.popup.width)
                height = minHeight + style.popup.height + popupTipHeight

                anchor = {
                    x : 0.5,
                    y : 1 - (style.icon.height / (2 * height))
                }
            }
            else if (popupPosition === 'bottom') {

                width = Math.max(minWidth, style.popup.width)
                height = minHeight + style.popup.height + popupTipHeight

                anchor = {
                    x : 0.5,
                    y : style.icon.height / (2 * height)
                }
            }
            else if (popupPosition === 'left') {

                width = minWidth + style.popup.width + popupTipHeight
                height = Math.max(minHeight, style.popup.height)

                anchor = {
                    x : 1 - (style.icon.width / (2 * width)),
                    y : 0.5
                }
            }
            else if (popupPosition === 'right') {

                width = minWidth + style.popup.width + popupTipHeight
                height = Math.max(minHeight, style.popup.height)

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
            flexDirection : popupPositions[popupPosition]
        }

        style = StyleSheet.create(style)

        return (
            <MapboxGL.MarkerView anchor={anchor} coordinate={coordinate}>
                <Pressable style={style.container}>
                    <IconLixeira
                        style={style.icon}
                        capacity={capacity}
                        onPress={() => togglePopup(coordinate.toString())}/>
                    {this.props.showPopup &&
                        <PopupLixeira tipHeight={popupTipHeight} capacity={capacity} position={popupPosition} style={style.popup}/>
                    }
                </Pressable>
            </MapboxGL.MarkerView>
        )
    }
}

export default MarkerLixeira