import React from 'react'
import {
    View,
    Pressable,
    StyleSheet
} from 'react-native'

interface Props {
    options : any,
    selected : any,
    onChange : (option : string) => void
}

interface State {
    showOptions : boolean,
}

class PillSelector extends React.Component<Props, State> {

    constructor(props : Props) {
        super(props)
        this.state = {
            showOptions : false
        }
    }

    toggleOptions = () => {
        this.setState((state) => ({
            showOptions : !state.showOptions
        }))
    }

    select = (value : any) => {
        this.props.onChange(value)
        this.toggleOptions()
    }
    
    render() {
        
        const icons = this.props.options
        const selected = this.props.selected
        const options = Object.keys(this.props.options) 

        return (
            <View style={styles.container}>
                <Pressable style={styles.selection} onPress={this.toggleOptions}>
                    {icons[selected]}
                </Pressable>
                {this.state.showOptions && options.map((option) => (
                    <Pressable key={option} style={styles.option} onPress={() => this.select(option)}>
                        {icons[option]}
                    </Pressable>
                ))}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        borderRadius : 25,
        flexDirection : 'row',
        backgroundColor : 'lightgray'
    },
    selection : {
        width : 50,
        height : 50,
        borderRadius : 25,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : '#2196F3'
    },
    option : {
        width : 50,
        height : 50,
        borderRadius : 25,
        alignItems : 'center',
        justifyContent : 'center'
    }
})

export default PillSelector