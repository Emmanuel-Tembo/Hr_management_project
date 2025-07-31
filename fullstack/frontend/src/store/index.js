import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    Attendance: null,
    AttendanceByDate: null,
    LeaveRecords: null,        // For all/filtered leave (main table)
    PendingLeaveStats: null,   // For pending leave count/list (dashboard)
    ApprovedLeaveStats: null,
    DeniedLeaveStats: null,
    salaries: null,
    reviews: null
  },
  getters: {
    allLeaveCount: (state) => state.LeaveRecords ? state.LeaveRecords.length : 0,
    pendingLeaveCount: (state) => state.PendingLeaveStats ? state.PendingLeaveStats.length : 0,
    approvedLeaveCount: (state) => state.ApprovedLeaveStats ? state.ApprovedLeaveStats.length : 0,
    deniedLeaveCount: (state) => state.DeniedLeaveStats ? state.DeniedLeaveStats.length : 0,

    // Getter to get unique employees from leave records for your main table display
    // This will help in merging data for your table structure
    uniqueEmployeesWithLeave: (state) => {
        if (!state.LeaveRecords) return [];

        const employeesMap = new Map(); // Map to store unique employees

        state.LeaveRecords.forEach(record => {
            if (!employeesMap.has(record.emp_id)) {
                employeesMap.set(record.emp_id, {
                    emp_id: record.emp_id,
                    name: record.EmployeeName, // Assuming EmployeeName comes from the join
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

        // Sort leave requests within each employee's array, e.g., by start_date
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
    // NEW MUTATION: To set the attendance data fetched by date
    SetAttendanceByDate(state, payload){
      state.AttendanceByDate = payload
    },
    SetLeaveRecords(state, payload){
      state.LeaveRecords = payload
    },
    SetPendingLeaveStats(state, payload){
      state.PendingLeaveStats = payload
    },
    SetApprovedLeaveStats(state, payload){ // NEW MUTATION
      state.ApprovedLeaveStats = payload
    },
    SetDeniedLeaveStats(state, payload){ // NEW MUTATION
      state.DeniedLeaveStats = payload
    },
    // Mutation to update a single leave record's status in the store
    // This is for optimistic UI updates before re-fetching all data
    UpdateLeaveRecordStatus(state, { leave_id, new_status }) {
      if (state.LeaveRecords) {
        const recordIndex = state.LeaveRecords.findIndex(record => record.leave_id === leave_id);
        if (recordIndex !== -1) {
          state.LeaveRecords[recordIndex].leave_status = new_status;
          // To ensure reactivity in Vue 2 if not working automatically:
          // Vue.set(state.LeaveRecords, recordIndex, { ...state.LeaveRecords[recordIndex], leave_status: new_status });
        }
      }
      // Note: Re-fetching the full lists after update (via dispatch in action)
      // is generally more robust for complex state changes than trying to
      // meticulously update all derived states here.
    },
    setSalaries(state, payload){
      state.salaries = payload
    },
    setReviews(state, payload){
      state.reviews = payload
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
        let url = 'http://localhost:3030/attendancedate'; // CORRECTED PORT TO 3030

        if (date) {
          url += `?date=${date}`; // Append the date as a query parameter if provided
        }
        
        let response = await axios.get(url);
        
        // Corrected data access based on backend's getAttendanceRecords: res.json({ data: ... })
        commit('SetAttendanceByDate', response.data.data); 
      } catch(e){
        console.error("Error fetching attendance by date:", e);
        // Important: If there's an error (e.g., no data for date), ensure state is cleared or handled
        commit('SetAttendanceByDate', []); // Clear data on error for user feedback
      }
    },
    async getLeaveRecords({ commit }){
      try {
        let response = await axios.get('http://localhost:3030/leave'); // Fetch all by default
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
    // You'll need backend endpoints for 'approved' and 'denied' too if you want these exact actions
    // For now, let's assume we filter from getLeaveRecords or create new backend routes like /leave/approved
     async getApprovedLeaveStats({ commit, state, dispatch }){ // ADD dispatch here
        // For simplicity, let's filter from all leave records for now if no specific backend route exists
        if (!state.LeaveRecords) {
            await dispatch('getLeaveRecords'); // Now dispatch is defined
        }
        const approved = state.LeaveRecords.filter(record => record.leave_status === 'Approved');
        commit('SetApprovedLeaveStats', approved);
    },
    async getDeniedLeaveStats({ commit, state, dispatch }){ // ADD dispatch here
        // For simplicity, let's filter from all leave records for now if no specific backend route exists
        if (!state.LeaveRecords) {
            await dispatch('getLeaveRecords'); // Now dispatch is defined
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
          // After a successful update, re-fetch all relevant data to ensure UI consistency
          dispatch('getLeaveRecords'); // Re-fetch for the main table
          dispatch('getPendingLeaveStats'); // Re-fetch pending stats
          dispatch('getApprovedLeaveStats'); // Re-fetch approved stats
          dispatch('getDeniedLeaveStats'); // Re-fetch denied stats
          
          return true; // Indicate success
        }
      } catch (error) {
        console.error("Error updating leave status:", error.response ? error.response.data : error.message);
        return false; // Indicate failure
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
    }
  },
  modules: {
  }
})
