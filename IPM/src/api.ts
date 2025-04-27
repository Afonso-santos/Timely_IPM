import axios from 'axios'
import * as types from './types'

const API = axios.create({
  baseURL: 'http://localhost:3000',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Fetch all shift requests and return as a dictionary by ID
 */
export async function list_ShiftRequests(): Promise<types.ShiftRequestDataDict> {
  const response = await API.get<types.ShiftRequestData[]>('/shiftRequests')
  const data = response.data
  const dict: types.ShiftRequestDataDict = {}
  data.forEach(item => {
    dict[item.id] = item
  })
  return dict
}

/**
 * Fetch all classroom requests and return as a dictionary by ID
 */
export async function list_ClassroomRequests(): Promise<types.ClassroomRequestDataDict> {
  const response = await API.get<types.ClassroomRequestData[]>('/classroomRequests')
  const data = response.data
  const dict: types.ClassroomRequestDataDict = {}
  data.forEach(item => {
    dict[item.id] = item
  })
  return dict
}