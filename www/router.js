const NotFound = { template: '<p>Page not found</p>' };

const routes = [
	{
		path: '/',
		component: Home
	},
	{
		path: '/account',
		component: Account
	},
	{
		path: '*',
		component: NotFound
	}
];

const router = new VueRouter({
	routes
});