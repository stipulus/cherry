var app = new Vue({
	el: '#app',
	router,
	data: {
		loading:false,
		user:null
	},
	methods: {
		loadUser: function (data) {
			//save user details
			this.user = data.user;
			//save token to cookie
			var cookie = new trex.Cookie('cherry-login');
			cookie.value = JSON.stringify(data);
			cookie.expire = '365';
			cookie.set();
			//update vue settings to use token
			Vue.http.headers.common['x-access-token'] = data.token.value;
		},
		logout: function () {
			//remove local data
			this.user = null;
			//remove cookie
			var cookie = new trex.Cookie('cherry-login');
			cookie.delete();
			//remove token from headers setting
			delete Vue.http.headers.common['x-access-token'];
			//nav to root
			router.push({path:'/'});
		}
	},
	created: function () {
		var data;
		var cookie = new trex.Cookie('cherry-login');
		cookie.get();
		if (cookie.value) {
			try {
				data = JSON.parse(cookie.value);
			} catch (e) {
				data = null;
			}
			if(data && data.token && new Date(data.token.expires) > new Date()) {
				this.user = data.user;
				Vue.http.headers.common['x-access-token'] = data.token.value;
			} else {
				cookie.delete();
			}
		}
	}
});