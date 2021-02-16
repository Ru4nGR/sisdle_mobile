import { combineReducers } from '@reduxjs/toolkit'
import lixeirasReducer from './lixeirasSlice'

const rootReducer = combineReducers({
    lixeiras : lixeirasReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer