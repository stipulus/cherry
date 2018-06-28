var LoginModal = Vue.component('login-modal', {
	template: `<div id="login-modal" class="modal fade" tabindex="-1" role="dialog">
	    <div class="modal-dialog" role="document">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h4 class="modal-title">Create an Account</h4>
	                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	                    <span aria-hidden="true">&times;</span>
	                </button>
	            </div>
	            <div class="modal-body">
	                    <div class="form-group">
	                        <label for="loginEmail">Email address</label>
	                        <input type="email" required name="email" class="form-control" id="loginEmail" placeholder="Enter email" v-model="user.email">
	                        <small class="form-text text-muted">Email addresses are used for account recovery purposes and will not be shared with anyone else.</small>
	                    </div>
	                    <div class="form-group">
	                        <label for="loginPassword">Password</label>
	                        <input type="password" required name="password" class="form-control" id="loginPassword" placeholder="Password" v-model="user.password" v-on:keydown.enter="submit">
	                    </div>
	                    <div class="form-group">
	                        <div class="alert alert-danger" role="alert" v-show="alert">{{ alert }}</div>
	                    </div>
	                <div class="text-center">
	                    <p>Don't have a Cherry Account?</p>
	                    <a href="#" data-toggle="modal" data-dismiss="modal" data-target="#signup-modal" class="login-link">Sign Up Now!</a>
	                </div>
	            </div>
	            <div class="modal-footer">
	                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
	                <button type="button" class="btn btn-primary submit" v-on:click="submit">Login</button>
	            </div>
	        </div>
	    </div>
	</div>`,
	data: function() {
		return {
			alert: '',
			user: {
				email:'',
				password:''
			}
		}
	},
	methods: {
		submit: function () {
			var self = this;
			if(this.user.email === '') return this.alert = 'Email is required.';
			if(this.user.password === '') return this.alert = 'A password is required.';
			//this.$parent.loading = true;
			//show loading
			this.$store.dispatch('login', this.user).then(res => {
				app.loadUser(res.data);
				$('#login-modal').modal('hide');
				//hide loading
				//app.loading = false;
			}).catch(res => {
				//hide loading
				//app.loading = false;
				if(res.bodyText && res.bodyText !== '{}') {
					self.alert = res.bodyText;
				} else {
					self.alert = 'An unknown error has occured. Please try again later.';
				}
			});
		}
	}
});