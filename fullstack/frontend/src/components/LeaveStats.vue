<template>
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div>
                <h3 class="mb-0 fs-3">Pending Leave Requests</h3>
                <p class="text-muted mb-0 fw-medium">Date: {{ displayDate }}</p>
            </div>
            <router-link to="/leaveform">
                <button class="btn-primary h-50">See all</button>
            </router-link>
        </div>

        <div class="card-body overflow-auto" style="max-height: 200px;">
            <div class="d-flex align-items-center mb-3" v-for="leaveRequest in topPendingLeaveRequests"
                :key="leaveRequest.leave_id">
                <div class="flex-shrink-0 me-3">
                    <img src="https://icon2.cleanpng.com/20180425/qtq/avtpmxje6.webp" alt="Employee Profile Picture"
                        class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
                </div>
                <div class="flex-grow-1 me-3">
                    <h5 class="mb-1">{{ leaveRequest.name }}</h5>
                    <p class="text-muted mb-0 fw-medium">Reason: {{ leaveRequest.reason }}</p>
                </div>
                <div class="text-end">
                    <p class="statusDecoration" :style="getLeaveStatusStyle(leaveRequest.status)">
                        {{ leaveRequest.status }}
                    </p>
                </div>
            </div>
            <div v-if="!topPendingLeaveRequests.length" class="text-center text-muted py-4">
                No pending leave requests at the moment.
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'LeaveStats',
    computed: {
        ...mapGetters([
            'uniqueEmployeesWithLeave',
            // 'pendingLeaveCount'
        ]),
        filteredEmployeesWithPendingLeaves() {
            const employeesWithPending = this.uniqueEmployeesWithLeave.filter(employee =>
                employee.leaveRequests.some(leave => leave.status === 'Pending')
            );

            return employeesWithPending.map(employee => ({
                ...employee,
                leaveRequests: employee.leaveRequests.filter(leave => leave.status === 'Pending')
            })).filter(employee => employee.leaveRequests.length > 0);
        },
        topPendingLeaveRequests() {
            const allPending = [];
            this.filteredEmployeesWithPendingLeaves.forEach(employee => {
                employee.leaveRequests.forEach(leave => {
                    allPending.push({
                        emp_id: employee.emp_id,
                        name: employee.name,
                        leave_id: leave.leave_id,
                        start_date: leave.start_date,
                        end_date: leave.end_date,
                        reason: leave.reason,
                        status: leave.status
                    });
                });
            });

            allPending.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

            return allPending.slice(0, 4);
        },
        displayDate() {
            if (this.topPendingLeaveRequests.length > 0) {
                return this.topPendingLeaveRequests[0].start_date;
            }
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    },
    methods: {
        ...mapActions([
            'getLeaveRecords',
            'getPendingLeaveStats'
        ]),
        getLeaveStatusStyle(status) {
            if (status === 'Approved') {
                return { backgroundColor: 'green', color: 'white' };
            } else if (status === 'Denied') {
                return { backgroundColor: 'red', color: 'white' };
            } else if (status === 'Pending') {
                return { backgroundColor: 'orange', color: 'white' };
            }
            return {};
        },
    },
    mounted() {
        this.getLeaveRecords();
        this.getPendingLeaveStats();
    }
}
</script>

<style>
@keyframes slideInFromLeftSlower {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

.card {
    animation: slideInFromLeftSlower 1.2s ease-out forwards;
}


h3 {
    margin: 5px;
    font-size: 30px;
    color: rgba(126, 123, 123, 0.904);
}

.date {
    margin-bottom: 10px;
    margin-left: 10px;
}

h5 {
    margin: 0;
}

p {
    margin: 1px;
    font-weight: 250;
}

.rsn-txt {
    color: #2c3e50;
    font-weight: 400;
    font-size: 17px;
}

img {
    width: 40px;
    border-radius: 50%;
    margin-left: 8px;
    object-fit: cover;
}

.cardtop {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

button {
    width: 85px;
    height: 25px;
    margin-top: 20px;
    margin-right: 10px;
    background-color: white;
    border: 1px solid skyblue;
    border-radius: 5px;
    color: rgb(78, 177, 216);
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
}

button:hover {
    background-color: rgb(78, 177, 216);
    color: white;
}

.Laeveimg {
    width: 50px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.leaveCard {
    text-align: start;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
    padding: 5px 0;
    border-bottom: 1px solid #eee;
}

.leaveCard:last-of-type {
    border-bottom: none;
}

.leaveRow {
    text-align: start;
    flex-grow: 1;
}

.leaveResponse {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    flex-shrink: 0;
}

.statusDecoration {
    background-color: #2c3e50;
    width: 80px;
    height: 30px;
    color: white;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    font-size: 0.9em;
}

.no-pending-requests {
    text-align: center;
    color: #777;
    margin-top: 30px;
    font-style: italic;
}


@media screen and (max-width: 1024px) {

    .leaveCard {
        display: grid;
        grid-template-columns: auto 1fr auto;
        font-size: 0.9em;
        gap: 8px;
    }

    .leaveResponse {
        margin: 0;
    }

    h3 {
        font-size: 25px;
    }

    .statusDecoration {
        width: 70px;
        height: 28px;
        font-size: 0.85em;
    }
}

@media screen and (max-width: 768px) {

    .leaveCard {
        width: auto;
        font-size: 0.85rem;
        gap: 5px;
    }

    .Laeveimg {
        width: 40px;
    }

    img {
        width: 35px;
        margin-left: 0;
    }

    .statusDecoration {
        width: 60px;
        height: 25px;
        font-size: 0.8em;
    }

    .rsn-txt {
        font-size: 0.9em;
    }

    h5 {
        font-size: 1em;
    }
}

@media screen and (max-width: 480px) {

    .leaveCard {
        font-size: 0.8rem;
    }

    .statusDecoration {
        width: 55px;
        height: 22px;
        font-size: 0.75em;
    }
}
</style>