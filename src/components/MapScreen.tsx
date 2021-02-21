import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text
} from 'react-native'
import Map from 'src/components/Map'
import { loadLixeiras, Status } from 'src/reducers/lixeirasSlice'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import Splash from './Splash'
import IconGenerator, { IconColection } from './IconGenerator'
import ControllLayer from 'src/components/ControllLayer'
import LixeiraPod from 'src/components/LixeiraPod'
import LixeiraDrawer from 'src/components/LixeiraDrawer'

const MapScreen : React.FC = () => {

    const dispatch = useDispatch()

    const status = useSelector((state : RootState) => state.lixeiras.status)
    const error = useSelector((state : RootState) => state.lixeiras.error)
    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)
    const sorted = useSelector((state : RootState) => state.lixeiras.sorted)

    const [icons, setIcons] = useState<IconColection>({})
    const [followUserLocation, setFollowUserLocation] = useState(true)

    const camera = useRef<MapboxGL.Camera>(null)

    useEffect(() => {
        if (status === Status.Idle) {
            dispatch(loadLixeiras())
        }
    }, [])

    useEffect(() => {
        camera.current?.flyTo(sorted[0].coordinates, 1000)
    }, [sorted])

    function onSort() {
        setFollowUserLocation(false)
    }

    function onIconGeneratorFinish(icons : IconColection) {
        setIcons(icons)
    }

    return (
        <View style={{flex : 1}}>
            {(status === Status.Fulfilled && Object.values(icons).length != lixeiras.length) &&
                <IconGenerator onFinish={onIconGeneratorFinish}/>
            }
            {(status === Status.Pending || Object.values(icons).length != lixeiras.length) &&
                <Splash/>
            }
            {(status === Status.Fulfilled && Object.values(icons).length == lixeiras.length) && 
                <>
                <Map
                    icons={icons}
                    cameraRef={camera}
                    onTouchStart={() => setFollowUserLocation(false)}
                    followUserLocation={followUserLocation}/>
                <ControllLayer onCenterOnUserPress={() => setFollowUserLocation(true)} onSort={onSort}/>
                {sorted.length != 0 &&
                    <View style={{position : 'absolute', width : '100%', height : '100%'}}>
                        <LixeiraDrawer/>
                    </View>
                }
                </>
            }
            {status === Status.Rejected &&
                <Text style={{flex : 1, textAlign : 'center', textAlignVertical : 'center'}}>{error}</Text>
            }
        </View>
    )
}
export default MapScreen