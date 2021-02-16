import { configureStore } from '@reduxjs/toolkit'
import rootReducer from 'src/reducers'

export const store = configureStore({
    reducer : rootReducer
})