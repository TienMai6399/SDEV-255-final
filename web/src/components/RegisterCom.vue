<template>
    <div class="container" style="margin-top: 50px;">
        <h3 style="text-align: center;">Register</h3>
    </div>
    <div class="container" style="margin-top: 50px;">
        <div class="row">
            <div class="offset-md-3 col-md-6">
                <form method="post" v-on:submit.prevent="doRegister">
                    <div class="form-group">
                        <label class="text-white">First name</label>
                        <input type="text" class="form-control" name="firstname" />
                    </div>
                    <br />
                    <div class="form-group">
                        <label class="text-white">Last name</label>
                        <input type="text" class="form-control" name="lastname" />
                    </div>
                    <br />
                    <div class="form-group">
                        <label class="text-white">Email</label>
                        <input type="email" class="form-control" name="email" />
                    </div>
                    <br />
                    <div class="form-group">
                        <label class="text-white">Password</label>
                        <input type="password" class="form-control" name="password" />
                    </div>
                    <br />
                    <input type="submit" v-bind:value="isLoading ? 'Loading...' : 'Submnit'"
                        v-bind:disabled="isLoading" name="submit" class="btn btn-primary" />
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
        doRegister: async function () {
            const form = event.target;
            const formData = new FormData(form);
            this.isLoading = true;
            const response = await axios.post(this.$apiURL + "/registration", formData);

            this.isLoading = false;
            swal.fire(response.data.status, response.data.message, "success");
            if (response.data.status == "success") {
                form.reset();
            }
        }
    }
}
</script>