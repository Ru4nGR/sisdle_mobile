import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Route, getRoute, RoutingProfile } from 'src/api/routes'

export enum Status {
    Idle,
    Pending,
    Fulfilled,
    Rejected
}

export const loadRoute = createAsyncThunk('route/loadRoute', async (
    payload : {
        start : Array<number>
        finish : Array<number>,
        profile : RoutingProfile
    }
) => {
    const { start, finish, profile } = payload
    const route = await getRoute(start, finish, profile)
    return route
})

const routeSlice = createSlice({
    name : 'route',
    initialState : {
        data : null,
        status : Status.Idle,
        error : ''
    },
    reducers : {

    },
    extraReducers : builder => {
        builder.addCase(loadRoute.pending, (state, action) => {
            state.status = Status.Pending
        })
        builder.addCase(loadRoute.fulfilled, (state, action) => {
            state.status = Status.Fulfilled
            state.data = action.payload
        })
        builder.addCase(loadRoute.rejected, (state, action) => {
            state.status = Status.Rejected
            state.error = action.error.message != undefined ? action.error.message : ''
        })
    }
})

export default routeSlice.reducer