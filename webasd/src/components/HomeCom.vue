<template>
    <div class="container">
        <div class="row" >
            <div class="offset-md-10 col-md-2" >
                <router-link class="btn btn-primary" v-if="teacher" to="/course/add">Add Course</router-link>
            </div>
        </div>
    </div>
    <div class="container">

        <CourseCom />

    </div>

</template>

<script>
import CourseCom from "./CourseCom"
import axios from "axios"
import swal from "sweetalert2"

export default {



    data() {

        return {
            student: null,
            teacher:false
        }
    },

    methods: {
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
                }else{
                    this.teacher=false
                }
            } else {
                this.login = false;
            }

            global.student = this.student
        },
    },

    mounted: function () {
        this.getUser();
    },
    components: {
        CourseCom
    }
}
</script>