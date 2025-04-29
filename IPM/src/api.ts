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

/**
 * Fetch all students
 */
export async function listStudents(): Promise<types.Student[]> {
  const response = await API.get<types.Student[]>('/students')
  return response.data
}

/**
 * Fetch all courses
 */
export async function listCourses(): Promise<types.Course[]> {
  const response = await API.get<types.Course[]>('/courses')
  return response.data
}

/**
 * Fetch request status statistics
 */
export async function listRequestStatusStatistics(): Promise<any> {
  const response = await API.get<types.ShiftRequestData[]>('/shiftRequests')
  const data = response.data;

  let pending = 0;
  let approved = 0;
  let denied = 0;

  for(const item of data) {
    if(item.response === 'Pendente') {
      pending++;
    } else if(item.response === 'Aprovado') {
      approved++;
    } else if(item.response === 'Recusado') {
      denied++;
    }
  }

  const total = pending + approved + denied;
  if(total > 0) {
    pending = Math.round((pending / total) * 100);
    approved = Math.round((approved / total) * 100);
    denied = Math.round((denied / total) * 100);
  }

  return { "pending": pending, "approved": approved, "denied": denied };
}

/**
 * Fetch users with conflicts by year statistics
 */
export async function listUsersWithConflictsByYearStatistics(): Promise<any> {
  const response = await API.get<any>('/conflicts')
  const data = response.data;

  let firstYearConflicts = 0;
  let secondYearConflicts = 0;
  let thirdYearConflicts = 0;

  for(const item of data){
    const studentId = item.studentId;
    const student = await API.get<[types.Student]>(`/students?id=${studentId}`);
    const studentData = student.data[0];
    if (studentData.ano === 1) {
      firstYearConflicts++;
    } else if (studentData.ano === 2) {
      secondYearConflicts++;
    } else if (studentData.ano === 3) {
      thirdYearConflicts++;
    }
  }

  return {"firstYear": firstYearConflicts, "secondYear": secondYearConflicts, "thirdYear": thirdYearConflicts};
}

/**
 * Fetch requests by year statistics
 */
export async function listRequestsByYearStatistics(): Promise<any> {
  const response = await API.get<types.ShiftRequestData[]>('/shiftRequests')
  const data = response.data;

  let firstYearRequests = 0;
  let secondYearRequests = 0;
  let thirdYearRequests = 0;

  for(const item of data){
    const studentId = item.studentId;
    const student = await API.get<[types.Student]>(`/students?id=${studentId}`);
    const studentData = student.data[0];
    if (studentData.ano === 1) {
      firstYearRequests++;
    } else if (studentData.ano === 2) {
      secondYearRequests++;
    } else if (studentData.ano === 3) {
      thirdYearRequests++;
    }
  }

  return {"firstYear": firstYearRequests, "secondYear": secondYearRequests, "thirdYear": thirdYearRequests};
}

/**
 * Fetch students with incomplete schedules by year statistics
 */
export async function listStudentsWithIncompleteSchedulesByYearStatistics(): Promise<any> {
  const response = await API.get<types.Student[]>('/students')
  const data = response.data;

  let firstYearStudents = 0;
  let secondYearStudents = 0;
  let thirdYearStudents = 0;

  for(const student of data){
    if(student.horario == "Incompleto"){
      if (student.ano === 1) {
        firstYearStudents++;
      } else if (student.ano === 2) {
        secondYearStudents++;
      } else if (student.ano === 3) {
        thirdYearStudents++;
      }
    }
  }

  return {"firstYear": firstYearStudents, "secondYear": secondYearStudents, "thirdYear": thirdYearStudents};
}

/**
 * Fetch the percentage of students with conflicts
 */
export async function getPercentageOfStudentsWithConflicts(): Promise<number> {
  const response = await API.get<any>('/conflicts')
  const data = response.data;

  const totalStudentsResponse = await API.get<types.Student[]>('/students')
  const totalStudentsData = totalStudentsResponse.data;

  let totalStudents = totalStudentsData.length;
  let studentsWithConflicts = data.length / 2;

  return Math.round((studentsWithConflicts / totalStudents) * 100);
}