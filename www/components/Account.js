var Account = Vue.component('Account', {
	template: `<div class="account">
		<div class="form-group">
			<button class="btn btn-outline-primary" data-target="#change-password-modal" data-toggle="modal">Change Password</button>
		</div>
		<div class="form-group">
            <label for="accountEmail">Email address</label>
            <div class="input-group">
            	<input type="email" required name="email" class="form-control" id="accountEmail" placeholder="Enter email" v-model="user.email">
            	<div class="input-group-append"><span class="input-group-text"><i class="fa fa-spinner fa-spin fa-lg" v-show="checkingEmail"></i><i class="fa fa-times fa-lg" v-show="!emailIsAvailable && !checkingEmail"></i><i class="fa fa-check-circle fa-lg" v-show="emailIsAvailable && !checkingEmail"></i></span></div>
            </div>
        </div>
        <div class="mb-1">
            <div class="alert alert-danger" v-show="alert" role="alert">{{ alert }}</div>
        </div>
    	<button class="btn btn-outline-primary btn-md ml-1 float-right" @click="save">Save Changes</button>
		<button class="btn btn-outline-secondary btn-md float-right" @click="cancel">Cancel</button>
		<div id="change-password-modal" class="modal fade" tabindex="-1" role="dialog">
		    <div class="modal-dialog" role="document">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h4 class="modal-title">Change Password</h4>
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                    <span aria-hidden="true">&times;</span>
		                </button>
		            </div>
		            <div class="modal-body">
		                <div class="form-group">
		                    <label for="oldPassword">Current Password</label>
		                    <input type="password" name="old-password" id="oldPassword" v-model="user.oldPassword" class="form-control" placeholder="Current Password" required>
		                </div>
		                <div class="form-group">
		                    <label for="newPassword">New Password</label>
		                    <input type="password" name="password" id="newPassword" v-model="user.newPassword" class="form-control" placeholder="New Password" required>
		                </div>
		                <div class="form-group">
		                    <label for="newPassword2">Repeat New Password</label>
		                    <input type="password" name="password2" id="newPassword2" v-model="user.newPassword2" class="form-control" placeholder="Repeat New Password" v-on:keydown.enter="updatePassword" required>
		                </div>
		                <div class="form-group">
	                        <div class="alert alert-danger" role="alert" v-show="modalAlert">{{ modalAlert }}</div>
	                    </div>
		            </div>
		            <div class="modal-footer">
		                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
		                <button type="button" class="btn btn-outline-primary" @click="updatePassword">Change</button>
		            </div>
		        </div>
		    </div>
		</div>
	</div>`,
	data: function() {
		return {
			user: {
				email:'',
				oldPassword:'',
				newPassword:'',
				newPassword2:''
			},
			modalAlert:'',
			alert:'',
			emailIsAvailable:true,
			checkingEmail:false
		}
	},
	watch: {
		'user.email':function (val) {
			if(val !== this.$parent.user.email) {
				var self = this;
				var promise = new Promise((resolve,reject) => {
					this.debouncedEmailAvailable(val, resolve, reject);
				});
				//show spinner
				this.checkingEmail = true;
				promise.then(function () {
					//show check mark
					self.emailIsAvailable = true;
					self.checkingEmail = false;
				}).catch(function (res) {
					//show x
					self.emailIsAvailable = false;
					self.checkingEmail = false;
				});
			}
		}
	},
	created: function () {
		this.user.email = (this.$parent.user)?this.$parent.user.email:'';
		//use debounce to limit the amount of calls made to api
		this.debouncedEmailAvailable = _.debounce(this.emailAvailable, 900);
	},
	methods: {
		save: function () {

		},
		cancel: function () {

		},
		updatePassword: function () {
			if(this.user.oldPassword === '') return this.modalAlert = 'The old password is required.';
			if(this.user.newPassword === '') return this.modalAlert = 'A new password is required.';
			if(this.user.newPassword2 !== this.newPassword) return this.modalAlert = 'New passwords do not match.';
			this.$parent.loading = true;
			//show loading
			this.$http.post('/user/changePassword',{oldPassword:CryptoJS.SHA256(this.user.oldPassword).toString(),newPassword:CryptoJS.SHA256(this.user.newPassword).toString()}).then(res => {
				$('#change-password-modal').modal('hide');
				//hide loading
				this.$parent.loading = false;
			}).catch(res => {
				//hide loading
				this.$parent.loading = false;
				if(res.bodyText && res.bodyText !== '{}') {
					this.modalAlert = res.bodyText;
				} else {
					this.modalAlert = 'An unknown error has occured. Please try again later.';
				}
			})
		},
		emailAvailable: function (email, resolve, reject) {
			console.log(email);
			this.$http.get('/user/emailIsAvailable',{params:{email:email}}).then(resolve).catch(reject);
		}
	}
});