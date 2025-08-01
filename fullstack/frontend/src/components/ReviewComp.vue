<template>
    <div class="pg-title">
        <h1>Employee Review</h1>
    </div>
    <div class="r-stats">
        <div class="r-card1">
            <h2 class="r1-title">Average Employee Rating</h2>
            <div class="i-rev">
                <i class="rv-i fa fa-star" aria-hidden="true"></i>
                <p class="r-txt">{{ averageRating.toFixed(1) }}</p>
            </div>
        </div>
        <!-- ADD BUTTON -->
        <div>
            <button class="add-btn h-50" style="margin-right: 20px; height: 70px;" @click="showAddModal = true">Add Review</button>
        </div>
    </div>
    
    <br>
    
    <div class="add-model" v-if="showViewModal">
        <div class="modal-add">
            <span class="close-btn" @click="closeViewModal">&times;</span>
            <h2>Review Details</h2>
            <div v-if="selectedReview" class="reviewDetails">
                <p><strong>Review ID:</strong> {{ selectedReview.review_id }}</p>
                <p><strong>Employee ID:</strong> {{ selectedReview.emp_id }}</p>
                <p><strong>Employee Name:</strong> {{ selectedReview.name }}</p>
                <p><strong>Reviewer ID:</strong> {{ selectedReview.reviewer_emp_id }}</p>
                <p><strong>Reviewer Name:</strong> {{ selectedReview.reviewer_name }}</p>
                <p><strong>Department:</strong> {{ selectedReview.department_name }}</p>
                <p><strong>Review Date:</strong> {{ selectedReview.review_date }}</p>
                <p><strong>Rating:</strong> {{ selectedReview.rating }}</p>
                <p><strong>Review Text:</strong> {{ selectedReview.review_text }}</p>
            </div>
            <div v-else>
                <p>Loading review details...</p>
            </div>
        </div>
    </div>

    <!-- ADD MODAL -->
    <div class="add-model" v-if="showAddModal">
        <div class="modal-add">
            <span class="close-btn" @click="closeAddModal">&times;</span>
            <h2>Add New Employee Review</h2>
            <form @submit.prevent="addReviewEntry">
                <div class="inputs">
                    <label for="emp_id">Employee ID:</label>
                    <input type="text" v-model="newReviewEntry.emp_id" id="emp_id" required>
                </div>
                <div class="inputs">
                    <label for="reviewer_emp_id">Reviewer Employee ID:</label>
                    <input type="text" v-model="newReviewEntry.reviewer_emp_id" id="reviewer_emp_id" required>
                </div>
                <div class="inputs">
                    <label for="department_id">Department ID:</label>
                    <input type="number" v-model="newReviewEntry.department_id" id="department_id" required>
                </div>
                <div class="inputs">
                    <label for="review_date">Review Date:</label>
                    <input type="date" v-model="newReviewEntry.review_date" id="review_date" required>
                </div>
                <div class="inputs">
                    <label for="review_text">Review Text:</label>
                    <textarea v-model="newReviewEntry.review_text" id="review_text"></textarea>
                </div>
                <div class="inputs">
                    <label for="rating">Rating (1-5):</label>
                    <input type="number" v-model="newReviewEntry.rating" id="rating" min="1" max="5" required>
                </div>
                <button type="submit" class="submit-btn">Submit Review</button>
            </form>
        </div>
    </div>

    <!-- UPDATE MODAL -->
    <div class="add-model" v-if="showUpdateModal">
        <div class="modal-add">
            <span class="close-btn" @click="closeUpdateModal">&times;</span>
            <h2>Update Employee Review</h2>
            <form @submit.prevent="updateReviewEntry">
                <div v-if="reviewToUpdate">
                    <p><strong>Review ID:</strong> {{ reviewToUpdate.review_id }}</p>
                    <div class="inputs">
                        <label for="update_emp_id">Employee ID:</label>
                        <input type="text" v-model="reviewToUpdate.emp_id" id="update_emp_id" required>
                    </div>
                    <div class="inputs">
                        <label for="update_reviewer_emp_id">Reviewer Employee ID:</label>
                        <input type="text" v-model="reviewToUpdate.reviewer_emp_id" id="update_reviewer_emp_id" required>
                    </div>
                    <div class="inputs">
                        <label for="update_department_id">Department ID:</label>
                        <input type="number" v-model="reviewToUpdate.department_id" id="update_department_id" required>
                    </div>
                    <div class="inputs">
                        <label for="update_review_date">Review Date:</label>
                        <input type="date" v-model="reviewToUpdate.review_date" id="update_review_date" required>
                    </div>
                    <div class="inputs">
                        <label for="update_review_text">Review Text:</label>
                        <textarea v-model="reviewToUpdate.review_text" id="update_review_text"></textarea>
                    </div>
                    <div class="inputs">
                        <label for="update_rating">Rating (1-5):</label>
                        <input type="number" v-model="reviewToUpdate.rating" id="update_rating" min="1" max="5" required>
                    </div>
                    <button type="submit" class="submit-btn">Save Changes</button>
                </div>
                <div v-else><p>Loading review for update...</p></div>
            </form>
        </div>
    </div>
    <div class="heading" v-if="Reviews && Reviews.length > 0">
        <table class="table">
            <thead>
                <tr>
                    <th class="h-row" scope="col">#</th>
                    <th class="h-row" scope="col">Employee ID</th>
                    <th class="h-row" scope="col">Employee Name</th>
                    <th class="h-row" scope="col">Role</th>
                    <th class="h-row" scope="col">Review Date</th>
                    <th class="h-row" scope="col">rating</th>
                    <th class="h-row" scope="col">Review</th>
                    <th class="h-row" scope="col"></th>
                    <th class="h-row" scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="review in Reviews" :key="review_id">
                    <th scope="row">{{ review.review_id }}</th>
                    <td>{{ review.emp_id }}</td>
                    <td>{{ review.name }}</td>
                    <td>{{ review.department_name }}</td>
                    <td>{{ review.review_date }}</td>
                    <td>{{ review.rating }}</td>
                    <td>
                        <div class="view view-wrap" @click="showReviewDetails(review.review_id)">View</div>
                    </td>
                    <td>
                        <div class="view view-wrap" @click="showUpdateDetails(review.review_id)">Update</div>
                    </td>
                    <td>
                        <div class="view-wrap delete-btn" @click="confirmDelete(review.review_id)">
                            Delete
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'ReviewComp',
    data() {
        return {
            showAddModal: false,    
            showViewModal: false,
            showUpdateModal: false,
            reviewToUpdate: null,
            newReviewEntry: {
                emp_id: '',
                reviewer_emp_id: '',
                department_id: null,
                review_date: '',
                review_text: '',
                rating: null
            },
            selectedReview: null
        };
    },
    computed: {
        Reviews(){
            const reviewsData = this.$store.state.reviews;
            console.log("Reviews computed property data:", reviewsData);
            return reviewsData;
        },
        averageRating() {
            if (this.Reviews && Array.isArray(this.Reviews) && this.Reviews.length > 0) {
                const totalRating = this.Reviews.reduce((sum, review) => {
                    return sum + (typeof review.rating === 'number' ? review.rating : 0);
                }, 0);
                return totalRating / this.Reviews.length;
            }
            return 0;
        }
    },
    methods: {
        confirmDelete(review_id) {
            if (window.confirm(`Are you sure you want to delete review ID: ${review_id}?`)) {
                this.deleteReview(review_id);
            }
        },
        async deleteReview(review_id) {
            try {
                await this.$store.dispatch('deleteReview', { review_id: review_id });
                await this.$store.dispatch('getAllReviewsWithAllDetails');
                console.log(`Review for ${review_id} deleted successfully.`);
            } catch (error) {
                console.error("Failed to delete review:", error);
            }
        },
        closeAddModal() {
            this.showAddModal = false;
            this.newReviewEntry = {
                emp_id: '',
                reviewer_emp_id: '',
                department_id: null,
                review_date: '',
                review_text: '',
                rating: null
            };
        },
        async showReviewDetails(review_id) {
            this.selectedReview = null; 
            this.showViewModal = true; 
            try {
                const reviewDetails = await this.$store.dispatch('getReviewById', review_id);
                this.selectedReview = reviewDetails; 
            } catch (error) {
                console.error('Error fetching review details:', error);
                this.selectedReview = { error: 'Could not load review details.' }; 
                alert(`Failed to load review details: ${error.message}`); 
            }
        },
        closeViewModal() {
            this.showViewModal = false;
            this.selectedReview = null; 
        },
        async addReviewEntry() {
            await this.$store.dispatch('addReview', this.newReviewEntry);
            console.log('Review added successfully!');
            await this.$store.dispatch('getAllReviewsWithAllDetails');
            this.closeViewModal();
        },
        async showUpdateDetails(review_id) {
            this.reviewToUpdate = null;
            this.showUpdateModal = true;

            try {
                const reviewDetails = await this.$store.dispatch('getReviewById', review_id);
                this.reviewToUpdate = {...reviewDetails};
            } catch (e) {
                console.error('Error fetching review details for update: ', e);
                alert('Failed to load review for update');
                this.closeUpdateModal();
            }
        },
        closeUpdateModal() {
            this.showUpdateModal = false;
            this.reviewToUpdate = null;
        },
        async updateReviewEntry() {
            if (!this.reviewToUpdate || !this.reviewToUpdate.review_id) {
                console.error('No review selected for update');
                alert('No review selected for update');
                return;
            }

            try {
                await this.$store.dispatch('updateReview', this.reviewToUpdate);
                console.log('Review ${this.reviewToUpdate.review_id} updated successfully!');
                await this.$store.dispatch('getAllReviewsWithAllDetails');
                this.closeUpdateModal();
            } catch (e) {
                console.error('Error updating review: ', e);
                alert('Failed to update review');
            }
        }
    },
    mounted() {
        this.$store.dispatch('getAllReviewsWithAllDetails');
    }
}

</script>

<style>
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
    max-width: 100vw;
    overflow-x: auto;
}
.table {
    width: 100%;
    margin: auto;
    padding-left: 230px;
    box-shadow: 1px 4px 3px 2px rgba(8, 14, 20, 0.312);
}
.table .h-row{
    background-color: #2c3e50;
    color: white;
}
.table th,
td {
    text-align: center;
    border-bottom: 1px solid #2c3e50;
}
.r-stats{
    width: 83%;
    margin-left: 15%;
    display: flex;
    justify-content: space-between;
    text-align: center;
}
.r-card1{
    background-color: white;
    width: 45%;
    height: 100px;
    color: #2c3e50;
    display: flex;
    justify-content: space-around;
    border-radius: 10px;
    align-items: center;
    box-shadow: 0 4px 16px 0 rgba(8, 14, 20, 0.312);
}
.r1-title{
    color: orange;
    font-size: 25px;
}
.rv-i, .r-txt{
    color: orange;
    font-size: 50px;
}
.r-txt{
    margin-top: 5px;
    margin-left: 50px;
}
.i-rev{
    display: flex;
    background-color: rgba(255, 166, 0, 0.23);
    width: 30%;
    height: 80px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;

}
.r-card2{
    background-color: white;
    width: 45%;
    height: 100px;
    color: #2c3e50;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 16px 0 rgba(8, 14, 20, 0.312);
}
.p-title{
    color: orange;
}
.r-performers{
    display: flex;
    justify-content: space-around;
}
.p-icon{
    color: rgb(255, 165, 0);
    margin-top: 4px;
}
.p-item1, .p-item2, .p-item3{
    width: 30%;
    text-align: center;
}
.p-txt{
    margin: 0;
    font-weight: 400;
}
.p-rev{
    display: flex;
    justify-content: center;
    gap: 10px;
    background-color: rgba(255, 166, 0, 0.356);
    border-radius: 10px;
    color: orange;
    height: 25px;
}
.p-icon-txt{
    font-size: 15px;
    font-weight: 400;
}
.pg-title{
    margin-left: 15%;
    width: 83%;
    text-align: center;
    padding: 10px;
    margin-bottom: 20px;
}
h3{
    font-size: 40px;
    color: #2c3e50;
}
.reviewDetails {
    font-weight: 400;
    font-size: 20px;
}
.inputs textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
@media screen and (max-width: 768px) {
    .r1-title{
        font-size: 20px;
        text-align: start;
        width: 65%;
    }
    .rv-i, .r-txt{
        font-size: 25px;
    }
    .i-rev{
        width: 25%;
        height: 50px;
    }
    .p-title{
        font-size: 20px;
    }
    .p-txt{
        font-size: 12px;
    }
    .p-rev{
        width: 60px;
        margin: auto;
    }
    .p-item1, .p-item2, .p-item3{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .p-icon{
        margin-top: 2px;
    }
    .pg-title{
        margin-left: 90px;
    }
    .r-stats{
        margin-left: 90px;
    }
    .heading{
        margin-left: 90px;
    }
}
@media screen and (max-width: 480px) {
    .r-stats{
        display: flex;
        flex-direction: column;
        margin-left: 65px;
    }
    .r-card1, .r-card2{
        width: 100%;
        margin-bottom: 10px;
    }
    .heading{
        margin-left: 65px;
    }
}
</style>