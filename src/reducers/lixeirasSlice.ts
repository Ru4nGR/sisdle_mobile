import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getLixeiras } from 'src/api/lixeiras'

export enum Status {
    Idle,
    Pending,
    Fulfilled,
    Rejected
}

export interface Lixeira {
    id : string
    coordinates : Array<number>
    capacity : number
    location : string
    description : string
}

export const loadLixeiras = createAsyncThunk('lixeiras/loadLixeiras', async () => {
    const lixeiras = await getLixeiras()
    return lixeiras
})

const lixeirasSlice = createSlice({
    name : 'lixeiras',
    initialState : {
        data : new Array<Lixeira>(),
        status : Status.Idle,
        error : ''
    },
    reducers : {
        setLixeiras(state, action) {
            state.data = action.payload
        }
    },
    extraReducers : builder => {
        builder.addCase(loadLixeiras.pending, (state, action) => {
            state.status = Status.Pending
        })
        builder.addCase(loadLixeiras.fulfilled, (state, action) => {
            state.status = Status.Fulfilled
            state.data = action.payload
        })
        builder.addCase(loadLixeiras.rejected, (state, action) => {
            state.status = Status.Rejected
            state.error = action.error.message != undefined ? action.error.message : ''
        })
    }
})

export const { setLixeiras } = lixeirasSlice.actions
export default lixeirasSlice.reducer