import Vue from 'vue';
import VueSession from 'vue-session';
import Meta from 'vue-meta';
import twitter from 'vue-twitter'
import CountryFlag from 'vue-country-flag'
import Axios from 'axios'
import VueCountdownTimer from 'vuejs-countdown-timer'
import VueCrypt from 'vue-crypt'
import $aes from 'vue-crypt'

Vue.use(VueCrypt)
Vue.use(VueCountdownTimer)

Vue.use(VueSession);
Vue.use(Meta);
Vue.use(twitter)
Vue.component('country-flag', CountryFlag)
Vue.prototype.$http = Axios;

Vue.config.productionTip = false

