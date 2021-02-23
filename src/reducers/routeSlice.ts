import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRoute, RoutingProfile } from 'src/api/routes'
import { RootState } from 'src/reducers'

export enum Status {
    Idle,
    Pending,
    Fulfilled,
    Rejected
}

export const loadRoute = createAsyncThunk<
    {
        start : Array<number>,
        finish : Array<number>,
        route : any
    },
    {
        start : Array<number>
        finish : Array<number>
    },
    {
        state : RootState
    }
> ('route/loadRoute', async (payload, thunkAPI) => {
    const { start, finish } = payload
    const route = await getRoute(start, finish, thunkAPI.getState().route.profile)
    return {start, finish, route}
})

export const setProfile = createAsyncThunk<void, RoutingProfile, {state : RootState}>('route/setProfile', (profile, thunkApi) => {
    const status = thunkApi.getState().route.status

    thunkApi.dispatch(routeSlice.actions.setProfile(profile))

    if (status === Status.Fulfilled) {
        const start = thunkApi.getState().route.cache.start!
        const finish = thunkApi.getState().route.cache.finish!
        thunkApi.dispatch(loadRoute({start, finish}))
    }
})

interface State {
    data : GeoJSON.LineString | undefined,
    cache : {
        start : Array<number> | undefined
        finish : Array<number> | undefined
    },
    profile : RoutingProfile
    status : Status,
    error : string
}

const initialState : State = {
    data : undefined,
    cache : {
        start : undefined,
        finish : undefined
    },
    profile : RoutingProfile.DrivingTraffic,
    status : Status.Idle,
    error : ''
}

const routeSlice = createSlice({
    name : 'route',
    initialState,
    reducers : {
        clear(state) {
            state.status = Status.Idle
            state.data = undefined
            state.cache = {
                start : undefined,
                finish : undefined
            }
        },
        setProfile(state, action : {payload : RoutingProfile}) {
            state.profile = action.payload
        }
    },
    extraReducers : builder => {
        builder.addCase(loadRoute.pending, (state, action) => {
            state.status = Status.Pending
        })
        builder.addCase(loadRoute.fulfilled, (state, action) => {
            state.status = Status.Fulfilled
            const {start, finish, route} = action.payload
            state.data = route
            state.cache = {
                start : start,
                finish : finish
            }
        })
        builder.addCase(loadRoute.rejected, (state, action) => {
            state.status = Status.Rejected
            state.error = action.error.message != undefined ? action.error.message : ''
        })
    }
})

export default routeSlice.reducer
export const {
    clear
} = routeSlice.actions