import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  id: number
  username: string
}

export interface Credentials {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(_state, action: PayloadAction<Credentials>) {
      return action.payload
    },
    clearAuth() {
      return initialState
    },
  },
})

export const { setCredentials, clearAuth } = authSlice.actions
