import Vue from 'vue'
import Router from 'vue-router'
import MainPage from "../components/MainPage";
import Login from "../components/Login";
import Userlist from "../components/Userlist";
import Reportlist from "../components/Reportlist";
//先写routes里的组件名，再import，不然先import易报错

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/mainpage',
      name:'主页',
      component: MainPage,
      children:[{
        path:"showusers",
        name:'用户列表',
        component:Userlist
      },
        {
          path:"reports",
          name:'举报管理',
          component:Reportlist
        }
      ]
    },
    {
      path:'/',
      name:'登录页面',
      component:Login
    },
  ]
})
