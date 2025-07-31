<template>
    <div class="empTable">
        <table class="content">
            <thead>
                <tr>
                    <th class="Hrow" scope="col">ID</th>
                    <th class="Hrow" scope="col">Name</th>
                    <th class="Hrow" scope="col">
                        <div class="btn-group">
                            <span class="date">Date</span>
                            <button type="button"
                                class="btn btn-danger dropdown-toggle dropdown-toggle-split ms-1"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <span class="visually-hidden">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" @click.prevent> <input v-model="selectDate" type="date" @change="handleDateChange">
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </th>
                    <th class="Hrow" scope="col">Status</th>
                    <th>Time in</th>
                    <th class="Hrow" scope="col">Attendance</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in displayedAttendance" :key="record.EmployeeID + record.attendance_date">
                    <td class="fw-medium">{{ record.EmployeeID }}</td>
                    <td class="fw-medium">{{ record.EmployeeName }}</td>
                    <td class="fw-medium">{{ record.attendance_date }}</td>
                    <td class="fw-medium" :style="changeBackground(record.attendance_status)"> {{ record.attendance_status }} </td>
                    <td class="fw-medium">{{ record.clocked_in_time }}</td>
                    <td :style="changeBackground(record.attendance_state)">
                        <div class="td-back">
                            {{ record.attendance_state }}
                        </div>
                    </td>
                </tr>
                <tr v-if="!displayedAttendance || displayedAttendance.length === 0">
                    <td colspan="6">No attendance records found.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'; // Import mapActions

export default {
    data() {
        return {
            selectDate: ''
        };
    },
    computed: {
        // Map both 'Attendance' (general) and 'AttendanceByDate' (filtered) states from Vuex
        ...mapState({
            generalAttendance: state => state.Attendance,
            attendanceByDateRecords: state => state.AttendanceByDate
        }),
        // This computed property determines which data set to display
        displayedAttendance() {
            // If a date is selected, prioritize displaying data fetched by date
            if (this.selectDate) {
                return this.attendanceByDateRecords;
            }
            // Otherwise, display the general attendance data
            return this.generalAttendance;
        }
    },
    mounted() {
        // Dispatch the action to fetch general attendance data when component mounts
        // This populates the table initially when no date is selected.
        this.getAttendanceByDate(null);
    },
    // Watchers: React to data changes
    watch: {
        // Watch for changes in the 'selectDate' input
        selectDate(newDate) {
            this.handleDateChange(); // Call the method to dispatch the action
        }
    },
    // Component methods for logic and formatting
    methods: {
        // Map Vuex actions to component methods
        ...mapActions([
            'getAttendance',       // To fetch general attendance (e.g., hardcoded date)
            'getAttendanceByDate'  // To fetch attendance by a specific date
        ]),
        
        // Method to handle the date input change and dispatch the appropriate action
        handleDateChange() {
            if (this.selectDate) {
                // If a date is selected, dispatch the action to fetch by date
                console.log("Dispatching getAttendanceByDate for:", this.selectDate);
                this.getAttendanceByDate(this.selectDate);
            } else {
                // If the date input is cleared, you might want to:
                // 1. Re-fetch all general attendance (from /attendance)
                // this.getAttendance(); 
                // OR
                // 2. Fetch all using the /attendancedate endpoint with no date param
                console.log("Date input cleared. Dispatching getAttendanceByDate for all records.");
                this.getAttendanceByDate(null); // Pass null to get all via the dynamic endpoint
            }
        },

        // Method to dynamically apply background and text color based on status
        changeBackground(status) {
            // Corrected to check the correct property names from your SQL query output
            if (status === 'Present' || status === 'In') { // 'In' for attendance_state
                return { backgroundColor: 'green', color: 'white' };
            } else if (status === 'Absent' || status === 'Out') { // 'Out' for attendance_state
                return { backgroundColor: 'red', color: 'white' };
            } else if (status === 'Late') {
                return { backgroundColor: 'orange', color: 'white' };
            } else if (status === 'Leave') {
                return { backgroundColor: 'blue', color: 'white' };
            } else if (status === 'Not Clocked in' || status === 'Undefined' || status === null) { // Handle null/undefined state
                return { backgroundColor: 'grey', color: 'white' };
            }
            return {}; // Default if status doesn't match
        }
    }
};
</script>

<style>
/* Your existing styles (no changes needed here) */
.empTable {
    text-align: center;
    color: #2c3e50;
    font-weight: 300;
    background-color: white;
    border-radius: 5px;
    /* width: 90%; */
    height: 90vh;
    margin-top: 20px;
}

.Hrow {
    background-color: #2c3e50;
    color: white;
}

.content {
    width: 100%;
    margin: auto;
    padding: 10;
    box-shadow: 1px 4px 3px 2px rgba(8, 14, 20, 0.312);
    height: 100%;
}

.date {
    text-align: center;
    margin-top: 7px;
    font-size: 16px;
}

.content th,
td {
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #2c3e50;
    height: 45px;
}

.btn-group .btn-danger {
    background-color: #007bff !important; /* Using a common blue for 'danger' class with custom style */
    border-color: #007bff !important;
    color: #fff !important;
    margin-top: 4px;
}

.td-back {
    border-radius: 5px;
}

/* Optional: Style for the date input within the dropdown */
.dropdown-menu .dropdown-item input[type="date"] {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%; /* Make it fill the dropdown item width */
    box-sizing: border-box; /* Include padding/border in width */
}
</style>