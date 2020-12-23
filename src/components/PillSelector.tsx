import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import PillButton from './PillButton'

interface Props {
    selected : any,
    onChange : (option : string) => void,
    buttonStyle : ViewStyle,
    selectionColor : string,
    style : ViewStyle,
    options : any
}

interface State {
    showOptions : boolean,
    selected : any
}

class PillSelector extends React.Component<Props, State> {

    constructor(props : Props) {
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

    select = (value : any) => {
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
        
        let width : number
        let height : number

        if (flexDirection === 'row' || flexDirection === 'row-reverse') {
            width = showOptions ? (options.length + 1) * parseFloat(buttonStyle.width!.toString()) : parseFloat(buttonStyle.width!.toString())
            height = parseFloat(buttonStyle.height!.toString())
        }
        else if (flexDirection === 'column' || flexDirection === 'column-reverse') {
            width = parseFloat(buttonStyle.width!.toString())
            height = showOptions ? (options.length + 1) * parseFloat(buttonStyle.height!.toString()) : parseFloat(buttonStyle.height!.toString())
        }

        const style = StyleSheet.create({
            container : {
                flexDirection : flexDirection,
                width : width!,
                height : height!,
                backgroundColor : backgroundColor,
                borderRadius : Math.min(width!, height!) / 2
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
                <PillButton onLongPress={() => {}} onPressIn={() => {}} onPressOut={() => {}} style={style.selection} onPress={this.toggleOptions}>
                    {icons[selected]}
                </PillButton>
                {this.state.showOptions && options.map((option) => (
                    <PillButton onLongPress={() => {}} onPressIn={() => {}} onPressOut={() => {}} key={option} style={style.option} onPress={() => {
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