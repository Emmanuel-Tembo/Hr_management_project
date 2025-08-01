<template>
    <div class="dash-img">
        <img class="dash-profile"
            src="https://images.aceandtate.com/image/upload/c_fill,h_3840,w_3840,g_face,q_85/:spree/public/spree/products/19282/original/149_Allen-small-red-storm-sun-head-male_033_C01.jpg"
            alt="TheDev">
        <div class="txt text-center w-100">
            <h2 class="fs-1 wlcm-title">Welcome Back</h2>
            <p class="dash-txt">To your HR Dashboard!</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WelcomeComp'
}
</script>

<style>
.wlcm-title {
    color: #333;
}

@keyframes slideInFromLeft {
    0% {
        transform: translateX(-100%); 
        opacity: 0; 
    }
    100% {
        transform: translateX(0);
        opacity: 1; 
    }
}

.dash-img {
    display: flex;
    align-items: center;
    width: 100%;

    animation: slideInFromLeft 0.8s ease-out forwards;
}

.dash-profile {
    width: 200px;
    border-radius: 10px;
    margin-left: 66px;
    box-shadow: 0 4px 16px 0 rgba(8, 14, 20, 0.312);
}

.txt {
    width: 100%; 
}

.dash-txt {
    color: #333;
    font-weight: 400;
    font-size: 20px;
}

@media screen and (max-width: 768px) {
    .wlcm-title {
        font-size: 35px;
    }
}
</style>