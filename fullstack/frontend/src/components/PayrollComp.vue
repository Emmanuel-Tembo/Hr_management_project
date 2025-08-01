 
 <template>
    <h1 style="margin-left: 15%;">Payroll</h1>
    <hr> <br>

    <!-- INFORMATION DIVS -->
    <div class="cont-box animate__animated animate__fadeIn animate__slow" v-if="salaries && salaries.length > 0">
        <div class="box one">
            <p class="text">Period: {{ paydayDate.monthYear }} | {{ paydayDate.daysInMonth }} Payable Days</p> <br>
            <table class="payroll-table">
                <tr class="costs">
                    <td class="costs"><b>R{{ calculateTotalBaseSalary.toFixed(2)}}</b></td>
                    <td class="space" width="50px"></td>
                    <td class="costs"><b>R{{ calculateTotalFinalSalary.toFixed(2) }}</b></td>
                </tr>
                <tr>
                    <td>Payroll Costs</td>
                    <td class="space" width="50px"></td>
                    <td>Employees' Net Pay</td>
                </tr>
            </table>
        </div>
        <div class="box small">
            <div class="pay-day">
                <p class="p">PAY DAY</p>
                <p class="date">{{paydayDate.day}} <br> {{ paydayDate.monthYear }}</p>
                <hr>
                <p class="p">{{salaries.length}}  employees</p>
            </div>
        </div>
        <div class="box two">
            <p class="text">Taxes & Deductions</p> <br>
            <table class="payroll-table">
                <tr>
                    <td class="costs"><b></b></td>
                    <td class="space" width="50px"></td>
                    <td class="costs"><b>R{{ calculateTotalDeductions.toFixed(2) }}</b></td>
                </tr>
                <tr>
                    <td>Taxes</td>
                    <td class="space" width="50px"></td>
                    <td>Total Deduction</td>
                </tr>
            </table>
        </div>
    </div>

    <!-- ADD PAYROLL -->
    <div>
        <button class="add-btn h-50" @click="showModal = true">Add Payroll</button>
    </div>

    <div class="add-model" v-if="showModal">
        <div class="modal-add">
            <span class="close-btn" @click="closeModal">&times;</span>
            <h2>Add New Payroll Entry</h2>
            <form @submit.prevent="addPayrollEntry">
                <div class="inputs">
                    <label for="emp_id">Employee Id:</label>
                    <input type="text" v-model="newPayrollEntry.emp_id" name="emp_id" id="emp_id" required>
                </div>
                <div class="inputs">
                    <label for="departmentId">Department ID:</label>
                    <input type="number" v-model="newPayrollEntry.department_id" id="departmentId" required>
                </div>
                <div class="inputs">
                    <label for="deductions">Deductions:</label>
                    <input type="number" v-model="newPayrollEntry.deductions" id="deductions" step="0.01" required>
                </div>
                <div class="inputs">
                    <label for="hours_worked">Hours Worked:</label>
                    <input type="number" v-model="newPayrollEntry.hours_worked" id="hours_worked" required>
                </div>
                <div class="inputs checkbox-container">
                    <input type="checkbox" id="newEmployeeCheckbox" v-model="isNewEmployee">
                    <label for="newEmployeeCheckbox">New Employee</label>
                </div>

                <div v-if="isNewEmployee">
                    <div class="inputs">
                    <label for="bank_name">Bank:</label>
                    <input type="text" v-model="newPayrollEntry.bank_name" id="bank_name" :required="isNewEmployee">
                </div>
                <div class="inputs">
                    <label for="bank_account_number">Bank Account Number:</label>
                    <input type="number" v-model="newPayrollEntry.bank_account_number" id="bank_account_number" :required="isNewEmployee">
                </div>
                <div class="inputs">
                    <label for="tax_code">Tax Number:</label>
                    <input type="text" v-model="newPayrollEntry.tax_code" id="tax_code" :required="isNewEmployee">
                </div>
                </div>
                <button type="submit" class="submit-btn">Submit</button>
            </form>
        </div>
    </div>

    <!-- EMPLOYEE TABLE -->
    <div class="table-wrapper" v-if="salaries && salaries.length > 0" >
        <table class="employee-table">
            <thead>
                <tr>
                    <th>Employee Name</th> 
                    <th>ID</th>
                    <th>Hours</th>
                    <th>Gross Pay</th>
                    <th>Deduction</th>
                    <th>Net Pay</th>
                    <th>Payslip</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="salary in animatedSalaries " :key="salary.emp_id">
                    <td> {{ salary.name }}</td>
                    <td>{{ salary.emp_id }}</td>
                    <td>{{ salary.hours_worked }}</td>
                    <td>R{{ (salary.animated_base_salary || 0).toFixed(2) }}</td>
                    <td>R{{ (salary.animated_deductions || 0).toFixed(2) }}</td>
                    <td>R{{ (salary.animated_final_salary || 0).toFixed(2) }}</td>
                    <td>
                        <div class="view-wrap">
                            <router-link :to="`/payslip/${salary.emp_id}/${salary.effective_date}`" class="view">View</router-link>
                        </div>
                    </td>  
                    <td>
                        <div class="view-wrap delete-btn" @click="confirmDelete(salary.emp_id, salary.effective_date)">
                            Delete
                        </div>
                    </td>  
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Payroll',
    data() {
        return {
            showModal: false,
            isNewEmployee: false,
            newPayrollEntry: {
                emp_id: '',
                department_id: null,
                hours_worked: null,
                deductions: null,
                bank_name: '',
                bank_account_number: '',
                tax_code: ''
            },
            animatedSalaries: []
        }
    },
    computed: {
        salaries(){
            return this.$store.state.salaries
        },
        calculateTotalBaseSalary() {
            return this.salaries.reduce((sum, salary) => sum + parseFloat(salary.base_salary), 0);
        },
        calculateTotalFinalSalary() {
            return this.salaries.reduce((sum, salary) => sum + parseFloat(salary.final_salary), 0);
        },
        calculateTotalDeductions() {
            return this.salaries.reduce((sum, salary) => sum + parseFloat(salary.deductions), 0);
        },
        paydayDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const lastDayOfMonth = new Date(year, month + 1, 0);
            const optionsMonthYear = {month: 'long', year: 'numeric'};

            return {
                day: lastDayOfMonth.getDate(),
                monthYear: lastDayOfMonth.toLocaleDateString('en-US', optionsMonthYear),
                daysInMonth: lastDayOfMonth.getDate()
            };
        }
    },
    methods: {
        animatedValue(obj, propName, target, duration = 1500) {

            let startValue = obj[propName] || 0;
            const startTime = performance.now();

            const step = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const currentValue = startValue + (target - startValue) * progress;
                obj[propName] = +currentValue.toFixed(2);

                if (progress < 1) {
                    requestAnimationFrame(step)
                }
            }

            requestAnimationFrame(step)
        },
        initializeRowAnimations() {
            this.animatedSalaries.forEach(salary => {
                // Animate base_salary
                this.animatedValue(salary, 'animated_base_salary', parseFloat(salary.base_salary));
                // Animate deductions
                this.animatedValue(salary, 'animated_deductions', parseFloat(salary.deductions));
                // Animate final_salary
                this.animatedValue(salary, 'animated_final_salary', parseFloat(salary.final_salary));
            });
        },
        async addPayrollEntry() {
            try {
                const salaryResponse = await axios.post('http://localhost:3030/api/salaries', {
                    emp_id: this.newPayrollEntry.emp_id,
                    department_id: this.newPayrollEntry.department_id,
                    hours_worked: this.newPayrollEntry.hours_worked,
                    deductions: this.newPayrollEntry.deductions,
                });

                if (salaryResponse.status !== 200 && salaryResponse.status !== 201) {
                    throw new Error(salaryResponse.data.message || `Failed to add salary entry.`);
                }
                console.log('Payroll entry added successfully!');

                if (this.isNewEmployee) {
                    const { emp_id, bank_name, bank_account_number, tax_code} = this.newPayrollEntry;

                    const bankResponse = await axios.post('http://localhost:3030/api/bankinfo', {
                        emp_id,
                        bank_name,
                        bank_account_number
                    });
                    if (bankResponse.status !== 200 && bankResponse.status !== 201) {
                        throw new Error(bankResponse.data.message || `Failed to add bank information.`);
                    }
                    console.log('Bank information added successfully!');

                    const taxResponse = await axios.post('http://localhost:3030/api/taxinfo', {
                        emp_id,
                        tax_code
                    });
                    if (taxResponse.status !== 200 && taxResponse.status !== 201) {
                        throw new Error(taxResponse.data.message || `Failed to add tax information.`);
                    }
                    console.log('Tax information added successfully!');
                }

                await this.$store.dispatch('getAllSalaries');
                this.closeModal();
            } catch (error) {
                console.error('Error adding payroll entry:', error);
                alert(`Failed to add payroll entry: ${error.message}`); 
            }
        },
        confirmDelete(empId, effectiveDate) {
            if (window.confirm(`Are you sure you want to delete the salary record for Employee ID: ${empId} on ${effectiveDate}?`)) {
                this.deleteSalaryRecord(empId, effectiveDate);
            }
        },
        async deleteSalaryRecord(empId, effectiveDate) {
            try {
                await this.$store.dispatch('deleteSalary', { emp_id: empId, effective_date: effectiveDate });
                await this.$store.dispatch('getAllSalaries');
                console.log(`Salary record for ${empId} on ${effectiveDate} deleted successfully.`);
            } catch (error) {
                console.error("Failed to delete salary record:", error);
            }
        },
        closeModal() {
            this.showModal = false;
            this.newPayrollEntry = {
                emp_id: '',
                department_id: null,
                hours_worked: null,
                deductions: null,
            };
        }
    },
    mounted() {
        this.$store.dispatch('getAllSalaries');
    },
    watch: {
        salaries: {
            handler(newSalaries) {
                if (newSalaries && newSalaries.length > 0) {
                    this.animatedSalaries = newSalaries.map(s => ({
                        ...s, 
                        animated_base_salary: 0, 
                        animated_deductions: 0,
                        animated_final_salary: 0,
                    }));

                    this.initializeRowAnimations();
                } else {
                    this.animatedSalaries = [];
                }
            },
            deep: true,
            immediate: true 
        }
    }
}
</script>

<style>
 h1 {
    text-align: left;
    font-size: 60px;
}

/* CSS INFORMATION DIVS */
.cont-box {
    width: 80%;
    margin-left: 15%;
    margin-bottom: 30px;
    display: flex;
    align-content: center;
    justify-content: space-evenly;
    gap:30px;
    color: rgb(224, 222, 222);
}

.box {  
    background-color: #2d4257;
    width: 30%;
    padding: 8px 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.box.small {
    width: 15%;
    text-align: center;
    padding: 20px 15px;
}

.pay-day {
    text-align: center;
    font-weight: 200;
    font-size: 30px;
}

.text {
    text-align: left;
    font-size: 24px;
    font-weight: 200;
}

.payroll-table td {
    border-bottom: none;
}

.p {
    font-size: 18px;
}

.date {
    font-weight: bold;
    font-size: 20px;
}

.payroll-table {
    width: 80%;
}

.payroll-table td {
    text-align: left;
    font-size: 18px;
    font-weight: 400;
}

.payroll-table .costs {
    font-size: 26px;
}

/* CSS EMPLOYEE TABLE */
.table-wrapper {
    width: 85%;
    margin-left: 15%;
    max-width: 100vw;
    overflow-x: auto;
}

.employee-table {
    width: 100%;
    min-width: 750px;
    font-weight: 400;
}

.employee-table th {
    font-weight: bold;
    font-size: 19px;
    border-bottom: 1px solid black;
    background-color: #2d4257;
    color: white;
    padding: 10px;
}

.employee-table td {
    padding: 10px;
    color: #2d4257;
}

.employee-table th,
.employee-table td {
    text-align: left;
}

/* VIEW BUTTON */
.view {
    text-align: center;
    color: rgb(224, 222, 222);
    text-decoration: none;
}

.view-wrap {
    text-align: center;
    margin-left: 20%;
    background-color: #2d4257;
    width: 70px;
    color: rgb(224, 222, 222);
    border-radius: 40px;
    text-decoration: none;
}

.view-wrap:hover {
    cursor: pointer;
    background-color: #3e566e;
}

/* ADD PAYROLL BTN */
.add-btn {
    background-color: #2d4257;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-left: 15%;
    margin-bottom: 20px;
    transition: background-color 0.3s ease;
}

.add-btn:hover {
    background-color: #44607b;
}

/* MODAL */
.add-model {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-add {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 500px;
    max-height: 720px;
    overflow-y: auto;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 24px;
    cursor: pointer;
    color: #aaa;
}

.close-btn:hover {
    color: #555;
}

.modal-add h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2d4257;
    text-align: center;
}

.inputs {
    margin-bottom: 15px;
}

.inputs label {
    display: block;
    margin-bottom: 5px;
    color: #333;
    font-weight: bold;
}

.inputs input[type="text"],
.inputs input[type="number"] {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

.submit-btn {
    background-color: #2d4257;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    width: 100%;
    transition: background-color 0.3s ease;
}

.submit-btn:hover {
    background-color: #3e566e;
}

.delete-btn {
    background-color: #dc3545;
    margin-left: 0;
}

.delete-btn:hover {
    background-color: #c82333;
}

/* RESPONSIVENESS */
@media (max-width: 1420px) {
    .cont-box {
        flex-wrap: wrap;
    }
    .box.small {
        order: -1;
        width: 89%;
    }
    .box.one,
    .box.two {
        order: 2;
        width: 40%;
    }
}

@media (max-width: 950px) {
    .cont-box {
        flex-direction: column;
        flex-wrap: nowrap;
    }

    .payroll-table .costs {
        font-size: 22px;
    }

    .box,
    .box.small,
    .box.one,
    .box.two {
        width: 95%;
        margin: 0 15px;
    }
}
</style>