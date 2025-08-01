<template>
    <div class="card attendanceCard shadow-sm "> <div class="d-flex justify-content-around mt-3">
            <h4 class="mb-0 fs-2">Attendance feedback</h4>
            <router-link to="/overallattendance">
                <button class="btn-primary me-3 h-50">See More</button>
            </router-link>
        </div>
        <div class="subDiv text-center my-3">
            <p class="fs-4 text-muted mb-2 fw-medium">Stats for {{ formattedTargetDate }}</p>
            <img class="sub-img img-fluid" src="https://cdn3.iconfinder.com/data/icons/human-resources-management-2/100/human-resources-management-19-512.png" alt="target" style="max-height: 80px;">
        </div>
        <div class="mini-attendCards px-3 pb-3 d-flex">
            <div class="mini-stats d-flex justify-content-around mb-3">
                <div class="a-l-a text-center flex-fill mx-1">
                    <span class="d-block fw-bold">Present</span>
                    <span class="d-block">{{ presentCount }}</span>
                </div>
                <div class="a-l-a text-center flex-fill mx-1">
                    <span class="d-block fw-bold">Late</span>
                    <span class="d-block">{{ lateCount }}</span>
                </div>
                <div class="a-l-a text-center flex-fill mx-1">
                    <span class="d-block fw-bold">Absent</span>
                    <span class="d-block">{{ absentCount }}</span>
                </div>
            </div>
            <div class="tank">
                <div class="attendanceProgress">
                    <div class="progressBar" :style="{ width: displayedProgressWidth + '%' }">Attendance {{ Math.round(displayedProgressWidth) }}%
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'AttendanceStats',
    data() {
        return {
            targetDate: '2025-07-29',
            presentCount: 0,
            lateCount: 0,
            absentCount: 0,
            displayedProgressWidth: 0, 
            animationFrameId: null 
        }
    },
    computed: {
        // Map AttendanceByDate from the store
        ...mapState({ attendanceData: state => state.AttendanceByDate }),

        formattedTargetDate() {
            if (this.targetDate) {
                try {
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    // Using Date.UTC to avoid timezone issues when parsing 'YYYY-MM-DD'
                    const [year, month, day] = this.targetDate.split('-');
                    const date = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed
                    return date.toLocaleDateString(undefined, options);
                } catch (error) {
                    console.error("Error formatting target date:", error);
                    return this.targetDate; // Fallback to raw date string on error
                }
            }
            return 'N/A';
        },
        // Calculate progressWidth based on fetched data
        progressWidth() {
            const totalConsidered = this.presentCount + this.absentCount;
            if (totalConsidered === 0) return 0;
            return (this.presentCount / totalConsidered) * 100;
        }
    },
    watch: {
        attendanceData: {
            handler(newVal) {
                console.log("AttendanceStats: Data received by watcher:", newVal);
                if (newVal && newVal.length > 0) {
                    this.calculateDailyStats();
                    this.animateProgressBar();
                } else {
                    this.presentCount = 0;
                    this.lateCount = 0;
                    this.absentCount = 0;
                    this.displayedProgressWidth = 0;
                    console.log("AttendanceStats: No data or empty array received. Counts reset.");
                }
            },
            deep: true,
            immediate: true
        },
        progressWidth(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.animateProgressBar();
            }
        }
    },
    mounted() {
        console.log("AttendanceStats: Component mounted. Fetching data for:", this.targetDate);
        this.getAttendanceByDate(this.targetDate);
    },
    beforeUnmount() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    },
    methods: {
        ...mapActions(['getAttendanceByDate']),

        calculateDailyStats() {
            let present = 0;
            let late = 0;
            let absent = 0;

            if (this.attendanceData && Array.isArray(this.attendanceData)) {
                console.log("AttendanceStats: Calculating daily stats from:", this.attendanceData);
                this.attendanceData.forEach(record => {
                    switch (record.attendance_state) {
                        case 'Present':
                            present++;
                            break;
                        case 'Late':
                            late++;
                            break;
                        case 'Absent':
                            absent++;
                            break;
                    }
                });
            }

            this.presentCount = present;
            this.lateCount = late;
            this.absentCount = absent;
            console.log("AttendanceStats: Final calculated counts - Present:", present, "Late:", late, "Absent:", absent);
        },
        animateProgressBar() {
            // Clear any existing animation frame
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }

            const targetWidth = this.progressWidth;
            const duration = 1000; // Animation duration in milliseconds
            const start = performance.now();
            const initialWidth = this.displayedProgressWidth;

            const step = (timestamp) => {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1

                // Easing function (e.g., ease-out quad)
                const easedProgress = progress * (2 - progress);

                this.displayedProgressWidth = initialWidth + (targetWidth - initialWidth) * easedProgress;

                if (progress < 1) {
                    this.animationFrameId = requestAnimationFrame(step);
                } else {
                    this.displayedProgressWidth = targetWidth; // Ensure it snaps to the final value
                }
            };

            this.animationFrameId = requestAnimationFrame(step);
        }
    }
}
</script>

<style>
@keyframes fadeInOnly {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.attendanceCard {
    margin-left: 10px;
    width: 100%;
    height: 350px; 
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 16px 0 rgba(8, 14, 20, 0.312);

    animation: fadeInOnly 0.8s ease-out forwards;
}

.subDiv {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center; 
}

.a-l-a{
    font-size: 20px;
}
.sub-img {
    width: 150px;
    margin-right: 15px; 
}

.mini-attendCards {
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-content: center;
}

.tank {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
}

.attendanceProgress {
    width: 100%;
    background-color: grey;
    border-radius: 4px;
}

.progressBar {
    height: 40px;
    width: 1%;
    background-color: #2c3e50;
    color: white;
    text-align: center;
    align-content: center;
    font-weight: 300;
    margin: auto;
    border-radius: 4px;
}

</style>