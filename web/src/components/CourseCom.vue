<template>
    <div class="row">
        <div class="col-md-12">
            <h1 class="text-center text-white">Courses</h1>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Course</th>
                        <th>Title</th>
                        <th>Instructor</th>
                        <th>Credits</th>
                        <th>Course Details</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="course in courses">
                        <td>
                            <span v-text="course.subject"></span>

                        </td>

                        <td v-text="course.course"></td>
                        <td v-text="course.title"></td>
                        <td v-text="course.instructor"></td>
                        <td v-text="course.credits"></td>

                        <td style="width: 30%;">
                            <details>
                                <summary>Course Description</summary>
                                <span style=" position: relative;" v-text="course.coursedes"></span>
                            </details>
                        </td>
                        <td>
                            <form method="POST" v-on:submit.prevent="addtocart" v-if="!teacher">
                                <input v-bind:value="course._id" name="courseid" type="hidden" />
                                <input type="submit" class="btn btn-primary btn-block"
                                    v-bind:value="isLoading ? 'Adding...' : 'Add to Schedule'"
                                    v-bind:disabled="isLoading" />
                            </form>
                        </td>
                        <td>
                            <form v-on:submit.prevent="deleteCourse" v-if="teacher">
                                <input type="hidden" name="courseid" v-bind:value="course._id" required />
                                <input type="submit" v-bind:value="isDeleting ? 'Deleting...' : 'Delete'"
                                    v-bind:isDeleting="disabled" class="btn btn-danger" />
                            </form>

                        </td>

                    </tr>


                </tbody>
            </table>
        </div>
    </div>
</template>
 
<script>
import axios from "axios"
import swal from "sweetalert2"

export default {
    data() {
        return {
            courses: [],
            teacher: false
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
                } else {
                    this.teacher = false
                }
            } else {
                this.login = false;
            }

            global.student = this.student
        },

        getData: async function () {
            const self = this

            const response = await axios.post(
                this.$apiURL + "/course/fetch",
                null,
                {
                    headers: this.$headers
                }
            )
            console.log(response)

            if (response.data.status == "success") {
                this.courses = response.data.courses
            } else {
                swal.fire("Error", response.data.message, "error");
            }
        },
        addtocart: async function () {
            const self = this
            const form = event.target;
            const formData = new FormData(form);

            this.isLoading = true;
            const response = await axios.post(
                this.$apiURL + "/course/addtocart",
                formData,
                {
                    headers: this.$headers
                }
            );

            this.isLoading = false;
            swal.fire("Add Course", response.data.message, response.data.status);

        }, deleteCourse: async function () {
            const self = this
            const form = event.target

            swal.fire({
                title: 'Are you sure?',
                text: "This course will be removed",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, remove it!'
            }).then(async function (result) {
                if (result.isConfirmed) {

                    self.isDeleting = true;
                    const formData = new FormData(form);

                    const response = await axios.post(
                        self.$apiURL + "/course/deletecourse",
                        formData,
                        {
                            headers: self.$headers
                        }
                    );
                    self.isDeleting = false;

                    if (response.data.status == "success") {
                        swal.fire(
                            'Deleted!',
                            response.data.message,
                            'success',
                            window.location.href = "/"
                        );
                    } else {
                        swal.fire("Error", response.data.message, "error");
                    }
                }
            })
        },
    },

    mounted() {
        this.getUser()
        this.getData()
    }
}
</script>
