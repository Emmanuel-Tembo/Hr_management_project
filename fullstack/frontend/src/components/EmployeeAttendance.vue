<template>
    <div class="heading">
        <p class="headingText">CURRENT ATTENDANCE</p>
        <table class="table">
            <thead>
                <tr>
                    <th class="Hrow" scope="col">ID</th>
                    <th class="Hrow" scope="col">Name</th>
                    <th class="Hrow" scope="col">Date</th>
                    <th class="Hrow" scope="col">Status</th>
                    <th>Time in</th>
                    <th class="Hrow" scope="col">Attendance</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in attendance" :key="record.EmployeeID">
                    <td>{{ record.EmployeeID }}</td>
                    <td>{{ record.EmployeeName }}</td>
                    <td>{{ record.attendance_date }}</td>
                    <td :style="changeBackground(record.attendance_status)">
                        {{ record.attendance_status }}
                    </td>
                    <td>{{ record.clocked_in_time }}</td>
                    <td :style="changeBackground(record.attendance_state)">
                        <div class="td-bg">
                            {{ record.attendance_state }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.headingText {
    padding-top: 5px;
    background-color: white;
    width: 100%;
    border-radius: 10px;
    margin: 0;
}

.table {
    width: 100%;
    margin: auto;
    padding-left: 230px;
    box-shadow: 1px 4px 3px 2px rgba(8, 14, 20, 0.312);
}

.heading {
    text-align: center;
    color: #2c3e50;
    font-weight: 300;
    background-color: white;
    border-radius: 5px;
    width: 83%;
    height: 500px;
    margin-left: 15%;
    margin-top: 20px;
}

.Hrow {
    background-color: #2c3e50;
    color: white;
}

.table th,
td {
    text-align: center;
    border-bottom: 1px solid #2c3e50;
}

.td-bg {
    border-radius: 5px;
}

@media screen and (max-width: 768px) {
    .heading {
        margin-left: 12%;
        width: 86%;
    }
}
</style>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            attendance: state => state.Attendance
        })
    },
    mounted() {
        this.$store.dispatch('getAttendance');
    },
    methods: {
        changeBackground(state) {
            if (state === 'Present') {
                return { backgroundColor: 'green', color: 'white' };
            } else if (state === 'Absent') {
                return { backgroundColor: 'red', color: 'white' };
            } else if (state === 'Late') { 
                return { backgroundColor: 'orange', color: 'white' };
            } else if (state === 'Leave') { 
                return { backgroundColor: 'blue', color: 'white' };
            }
            return {}; 
        }
    }
}

</script>
