var Home = Vue.component('Home', {
	template: `<h2>{{ message }}</h2>`,
	data: function() {
		return {
			message: 'Hello World!'
		}
	}
});