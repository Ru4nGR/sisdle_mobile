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
    selected : boolean
}

export const loadLixeiras = createAsyncThunk('lixeiras/loadLixeiras', async () => {
    const lixeiras = await getLixeiras()
    return lixeiras
})

const lixeirasSlice = createSlice({
    name : 'lixeiras',
    initialState : {
        data : new Array<Lixeira>(),
        sorted : new Array<Lixeira>(),
        status : Status.Idle,
        error : ''
    },
    reducers : {
        setSorted(state, action) {
            state.sorted = action.payload
        },
        selectLixeira(state, action : {payload : string}) {
            const id = action.payload
            const lixeira = state.data.find(lixeira => lixeira.id == id)!
            state.sorted.splice(state.sorted.indexOf(lixeira), 1)
            state.sorted.unshift(lixeira)
        },
        setLixeiras(state, action) {
            state.data = action.payload
        },
        toggleLixeiraSelected(state, action : {payload : string}) {
            const id = action.payload
            const lixeira = state.data.find(lixeira => lixeira.id == id)!
            lixeira.selected = !lixeira.selected
        },
        deselectAllLixeiras(state) {
            state.data.forEach(lixeira => {
                lixeira.selected = false
            })
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

export default lixeirasSlice.reducer
export const {
    setSorted,
    selectLixeira,
    setLixeiras,
    toggleLixeiraSelected,
    deselectAllLixeiras
} = lixeirasSlice.actions