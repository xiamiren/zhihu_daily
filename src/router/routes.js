import Home from '@/pages/Home.vue';
const routes = [{
    path: '/',
    component: Home
}, {
    path: '/detail/:id',
    component: () => import(/* webpackChunkName:'other' */'@/pages/Detail.vue')
}, {
    path: '/login',
    component: () => import(/* webpackChunkName:'other' */'@/pages/Login.vue')
}, {
    path: '/person',
    component: () => import(/* webpackChunkName:'other' */'@/pages/Person.vue')
}, {
    path: '/store',
    component: () => import(/* webpackChunkName:'other' */'@/pages/Store.vue')
}, {
    path: '/updateperson',
    component: () => import(/* webpackChunkName:'other' */'@/pages/UpdatePerson.vue')
}, {
    path: '/:pathMatch(.*)*',
    redirect: '/'
}];
export default routes;