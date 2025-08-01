<template>
  <SideBar />

  <!-- Search bar with v-model -->
  <div style="display: flex; justify-content: center; margin: 20px 0" class="gap-1">
    <div class="input-group gap-1" style="width: 50%">
      <input 
        type="text" 
        class="form-control" 
        placeholder="Search by name, position or department..." 
        v-model="searchTerm" 
      />
      <button class="btn btn-outline-secondary h-100 m-0" type="button">
        <i class="fas fa-search"></i>
      </button>
    </div> 

    <!-- The add button to add a new employee-->
    <button
      type="button"
      class="btn btn-primary m-0 h-50 gap-1"
      style="width: 100px;"
      @click="addEmpModal = true"
    >
      <i class="fas fa-plus"></i> Add Employee
    </button>
  </div>

  <!-- Add Employee Modal -->
  <div v-if="addEmpModal" class="custom-modal-overlay">
    <div class="modal-content custom-modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">Add Employee</h1>
        <button
          type="button"
          class="btn-close"
          @click="addEmpModal = false"
          aria-label="Close"
        ></button>
      </div>
      <form @submit.prevent="submitAddEmployee">
        <div class="modal-body">
          <div class="mb-3">
            <label for="empName" class="form-label">Name <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              id="empName"
              v-model="newEmployee.name"
              required
            />
          </div>

          <div class="mb-3">
            <label for="empPosition" class="form-label">Position <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              id="empPosition"
              v-model="newEmployee.position"
              required
            />
          </div>

          <div class="mb-3">
            <label for="empId" class="form-label">Employee ID <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              id="empId"
              v-model="newEmployee.emp_id"
              placeholder="EMP-XXX"
              pattern="EMP-\d{3}"
              required
            />
            <small class="text-muted">Format: EMP-XXX (e.g. EMP-123)</small>
          </div>

          <div class="mb-3">
            <label for="reviewerId" class="form-label">Reviewer Employee ID</label>
            <input
              type="text"
              class="form-control"
              id="reviewerId"
              v-model="newEmployee.reviewer_emp_id"
              placeholder="e.g. EMP-701"
              pattern="EMP-\d{3}"
            />
          </div>

          <div class="mb-3">
            <label for="deptId" class="form-label">Department ID</label>
            <input
              type="text"
              class="form-control"
              id="deptId"
              v-model="newEmployee.department_id"
              placeholder="If applicable"
            />
          </div>
        </div>
        <div class="modal-footer gap-1">
          <button
            type="button"
            class="btn btn-secondary h-25 w-25"
            @click="addEmpModal = false"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary h-25 w-25" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ isLoading ? 'Adding...' : 'Add Employee' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!--Edit employee modal-->
  <div v-if="editEmpModal" class="custom-modal-overlay">
    <div class="modal-content custom-modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">Edit Employee</h1>
        <button
          type="button"
          class="btn-close"
          @click="editEmpModal = false"
          aria-label="Close"
        ></button>
      </div>
      <form @submit.prevent="submitEditEmployee">
        <div class="modal-body">
          <div class="mb-3">
            <label for="editEmpName" class="form-label">Name <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              id="editEmpName"
              v-model="editingEmployee.name"
              required
            />
          </div>

          <div class="mb-3">
            <label for="editEmpPosition" class="form-label">Position <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              id="editEmpPosition"
              v-model="editingEmployee.position"
              required
            />
          </div>

          <div class="mb-3">
            <label for="editReviewerId" class="form-label">Reviewer Employee ID</label>
            <input
              type="text"
              class="form-control"
              id="editReviewerId"
              v-model="editingEmployee.reviewer_emp_id"
              pattern="EMP-\d{3}"
            />
          </div>

          <div class="mb-3">
            <label for="editDeptId" class="form-label">Department ID</label>
            <input
              type="text"
              class="form-control"
              id="editDeptId"
              v-model="editingEmployee.department_id"
            />
          </div>
        </div>
        <div class="modal-footer gap-1">
          <button
            type="button"
            class="btn btn-secondary h-25"
            @click="editEmpModal = false"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary h-25 w-25" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Main background container -->
  <div v-if="showModal" class="custom-modal-overlay">
    <div class="modal-content custom-modal-content" style="width: 650px;">
      <div class="modal-header border-bottom-0 pb-3">
        <h1 class="modal-title" style="color: #2c3e50; font-size: 1.5rem; font-weight: 600;">{{ modalEmployeeData.employee.name }}</h1>
        <button
          type="button"
          class="btn-close"
          @click="closeModal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body py-0 px-4">
        <div class="mb-3">
          <h3 style="color: #34495e; font-size: 1.2rem; margin-bottom: 0.3rem;">Position:</h3>
          <p style="color: #2c3e50; font-size: 1.1rem;">{{ modalEmployeeData.employee.position }}</p>
        </div>
        
        <div class="mb-3">
          <h3 style="color: #34495e; font-size: 1.2rem; margin-bottom: 0.3rem;">Department:</h3>
          <p style="color: #2c3e50; font-size: 1.1rem;">{{ modalEmployeeData.department?.department_name || 'N/A' }}</p>
        </div>
        
        <div class="mb-3">
          <h3 style="color: #34495e; font-size: 1.2rem; margin-bottom: 0.3rem;">Current salary:</h3>
          <p style="color: #2c3e50; font-size: 1.1rem;">R {{ modalEmployeeData.salary?.base_salary || 'N/A' }}</p>
        </div>
        
        <div class="mb-3">
          <h3 style="color: #34495e; font-size: 1.2rem; margin-bottom: 0.3rem;">Email:</h3>
          <p style="color: #2c3e50; font-size: 1.1rem;">{{ modalEmployeeData.contact?.email || 'N/A' }}</p>
        </div>
        
        <div class="mb-3">
          <h3 style="color: #34495e; font-size: 1.2rem; margin-bottom: 0.3rem;">Phone:</h3>
          <p style="color: #2c3e50; font-size: 1.1rem;">{{ modalEmployeeData.contact?.phone_number || 'N/A' }}</p>
        </div>
        
        <div class="mb-3">
          <h3 style="color: #34495e; font-size: 1.2rem; margin-bottom: 0.3rem;">Address:</h3>
          <p style="color: #2c3e50; font-size: 1.1rem;">
            {{ modalEmployeeData.address?.street_address || '' }} 
            {{ modalEmployeeData.address?.city || '' }}
          </p>
        </div>

        <div v-if="modalEmployeeData.latestReview" class="mt-4 p-3" style="background-color: #f8f9fa; border-radius: 8px;">
          <h4 style="color: #34495e; font-size: 1.2rem; margin-bottom: 0.5rem;">Latest Review:</h4>
          <p style="color: #2c3e50;"><strong>Rating:</strong> {{ modalEmployeeData.latestReview.rating }}</p>
          <p style="color: #2c3e50;"><strong>Comments:</strong> {{ modalEmployeeData.latestReview.review_text }}</p>
        </div>
      </div>
      <div class="modal-footer pt-3">
        <button type="button" class="btn btn-secondary" @click="closeModal">
          Close
        </button>
      </div>
    </div>
  </div>

    <!-- Cards -->
    <div
      class="center-wrapper"
      style="margin-left: 190px; flex-wrap: wrap; gap: 24px"
    >
      <div
        class="card shadow-lg"
        v-for="employee in filteredEmployees"
        :key="employee.emp_id"
        style="height: auto; width: 300px; margin: 12px"
      >
        <img
          src="https://th.bing.com/th/id/OIP.d0-XU41p65lgmmxUl2e5JwHaEV?rs=1&pid=ImgDetMain"
          alt="Employee photo"
          style="width: 95%"
        />
        <div class="card-body">
          <h3>{{ employee.name }}</h3>
          <p class="title">{{ employee.position }}</p>
          <h4>{{ employee.department }}</h4>
          <div class="d-flex flex-wrap gap-2 mt-3">
           <button 
  @click="openModal(employee)"
  class="btn text-nowrap"
  style="height: auto; width: auto"
>
  View more
</button>

            <button 
              @click="editEmployee(employee)"
              class="btn btn-warning flex-grow-1 h-25"
            >
              Edit
            </button>

            <button 
              @click="deleteEmployee(employee)"
              class="btn btn-danger flex-grow-1 h-25"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
 
  
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import axios from 'axios';
export default {
  name: "EmployeeView",

  data() {
    return {
      selectedIndex: 0,
      showModal: false,
      searchTerm: "",
      addEmpModal: false,
      isLoading: false,
      newEmployee: {
        emp_id: "",
        name: "",
        department_id: "",
        position: "",
        reviewer_emp_id: "EMP-701",
      },
      editEmpModal: false,
      editingEmployee: {
        emp_id: '',
        name: '',
        department_id: '',
        position: '',
        reviewer_emp_id: ''
      },
       modalEmployeeData: {}
    };
  },

  computed: {
    users() {
      return this.$store.state.users;
    },
    filteredEmployees() {
      if (!this.searchTerm) return this.users;
      const term = this.searchTerm.toLowerCase();
      return this.users.filter(
        (emp) =>
          (emp.name && emp.name.toLowerCase().includes(term)) ||
          (emp.position && emp.position.toLowerCase().includes(term)) ||
          (emp.department && emp.department.toLowerCase().includes(term))
      );
    },
  },

  mounted() {
    this.loadEmployees();
  },

  methods: {
    async loadEmployees() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("getEmp");
      } catch (error) {
        console.error("Error loading employees:", error);
        alert("Failed to load employees. Please try again.");
      } finally {
        this.isLoading = false;
      }
    },

    async submitAddEmployee() {
      if (!this.validateEmployee(this.newEmployee)) return;
      
      this.isLoading = true;
      try {
        await this.$store.dispatch("addEmp", {
          emp_id: this.newEmployee.emp_id,
          name: this.newEmployee.name,
          department_id: this.newEmployee.department_id || null,
          position: this.newEmployee.position,
          reviewer_emp_id: this.newEmployee.reviewer_emp_id || "EMP-701"
        });

        this.addEmpModal = false;
        this.resetNewEmployee();
        await this.loadEmployees();
        alert("Employee added successfully!");
      } catch (error) {
        console.error("Add employee error:", error);
        alert(`Failed to add employee: ${error.response?.data?.message || error.message}`);
      } finally {
        this.isLoading = false;
      }
    },

    validateEmployee(employee) {
      if (!employee.emp_id || !employee.name || !employee.position) {
        alert("Please fill in all required fields!");
        return false;
      }
      
      if (!/^EMP-\d{3}$/.test(employee.emp_id)) {
        alert("Employee ID must be in format EMP-XXX (e.g. EMP-123)");
        return false;
      }
      
      if (employee.reviewer_emp_id && !/^EMP-\d{3}$/.test(employee.reviewer_emp_id)) {
        alert("Reviewer ID must be in format EMP-XXX (e.g. EMP-701)");
        return false;
      }
      
      return true;
    },

    resetNewEmployee() {
      this.newEmployee = { 
        emp_id: "",
        name: "",
        department_id: "",
        position: "",
        reviewer_emp_id: "EMP-701"
      };
    },

    async deleteEmployee(employee) {
      if (!confirm(`Are you sure you want to delete ${employee.name}?`)) return;
      
      this.isLoading = true;
      try {
        const result = await this.$store.dispatch("deleteEmp", employee.emp_id);
        if (result && result.success) {
          alert("Employee deleted successfully");
          await this.loadEmployees();
        }
      } catch (error) {
        alert("Failed to delete employee: " + error.message);
      } finally {
        this.isLoading = false;
      }
    },

    editEmployee(employee) {
      this.editingEmployee = {
        emp_id: employee.emp_id,
        name: employee.name,
        position: employee.position,
        department_id: employee.department_id,
        reviewer_emp_id: employee.reviewer_emp_id
      };
      this.editEmpModal = true;
    },

    async submitEditEmployee() {
      if (!this.validateEmployee(this.editingEmployee)) return;
      
      this.isLoading = true;
      try {
        await this.$store.dispatch("updateEmp", {
          emp_id: this.editingEmployee.emp_id,
          name: this.editingEmployee.name,
          department_id: this.editingEmployee.department_id,
          position: this.editingEmployee.position,
          reviewer_emp_id: this.editingEmployee.reviewer_emp_id
        });
        
        this.editEmpModal = false;
        await this.loadEmployees();
        alert("Employee updated successfully!");
      } catch (error) {
        console.error("Edit error:", error);
        alert("Failed to update employee: " + error.message);
      } finally {
        this.isLoading = false;
      }
    },

    setIndex(n) {
      this.selectedIndex = n;
    },

   async openModal(employee) {
  this.isLoading = true;
  try {
    
    const response = await axios.get(`http://localhost:3030/Employees/employee-modal-data/${employee.emp_id}`);
    this.modalEmployeeData = response.data;
    this.showModal = true;
  } catch (error) {
    console.error("Error fetching employee details:", error);
    alert("Failed to load employee details");
  } finally {
    this.isLoading = false;
  }
},
    closeModal() {
      this.showModal = false;
    },
  },

  components: {
    SideBar,
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
h3 {
  font-size: 30px !important;
  font-weight: 400px;
  color: #111;
}
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}
.sidenav {
  height: 100%;
  width: 200px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #333;
  overflow-x: hidden;
}
.sidenav a {
  color: white;
  padding: 16px;
  text-decoration: none;
  display: block;
}
.sidenav a:hover {
  background-color: #ddd;
  color: black;
}
.btn:hover {
  background-color: antiquewhite;
  color: #111 !important;
}
.content {
  margin-left: 200px;
  padding-left: 20px;
}
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  margin: auto;
  text-align: center;
}
.center-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.btn {
  background-color: #2d4257;
  color: white;
}
.main-container {
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  padding: 20px;
}
@media screen and (max-width: 780px) {
  .center-wrapper {
    margin-left: 30px !important;
  }
}
@media screen and (max-width: 480px) {
  .center-wrapper {
    margin-left: 40px !important;
  }
}

.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.custom-modal-content {
  background: #fff;
  border-radius: 10px;
  width: 500px;
  max-width: 95vw;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
  padding: 0;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
.btn-danger:hover {
  background-color: #bb2d3b;
  color: white !important;
}
.btn-warning {
  background-color: #ffc107;
  color: #000;
}
.btn-warning:hover {
  background-color: #ffca2c;
  color: #000 !important;
}
.btn-info {
  background-color: #0dcaf0;
  color: #000;
}
.btn-info:hover {
  background-color: #31d2f2;
  color: #000 !important;
}
.card-body {
  padding: 15px;
}
.title {
  color: grey;
  font-size: 18px;
  margin: 10px 0;
}
.custom-modal-content {
  background: #fff;
  border-radius: 12px;
  width: 650px;
  max-width: 90vw;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.modal-header {
  padding: 15px 20px 0;
}

.modal-body {
  padding: 0 20px;
}

.modal-footer {
  padding: 15px 20px 0;
  border-top: none;
}
</style>