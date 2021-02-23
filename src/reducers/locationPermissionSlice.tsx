import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { PermissionsAndroid } from 'react-native'

export enum Status {
    Idle,
    Pending,
    Fulfilled,
    Rejected
}

export const requestLocationPermission = createAsyncThunk('requestLocationPermission', async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    return granted
})

const locationPermissionSlice = createSlice({
    name : 'locationPermission',
    initialState : {
        data : PermissionsAndroid.RESULTS.DENIED,
        status : Status.Idle,
        error : ''
    },
    reducers : {

    },
    extraReducers : builder => {
        builder.addCase(requestLocationPermission.pending, (state, action) => {
            state.status = Status.Pending
        })
        builder.addCase(requestLocationPermission.fulfilled, (state, action) => {
            state.status = Status.Fulfilled
            state.data = action.payload
        })
        builder.addCase(requestLocationPermission.rejected, (state, action) => {
            state.status = Status.Rejected
            state.error = action.error.message != undefined ? action.error.message : ''
        })
    }
})

export default locationPermissionSlice.reducer