<template>
    <div class="ReviewCard shadow-sm"> <h3 class="text-center my-3">Reviews</h3>
        <div class="reviews">
            <div class="w-100 d-flex justify-content-around mb-3" v-for="(review,idx) in displayedReviews" :key="review.review_id">
                <div class="pfp">
                    <img class="rev-img" :src="imgAndRating[idx] ? imgAndRating[idx].img : 'https://via.placeholder.com/50'" alt="Employee Profile">
                </div>
                <div class="top ms-4">
                    <h5 class="rev-name">{{ review.name }}</h5>
                    <p class="review">{{ review.department_name }}</p>
                </div>
                <div class="bottom">
                    <div class="rev-icon">
                        <i class="fa fa-star" aria-hidden="true"></i>
                        <p class="icon-txt">{{ review.rating }}</p>
                    </div>

                </div>
            </div>
        </div>
        <div class="rv-btn-div">
            <router-link to="/reviews"><button class="btn-primary rev-btn">see more</button></router-link>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'EmployeeReview',
    data(){
        return{
            imgAndRating:[
                {
                img: "https://img.drz.lazcdn.com/static/pk/p/ad5ac8a13dc747a012e1b07e9e520645.jpg_720x720q80.jpg",
                },
                {
                img: "https://thepatientstory.com/wp-content/uploads/2025/01/Oya-G.-square-headshot-1024x1024.jpg",
                },
                {
                img: "https://img.freepik.com/premium-vector/portrait-handsome-middle-aged-male-blue-sweater-smiling-cameraportrait-han_912214-54892.jpg?semt=ais_hybrid&w=740",
                },
                {
                img: "https://i5.walmartimages.com/asr/c944f9da-bab8-456f-b824-16b643680b85.fa348ac80dae673c9a26579e0acbbb6a.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
                },
                {
                img: "https://media.istockphoto.com/id/1389348844/photo/studio-shot-of-a-beautiful-young-woman-smiling-while-standing-against-a-grey-background.jpg?s=612x612&w=0&k=20&c=anRTfD_CkOxRdyFtvsiPopOluzKbhBNEQdh4okZImQc=",
                },
                {
                img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCwnCbh6E7elXmxojUwd0U2k52ulKGAjhlhA&s",
                },
                {
                img: "https://media.istockphoto.com/id/1194465573/photo/portrait-of-smiling-african-american-woman.jpg?s=612x612&w=0&k=20&c=hD6As6gEFZobg44dhiHWkweVcKCv0NvPkk6XQChQKds=",
                },
            ]
        }
    },
    computed: {
        ...mapState(['reviews']),
        displayedReviews() {
            const reviewsFromStore = this.reviews ? this.reviews.slice(0, 6) : [];
            return reviewsFromStore.map((review, index) => {
                const imageUrl = this.imgAndRating[index] ? this.imgAndRating[index].img : 'https://via.placeholder.com/50';
                return {
                    ...review,
                    img: imageUrl
                };
            });
        }
    },
    created() {
        this.getAllReviewsWithAllDetails();
    },
    methods: {
        ...mapActions(['getAllReviewsWithAllDetails'])
    }
}
</script>

<style>
@keyframes slideInFromRightSpeed {
    0% {
        transform: translateX(100%); 
        opacity: 0; 
    }
    100% {
        transform: translateX(0); 
        opacity: 1; 
    }
}

.ReviewCard {
    background-color: white;
    margin-left: 10px;
    width: 400px;
    height: 97%;
    border-radius: 10px;
    box-shadow: 0 4px 16px 0 rgba(8, 14, 20, 0.312);
    border: 1px solid rgba(128, 128, 128, 0.384);
    animation: slideInFromRightSpeed 1s ease-out forwards; 
}

.pfp{
    width: 15%;
    align-content: center;
}
.top{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: center;
    width: 50%;
}
.bottom{
    display: flex;
    width: 20%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3px;
    margin-top: 5px;
}
.rev-img{
    width: 65px;
    border-radius: 50%;
    box-shadow: 0 4px 16px 0 rgba(8, 14, 20, 0.312);
}
.rev-icon{
    background-color: rgba(245, 171, 33, 0.226);
    width: 60px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    height: 30px;
    border-radius: 10px;
}
.icon-txt{
    margin-top: 10px;
    color: orange;
    font-weight: 400;
}
.reviews{
    margin: 0;
    font-weight: 300;
    height: 77%;
}
.review{
    color: #333;
    font-weight: 400;
}
.rev-btn{
    width: 100%;
    height: 30px;
}
.rv-btn-div{
    width: 90%;
    margin: auto;
}
.fa{
    color: orange;
    border-radius: 5px;
    width: 15px;
}
@media screen and (max-width: 1024px) {
    .ReviewCard{
        width: 300px;
    }
}
@media screen and (max-width: 768px) {
    .ReviewCard{
        width: 100%;
        height: 100%;
    }
    .rev-img{
        width: 80px;
    }
    .rev-title{
        padding: 10px;
    }
    .rv-btn-div{
        padding: 10px;
    }
}
@media screen and (max-width: 480px) {
    .bottom{
        width: 15%;
    }
    .top{
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>