import { createApp } from 'vue'
import App from './App.vue'

import { createRouter, createWebHistory } from 'vue-router'
import RegisterCom from "./components/RegisterCom.vue"
import LoginCom from "./components/LoginCom.vue"
import HomeCom from "./components/HomeCom.vue"
import AddCourse from "./components/AddCourseCom.vue"
import CartCom from "./components/CartCom.vue"



const routes = [
    { path: '/register', component: RegisterCom },
    { path: '/login', component: LoginCom },
    { path: '/', component: HomeCom },
    { path: "/course/add", component: AddCourse },
    { path: "/cart", component: CartCom },
];


const router = createRouter({
    history: createWebHistory(),
    routes,

})

const app = createApp(App)
app.use(router)


app.config.globalProperties.$mainURL = "http://localhost:8080"
app.config.globalProperties.$apiURL = "http://localhost:3000"
app.config.globalProperties.$accessTokenKey = "accessTokenKey"

app.config.globalProperties.$student = null;
app.config.globalProperties.$login = false;
app.config.globalProperties.$headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("accessTokenKey")
};


app.mount('#app')

