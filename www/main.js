
var app = new Vue({
	el: '#app',
	store,
	router,
	data: {

	},
	computed: {
		loading: function () {
			return this.$store.state.loading;
		},
		user: function () {
			return this.$store.state.user;
		}
	},
	methods: {
		logout: function () {
			this.$store.dispatch('logout');
		}
	},
	beforeCreate: function () {
		this.$store.dispatch('checkForUser');
	}
});