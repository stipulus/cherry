var SignupModal = Vue.component('signup-modal', {
	template: `<div id="signup-modal" class="modal fade" tabindex="-1" role="dialog">
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
	                        <label for="signupEmail">Email address</label>
	                        <input type="email" required name="email" class="form-control" id="signupEmail" placeholder="Enter email" v-model="user.email">
	                        <small class="form-text text-muted">Email addresses are used for account recovery purposes and will not be shared with anyone else.</small>
	                    </div>
	                    <div class="form-group">
	                        <label for="signupPassword">Password</label>
	                        <input type="password" required name="password" class="form-control" id="signupPassword" placeholder="Password" v-model="user.password">
	                    </div>
	                    <div class="form-group">
	                        <label for="signupPassword2">Repeat Password</label>
	                        <input type="password" required name="password2" class="form-control" id="signupPassword2" placeholder="Password" v-model="user.password2" v-on:keydown.enter="submit">
	                    </div>
	                    <div class="form-group">
	                        <div class="alert alert-danger" role="alert" v-show="alert">{{ alert }}</div>
	                    </div>
	                <div class="text-center">
	                    <p>Already have a Cherry Account?</p>
	                    <a href="#" data-toggle="modal" data-dismiss="modal" data-target="#login-modal" class="signup-link">Sign in Now!</a>
	                </div>
	            </div>
	            <div class="modal-footer">
	                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
	                <button type="button" class="btn btn-outline-primary submit" v-on:click="submit">Signup</button>
	            </div>
	        </div>
	    </div>
	</div>`,
	data: function() {
		return {
			alert: '',
			user: {
				email:'',
				password:'',
				password2:''
			}
		}
	},
	methods: {
		submit: function () {
			var self = this;
			if(this.user.email === '') return this.alert = 'Email is required.';
			if(this.user.password === '') return this.alert = 'A password is required.';
			if(this.user.password2 !== this.user.password) return this.alert = 'Passwords do not match.';
			this.$parent.loading = true;
			//show loading
			this.$http.post('/user',{email:this.user.email,password:CryptoJS.SHA256(this.user.password).toString()}).then(res => {
				app.loadUser(res.data);
				$('#signup-modal').modal('hide');
				//hide loading
				this.$parent.loading = false;
			}).catch(res => {
				//hide loading
				this.$parent.loading = false;
				if(res.bodyText && res.bodyText !== '{}') {
					self.alert = res.bodyText;
				} else {
					self.alert = 'An unknown error has occured. Please try again later.';
				}
			});
		}
	}
});