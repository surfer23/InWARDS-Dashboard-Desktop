<template>
  <div
    class="modal rounded-0 fade modal_center"
    tabindex="-1"
    id="login-modal"
    data-keyboard="false"
    data-backdrop="static"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header center">
          <div class="text-center">
            <img src="@/assets/inwards_logo_blue.png" height="90" />
          </div>
        </div>
        <div class="modal-body">
          <div class="col-md-12">
            <nav>
              <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                <a
                  class="nav-item nav-link active"
                  id="nav-login-tab"
                  data-toggle="tab"
                  href="#login-tab"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                  style="text-align: center"
                  >Login</a
                >
                <a
                  class="nav-item nav-link"
                  id="nav-profile-tab"
                  data-toggle="tab"
                  href="#profile"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                  >Register</a
                >
                <a
                  class="nav-item nav-link"
                  id="nav-reset-tab"
                  data-toggle="tab"
                  href="#reset-tab"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                  >Forgot password?</a
                >
              </div>
            </nav>
            <div
              class="tab-content py-3 px-3 px-sm-0"
              id="nav-tabContent-login"
            >
              <div
                class="tab-pane fade show active"
                id="login-tab"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div class="container" style="height: auto">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="emailAddress" style="margin-top: 0.3rem"
                          >Email address</label
                        >
                        <input
                          type="email"
                          class="form-control rounded-0"
                          id="emailAddress"
                          v-model="emailAddress"
                          aria-describedby="emailHelp"
                        />
                      </div>
                      <div class="form-group">
                        <label for="passCode">Password</label>
                        <input
                          type="password"
                          class="form-control rounded-0"
                          id="passCode"
                          v-model="passCode"
                        />
                      </div>
                      <button
                        id="verifyCode"
                        type="submit"
                        class="btn rounded-0 inwards_button"
                        v-on:click="submit"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                <div class="container" style="height: auto">
                  <div class="row register-form">
                    <div class="col-md-12">
                      <form id="regForm" method="post">
                        <div class="form-group">
                          <div class="form-group">
                            <div class="row">
                              <div class="col-md-6">
                                <label for="firstName">First Name</label>
                                <input
                                  type="text"
                                  class="form-control rounded-0"
                                  id="firstName"
                                  v-model="firstName"
                                  placeholder="Enter your first name..."
                                />
                              </div>
                              <div class="col-md-6">
                                <label for="lastName">Last Name</label>
                                <input
                                  type="text"
                                  class="form-control rounded-0"
                                  id="lastName"
                                  v-model="lastName"
                                  placeholder="Enter your last name..."
                                />
                              </div>
                            </div>
                          </div>

                          <div class="form-group">
                            <div class="row">
                              <div class="col-md-6">
                                <label for="regEmailAddress"
                                  >Email address</label
                                >
                                <input
                                  type="text"
                                  class="form-control rounded-0"
                                  v-model="regEmailAddress"
                                  placeholder="Enter email address..."
                                /><img
                                  v-if="regEmailAddress.length >= 6"
                                  src="@/assets/ok.svg"
                                  alt=""
                                  height="10"
                                />
                              </div>
                              <div class="col-md-6">
                                <label for="mail_confirm"
                                  >Confirm email address</label
                                >
                                <input
                                  type="text"
                                  class="form-control rounded-0"
                                  v-model="mail_confirm"
                                  placeholder="Confirm email address ..."
                                /><img
                                  v-if="!regEmailAddress"
                                  style="display: none"
                                  src="@/assets/ok.svg"
                                  alt=""
                                  height="10"
                                /><img
                                  v-else-if="mail_confirm === regEmailAddress"
                                  src="@/assets/ok.svg"
                                  alt=""
                                  height="10"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="form-group">
                            <label for="sectorSelect">Sector</label>
                            <select
                              class="form-control rounded-0"
                              id="sectorSelect"
                              v-model="sectorSelect"
                            >
                              <option selected disabled>
                                Please use the drop down to select your
                                sector...
                              </option>
                              <option>Academia & Research</option>
                              <option>Agricultural Water Management</option>
                              <option>Water Treatment & Distribution</option>
                              <option>Environmental Conservation</option>
                              <option>Civil Society & NGOs</option>
                              <option>Government & Regulatory Bodies</option>
                              <option>Consulting Services</option>
                              <option>
                                Utilities & Water Service Providers
                              </option>
                              <option>Industrial & Manufacturing</option>
                              <option>Water Quality Monitoring</option>
                              <option>Emergency Management</option>
                              <option>Urban Planning</option>
                              <option>
                                Sanitation & Wastewater Management
                              </option>
                              <option>Infrastructure & Construction</option>
                              <option>International Organizations</option>
                              <option>Technology & Innovation</option>
                              <option>Media & Public Relations</option>
                              <option>Investment & Finance</option>
                              <option>Legal & Compliance</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div class="form-group">
                            <div class="row">
                              <div class="col-md-6">
                                <label for="password_confirmation"
                                  >Set Password</label
                                >
                                <input
                                  class="form-control rounded-0"
                                  v-model="password_confirmation"
                                  type="password"
                                  placeholder="8 charachters minimum"
                                  required
                                /><img
                                  v-if="password_confirmation.length >= 8"
                                  src="@/assets/ok.svg"
                                  alt=""
                                  height="10"
                                />
                                <div class="password_bar">
                                  <div
                                    :class="{
                                      bar: true,
                                      green: password_confirmation.length > 1,
                                    }"
                                  ></div>
                                  <div
                                    :class="{
                                      bar: true,
                                      green: password_confirmation.length > 3,
                                    }"
                                  ></div>
                                  <div
                                    :class="{
                                      bar: true,
                                      green: password_confirmation.length > 5,
                                    }"
                                  ></div>
                                  <div
                                    :class="{
                                      bar: true,
                                      green: password_confirmation.length > 7,
                                    }"
                                  ></div>
                                </div>
                              </div>
                              <div class="col-md-6">
                                <label for="password"
                                  >Please confirm password...</label
                                >
                                <input
                                  class="form-control rounded-0"
                                  v-model="password"
                                  type="password"
                                  placeholder="Please confirm password..."
                                  required
                                /><img
                                  v-if="!password_confirmation"
                                  style="display: none"
                                  src="@/assets/ok.svg"
                                  alt=""
                                  height="10"
                                /><img
                                  v-else-if="password === password_confirmation"
                                  src="@/assets/ok.svg"
                                  alt=""
                                  height="10"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="form-group">
                            <label for="userDesignation">Designation</label>
                            <input
                              type="text"
                              class="form-control rounded-0"
                              id="userDesignation"
                              v-model="userDesignation"
                              placeholder="What is your job designation..."
                            />
                          </div>
                          <div class="form-group">
                            <label for="institution">Institution</label>
                            <input
                              type="text"
                              class="form-control rounded-0"
                              id="institution"
                              v-model="institution"
                              placeholder="What institution do you represent?"
                            />
                          </div>
                          <div class="form-group">
                            <label for="useReason"
                              >Reason for use of data/accessing of
                              information</label
                            >
                            <textarea
                              rows="5"
                              class="form-control rounded-0"
                              id="useReason"
                              v-model="useReason"
                            >
                            </textarea>
                          </div>
                          <div class="form-group">
                            <button
                              type="submit"
                              class="btn rounded-0 inwards_button"
                              v-on:click="requestAccess"
                            >
                              Register
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="reset-tab"
                role="tabpanel"
                aria-labelledby="reset-tab"
              >
                <div class="container" style="height: auto">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="emailAddressResend">Email address</label>
                        <input
                          type="email"
                          class="form-control rounded-0"
                          id="emailAddressResend"
                          v-model="emailAddressResend"
                          aria-describedby="emailHelp"
                        />
                      </div>
                      <button
                        id="requestCode"
                        type="button"
                        class="btn rounded-0 inwards_button mb-3"
                        v-on:click="requestCode"
                      >
                        Request Code
                      </button>
                      <div class="form-group">
                        <label for="sentCode">Code</label>
                        <input
                          type="text"
                          class="form-control rounded-0"
                          id="sentCode"
                          v-model="sentCode"
                        />
                      </div>
                      <div class="form-group">
                        <label for="passwordResend">New Password</label>
                        <input
                          type="password"
                          class="form-control rounded-0"
                          id="passwordResend"
                          v-model="passwordResend"
                        />
                      </div>
                      <div class="form-group">
                        <label for="verifyPassword">Verify New Password</label>
                        <input
                          type="password"
                          class="form-control rounded-0"
                          id="verifyPassword"
                          v-model="verifyPassword"
                        />
                      </div>
                      <button
                        id="resendUserCode"
                        type="submit"
                        class="btn rounded-0 inwards_button"
                        v-on:click="updatePassword"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="container" style="height: auto">
              <div class="text-center">
                <h6>In collaboration with:</h6>
              </div>
              <div class="row">
                <div class="grid grid-logo-login">
                  <div><img src="@/assets/award.svg" alt="" /></div>
                  <div><img src="@/assets/knp.png" alt="" /></div>
                  <div><img src="@/assets/iucma.png" alt="" /></div>
                  <div><img src="@/assets/dws.png" alt="" /></div>
                  <div><img src="@/assets/jrs_square_logo.png" alt="" /></div>
                  <div><img src="@/assets/fbis_logo.png" alt="" /></div>
                  <div><img src="@/assets/kartoza.png" alt="" /></div>
                  <div><img src="@/assets/frc.svg" alt="" /></div>
                  <div><img src="@/assets/wrc.jpg" alt="" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import stateStore from '../store/state_handler'
const { shell } = require('electron')
const { dialog } = require('electron').remote
export default {
  data() {
    return {
      isLoggedIn: false,
      emailAddress: '',
      passCode: '',
      uniqueCode: '',
      userCode: '',
      firstName: '',
      lastName: '',
      sectorSelect: '',
      useReason: '',
      userDesignation: '',
      regEmailAddress: '',
      emailAddressResend: '',
      password: '',
      userLoggedIn: false,
      username: '',
      mail: '',
      mail_confirm: '',
      password_confirmation: '',
      institution: '',
      emailAddressResend: '',
      sentCode: '',
      passwordResend: '',
      verifyPassword: '',
    }
  },
  mounted() {
    let self = this
    this.$bus.on('databaseValidated', () => {
      // Check user login status
      if (!this.isLoggedIn) {
        //console.log('Check user login status in local store');
        stateStore.getState(stateStore.keys.loginStatus, (status) => {
          if (!status) {
            self.loginStatus = false
          } else {
            if (status.hasOwnProperty('loggedIn')) {
              self.userCode = status['uniqueCode']
              console.log(
                'https://inwards.award.org.za/app_json/admin/access_count.php?userCode=' +
                  self.userCode
              )

              $.get(
                'https://inwards.award.org.za/app_json/admin/access_count.php?userCode=' +
                  self.userCode
              )
                .then((response) => {})
                .catch((e) => {})
              self.loginStatus = status['loggedIn']
            } else {
              self.loginStatus = false
            }
          }
          if (!self.loginStatus) {
            self.showLoginModal()
          }
        })
      }
    })
  },
  methods: {
    checkUserLoggedIn() {
      //console.log('Check if user is logged in');
    },
    showLoginModal() {
      let loginModal = $('#login-modal')
      loginModal.modal({
        backdrop: 'static',
        keyboard: false,
      })
    },
    requestCode(e) {
      let self = this
      let button = $(e.target)
      let loginModal = $('#login-modal')
      button.prop('disabled', true)
      button.html(`Submitting...`)
      //console.log('https://inwards.award.org.za/app_json/user_resend.php?email=' + this.emailAddressResend);
      $.get(
        'https://inwards.award.org.za/app_json/user/user_resend.php?email=' +
          this.emailAddressResend +
          '&password=' +
          this.passCode,
        function (data) {
          if (data === 'true') {
            document.getElementById('login-tab').click()
            dialog.showMessageBox(null, {
              type: 'info',
              message: 'Successfully Submitted Please Check your Email!',
              buttons: ['OK'],
            })
            button.html(`Request Succesfully Submitted`)
            loginModal.modal('show')
          } else {
            button.prop('disabled', false)
            button.html(`Submit Again`)
            dialog.showMessageBox(null, {
              type: 'error',
              message:
                'Sorry we failed to verify your account please make sure the email address you have entered is correct or contact hugo@award.org.za for assistance.',
              buttons: ['OK'],
            })
          }
        }
      )
    },
    updatePassword(e) {
      let self = this
      let button = $(e.target)
      let loginModal = $('#login-modal')
      button.prop('disabled', true)
      button.html('Verifying...')
      $.get(
        'https://inwards.award.org.za/app_json/user/user_new_password.php?requestCode=' +
          encodeURIComponent(this.sentCode) +
          '&password=' +
          encodeURIComponent(this.passwordResend),
        function (data) {
          if (data === 'true') {
            dialog
              .showMessageBox(null, {
                type: 'info',
                message: 'Successfully Submitted Request! You may now log in.',
                buttons: ['OK'],
              })
              .then((result) => {
                if (result.response === 0) {
                  $('#emailAddress').val(self.regEmailAddress)
                  $('#regForm').trigger('reset')
                  $('#nav-login-tab').tab('show')
                  loginModal.modal('show')
                }
              })
          } else {
            button.prop('disabled', false)
            button.html('Submit')
            dialog.showMessageBox(null, {
              type: 'error',
              message: 'Failed to verify code, please try again',
              buttons: ['OK'],
            })
            button.html('Try again...')
          }
        }
      )
      // Your logic here to request the code based on emailAddressResend.
    },
    requestAccess(e) {
      let self = this
      let button = $(e.target)
      let loginModal = $('#login-modal')
      button.prop('disabled', true)
      button.html('Submitting...')
      $.get(
        'https://inwards.award.org.za/app_json/user/user_registration.php?' +
          'email=' +
          encodeURIComponent(this.regEmailAddress) +
          '&first_name=' +
          encodeURIComponent(this.firstName) +
          '&last_name=' +
          encodeURIComponent(this.lastName) +
          '&sector=' +
          encodeURIComponent(this.sectorSelect) +
          '&designation=' +
          encodeURIComponent(this.userDesignation) +
          '&reason=' +
          encodeURIComponent(this.useReason) +
          '&password=' +
          encodeURIComponent(this.password) +
          '&institution=' +
          encodeURIComponent(this.institution),
        function (data) {
          if (data === 'true') {
            dialog
              .showMessageBox(null, {
                type: 'info',
                message: 'Successfully Submitted Request! You may now log in.',
                buttons: ['OK'],
              })
              .then((result) => {
                if (result.response === 0) {
                  $('#emailAddress').val(self.regEmailAddress)
                  $('#regForm').trigger('reset')
                  $('#nav-login-tab').tab('show')
                  loginModal.modal('show')
                }
              })
          } else {
            button.prop('disabled', false)
            button.html('Submit')
            dialog.showMessageBox(null, {
              type: 'error',
              message:
                'Failed to submit request. Please ensure all fields have been filled correctly',
              buttons: ['OK'],
            })
            button.html('Try Submit Again...')
          }
        }
      )
    },
    submit(e) {
      let self = this
      let button = $(e.target)
      let loginModal = $('#login-modal')
      button.prop('disabled', true)
      button.html(`Submitting...`)
      //console.log('https://inwards.award.org.za/app_json/user/user_verification.php?email=' + this.emailAddress + '&password=' + this.passCode);
      $.get(
        'https://inwards.award.org.za/app_json/user/user_verification.php?email=' +
          encodeURIComponent(this.emailAddress) +
          '&password=' +
          encodeURIComponent(this.passCode),
        function (data) {
          if (
            data != 'false' &&
            data != 'unverified' &&
            data != '' &&
            data != 'email'
          ) {
            loginModal.modal('hide')
            stateStore.setState(
              stateStore.keys.loginStatus,
              {
                loggedIn: true,
                emailAddress: self.emailAddress,
                uniqueCode: data,
                timestamp: Date.now(),
              },
              false
            )
            self.loggedIn = true
            dialog.showMessageBox(null, {
              type: 'info',
              message:
                'Successfully Logged In! You can now start using INWARDS',
              buttons: ['OK'],
            })
            stateStore.updateFromServer(() => {
              setTimeout(function () {
                console.log('logged in')
              }, 200)
            })
            stateStore.updateFromServer(() => {
              setTimeout(function () {
                window.location.reload()
              }, 200)
            })
          } else if (data === 'false') {
            dialog.showMessageBox(null, {
              type: 'info',
              message:
                'Incorrect password please try again or request password to be resent',
              buttons: ['OK'],
            })
            button.prop('disabled', false)
            button.html(`Try Login Again...`)
          } else if (data === 'email') {
            dialog.showMessageBox(null, {
              type: 'info',
              message: 'Incorrect email or you need to register',
              buttons: ['OK'],
            })
            button.prop('disabled', false)
            button.html(`Try Login Again...`)
          } else if (data === 'unverified') {
            dialog.showMessageBox(null, {
              type: 'info',
              message:
                'We have recieved your registration and you will recieve and email once you have been accepted. If you have any queries please contact hugo@award.org.za',
              buttons: ['OK'],
            })
            button.prop('disabled', false)
            button.html(`Try Login Again...`)
          }
        }
      )
    },
  },
}
</script>
