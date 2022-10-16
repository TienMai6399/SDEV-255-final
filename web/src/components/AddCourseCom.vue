<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h1 class="text-center text-white">Add Course</h1>
            </div>
        </div>
        <div class="row">
            <div class="offset-md-3 col-md-6">
                <form method="POST" v-on:submit.prevent="addCourse">
                    <div class="form-group">
                        <label class="text-white">Subject </label>
                        <input type="text" name="subject" class="form-control" required />
                    </div>

                    <div class="form-group" style="margin-top: 20px; margin-bottom: 30px;">
                        <label class="text-white">Course Number</label>
                        <input type="number" name="course" class="form-control" required />
                    </div>
                    <div class="form-group" style="margin-top: 20px; margin-bottom: 30px;">
                        <label class="text-white">Course Title</label>
                        <textarea type="text" name="title" class="form-control" required />
                    </div>
                    <div class="form-group" style="margin-top: 20px; margin-bottom: 30px;">
                        <label class="text-white">Instructor</label>
                        <input type="text" name="instructor" class="form-control" required />
                    </div>
                    <div class="form-group" style="margin-top: 20px; margin-bottom: 30px;">
                        <label class="text-white">Credits</label>
                        <input type="number" name="credits" class="form-control" required />
                    </div>
                    <div class="form-group" style="margin-top: 20px; margin-bottom: 30px;">
                        <label class="text-white">Course description</label>
                        <textarea type="text" name="coursedes" class="form-control" required />
                    </div>

                    <div class="d-grid gap-2">
                        <input type="submit" class="btn btn-primary btn-block"
                            v-bind:value="isLoading ? 'Adding...' : 'Add Course'" v-bind:disabled="isLoading" />
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>
<script>
import axios from "axios"
import swal from "sweetalert2"

export default {
    data() {
        return {
            "isLoading": false
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
                if (response.data.role == "teacher") {
                    this.teacher = true
                }
            } else {
                this.login = false;
            }

            global.student = this.student

        },
        addCourse: async function () {
            const form = event.target;
            const formData = new FormData(form);

            this.isLoading = true;
            const response = await axios.post(
                this.$apiURL + "/course/add",
                formData,
                {
                    headers: this.$headers
                }
            );

            this.isLoading = false;
            swal.fire("Add Course", response.data.message, response.data.status);

            if (response.data.status == "success") {
                form.reset()
            }
        }
    },
    mounted() {
        this.getUser()
    }
}
</script>