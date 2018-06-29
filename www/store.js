
//Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		loading: false,
		user: null
	},
	mutations: {
		login: function (state) {
			state.loading = true;
			state.user = null;
		},
		loginSuccess: function (state, user) {
			state.loading = false;
			state.user = user;
			//save token to cookie
			var cookie = new trex.Cookie('cherry-login');
			cookie.value = JSON.stringify(user);
			cookie.expire = '365';
			cookie.set();
			//update vue settings to use token
			Vue.http.headers.common['x-access-token'] = user.token.value;
		},
		loginFailure: function (state) {
			state.loading = false;
		},
		logout: function (state) {
			//remove local data
			state.user = null;
			//remove cookie
			var cookie = new trex.Cookie('cherry-login');
			cookie.delete();
			//remove token from headers setting
			delete Vue.http.headers.common['x-access-token'];
		}
	},
	actions: {
		signup: function (state, {email, password}) {
			state.commit('login');
			return new Promise(function (resolve, reject) {
				app.$http.post('/user',{email:email,password:CryptoJS.SHA256(password).toString()}).then(function (res) {
					state.commit('loginSuccess', res.data);
					resolve(res);
				}).catch(function (res) {
					state.commit('loginFailure');
					reject(res);
				});
			});
		},
		login: function (state, {email, password}) {
			state.commit('login');
			return new Promise(function (resolve, reject) {
				app.$http.post('/user/login',{email:email,password:CryptoJS.SHA256(password).toString()}).then(function (res) {
					state.commit('loginSuccess', res.data);
					resolve(res);
				}).catch(function (res) {
					state.commit('loginFailure');
					reject(res);
				});
			});
		},
		logout: function (state) {
			state.commit('logout');
			//nav to root
			router.push({path:'/'});
		},
		checkForUser: function (state) {
			var user;
			var cookie = new trex.Cookie('cherry-login');
			cookie.get();
			if (cookie.value) {
				try {
					user = JSON.parse(cookie.value);
				} catch (e) {
					user = null;
				}
				if(user && user.token && new Date(user.token.expires) > new Date()) {
					state.commit('loginSuccess', user);
				} else {
					cookie.delete();
					state.commit('loginFailure');
				}
			}
		}
	}
});