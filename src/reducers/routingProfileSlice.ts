import { createSlice } from '@reduxjs/toolkit'
import { RoutingProfile } from 'src/api/routes'

const routingProfileSlice = createSlice({
    name : 'routingProfile',
    initialState : RoutingProfile.DrivingTraffic,
    reducers : {
        set(state, action) {
            state = action.payload
        }
    }
})

export default routingProfileSlice.reducer
export const {
    set
} = routingProfileSlice.actions