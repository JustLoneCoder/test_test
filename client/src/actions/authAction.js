import axios from 'axios'
import { returnErrors } from './errorAction'
import { serverURL } from '../config/Keys'

import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './types'

// Check token & load user
export const loadUser = () => (dispatch, getState) =>
{
  // Use loading
  dispatch({
    type: USER_LOADING
  })

  axios.get(serverURL + '/api/auth/user', tokenConfig(getState))
    .then(res => dispatch({
      type: USER_LOADED,
      payload: res.data
    }))
    .catch(err =>
    {
      dispatch(returnErrors(err.response.data, err.response.status))
      dispatch({
      type: AUTH_ERROR
    })})
}

// REGISTER USER
export const register = ({ name, email, password }) => dispatch =>
{
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // Request body
  const body = JSON.stringify({ name, email, password })

  axios.post(serverURL + '/api/users', body, config)
    .then(res => dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    }))
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'))
      dispatch({
      type: REGISTER_FAIL
    })})
}

// Login User
export const login = ({ email, password }) => dispatch =>
{
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // Request body
  const body = JSON.stringify({ email, password })

  axios.post(serverURL + '/api/auth', body, config)
    .then(res => dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    }))
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'))
      dispatch({
      type: LOGIN_FAIL
    })})
}

// Logout User
export const logout = () =>
{
  return {
    type: LOGOUT_SUCCESS
  }
}

// Setup config/header & token
export const tokenConfig = getState =>
{
  // Get token from localStorage
  const token = getState().auth.token

  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  // Check token
  if(token)
  {
    config.headers['x-auth-token'] = token
  }

  return config
}
