import { combineReducers } from '@reduxjs/toolkit'
import lixeirasReducer from './lixeirasSlice'
import userPositionReducer from './userPositionSlice'
import routeReducer from './routeSlice'
import locationPermissionReducer from './locationPermissionSlice'

const rootReducer = combineReducers({
    lixeiras : lixeirasReducer,
    userPosition : userPositionReducer,
    route : routeReducer,
    locationPermission : locationPermissionReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer