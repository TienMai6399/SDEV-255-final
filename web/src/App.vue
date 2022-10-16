<template>
  <AppHeader/>
    <RouterView/>

</template>

<script>
import AppHeader from './components/layouts/AppHeader.vue'
//import AppFooter from './components/layouts/AppFooter.vue'
import "../public/assets/css/bootstrap.min.css"
import "../public/assets/js/bootstrap.min.js"
import "../public/assets/js/jquery-3.6.1.js"

export default {
  name: 'App',
  components: {
    AppHeader
  }
}
</script>

<style>
body{
  margin-top: 0px;
}
</style>
