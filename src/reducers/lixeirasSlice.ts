import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getLixeiras } from 'src/api/lixeiras'

export enum Status {
    Idle,
    Pending,
    Fulfilled,
    Rejected
}

interface Properties {
    location : string,
    description : string,
    capacity : number,
    selected? : boolean
}

export interface Lixeira extends GeoJSON.Feature<GeoJSON.Point, Properties> {
    id : string
}

export interface LixeiraCollection extends GeoJSON.FeatureCollection<GeoJSON.Point, Properties> {
    features : Array<Lixeira>
}

const initialState : LixeiraCollection = {
    type : 'FeatureCollection',
    features : new Array<Lixeira>()
}

export const loadLixeiras = createAsyncThunk('lixeiras/loadLixeiras', async () => {
    const lixeiras = await getLixeiras()
    console.log(lixeiras)
    return lixeiras
})

const lixeirasSlice = createSlice({
    name : 'lixeiras',
    initialState : {
        data : initialState,
        sorted : initialState,
        status : Status.Idle,
        error : ''
    },
    reducers : {
        setSorted(state, action) {
            state.sorted = action.payload
        },
        selectLixeira(state, action : {payload : string}) {
            const id = action.payload
            const lixeira = state.data.features.find(lixeira => lixeira.id == id)!
            state.sorted.features.splice(state.sorted.features.indexOf(lixeira), 1)
            state.sorted.features.unshift(lixeira)
        },
        setLixeiras(state, action) {
            state.data = action.payload
        },
        toggleLixeiraSelected(state, action : {payload : string}) {
            const id = action.payload
            const lixeira = state.data.features.find(lixeira => lixeira.id == id)!
            console.log(lixeira)
            lixeira.properties.selected = !lixeira.properties.selected
        },
        deselectAllLixeiras(state) {
            state.data.features.forEach(lixeira => {
                lixeira.properties.selected = false
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