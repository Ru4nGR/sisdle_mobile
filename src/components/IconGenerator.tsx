import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    View
} from 'react-native'
import ViewShot from 'react-native-view-shot'
import Icon from 'src/components/MarkerLixeira/Icon'
import { useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import { Lixeira } from 'src/reducers/lixeirasSlice'

export interface IconColection {
    [key : string] : string
}

interface Props {
    onFinish : (icons : IconColection) => void
}

const IconGenerator : React.FC<Props> = (props) => {

    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)
    const [icons, setIcons] = useState<IconColection>({})
    
    useEffect(() => {
        if (Object.values(icons).length == lixeiras.length) {
            props.onFinish(icons)
        }
    }, [icons])

    function onCapture(uri : string, lixeira : Lixeira) {
        const out = {...icons}
        out[lixeira.capacity.toString()] = uri
        setIcons(out)
    }

    return (
        <View>
            {lixeiras.map(lixeira => (
                <ViewShot
                    key={lixeira.id}
                    captureMode='mount'
                    style={styles.container}
                    options={{result : 'data-uri'}}
                    onCapture={(uri) => onCapture(uri, lixeira)}>
                    <Icon lixeira={lixeira}/>
                </ViewShot>
            ))}
        </View>
    )
}

export default IconGenerator

const styles = StyleSheet.create({
    container : {
        width : 30,
        height : 30
    }
})