import React from 'react'
import {
    View,
    Text,
    Pressable,
    StyleSheet
} from 'react-native'
import {Lixeira} from 'src/api/lixeiras'
import {magnitude} from 'src/utils/complicatedGeometry'

interface Props {
    userLocation : Array<number>
    lixeiras : Array<Lixeira>
}

const Sorter : React.FC<Props> = (props) => {

    function byDistance() {
        return props.lixeiras.sort(
            (a, b) => {
                const da = magnitude([
                    parseFloat(a.longitude) - props.userLocation[0],
                    parseFloat(a.latitude) - props.userLocation[1]
                ])
                const db = magnitude([
                    parseFloat(b.longitude) - props.userLocation[0],
                    parseFloat(b.latitude) - props.userLocation[1]
                ])
                return da - db
            }
        )
    }

    function byCapacity() {
        return props.lixeiras.sort((a, b) => a.capacity - b.capacity)
    }

    function byNormalizedProduct() {
        const distances = byDistance().map(lixeira => {
            return magnitude([
                parseFloat(lixeira.longitude) - props.userLocation[0],
                parseFloat(lixeira.latitude) - props.userLocation[1]
            ])
        })
        const capacities = byCapacity().map(lixeira => lixeira.capacity)

        const minD = distances[0]
        const maxD = distances[distances.length - 1]

        const minC = capacities[0]
        const maxC = capacities[capacities.length - 1]

        return props.lixeiras.sort(
            (a, b) => {
                const da = magnitude([
                    parseFloat(a.longitude) - props.userLocation[0],
                    parseFloat(a.latitude) - props.userLocation[1]
                ])
                const db = magnitude([
                    parseFloat(b.longitude) - props.userLocation[0],
                    parseFloat(b.latitude) - props.userLocation[1]
                ])

                // normalized distance
                const nda = 1 - (da - minD) / (maxD - minD)
                const ndb = 1 - (db - minD) / (maxD - minD)

                //normalized capacity
                const nca = 1 - (a.capacity - minC) / (maxC - minC)
                const ncb = 1 - (b.capacity - minC) / (maxC - minC)

                return (ndb * ncb) - (nda * nca)
            }
        )
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={() => console.log(byNormalizedProduct())} style={styles.btn}>
                <Text style={{color : 'white'}}>
                    Lixeira mais proxima
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        width : 200,
        height : 50,
        borderRadius : 25,
        overflow : 'hidden',
        flexDirection : 'row',
        backgroundColor : '#2196F3'
    },
    btn : {
        flex : 3,
        alignItems : 'center',
        justifyContent : 'center',
        flexDirection : 'row',
    }
})

export default Sorter