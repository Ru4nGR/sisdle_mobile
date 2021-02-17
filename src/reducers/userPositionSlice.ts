import { createSlice } from '@reduxjs/toolkit'

const userPositionSlice = createSlice({
    name : 'userPosition',
    initialState : [0, 0],
    reducers : {
        update(state, action) {
            return action.payload
        }
    }
})

export default userPositionSlice.reducer
export const {
    update
} = userPositionSlice.actions