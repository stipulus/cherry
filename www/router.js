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

//Vue.use(VueRouter);

const router = new VueRouter({
	routes
});