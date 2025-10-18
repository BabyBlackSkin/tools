import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'HomeView',
        meta: {
            name: 'HomeView'
        },
        component: () => {
            return import("@/views/modules/HomeView.vue")
        },
    },

    {
        path: '/about',
        name: 'About',
        meta: {
            name: 'About'
        },
        component: () => {
            return import("@/views/modules/About.vue")
        },
    },
    {
        path: '/settings',
        name: 'Settings',
        meta: {
            name: 'Settings'
        },
        component: () => {
            return import("@/views/modules/Settings.vue")
        },
    },
    {
        path: '/sshManager',
        name: 'sshManager',
        meta: {
            name: 'sshManager'
        },
        component: () => {
            return import("@/views/Container.vue")
        },
        children: [
            {
                path: '/sshList',
                name: 'sshList',
                meta: {
                    name: 'sshManager'
                },
                component: () => {
                    return import("@/views/modules/tunnel/tunnelList.vue")
                },
            },
            {
                path: '/addSsh',
                name: 'addSSH',
                meta: {
                    name: 'sshManager'
                },
                component: () => {
                    return import("@/views/modules/tunnel/addTuunel.vue")
                }
            }
        ]
    },
    {
        path: '/str',
        name: 'Str',
        meta: {
            name: 'ParsingMapToStringStr'
        },
        component: () => {
            return import("@/views/modules/stringAnalysis/ParsingMapToStringStr.vue")
        },
    },
]

const router = new VueRouter({
    routes
})

export default router
