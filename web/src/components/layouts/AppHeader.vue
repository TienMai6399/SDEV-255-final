<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" style="margin-bottom: 50px;">
        <div class="container-fluid">

            <router-link class="navbar-brand" to="/">
                Course
            </router-link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01"
                aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarColor01">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" v-if="!login" to="/login">Login</router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="nav-link" v-if="!login" to="/register">Register</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" v-if="!teacher && login" to="/cart">Cart</router-link>
                    </li>
                    <li class="nav-item dropdown" v-if="login">
                        <a class="nav-link dropdown-toggle" v-text="$student.firstname" href="#" id="navbarDropdown"
                            role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" v-on:click="doLogout" href="javascript:void(0);">Logout</a></li>
                    
            </div>
            </li>
            </ul>
        </div>
        </div>
    </nav>
</template>
 
<script>
import axios from "axios"
import swal from "sweetalert2"

export default {
    data() {
        
        return {
            login: false,
            student: null,
            teacher: false
        }
    },

    methods: {

        doLogout: async function () {
            const response = await axios.post(
                this.$apiURL + "/logout",
                null,
                {
                    headers: this.$headers
                }
            );

            if (response.data.status == "success") {
                // remove access token from local storage
                localStorage.removeItem(this.$accessTokenKey)

                window.location.href = "/login"
            } else {
                swal.fire("Error", response.data.message, "error");
            }
        },
        getUser: async function () {
            const self = this

            // check if user is logged in
            if (localStorage.getItem(this.$accessTokenKey)) {
                const response = await axios.post(
                    this.$apiURL + "/getUser",
                    null,
                    {
                        headers: this.$headers
                    }
                )

                if (response.data.status == "success") {
                    this.$student = response.data.student
                    console.log(this.$student)
                } else {
                    localStorage.removeItem(this.$accessTokenKey);                    
                }
                this.login = (localStorage.getItem(this.$accessTokenKey) != null);
                if(response.data.role=="teacher"){
                    this.teacher=true
                }
            } else {
                this.login = false;
            }

            global.student = this.student
        },
    },

    mounted: function () {
        this.getUser();
    }
}
</script>