
//Vue.use(Vuex);

var store = new Vuex.Store({
	state: {
		isLoggedIn: false,
		loading: false
	},
	mutations: {
		login: function (state) {
			state.loading = true;
			state.isLoggedIn = true;
		},
		loginSuccess: function (state) {
			state.loading = false;
			state.isLoggedIn = true;
		},
		loginFailure: function (state) {
			state.loading = false;
		},
		logout: function (state) {
			state.isLoggedIn = false;
		}
	},
	actions: {
		login: function (state, {email, password}) {
			console.log({email:email,password:CryptoJS.SHA256(password).toString()});
			state.commit('login');
			return new Promise(function (resolve, reject) {
				console.log(email,CryptoJS.SHA256(password).toString());
				app.$http.post('/user/login',{email:email,password:CryptoJS.SHA256(password).toString()}).then(function (data) {
					state.commit('loginSuccess');
					resolve(data);
				}).catch(function (res) {
					state.commit('loginFailure');
					reject(res);
				});
			});
		}
	}
});