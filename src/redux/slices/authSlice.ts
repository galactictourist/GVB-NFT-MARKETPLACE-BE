import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '~/utils/@reduxjs/toolkit'
//import { useInjectReducer, useInjectSaga } from '~/utils/redux-injectors'
import { authApi } from '../../pages/api/auth.api'
import { AuthState } from '../types'

export const initialState: AuthState = {
  signingIn: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSigningIn(state, action: PayloadAction<boolean>) {
      state.signingIn = action.payload
    },
    signedIn(state, action: PayloadAction<{ id: string; wallet?: string }>) {
      state.id = action.payload.id
      state.wallet = action.payload.wallet
    },
    signOut(state) {
      state.id = undefined
      state.wallet = undefined
      authApi.deleteToken()
    },
  },
})

export const { actions: userActions, reducer } = authSlice

export const useAuthSlice = () => {
  //useInjectReducer({ key: authSlice.name, reducer: authSlice.reducer })
  //useInjectSaga({ key: authSlice.name, saga: function* () {} })
  return { actions: authSlice.actions }
}
