<template>
    <div class="attendanceCard ">
        <div class="d-flex justify-content-around mt-3">
            <h4 class="attendTitle">Attendance feedback</h4>
        <router-link to="/overallattendance"><button class="btn btn-sm">see more</button></router-link>
        </div>
        <div class="subDiv">
            <p class="sub-txt">Stats for {{ formattedTargetDate }}</p>
            <img class="sub-img" src="https://cdn3.iconfinder.com/data/icons/human-resources-management-2/100/human-resources-management-19-512.png" alt="target">
        </div>
        <div class="mini-attendCards">
            <div class="mini-stats">
                <div class="a-l-a">Present {{ presentCount }}</div>
                <div class="a-l-a">Late {{ lateCount }}</div>
                <div class="a-l-a">Absent {{ absentCount }}</div>
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
            targetDate: '2025-07-29', // Hardcoded for the 29th as requested
            presentCount: 0,
            lateCount: 0,
            absentCount: 0,
            displayedProgressWidth: 0, // New data property for animated width
            animationFrameId: null // To store animation frame ID for cleanup
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
        // Calculate progressWidth dynamically based on fetched data, ignoring 'Late'
        progressWidth() {
            // Only consider present and absent for the total for percentage calculation
            const totalConsidered = this.presentCount + this.absentCount;
            if (totalConsidered === 0) return 0;
            return (this.presentCount / totalConsidered) * 100;
        }
    },
    watch: {
        // Watch for changes in attendanceData from the store
        attendanceData: {
            handler(newVal) {
                console.log("AttendanceStats: Data received by watcher:", newVal);
                if (newVal && newVal.length > 0) {
                    this.calculateDailyStats();
                    // After calculating stats, animate the progress bar
                    this.animateProgressBar();
                } else {
                    this.presentCount = 0;
                    this.lateCount = 0;
                    this.absentCount = 0;
                    this.displayedProgressWidth = 0; // Reset animated width
                    console.log("AttendanceStats: No data or empty array received. Counts reset.");
                }
            },
            deep: true,
            immediate: true
        },
        // Watch for changes in the target progressWidth to re-animate if needed
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
        // Clear any ongoing animation frames to prevent memory leaks
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
/* Your existing styles (no changes needed for styles) */
.attendTitle {
    margin: 5px;
    font-size: 30px;
    color: rgba(126, 123, 123, 0.904);
}

.subDiv {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.sub-img {
    width: 150px;
}

.sub-txt {
    font-size: 30px;
    font-weight: 400;
    padding-left: 20px;
    padding-top: 20px;
}

.attendanceCard {
    margin-left: 10px;
    width: 100%;
    height: 200px;
    background-color: white;
    height: 350px;
    border-radius: 10px;
    box-shadow: 0 4px 16px 0 rgba(8, 14, 20, 0.312);
}

.mini-stats {
    display: flex;
    justify-content: space-between;
    align-self: center;
    align-items: center;
    width: 90%;
    height: 70px;
}

.a-l-a {
    color: #2c3e50;
    font-size: 25px;
    font-weight: 400;
}

.mini-attendCards {
    width: 100%;
    display: flex;
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
    width: 90%;
    background-color: grey;
    border-radius: 4px;
}

.seeattend {
    width: 100%;
    height: 30px;
    /* background-color: white;
    border: 1px solid skyblue;
    border-radius: 5px;
    */
    color: rgb(78, 177, 216);
    margin-top: 30px; 
}

.see-wrap {
    margin: auto;
    width: 90%;
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

@media screen and (max-width: 1024px) {
    .attendTitle {
        font-size: 25px;
    }

    .subDiv {
        width: 95%;
        display: flex;
        align-items: center;
    }

    .sub-txt {
        font-size: 20px;
        padding: 10px 0 0 10px;
    }

    .sub-img {
        width: 60px;
    }

    .a-l-a {
        font-size: 18px;
    }
}

@media screen and (max-width: 768px) {
    .subDiv {
        width: 95%;
    }

    .a-l-a {
        text-align: center;
    }

    .attendanceCard {
        width: 50%;
    }
}

@media screen and (max-width: 480px) {
    .attendanceCard {
        width: 100%;
        margin: 10px 0 0 0;
    }
}
</style>
