import React from 'react'
import { StyleSheet, View } from 'react-native'
import PillButton from './PillButton'

class PillSelector extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showOptions : false,
            selected : this.props.selected
        }
    }

    toggleOptions = () => {
        this.setState((state) => ({
            showOptions : !state.showOptions
        }))
    }

    select = (value) => {
        this.setState({
            selected : value
        })
        this.toggleOptions()
    }
    
    render() {

        const selected = this.state.selected
        const onChange = this.props.onChange
        const showOptions = this.state.showOptions
        const buttonStyle = this.props.buttonStyle
        const selectionColor = this.props.selectionColor
        const flexDirection = this.props.style.flexDirection
        const backgroundColor = this.props.style.backgroundColor

        const icons = this.props.options
        const options = Object.keys(this.props.options)
        
        let width
        let height

        if (flexDirection === 'row' || flexDirection === 'row-reverse') {
            width = showOptions ? (options.length + 1) * buttonStyle.width : buttonStyle.width
            height = buttonStyle.height
        }
        else if (flexDirection === 'column' || flexDirection === 'column-reverse') {
            width = buttonStyle.width
            height = showOptions ? (options.length + 1) * buttonStyle.height : buttonStyle.height
        }

        const style = StyleSheet.create({
            container : {
                flexDirection : flexDirection,
                width : width,
                height : height,
                backgroundColor : backgroundColor,
                borderRadius : Math.min(width, height) / 2
            },
            selection : {
                ...buttonStyle,
                backgroundColor : selectionColor
            },
            option : {
                ...buttonStyle
            }
        })
        return (
            <View style={style.container}>
                <PillButton style={style.selection} onPress={this.toggleOptions}>
                    {icons[selected]}
                </PillButton>
                {this.state.showOptions && options.map((option) => (
                    <PillButton key={option} style={style.option} onPress={() => {
                        this.select(option)
                        onChange && onChange(option)
                    }}>
                        {icons[option]}
                    </PillButton>
                ))}
            </View>
        )
    }
}


export default PillSelector