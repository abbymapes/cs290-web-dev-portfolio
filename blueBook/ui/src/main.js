/*
 *  The main JavaScript file for BlueBook's frontend.
 *
 * @author Abby Mapes
 */

import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import { BootstrapVue, BIcon } from 'bootstrap-vue';
import './plugins/bootstrap-vue';
import '../../../style.css';
import App from './App.vue';
import userState from './userState';

let isFirstLoad = true;

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.component('BIcon', BIcon);

userState.auth.onAuthStateChanged((user) => {
    userState.updateUser(user);
    if (isFirstLoad) {
        new Vue({
            render: (h) => h(App),
        }).$mount('#app');
    }
    isFirstLoad = false;
});
