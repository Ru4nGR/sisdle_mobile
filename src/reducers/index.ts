import { combineReducers } from '@reduxjs/toolkit'
import lixeirasReducer from './lixeirasSlice'
import userPositionReducer from './userPositionSlice'
import routeSlice from './routeSlice'
import routingProfileSlice from './routingProfileSlice'

const rootReducer = combineReducers({
    lixeiras : lixeirasReducer,
    userPosition : userPositionReducer,
    route : routeSlice,
    routingProfile : routingProfileSlice
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer