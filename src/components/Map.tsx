import React, { RefObject, useEffect } from 'react'
import {
    GestureResponderEvent,
    PermissionsAndroid,
    PixelRatio
} from 'react-native'
import {MAPBOX_ACCESS_TOKEN} from 'src/api/constants'
import MapboxGL, { OnPressEvent } from '@react-native-mapbox-gl/maps'
import { useDispatch, useSelector } from 'react-redux'
import { update } from 'src/reducers/userPositionSlice'
import { RootState } from 'src/reducers'
import { deselectAllLixeiras, Lixeira, toggleLixeiraSelected } from 'src/reducers/lixeirasSlice'
import { getProjectionOnLineString } from 'src/utils/complicatedGeometry'
import MarkerCallout from 'src/components/MarkerCallout'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)

interface Props {
    followUserLocation : boolean
    cameraRef : RefObject<MapboxGL.Camera>
    onTouchStart : (event : GestureResponderEvent) => void
    icons : any
}

const Map : React.FC<Props> = (props) => {

    const dispatch = useDispatch()

    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)
    const route = useSelector((state : RootState) => state.route.data)
    const userPosition = useSelector((state : RootState) => state.userPosition)

    useEffect(() => {
        MapboxGL.setTelemetryEnabled(false)
    }, [])

    function onPress() {
        dispatch(deselectAllLixeiras())
    }

    function onUserLocationUpdate(location : MapboxGL.Location) {
        dispatch(update([location.coords.longitude, location.coords.latitude]))
    }

    function onShapeSourcePress(feature : OnPressEvent) {
        dispatch(toggleLixeiraSelected((feature.features[0] as Lixeira).id))
    }

    const routePast : GeoJSON.LineString = route != undefined && JSON.parse(JSON.stringify(route))
    const routeLeft : GeoJSON.LineString = route != undefined && JSON.parse(JSON.stringify(route))
    if (route != undefined) {
        const projection = getProjectionOnLineString(userPosition, route.coordinates.slice())

        routePast.coordinates.splice(route.coordinates.indexOf(projection.segment[1]))
        routePast.coordinates.push(projection.projection)

        routeLeft.coordinates.splice(0, route.coordinates.indexOf(projection.segment[1]))
        routeLeft.coordinates.unshift(projection.projection)

    }
    
    return (
        <MapboxGL.MapView style={{flex : 1}} onTouchStart={props.onTouchStart} onPress={onPress}>
            <MapboxGL.Camera
                followUserLocation={props.followUserLocation}
                ref={props.cameraRef}/>
            <MapboxGL.Images images={props.icons}/>
            <MapboxGL.ShapeSource onPress={onShapeSourcePress} id='lixeiras_source' shape={lixeiras}>
                <MapboxGL.SymbolLayer style={{
                    iconImage : ['get', 'capacity'],
                    iconSize : 1 / PixelRatio.getPixelSizeForLayoutSize(1)
                }} id='lixeiras_symbol'/>
            </MapboxGL.ShapeSource>
            {lixeiras.features.map(lixeira => (lixeira.properties.selected && 
                <MarkerCallout key={lixeira.id} lixeira={lixeira}/>
            ))}
            <MapboxGL.UserLocation onUpdate={onUserLocationUpdate}/>
            {route &&
                <>
                <MapboxGL.ShapeSource id="route_past_shape" shape={routePast}>
                    <MapboxGL.LineLayer layerIndex={105} id="route_past_line" style={{lineColor : 'lightgray', lineWidth : 5, lineCap : 'round', lineJoin : 'round'}}/>
                </MapboxGL.ShapeSource>
                <MapboxGL.ShapeSource id="route_left_shape" shape={routeLeft}>
                    <MapboxGL.LineLayer layerIndex={105} id="route_left_line" style={{lineColor : 'blue', lineWidth : 5, lineCap : 'round', lineJoin : 'round'}}/>
                </MapboxGL.ShapeSource>
                </>
            }
        </MapboxGL.MapView>
    )
}
export default Map