import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    StyleSheet,
    Pressable,
    Text
} from 'react-native'
import Map from 'src/components/Map'
import Sorter from 'src/components/Sorter'
import { getLixeiras } from 'src/api/lixeiras'
import { Lixeira, loadLixeiras, setLixeiras, Status } from 'src/reducers/lixeirasSlice'
import RoutingProfileSelector from 'src/components/RoutingProfileSelector'
import {
    Route,
    RoutingProfile,
    getRoute as APIGetRoute
} from 'src/api/routes'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { getOrtogonalProjection, magnitude, isOnSegment } from 'src/utils/complicatedGeometry'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/reducers'

const MapScreen : React.FC = () => {

    const dispatch = useDispatch()

    const status = useSelector((state : RootState) => state.lixeiras.status)
    const error = useSelector((state : RootState) => state.lixeiras.error)
    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)
    const userLocation = useSelector((state : RootState) => state.userPosition)

    const [sorted, setSorted] = useState(false)
    const [route, setRoute] = useState<Route | undefined>(undefined)
    const [followUserLocation, setFollowUserLocation] = useState(true)
    const [selectedLixeira, setSelectedLixeira] = useState<Lixeira | undefined>(undefined)
    const [routingProfile, setRoutingProfile] = useState<RoutingProfile>(RoutingProfile.DrivingTraffic)

    const camera = useRef<MapboxGL.Camera>(null)

    useEffect(() => {
        if (status === Status.Idle) {
            dispatch(loadLixeiras())
        }
    }, [])

    useEffect(() => {
        if (sorted) {
            camera.current?.flyTo(lixeiras![0].coordinate)
            setSorted(false)
        }
    }, [sorted])

    function onSort(lixeiras : Array<Lixeira>) {
        dispatch(setLixeiras(lixeiras))
        setFollowUserLocation(false)
        setSorted(true)
    }

    async function getRoute(lixeira : any) {
        if (userLocation != undefined) {
            const route = await APIGetRoute(userLocation, lixeira.coordinate, routingProfile)
            setSelectedLixeira(lixeira)
            setRoute(route)
        }
    }

    function onRoutingProfileChanged(value : any) {
        setRoutingProfile(value)
        if (route) {
            getRoute(selectedLixeira)
        }
    }

    let projection
    let newRoute = route && JSON.parse(JSON.stringify(route))
    if (route != undefined && userLocation != undefined) {
        const projections = []
        for (let j = 1; j < route.geometry.coordinates.length; j++) {
            const i = j - 1
            const result = getOrtogonalProjection(
                route.geometry.coordinates[i],
                route.geometry.coordinates[j],
                userLocation
            )
            if (isOnSegment(route.geometry.coordinates[i], route.geometry.coordinates[j], result)) {
                projections.push({
                    projection : result,
                    segment : [route.geometry.coordinates[i], route.geometry.coordinates[j]]
                })
            }
        }
        const closestPoint = [...route.geometry.coordinates].sort((a, b) => 
            magnitude([a[0] - userLocation[0], a[1] - userLocation[1]]) - magnitude([b[0] - userLocation[0], b[1] - userLocation[1]])
        )[0]
        projections.push({
            projection : closestPoint,
            segment : [closestPoint, route.geometry.coordinates[route.geometry.coordinates.indexOf(closestPoint) + 1]]
        })
        projections.sort((a, b) => {
            const da = magnitude([a.projection[0] - userLocation[0], a.projection[1] - userLocation[1]])
            const db = magnitude([b.projection[0] - userLocation[0], b.projection[1] - userLocation[1]])
            return da - db
        })
        projection = projections[0]
        newRoute.geometry.coordinates.splice(0, route.geometry.coordinates.indexOf(projection.segment[1]))
        newRoute.geometry.coordinates.unshift(projection.projection)
    }

    return (
        <View style={{flex : 1}}>
            {status === Status.Fulfilled && 
                <>
                <Map
                    cameraRef={camera}
                    lixeiras={lixeiras}
                    onTouchStart={() => setFollowUserLocation(false)}
                    followUserLocation={followUserLocation}
                    onMarkerCalloutButtonPress={getRoute}
                    route={newRoute?.geometry}/>
                <View style={styles.controlLayer}>
                    <View>
                        <RoutingProfileSelector
                            btnCancel={route != undefined}
                            onBtnCancelPress={() => setRoute(undefined)}
                            selected={routingProfile}
                            onChange={onRoutingProfileChanged}/>
                    </View>
                    <View>
                        <Sorter onSort={onSort}/>
                    </View>
                    <Pressable onPress={() => setFollowUserLocation(true)} style={styles.btnCenterOnUserLocation}>
                        <Icon name='gps-fixed' style={styles.iconCenterOnUserLocation}/>
                    </Pressable>
                </View>
                </>
            }
            {status === Status.Pending &&
                <Text style={{flex : 1, textAlign : 'center', textAlignVertical : 'center'}}>Carregando...</Text>
            }
            {status === Status.Rejected &&
                <Text style={{flex : 1, textAlign : 'center', textAlignVertical : 'center'}}>{error}</Text>
            }
        </View>
    )
}
export default MapScreen

const styles = StyleSheet.create({
    controlLayer : {
        bottom : 0,
        width : '100%',
        position : 'absolute',
        marginVertical : 30,
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        alignItems : 'flex-end'
    },
    filler : {
        width : 50,
        height : 50,
    },
    btnCenterOnUserLocation : {
        width : 50,
        height : 50,
        borderRadius : 25,
        backgroundColor : '#2196F3',
        justifyContent : 'center',
        alignItems : 'center'
    },
    iconCenterOnUserLocation : {
        fontSize : 30,
        color : 'white'
    }
})