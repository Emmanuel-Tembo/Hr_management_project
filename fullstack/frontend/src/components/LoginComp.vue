<template>
    <div class="signInScreen">
        <div class="signIn">
            <div class="signIn-header">
                <h3>ModernTech Solutions</h3> <br> <hr> <br>
                <div class="toggle-buttons">
                    <button class="h-50 w-25" @click="isSignIn = true" :class="{ 'active-toggle': isSignIn}">Sign In</button>
                    <button class="h-50 w-25" @click="isSignIn = false" :class="{ 'active-toggle': !isSignIn}">Register</button>
                </div>
            </div>

            <div class="form-container">
                <form @submit.prevent="signInForm" v-if="isSignIn">
                    <span>Sign In</span> <br><br>
                    <div class="singIn-form">
                        <div class="inputs">
                            <input type="text" class="username" v-model="enteredUser" :class="{'errorInput': signInError}" placeholder="Username" required>
                            <br> <br>

                            <input type="password" class="password" v-model="enteredPwd" :class="{'errorInput': signInError}" placeholder="Password" required>
                            <br> <br>
                        </div>

                        <div class="cont-button">
                            <button type="submit" class="signIn-button h-25 w-25">Sign In</button>
                        </div>
                    </div>
                    <br>
                    <p class="error-msg" :class="{visible: signInError}">Invalid credentials. Please try again.</p>
                </form>

                <form @submit.prevent="registerForm" v-else>
                    <span>Register</span> <br><br>
                    <div class="signIn-form">
                        <div class="inputs">
                            <input type="text" class="username" v-model="regUser" placeholder="Insert Username" required>
                            <br><br>

                            <input type="text" class="ID" v-model="regID" placeholder="Insert Employee ID" required>
                            <br><br>

                            <input type="password" class="password" v-model="regPwd" placeholder="Insert Password" required>
                            <br><br>

                            <input type="password" class="password" v-model="regConfirmPwd" placeholder="Confirm Password" required>
                            <br><br>
                        </div>

                        <div class="cont-button">
                            <button type="submit" class="signIn-button h-25 w-25">Register</button>
                        </div>
                        <br>
                        <p class="error-msg" :class="{visible: registerError}" ref="registerErrorMessage">{{ registerErrorMessage }}</p>
                        <p class="success-msg" :class="{visible: registerSuccess}" ref="registerSuccessMessage">Registration successful! Please sign in.</p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                isSignIn: true,
                enteredUser: "",
                enteredPwd: "",
                signInError: false,

                regUser: '',
                regID: '',
                regPwd:'',
                regConfirmPwd:'',
                registerError: false,
                registerSuccess: false,
                registerErrorMessage: 'Registration failed.' // Initialize with a default message
            }
        },
        methods: {
            async signInForm() {
                this.signInError = false;
                this.registerSuccess = false;

                try {
                    const res = await axios.post('http://localhost:3030/api/auth/login', {
                        username: this.enteredUser,
                        password: this.enteredPwd
                    });

                    if (res.data && res.data.token) {
                        localStorage.setItem('userToken', res.data.token);
                        console.log('Login successful! Token: ', res.data.token);
                        this.$router.push('/overview');
                    } else {
                        this.signInError = true;
                        console.error('Login successful but no token received');
                    }
                } catch (e) {
                    this.signInError = true;
                }
            },

            validatePassword(password, username) {
                // 1. Minimum 8 characters
                if (password.length < 8) {
                    return "Password must be at least 8 characters long.";
                }

                // 2. Contains at least one lowercase letter
                if (!/[a-z]/.test(password)) {
                    return "Password must contain at least one lowercase letter.";
                }

                // 3. Contains at least one uppercase letter
                if (!/[A-Z]/.test(password)) {
                    return "Password must contain at least one uppercase letter.";
                }

                // 4. Contains at least one number
                if (!/[0-9]/.test(password)) {
                    return "Password must contain at least one number.";
                }

                // 5. Contains at least one special character
                if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~` ]/.test(password)) {
                    return "Password must contain at least one special character (e.g., !@#$%^&*).";
                }

                // 6. Password cannot include username
                if (username && password.toLowerCase().includes(username.toLowerCase())) {
                    return "Password cannot include your username.";
                }

                return null; // Indicates no error
            },

            async registerForm() {
                this.registerError = false;
                this.registerSuccess = false;
                this.registerErrorMessage = 'Registration failed.'; // Reset message

                if (
                    this.regUser.trim() === "" ||
                    this.regID.trim() === "" ||
                    this.regPwd.trim() === "" ||
                    this.regConfirmPwd.trim() === ""
                ) {
                    this.registerError = true;
                    this.registerErrorMessage = 'All fields are required';
                    // Scroll to error message immediately
                    this.$nextTick(() => {
                        this.$refs.registerErrorMessage?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    });
                    return;
                }

                if (this.regPwd !== this.regConfirmPwd) {
                    this.registerError = true;
                    this.registerErrorMessage = 'Passwords do not match';
                    // Scroll to error message immediately
                    this.$nextTick(() => {
                        this.$refs.registerErrorMessage?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    });
                    return;
                }

                const passwordValidationError = this.validatePassword(this.regPwd, this.regUser);
                if (passwordValidationError) {
                    this.registerError = true;
                    this.registerErrorMessage = passwordValidationError;
                    // Scroll to error message immediately
                    this.$nextTick(() => {
                        this.$refs.registerErrorMessage?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    });
                    return;
                }

                try {
                    const res = await axios.post('http://localhost:3030/api/auth/register', {
                        emp_id: this.regID,
                        username: this.regUser,
                        password: this.regPwd
                    });

                    if (res.status === 201) {
                        this.registerSuccess = true;
                        // Scroll to success message immediately
                        this.$nextTick(() => {
                            this.$refs.registerSuccessMessage?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        });

                        this.regUser = "";
                        this.regID = "";
                        this.regPwd = "";
                        this.regConfirmPwd = "";

                        setTimeout(() => {
                            this.isSignIn = true;
                            this.registerSuccess = false;
                            this.registerErrorMessage = 'Registration failed.';
                        }, 1500);
                    }
                } catch (e) {
                    this.registerError = true;
                    this.registerErrorMessage = e.response ? e.response.data.message : 'An unexpected error occurred during registration.';
                    // Scroll to error message on backend failure
                    this.$nextTick(() => {
                        this.$refs.registerErrorMessage?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    });
                }
            }
        },
        watch: {
            isSignIn(newValue) {
                this.registerSuccess = false;
                this.registerError = false;
                this.signInError = false;
                this.enteredUser = '';
                this.enteredPwd = '';
                this.regUser = '';
                this.regID = '';
                this.regPwd = '';
                this.regConfirmPwd = '';
                this.registerErrorMessage = 'Registration failed.';
            }
        }
    }
</script>

<style scoped>
    /* Your existing CSS styles remain unchanged */
    .signInScreen {
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('@/assets/background.jpg');
        background-position: top right;
        background-repeat: no-repeat;
        animation: moving 50s infinite;
    }

    .signIn {
        margin: 0 auto;
        padding: 40px;
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        max-height: 80vh;
    }

    .signIn-header {
        width: 100%;
        text-align: center;
    }

    .form-container {
        flex-grow: 1;
        width: 100%;
        overflow-y: auto;
        padding: 20px 0;
        box-sizing: border-box;

        &::-webkit-scrollbar {
        width: 0px;
        background: transparent;
        }
    }


    h3 {
        color: #1b7ad8;
        font-size: 50px;
    }

    .signIn span {
        font-size: 30px;
        font-weight: 300;
    }

    /* TOGGLE BUTTONS */
    .toggle-buttons {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-evenly;
        gap: 10px;
    }

     .toggle-buttons button {
        background-color: #e0e0e0;
        color: #555;
        border: none;
        padding: 10px 20px;
        border-radius: 15px;
        cursor: pointer;
        font-size: 18px;
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    .toggle-buttons button.active-toggle {
        background-color: #2d4257;
        color: white;
    }

    .toggle-buttons button:hover:not(.active-toggle) {
        background-color: #d0d0d0;
    }

    /* CSS INPUT */
    .signIn-form {
        text-align: left;
    }

    .signIn input{
        border-radius: 10px;
        width: 100%;
        cursor: text;
    }

    .inputs {
        width: 100%;
    }

    /* CSS BUTTON */
    .cont-button {
        display: flex;
        justify-content: center;
    }
    .signIn-button {
        border-radius: 15px;
        padding: 10px 15px;
        background-color: #2d4257;
        color: white;
        font-size: 20px;
        border: 1px solid #2d4257;
    }

    .signIn-button:hover {
        border-radius: 15px;      
        background-color: white;
        color: #2d4257;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 6px 20px 0 rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
        transition: transform ease-in 2s;
    }

    /* CSS ERROR */
    .signIn p {
        font-size: 20px;
        padding: 15px 25px;
        border-radius: 15px;
    }
    .error-msg {
        visibility: hidden;
        opacity: 0;
        color: red;
        background-color: rgb(247, 191, 186);
        transition: opacity ease 0.3s;
        font-weight: 400;
    }

    .success-msg {
        visibility: hidden;
        opacity: 0;
        background-color: rgb(200, 247, 186); 
        color: green;
        transition: opacity ease 0.3s;
    }

    .error-msg.visible, .success-msg.visible {
        visibility: visible;
        opacity: 1;
    }

    .errorInput {
        border: 2px solid red;
    }

    /* KEYFRAME */
    @keyframes moving {
        50% {background-position: center}
    }

    @media (max-width: 800px) {
        .signIn {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
            justify-content: center;
        }
    }
</style>