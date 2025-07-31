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
    // No JavaScript needed in mounted() for this pure CSS keyframes animation
}
</script>

<style>
/* Global styles or styles defined in other components that apply here */
.wlcm-title {
    color: #333;
}

/* --- Keyframes Animation Definition --- */
@keyframes slideInFromLeft {
    0% {
        transform: translateX(-100%); /* Starts 100% of its own width off-screen to the LEFT */
        opacity: 0; /* Starts invisible */
    }
    100% {
        transform: translateX(0); /* Ends at its normal position */
        opacity: 1; /* Ends fully visible */
    }
}

/* --- Styles for the dash-img container --- */
.dash-img {
    display: flex;
    align-items: center;
    width: 100%;

    /* Apply the animation here */
    animation: slideInFromLeft 0.8s ease-out forwards;
    /*
      - slideInFromLeft: The name of our keyframes animation
      - 0.8s: Duration of the animation
      - ease-out: Timing function (starts fast, ends slow)
      - forwards: Essential! Keeps the element in its final state (100%) after the animation completes.
    */
}

/* Other styles you already have */
.dash-profile {
    width: 200px;
    border-radius: 10px;
    margin: 20px;
    box-shadow: 0 4px 16px 0 rgba(8, 14, 20, 0.312);
}

.txt {
    /* text-align: center; */ /* Bootstrap's text-center handles this */
    width: 100%; /* Bootstrap's w-100 handles this */
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
    /*
    .txt {
        text-align: center; // This is redundant if you use Bootstrap's text-center or it's default
    }
    */
}
</style>