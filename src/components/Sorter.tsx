import React, {useRef, useState} from 'react'
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Animated,
    Easing
} from 'react-native'
import { Lixeira } from 'src/reducers/lixeirasSlice'
import {magnitude} from 'src/utils/complicatedGeometry'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux'
import { RootState } from 'src/reducers'

enum SortingMethod {
    ByDistance = 'Distância',
    ByCapacity = 'Capacidade',
    ByNormalizedProduct = 'Automático'
}

interface Props {
    onSort : (lixeiras : Array<Lixeira>) => void
}

const Sorter : React.FC<Props> = (props) => {

    const userLocation = useSelector((state : RootState) => state.userPosition)
    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)

    const [isOpen, setIsOpen] = useState(false)
    const [sortingMethod, setSortingMethod] = useState(SortingMethod.ByNormalizedProduct)

    const y = useRef(new Animated.Value(200)).current

    function selectMethod(method : SortingMethod) {
        setSortingMethod(method)
        toggleOptions()
    }

    function sort(method : SortingMethod) {
        if (method  == SortingMethod.ByNormalizedProduct) {
            return byNormalizedProduct()
        }
        else if (method == SortingMethod.ByDistance) {
            return byDistance()
        }
        // if (method == SortingMethod.ByCapacity)
        else {
            return byCapacity()
        }
    }
    
    function byNormalizedProduct() {
        const distances = byDistance().map(lixeira => {
            return magnitude([
                lixeira.coordinates[0] - userLocation[0],
                lixeira.coordinates[1] - userLocation[1]
            ])
        })
        const capacities = byCapacity().map(lixeira => lixeira.capacity)

        const minD = distances[0]
        const maxD = distances[distances.length - 1]

        const minC = capacities[0]
        const maxC = capacities[capacities.length - 1]

        return lixeiras.slice().sort(
            (a, b) => {
                const da = magnitude([
                    a.coordinates[0] - userLocation[0],
                    a.coordinates[1] - userLocation[1]
                ])
                const db = magnitude([
                    b.coordinates[0] - userLocation[0],
                    b.coordinates[1] - userLocation[1]
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

    function byDistance() {
        return lixeiras.slice().sort(
            (a, b) => {
                const da = magnitude([
                    a.coordinates[0] - userLocation[0],
                    a.coordinates[1] - userLocation[1]
                ])
                const db = magnitude([
                    b.coordinates[0] - userLocation[0],
                    b.coordinates[1] - userLocation[1]
                ])
                return da - db
            }
        )
    }

    function byCapacity() {
        return lixeiras.slice().sort((a, b) => a.capacity - b.capacity)
    }

    function toggleOptions() {
        if (isOpen) {
            setIsOpen(false)
            Animated.timing(y, {
                toValue : 201,
                duration : 500,
                useNativeDriver : true,
                easing : Easing.out(Easing.exp)
            }).start()
        }
        else {
            setIsOpen(true)
            Animated.timing(y, {
                toValue : 50,
                duration : 500,
                useNativeDriver : true,
                easing : Easing.out(Easing.exp)
            }).start()
        }
    }

    return (
        <View pointerEvents='box-none' style={styles.container}>
            <Animated.View style={[styles.containerOptions, {transform : [{translateY : y}]}]}>
                <Pressable onPress={() => selectMethod(SortingMethod.ByNormalizedProduct)} style={styles.btnOption}>
                    <Text>{SortingMethod.ByNormalizedProduct}</Text>
                </Pressable>
                <View style={styles.hSeparator}/>
                <Pressable onPress={() => selectMethod(SortingMethod.ByDistance)} style={styles.btnOption}>
                    <Text>{SortingMethod.ByDistance}</Text>
                </Pressable>
                <View style={styles.hSeparator}/>
                <Pressable onPress={() => selectMethod(SortingMethod.ByCapacity)} style={styles.btnOption}>
                    <Text>{SortingMethod.ByCapacity}</Text>
                </Pressable>
                <View style={styles.filler}/>
            </Animated.View>
            <View style={styles.btnGroup}>
                <Pressable onPress={() => props.onSort(sort(sortingMethod))} style={styles.btn}>
                    <Text style={styles.txtBtn}>
                        {sortingMethod}
                    </Text>
                </Pressable>
                <View style={styles.vSeparator}/>
                <Pressable onPress={toggleOptions} style={styles.btnSelector}>
                    <Icon style={styles.iconSelector} name={isOpen ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}/>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        borderRadius : 25,
        overflow : 'hidden'
    },
    containerOptions : {
        borderRadius : 25,
        backgroundColor : 'lightgray',
    },
    filler : {
        height : 50
    },
    btnGroup : {
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
    },
    txtBtn : {
        color : 'white'
    },
    vSeparator : {
        width : 2 * StyleSheet.hairlineWidth,
        backgroundColor : 'black',
        opacity : 0.1,
        marginVertical : 10
    },
    hSeparator : {
        height : StyleSheet.hairlineWidth,
        backgroundColor : 'black',
        opacity : 0.1,
        marginHorizontal : 10
    },
    btnSelector : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    },
    iconSelector : {
        color : 'white',
        fontSize : 20
    },
    btnOption : {
        height : 50,
        width : 200,
        justifyContent : 'center',
        alignItems : 'center'
    }
})

export default Sorter