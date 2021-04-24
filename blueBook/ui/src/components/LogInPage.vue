The LogInPage component represents the display for the login page, where users can
log into BlueBook.

@author Abby Mapes
<template>
  <div>
  <h1 id='page-name'>Log In</h1>
  <b-overlay :show="loading" rounded="sm">
      <div v-if="validPage" class="log-in">
        <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
              id="input-email"
              label="Email:"
              label-for="duke-email"
              description="Use your '@duke.edu' email address."
            >
              <b-form-input
                id="duke-email"
                v-model="email"
                type="email"
                placeholder="Enter email"
                required
              ></b-form-input>
              <b-form-invalid-feedback
                :state="emailValidation"
                v-if="showState || email.length > 0">
                  Email must be a '@duke.edu' address.
              </b-form-invalid-feedback>
            </b-form-group>
            <br>
            <b-form-group
              id="input-password"
              label="Password:"
              label-for="password-input-1"
            >
              <b-form-input
                id="password-input-1"
                v-model="password"
                placeholder="Enter password"
                type="password"
                required
              ></b-form-input>
              <b-form-invalid-feedback
                :state="passwordValidation"
                v-if="showState || password.length > 0">
                  Password must be at least 8 characters long.
              </b-form-invalid-feedback>
            </b-form-group>
            <br>
            <b-button
              type="submit"
              variant="outline-success"
              class="submit-buttons">Log In</b-button>
            <br>
            <div>
              Need to Create an Account?
            </div>
            <br>
            <b-button
              type="reset"
              variant="outline-primary"
              class="submit-buttons">Sign Up</b-button>
          </b-form>
        </div>
        <div v-else>
            Sorry! There was an error loading the log in page. Please refresh and try again.
        </div>
      </b-overlay>
      <b-modal v-model="showError">
        <div class="modal-body">
          {{ errorMessage }}
        </div>
      </b-modal>
    </div>
</template>

<script>
import userState from '../userState';

export default {
    name: 'LogInPage',
    props: {
    },
    data() {
        return {
            loading: false,
            email: '',
            password: '',
            showError: false,
            errorMessage: '',
            validPage: true,
            showState: false,
            validAccount: true,
        };
    },
    methods: {
        async onSubmit(event) {
            this.loading = true;
            event.preventDefault();
            this.showState = true;
            if (this.emailValidation && this.passwordValidation) {
                await userState.auth.signInWithEmailAndPassword(
                    this.email, this.password,
                ).then((userCredential) => {
                    const { user } = userCredential;
                    this.$emit('update-user', user.uid);
                }).catch(async (error) => {
                    this.validAccount = false;
                    this.errorMessage = error.message;
                    this.showError = true;
                });
            }
            this.loading = false;
        },
        onReset() {
            this.$emit('sign-up');
        },
    },
    computed: {
        emailValidation() {
            return (this.email.split('@')[1] === 'duke.edu');
        },
        passwordValidation() {
            return this.password.length >= 8;
        },
    },
    watch: {
    },
};
</script>

<style scoped>
.log-in {
  width: 90%;
  margin: auto;
}

@media screen and (min-width: 400px) {
    .log-in {
        width: 90%;
        margin: auto;
    }
}

@media screen and (min-width: 600px) {
    .log-in {
        width: 80%;
        margin: auto;
    }
}

@media screen and (min-width: 1000px) {
    .log-in {
        width: 50%;
    }
}

.submit-buttons {
  margin: 10px;
}
</style>
