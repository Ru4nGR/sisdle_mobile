import { combineReducers } from '@reduxjs/toolkit'
import lixeirasReducer from './lixeirasSlice'
import userPositionReducer from './userPositionSlice'

const rootReducer = combineReducers({
    lixeiras : lixeirasReducer,
    userPosition : userPositionReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer