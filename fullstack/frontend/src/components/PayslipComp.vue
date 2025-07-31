<template>
    <router-link to="/payroll">
        <div class="return-btn">
            <router-link to="/payroll">
                <i class="i-arrow fa fa-arrow-left fa-lg" aria-hidden="true"></i>
            </router-link>
        </div>
    </router-link>
    <!-- HEADING -->
    <div class="page">
        <div class="heading-top">
            <h1>ModernTech Solutions</h1> <br>
            <h3 class="payslip">PAYSLIP</h3>
            <p style="font-weight: 400; font-size: 20px;">Pay Date: {{salary?.effective_date || "N/A"}}</p> <br> <br>
        </div>

        <div v-if="salary && bank && tax">
            <!-- EMPLOYEE INFORMATION -->
            <div class="emp-info">
                <p>Employee ID: {{salary.emp_id}}</p>
                <p>Employee Name: {{ salary.name }}</p>
                <p>Bank Name: {{bank.bank_name}}</p>
                <p>Account Number: {{bank.bank_account_number}}</p>
                <p>Tax Number: {{tax.tax_code}}</p>
            </div>
            <br>

            <!-- TABLE -->
            <div class="tables">
                <div class="table-wrap">
                    <table class="earnings-deductions-table">
                        <!-- EARNINGS TABLE -->
                        <thead>
                            <tr>
                                <th>Earnings</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Basic</td>
                                <td>R{{salary.base_salary}}</td>
                            </tr>
                            <tr>
                                <td>Bonus</td>
                                <td>N/A</td>
                            </tr>
                            <tr style="height: 30px;">
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>

                        <!-- DEDUCTIONS TABLE -->
                        <thead>
                            <tr>
                                <th>Deductions</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Deductions</td>
                                <td>R{{salary.deductions}}</td>
                            </tr>
                            <tr>
                                <td>Taxes</td>
                                <td>R{{tax.tax_amount || "0.00"}}</td>
                            </tr>
                            <tr style="height: 30px;">
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>

                        <!-- TOTALS -->
                        <thead class="totals-head">
                            <tr>
                                <th>Total Deductions</th>
                                <th>R{{salary.deductions}}</th>
                            </tr>
                            <tr>
                                <th>Salary</th>
                                <th>R{{salary.final_salary}}</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div>
                    <p class="estimated"><i>Estimated annual salary: R{{getAnnualSalary(salary.final_salary)}}</i></p>
                </div>
            </div>
        </div> <br> <br> <br>
    

        <!-- SIGNATURES -->
        <div class="signatures">
            <p>Approved by:_________________________</p>
            <p>Recieved by:_________________________</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            salary: null,
            bank: null,
            tax: null
        }
    },
    watch: {
        '$route.params': {
            immediate: true,
            handler(newParams) {
                this.loadPayslipData(newParams.emp_id, newParams.effective_date);
            }
        }
    },
    methods: {
        async loadPayslipData(emp_id, effective_date) {
            try {
            const [salaryRes, bankRes, taxRes] = await Promise.all([
                axios.get(`http://localhost:3030/api/salaries/${emp_id}/${effective_date}`),
                axios.get(`http://localhost:3030/api/bankinfo/${emp_id}`),
                axios.get(`http://localhost:3030/api/taxinfo/${emp_id}`)
            ]);

            this.salary = salaryRes.data;
            this.bank = bankRes.data.bankInfo;
            this.tax = taxRes.data.taxInfo;
        } catch (e) {
            console.error("Error loading payslip data: ", e)
        }
        },
        getAnnualSalary(finalSalary){
            if (!finalSalary) return '0.00';
            return (parseFloat(finalSalary) * 12).toFixed(2);
        }
    },
}
</script>

<style>
body {
    margin: 0;
}

.page {
    max-width: 100%;
    padding: 20px;
}

.payslip {
    color: #2d4257;
}

/* BACK BUTTON */
.return-btn {
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.7);
    height: 55px;
    width: 55px;
    text-align: center;
    align-content: center;
    border: 2px solid #2d4257;
    position: fixed;
    top: 30px;
    left: 30px;
}

.return-btn:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.908);
    height: 57px;
    width: 57px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.heading-top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
    max-width: 100%;
    background-color: transparent;
}

/* CSS EMPLOYEE INFORMATION */
.emp-info {
    text-align: left;
    font-size: 25px;
    color: #2d4257;
    margin-left: 6%;
    font-weight: 400;
}

/* CSS TABLES */
.table-wrap {
    width: 100%;
    overflow-x: auto;
}
.earnings-deductions-table {
    margin: 0 auto;
    font-size: 20px;
    width: 94%;

}

.earnings-deductions-table td {
    border-bottom: none;
    font-weight: 300;
    text-align: left;
    color: #2d4257;
}

.earnings-deductions-table th {
    background-color: #2d4257;
    color: white;
    border-bottom: 1px solid black;
}

.totals-head th {
    border-bottom: none;
}

.estimated {
    text-align: right;
    font-weight: 400;
    font-size: 20px;
    color: #2d4257;
    margin-right: 4%;
}

/* Signatures */
.signatures {
    display: flex;
    justify-content: space-evenly;
    color: #2d4257;
    gap: 100px;
    flex-wrap: wrap;
}

.signatures p {
    font-weight: 400;
    font-size: 22px;
}
</style>