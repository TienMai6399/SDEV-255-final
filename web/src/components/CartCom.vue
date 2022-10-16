<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h1 class="text-center text-white">Your Enrolled Classes</h1>
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
                        </tr>
                    </thead>

                    <tbody>

                        <tr v-for="cart in carts">
                            <td>
                                <span v-text="cart.subject"></span>

                            </td>

                            <td v-text="cart.course"></td>
                            <td v-text="cart.title"></td>
                            <td v-text="cart.instructor"></td>
                            <td v-text="cart.credits"></td>

                            <td style="width: 30%;">
                                <details>
                                    <summary>Course Description</summary>
                                    <span style=" position: relative;" v-text="cart.coursedes"></span>
                                </details>
                            </td>
                            <td style="display: flex;">
                                <form v-on:submit.prevent="deleteCourse">
                                    <input type="hidden" name="cartid" v-bind:value="cart._id" required />
                                    <input type="submit" v-bind:value="isDeleting ? 'Deleting...' : 'Delete'"
                                        v-bind:isDeleting="disabled" class="btn btn-danger" />
                                </form>
                            </td>

                        </tr>


                    </tbody>
                </table>
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
            carts: []
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
            } else {
                this.login = false;
                window.location.href = "/login"
            }

            global.student = this.student
        },
        getData: async function () {
            const self = this

            const response = await axios.post(
                this.$apiURL + "/course/cart",
                null,
                {
                    headers: this.$headers
                }
            )
            console.log(response)

            if (response.data.status == "success") {
                this.carts = response.data.carts
            } else {
                swal.fire("Error", response.data.message, "error");
            }
        },
        deleteCourse: async function () {
            const self = this
            const form = event.target

            swal.fire({
                title: 'Are you sure?',
                text: "This will be removed from your card",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(async function (result) {
                if (result.isConfirmed) {

                    self.isDeleting = true;
                    const formData = new FormData(form);

                    const response = await axios.post(
                        self.$apiURL + "/course/delete",
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
                            window.location.href = "/cart"
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
