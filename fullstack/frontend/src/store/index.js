import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    Attendance: null,
    AttendanceByDate: null,
    LeaveRecords: null,        
    PendingLeaveStats: null,   
    ApprovedLeaveStats: null,
    DeniedLeaveStats: null,
    salaries: null,
    reviews: null,
    employees: [],
    users: []
  },
  getters: {
    allLeaveCount: (state) => state.LeaveRecords ? state.LeaveRecords.length : 0,
    pendingLeaveCount: (state) => state.PendingLeaveStats ? state.PendingLeaveStats.length : 0,
    approvedLeaveCount: (state) => state.ApprovedLeaveStats ? state.ApprovedLeaveStats.length : 0,
    deniedLeaveCount: (state) => state.DeniedLeaveStats ? state.DeniedLeaveStats.length : 0,

    uniqueEmployeesWithLeave: (state) => {
        if (!state.LeaveRecords) return [];

        const employeesMap = new Map(); 

        state.LeaveRecords.forEach(record => {
            if (!employeesMap.has(record.emp_id)) {
                employeesMap.set(record.emp_id, {
                    emp_id: record.emp_id,
                    name: record.EmployeeName, 
                    leaveRequests: []
                });
            }
            employeesMap.get(record.emp_id).leaveRequests.push({
                leave_id: record.leave_id,
                start_date: record.leave_start,
                end_date: record.leave_end,
                reason: record.leave_reason,
                status: record.leave_status
            });
        });

        return Array.from(employeesMap.values());
    },
    uniqueEmployeesWithLeave: (state) => {
        if (!state.LeaveRecords) return [];

        const employeesMap = new Map();

        state.LeaveRecords.forEach(record => {
            if (!employeesMap.has(record.emp_id)) {
                employeesMap.set(record.emp_id, {
                    emp_id: record.emp_id,
                    name: record.EmployeeName,
                    leaveRequests: []
                });
            }
            employeesMap.get(record.emp_id).leaveRequests.push({
                leave_id: record.leave_id,
                start_date: record.leave_start,
                end_date: record.leave_end,
                reason: record.leave_reason,
                status: record.leave_status
            });
        });

        employeesMap.forEach(employee => {
            employee.leaveRequests.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        });

        return Array.from(employeesMap.values());
    }
  },
  mutations: {
    SetAttendance(state,payload){
      state.Attendance = payload
    },
    SetAttendanceByDate(state, payload){
      state.AttendanceByDate = payload
    },
    SetLeaveRecords(state, payload){
      state.LeaveRecords = payload
    },
    SetPendingLeaveStats(state, payload){
      state.PendingLeaveStats = payload
    },
    SetApprovedLeaveStats(state, payload){ 
      state.ApprovedLeaveStats = payload
    },
    SetDeniedLeaveStats(state, payload){ 
      state.DeniedLeaveStats = payload
    },
    // Mutation to update a single leave record's status in the store
    UpdateLeaveRecordStatus(state, { leave_id, new_status }) {
      if (state.LeaveRecords) {
        const recordIndex = state.LeaveRecords.findIndex(record => record.leave_id === leave_id);
        if (recordIndex !== -1) {
          state.LeaveRecords[recordIndex].leave_status = new_status;
          
        }
      }
    },
    setSalaries(state, payload){
      state.salaries = payload
    },
    setReviews(state, payload){
      state.reviews = payload
    },
    setEmployees(state, employees) {
      state.employees = employees
    },
    setUsers(state, users) {
      state.users = users
    },
    deleteEmployee(state, emp_id) {
      state.users = state.users.filter(user => user.emp_id !== emp_id)
    },
     ADD_EMPLOYEE(state, employee) {
    state.users.push(employee);
  },
 UPDATE_EMPLOYEE(state, { emp_id, employee }) {
  const index = state.users.findIndex(u => u.emp_id === emp_id);
  if (index !== -1) {
    state.users.splice(index, 1, employee);
  }
}
  },
  actions: {
    // allow asyncrones process so its used to fetch data
    async getAttendance({commit}){
      try {let data = await axios.get('http://localhost:3030/attendance')
        commit('SetAttendance',data.data.Attendance)
      }catch(e){
        console.error("error fetching attendance:", e);
      }      
    },
    async getAttendanceByDate({ commit }, date = null){
      try {
        let url = 'http://localhost:3030/attendancedate'; 

        if (date) {
          url += `?date=${date}`; 
        }
        
        let response = await axios.get(url);
        
        commit('SetAttendanceByDate', response.data.data); 
      } catch(e){
        console.error("Error fetching attendance by date:", e);
        commit('SetAttendanceByDate', []); 
      }
    },
    async getLeaveRecords({ commit }){
      try {
        let response = await axios.get('http://localhost:3030/leave'); 
        commit('SetLeaveRecords', response.data.data);
      } catch(e){
        console.error("Error fetching all leave records:", e);
        commit('SetLeaveRecords', []);
      }
    },

    // NEW ACTIONS: Fetch specific leave statuses
    async getPendingLeaveStats({ commit }){
      try {
        let response = await axios.get('http://localhost:3030/leave/pending');
        commit('SetPendingLeaveStats', response.data.data);
      } catch(e){
        console.error("Error fetching pending leave stats:", e);
        commit('SetPendingLeaveStats', []);
      }
    },
     async getApprovedLeaveStats({ commit, state, dispatch }){
        if (!state.LeaveRecords) {
            await dispatch('getLeaveRecords'); 
        }
        const approved = state.LeaveRecords.filter(record => record.leave_status === 'Approved');
        commit('SetApprovedLeaveStats', approved);
    },
    async getDeniedLeaveStats({ commit, state, dispatch }){ 
        if (!state.LeaveRecords) {
            await dispatch('getLeaveRecords'); 
        }
        const denied = state.LeaveRecords.filter(record => record.leave_status === 'Denied');
        commit('SetDeniedLeaveStats', denied);
    },
    // Action to update Leave Status
    async updateLeaveStatus({ commit, dispatch }, { leave_id, new_status }) {
      try {
        const response = await axios.put('http://localhost:3030/leave/update', {
          leave_id,
          new_status
        });

        if (response.status === 200) {
          console.log(response.data.message);
          
          dispatch('getLeaveRecords'); 
          dispatch('getPendingLeaveStats'); 
          dispatch('getApprovedLeaveStats'); 
          dispatch('getDeniedLeaveStats'); 
          
          return true; 
        }
      } catch (error) {
        console.error("Error updating leave status:", error.response ? error.response.data : error.message);
        return false; 
      }
    },
    async getAllSalaries({commit}) {
      try {
        let response = await axios.get('http://localhost:3030/api/salaries');
        commit('setSalaries',response.data);
      } catch (e) {
        console.error("Error fetching salaries:", e);
      }
    },
    async deleteSalary({ commit }, { emp_id, effective_date }) {
      try {
        await axios.delete(`http://localhost:3030/api/salaries/${emp_id}/${effective_date}`);
        console.log(`Successfully sent delete request for ${emp_id} on ${effective_date}`);
      } catch (error) {
        console.error("Error deleting salary record:", error);
        throw error;
      }
    },
    async getAllReviewsWithAllDetails({commit}) {
      try {
        let response = await axios.get('http://localhost:3030/api/reviews');
        console.log("API Response Data for Reviews:", response.data);
        commit('setReviews',response.data);
      } catch (e) {
        console.error("Error fetching reviews:", e);
      }
    },
    async addReview({ commit }, review) {
      try {
        const response = await axios.post('http://localhost:3030/api/reviews', review);
        console.log("Review added successfully via API:", response.data);
      } catch (error) {
        console.error("Error adding review:", error.response ? error.response.data : error.message);
        throw error; 
      }
    },
    async deleteReview({ commit }, { review_id }) {
      try {
        await axios.delete(`http://localhost:3030/api/reviews/${review_id}`);
        console.log(`Successfully sent delete request for ${review_id}`);
      } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
      }
    },
    async updateReview({ commit }, reviewData) {
      try {
        const review_id = reviewData.review_id;
        const response = await axios.put(`http://localhost:3030/api/reviews/${review_id}`, reviewData);
        console.log(`Successfully sent update request for ${review_id}`, response.data);
      } catch (error) {
        console.error("Error updating review:", error);
        throw error;
      }
    },
    async getReviewById({ commit }, review_id) {
      try {
        const response = await axios.get(`http://localhost:3030/api/reviews/${review_id}`);
        console.log("Fetched single review details:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching single review:");
        throw error; 
      }
    },
    async getEmp({ commit }) {
  try {
    let { data } = await axios.get('http://localhost:3030/Employees')
    commit('setUsers', data) 
  } catch (error) {
    console.error("Error fetching employees:", error)
    return error
  }
},
  async addEmp({ commit }, employeeData) {
    try {
      const response = await axios.post('http://localhost:3030/Employees', {
        emp_id: employeeData.emp_id,
        name: employeeData.name,
        department_id: employeeData.department_id || null,
        position: employeeData.position,
        reviewer_emp_id: employeeData.reviewer_emp_id || "EMP-701"
      });
      commit('ADD_EMPLOYEE', response.data);
      return response.data;
    } catch (error) {
      console.error('Add error:', error);
      throw error;
    }
  },
    async deleteEmp({ commit }, emp_id) {
      try {
        await axios.delete(`http://localhost:3030/Employees/${emp_id}`)
        commit('deleteEmployee', emp_id)
        return { success: true }
      } catch (error) {
        console.error('Delete error:', error)
        throw error
      }
    },
 async updateEmp({ commit }, { emp_id, name, department_id, position, reviewer_emp_id }) {
  try {
    const response = await axios.put(`http://localhost:3030/Employees/${emp_id}`, {
      name,
      department_id,
      position,
      reviewer_emp_id
    });
    commit('UPDATE_EMPLOYEE', {
      emp_id,
      employee: response.data.employee
    });
    return response.data;
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
}
  },
  modules: {
  }
})
