<template>
    <div class="leave-div" style="margin-left: 200px; padding: 24px;">
        <h1 class="text-center fs-40">Leave Management</h1>
        <div class="d-flex justify-content-between flex-wrap gap-3">
            <div class="card" style="width: 18rem">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Approved</li>
                    <li class="list-group-item">{{ approvedLeaveCount }}</li>
                </ul>
            </div>
            <div class="card" style="width: 18rem">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Pending</li>
                    <li class="list-group-item">{{ pendingLeaveCount }}</li>
                </ul>
            </div>
            <div class="card" style="width: 18rem">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Denied</li>
                    <li class="list-group-item">{{ deniedLeaveCount }}</li>
                </ul>
            </div>
        </div>

        <div style="margin-top: 20px;">
            <h1>Leave Requests</h1>
        </div>

        <table class="table">
            <thead class="tHead">
                <tr>
                    <th class="Hrow" scope="col">Employee</th>
                    <th class="Hrow" scope="col">Leave Start</th> <th class="Hrow" scope="col">Leave End</th> <th class="Hrow" scope="col">Reason</th>
                    <th class="Hrow" scope="col">Status</th>
                    <th class="Hrow" scope="col">Actions</th> </tr>
            </thead>
            <tbody>
                <template v-for="employee in uniqueEmployeesWithLeave" :key="employee.emp_id">
                    <template v-if="employee.leaveRequests && employee.leaveRequests.length">
                        <tr>
                            <td :rowspan="employee.leaveRequests.length" class="border-end">{{ employee.name }}</td>
                            <td>{{ employee.leaveRequests[0].start_date }}</td>
                            <td>{{ employee.leaveRequests[0].end_date }}</td>
                            <td>{{ employee.leaveRequests[0].reason }}</td>
                            <td>
                                <div class="td-background" :style="getLeaveStatusStyle(employee.leaveRequests[0].status)">
                                    {{ employee.leaveRequests[0].status }}
                                </div>
                            </td>
                            <td>
                                <div class="action-buttons" v-if="employee.leaveRequests[0].status === 'Pending'">
                                    <button @click="confirmUpdateStatus(employee.leaveRequests[0].leave_id, 'Approved')" class="btn-action approve">Approve</button>
                                    <button @click="confirmUpdateStatus(employee.leaveRequests[0].leave_id, 'Denied')" class="btn-action deny">Deny</button>
                                </div>
                                <div v-else>
                                    -
                                </div>
                            </td>
                        </tr>
                        <tr v-for="(leave, index) in employee.leaveRequests.slice(1)" :key="leave.leave_id">
                            <td>{{ leave.start_date }}</td>
                            <td>{{ leave.end_date }}</td>
                            <td>{{ leave.reason }}</td>
                            <td>
                                <div class="td-background" :style="getLeaveStatusStyle(leave.status)">
                                    {{ leave.status }}
                                </div>
                            </td>
                            <td>
                                <div class="action-buttons" v-if="leave.status === 'Pending'">
                                    <button @click="confirmUpdateStatus(leave.leave_id, 'Approved')" class="btn-action approve">Approve</button>
                                    <button @click="confirmUpdateStatus(leave.leave_id, 'Denied')" class="btn-action deny">Deny</button>
                                </div>
                                <div v-else>
                                    -
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td>{{ employee.name }}</td>
                        <td colspan="5">No leave requests for this employee.</td>
                    </tr>
                </template>
                <tr v-if="!uniqueEmployeesWithLeave || uniqueEmployeesWithLeave.length === 0">
                    <td colspan="6">No leave records found in the system.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
    name: 'LeaveManagementPage', // Renamed for clarity, adapt as needed
    // No local data needed, all from Vuex
    // data() {
    //     return {
    //         attendanceAndLeave: null // This will now come from a computed property/getter
    //     };
    // },
    computed: {
        ...mapState([
            // If you need direct access to raw state
            // 'LeaveRecords',
            // 'Attendance',
            // 'AttendanceByDate'
        ]),
        ...mapGetters([
            'uniqueEmployeesWithLeave', // This getter processes raw LeaveRecords for your table
            'pendingLeaveCount',
            'approvedLeaveCount',
            'deniedLeaveCount', // Your 'Rejected' count
            'allLeaveCount' // For total if you add a card for it
        ])
    },
    methods: {
        ...mapActions([
            'getLeaveRecords',
            'getPendingLeaveStats',
            'getApprovedLeaveStats',
            'getDeniedLeaveStats', // Fetch denied stats for 'Rejected' card
            'updateLeaveStatus'
        ]),
        getLeaveStatusStyle(status) {
            if (status === 'Approved') {
                return { backgroundColor: 'green', color: 'white' };
            } else if (status === 'Denied') { // Changed 'Rejected' to 'Denied' to match backend
                return { backgroundColor: 'red', color: 'white' };
            } else if (status === 'Pending') {
                return { backgroundColor: 'orange', color: 'white' };
            }
            return {};
        },
        async confirmUpdateStatus(leave_id, new_status) {
            if (confirm(`Are you sure you want to ${new_status} leave ID ${leave_id}?`)) {
                const success = await this.updateLeaveStatus({
                    leave_id,
                    new_status
                });

                if (success) {
                    alert(`Leave ID ${leave_id} ${new_status} successfully!`);
                    // The action itself dispatches re-fetches, so UI will update
                } else {
                    alert(`Failed to ${new_status} leave ID ${leave_id}. Check console for details.`);
                }
            }
        }
    },
    mounted() {
        // Fetch all necessary data when the component mounts
        this.getLeaveRecords(); // Populate the main table data
        this.getPendingLeaveStats();
        this.getApprovedLeaveStats();
        this.getDeniedLeaveStats(); // Fetch data for the 'Rejected' card
    }
}
</script>

<style scoped>
/* Scoped styles - adapted for your new HTML structure */

/* Overall container */
.leave-div {
    /* Keep your inline styles or move them here */
    margin-left: 200px;
    padding: 24px;
    background-color: white; /* Added background for clarity */
    border-radius: 8px; /* Added some border-radius */
    box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Added subtle shadow */
}

/* Headings */
h1 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 1.8em; /* Adjust as needed */
}

/* Bootstrap Card Overrides/Enhancements */
.card {
    border: 1px solid #dee2e6; /* Default Bootstrap border color */
    border-radius: 0.25rem; /* Default Bootstrap border radius */
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Subtle shadow */
    text-align: center;
}

.card .list-group-item {
    border: none; /* Remove default list group item borders */
    padding: 0.75rem 1.25rem;
}

.card .list-group-item:first-child {
    font-weight: bold;
    color: #555;
    border-bottom: 1px solid #dee2e6;
    background-color: #f8f9fa; /* Light background for the header item */
}

/* Specific styling for card numbers */
.card .list-group-item:nth-child(2) {
    font-size: 2.2em; /* Larger font size for the count */
    font-weight: bold;
    color: #007bff; /* Default color, adjust per status below */
    padding-top: 0.5rem; /* Spacing below label */
}
/* Specific colors for counts */
.d-flex .card:nth-child(1) .list-group-item:nth-child(2) { /* Approved */
    color: green;
}
.d-flex .card:nth-child(2) .list-group-item:nth-child(2) { /* Pending */
    color: orange;
}
.d-flex .card:nth-child(3) .list-group-item:nth-child(2) { /* Rejected/Denied */
    color: red;
}


/* Table styling - largely retained/refined from your original */
.table {
    width: calc(100% - 20px); /* Adjust width to fit container with some margin */
    margin: 20px auto; /* Centered with top/bottom margin */
    /* REMOVED: padding-left: 230px; as it's handled by .leave-div margin-left */
    border-collapse: collapse; /* Ensure clean table borders */
    box-shadow: 1px 4px 3px 2px rgba(8, 14, 20, 0.312); /* Your original shadow */
}

.table .tHead .Hrow {
    background-color: #2c3e50;
    color: white;
    padding: 12px 8px; /* Consistent padding */
    text-align: center;
    border-bottom: 1px solid #2c3e50;
}

.table th,
.table td {
    text-align: center;
    padding: 10px 8px; /* Consistent padding for cells */
    border-bottom: 1px solid #ddd; /* Lighter border for rows */
    font-weight: 400;
    vertical-align: middle; /* Align content vertically in the middle */
}

.table tbody tr:last-child td {
    border-bottom: none; /* No border for the last row */
}

.td-background {
    border-radius: 5px;
    padding: 5px 10px; /* Adjust padding for visual appeal */
    display: inline-block; /* Makes background only cover content */
    min-width: 80px; /* Gives consistent width to status cells */
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 5px;
    justify-content: center;
    flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
}

.btn-action {
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85em;
    transition: background-color 0.3s ease, transform 0.1s ease;
}

.btn-action.approve {
    background-color: #28a745; /* Green */
    color: white;
}

.btn-action.approve:hover {
    background-color: #218838;
    transform: translateY(-1px);
}

.btn-action.deny {
    background-color: #dc3545; /* Red */
    color: white;
}

.btn-action.deny:hover {
    background-color: #c82333;
    transform: translateY(-1px);
}

/* Media Queries for responsiveness */
@media screen and (max-width: 992px) {
    .leave-div {
        margin-left: 0; /* Remove fixed margin on smaller screens */
        width: 100%;
        padding: 15px;
    }
    .d-flex.justify-content-between.flex-wrap.gap-3 {
        justify-content: center !important; /* Center cards on smaller screens */
    }
    .card {
        width: 100% !important; /* Make cards full width */
        max-width: 250px; /* Max width for cards when stacked */
    }
    .table {
        width: 100%; /* Full width */
        margin: 15px auto;
    }
    .table th,
    .table td {
        padding: 8px 5px; /* Reduce table cell padding */
        font-size: 0.9em;
    }
    .td-background {
        padding: 3px 6px;
        min-width: 60px;
        font-size: 0.85em;
    }
    .btn-action {
        padding: 5px 8px;
        font-size: 0.8em;
    }
}

@media screen and (max-width: 576px) {
    h1 {
        font-size: 1.5em;
    }
    .table th,
    .table td {
        font-size: 0.8em;
        padding: 6px 4px;
    }
    .action-buttons {
        flex-direction: column; /* Stack buttons vertically on very small screens */
        gap: 3px;
    }
    .btn-action {
        font-size: 0.7em;
        padding: 4px 6px;
        width: 100%; /* Make buttons full width when stacked */
    }
}
</style>