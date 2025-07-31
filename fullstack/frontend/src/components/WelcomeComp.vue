<template>
    <div class="dash-img w-100">
        <img class="dash-profile"
            src="https://www.shutterstock.com/image-photo/attractive-positive-african-american-young-600nw-2464015801.jpg"
            alt="TheDev">
        <div class="txt text-center">
            <h2 class="fs-1">Welcome Back</h2>
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
    font-size: 40px;
    color: #333;
}

.dash-profile {
    width: 200px;
    border-radius: 10px;
    margin: 20px;
    box-shadow: 0 4px 16px 0 rgba(8, 14, 20, 0.312);
}

.dash-img {
    display: flex;
    align-items: center;

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

    .txt {
        text-align: center;
    }
}
</style>