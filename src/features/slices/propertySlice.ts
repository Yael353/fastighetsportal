import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Property {
  id: string
  name: string
  address: string
  type: string
}

interface PropertyState {
  properties: Property[]
}

const initialState: PropertyState = {
  properties: [],
}

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload
    },
  },
})

export const { setProperties } = propertySlice.actions
export default propertySlice.reducer

