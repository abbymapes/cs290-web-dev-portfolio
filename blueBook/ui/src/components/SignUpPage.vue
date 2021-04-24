The SignUpPage component represents the display for the sign up page,
which allows users to create an account.

@author Abby Mapes
<template>
  <div>
    <h1 id='page-name'>Sign Up</h1>
    <b-overlay :show="loading" rounded="sm">
      <div v-if="validPage" class="sign-up">
        <b-form @submit="onSubmit" @reset="onReset">
            <b-avatar size="10rem"
              v-if="!form.picture">
            </b-avatar>
            <b-avatar size="10rem"
              v-else
              :src="getThumbnail">
            </b-avatar>
            <br>
            <b-form-group
              id="picture-label"
              label="Choose a Profile Picture:"
              label-for="input-picture"
            >
              <b-form-file
                id="input-picture"
                class="file"
                v-model="form.picture"
                accept="image/*"
              ></b-form-file>
              <div v-if="form.picture">
                <b-button
                  @click="clearFiles"
                  class="mr-2"
                  variant="outline-danger"
                >Remove photo</b-button>
              </div>
            </b-form-group>
            <b-form-group
              id="input-name"
              label="Name:"
              label-for="name-input"
            >
              <b-form-input
                id="name-input"
                v-model="form.displayName"
                placeholder="Enter name"
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="nameValidation" v-if="showState">
                Please enter a display name.
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="nameValidation" v-if="showState">
                Looks Good.
              </b-form-valid-feedback>
            </b-form-group>
            <br>
            <b-form-group
              id="input-email"
              label="Email:"
              label-for="duke-email"
              description="Use your '@duke.edu' email address."
            >
              <b-form-input
                id="duke-email"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                autocomplete="username"
                required
              ></b-form-input>
              <b-form-invalid-feedback
                :state="emailValidation"
                v-if="showState || form.email.length > 0">
                Email must be a '@duke.edu' address.
              </b-form-invalid-feedback>
              <b-form-valid-feedback
                :state="emailValidation"
                v-if="showState || form.email.length > 0">
                Looks Good.
              </b-form-valid-feedback>
            </b-form-group>
            <br>
            <b-form-group
              id="input-password"
              label="Password:"
              label-for="password-input-1"
            >
              <b-form-input
                id="password-input-1"
                v-model="form.password"
                autocomplete="new-password"
                placeholder="Enter password"
                type="password"
                required
              ></b-form-input>
              <b-form-invalid-feedback
                :state="passwordValidation"
                v-if="showState || form.password.length > 0">
                Password must be at least 8 characters long.
              </b-form-invalid-feedback>
              <b-form-valid-feedback
                :state="passwordValidation"
                v-if="showState || form.password.length > 0">
                Looks Good.
              </b-form-valid-feedback>
            </b-form-group>
            <br>
            <b-form-group
              id="input-password-2"
              label="Confirm Password:"
              label-for="password-input-2"
            >
              <b-form-input
                id="password-input-2"
                v-model="form.confirmPassword"
                placeholder="Confirm password"
                autocomplete="new-password"
                type="password"
                required
              ></b-form-input>
              <b-form-invalid-feedback
                :state="passwordConfirmationValidation"
                v-if="showState || form.confirmPassword.length > 0">
                Passwords must match.
              </b-form-invalid-feedback>
              <b-form-valid-feedback
                :state="passwordConfirmationValidation"
                v-if="showState || form.confirmPassword.length > 0">
                Looks Good.
              </b-form-valid-feedback>
            </b-form-group>
            <br>
            <b-form-group
              id="input-majors"
              label="Majors:"
              label-for="major-input"
            >
              <b-button v-b-modal.major-modal
                variant="outline-primary"
              >Select Major(s)</b-button>
              <b-modal id="major-modal" ok-only scrollable>
                <b-form-checkbox-group
                  v-model="form.majors"
                  id="major-input"
                  stacked
                >
                  <b-form-checkbox
                    v-for="(subject, i) in subjects"
                    :key="i"
                    :value="subject.code"
                    :disabled="validMajor(subject.code)"
                  >{{subject.name}}</b-form-checkbox>
                </b-form-checkbox-group>
              </b-modal>
            </b-form-group>
            <b-card class="mt-3" header="Selected Majors" v-if="form.majors.length > 0">
              <p class="m-0">{{ displayMajors }}</p>
              <b-button @click="clearMajors" variant="outline-danger">Clear Majors</b-button>
            </b-card>
            <br>
            <b-form-group
              id="input-minors"
              label="Minors:"
              label-for="minor-input"
            >
              <b-button v-b-modal.minor-modal
                variant="outline-primary"
              >Select Minor(s)</b-button>
              <b-modal id="minor-modal" ok-only scrollable>
                <b-form-checkbox-group
                  v-model="form.minors"
                  id="minor-input"
                  stacked
                >
                  <b-form-checkbox
                    v-for="(subject, i) in subjects"
                    :key="i"
                    :value="subject.code"
                    :disabled="validMinor(subject.code)"
                  >{{subject.name}}</b-form-checkbox>
                </b-form-checkbox-group>
              </b-modal>
            </b-form-group>
            <b-card class="mt-3" header="Selected Minors" v-if="form.minors.length > 0">
              <p class="m-0">{{ displayMinors }}</p>
              <b-button @click="clearMinors" variant="outline-danger">Clear Minors</b-button>
            </b-card>
            <br>
            <b-form-group
              id="input-certificates"
              label="Certificates:"
              label-for="certificate-input"
            >
              <b-button v-b-modal.certificate-modal
                variant="outline-primary"
              >Select Certificates(s)</b-button>
              <b-modal id="certificate-modal" ok-only scrollable>
                <b-form-checkbox-group
                  v-model="form.certificates"
                  id="certificate-input"
                  stacked
                >
                  <b-form-checkbox
                    v-for="(subject, i) in subjects"
                    :key="i"
                    :value="subject.code"
                    :disabled="validCertificate(subject.code)"
                  >{{subject.name}}</b-form-checkbox>
                </b-form-checkbox-group>
              </b-modal>
            </b-form-group>
            <b-card class="mt-3" header="Selected Certificates" v-if="form.certificates.length > 0">
              <p class="m-0">{{ displayCertificates }}</p>
              <b-button
                @click="clearCertificates"
                variant="outline-danger">Clear Certificates</b-button>
            </b-card>
            <br>
            <b-button
              type="submit"
              variant="outline-success"
              class="submit-buttons">Create Account</b-button>
            <b-button
              type="reset"
              variant="outline-danger"
              class="submit-buttons">Reset Choices</b-button>
          </b-form>
        </div>
        <div v-else>
            Sorry! There was an error loading the sign up page. Please refresh and try again.
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
    name: 'SignUpPage',
    props: {
    },
    data() {
        return {
            loading: false,
            form: {
                displayName: '',
                email: '',
                password: '',
                picture: null,
                confirmPassword: '',
                majors: [],
                minors: [],
                certificates: [],
                subjects: [],
            },
            subjects: [],
            showError: false,
            errorMessage: '',
            validPage: true,
            showState: false,
            userId: '',
        };
    },
    methods: {
        async onSubmit(event) {
            this.loading = true;
            event.preventDefault();
            this.showState = true;
            if (this.nameValidation && this.emailValidation
              && this.passwordValidation && this.passwordConfirmationValidation) {
                await userState.auth.createUserWithEmailAndPassword(
                    this.form.email, this.form.password,
                ).then(async (userCredential) => {
                    const { user } = userCredential;
                    const userId = user.uid;
                    let pictureRef = '';
                    if (this.form.picture) {
                        pictureRef = await userState.storeProfileImage(userId, this.form.picture);
                    }
                    const newUser = {
                        userId,
                        displayName: this.form.displayName,
                        email: this.form.email,
                        majors: (this.form.majors !== null ? this.form.majors : []),
                        minors: (this.form.minors !== null ? this.form.minors : []),
                        certificates: (this.form.certificates !== null
                            ? this.form.certificates : []),
                        subjects: [],
                        picture: pictureRef,
                        isAdmin: false,
                    };
                    const response = await fetch(
                        `${userState.SERVER_URL
                        }/bluebook/createUserDocument`,
                        {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(newUser),
                        },
                    );
                    const result = await response.json();
                    if (response.ok) {
                        this.showError = false;
                        this.$emit('update-user', result);
                    } else {
                        throw new Error(result.message);
                    }
                }).catch(async (error) => {
                    await userState.deleteUser();
                    this.errorMessage = `There was an error creating your account: ${error}. Please try again.`;
                    this.showError = true;
                });
            } else {
                console.log('BAD USER INPUT: Unable to create user profile due to invalid user input.');
                this.errorMessage = 'Please ensure all the fields are filled out appropriately.';
                this.showError = true;
            }
            this.loading = false;
        },
        onReset() {
            this.form = {
                displayName: '',
                email: '',
                password: '',
                picture: null,
                confirmPassword: '',
                majors: [],
                minors: [],
                certificates: [],
                subjects: [],
            };
        },
        clearMajors() {
            this.form.majors = [];
        },
        clearMinors() {
            this.form.minors = [];
        },
        clearCertificates() {
            this.form.certificates = [];
        },
        clearFiles() {
            this.form.picture = null;
        },
        async getSubjects() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getAllSubjects`);
            const result = await response.json();
            if (response.ok) {
                this.subjects = result;
                this.validPage = true;
            } else {
                this.errorMessage = result.message;
                this.showError = true;
                this.validPage = false;
            }
        },
        validMajor(code) {
            return this.form.minors.includes(code) || this.form.certificates.includes(code);
        },
        validMinor(code) {
            return this.form.majors.includes(code) || this.form.certificates.includes(code);
        },
        validCertificate(code) {
            return this.form.minors.includes(code) || this.form.majors.includes(code);
        },
    },
    computed: {
        displayMajors() {
            return this.form.majors.join(', ');
        },
        displayMinors() {
            return this.form.minors.join(', ');
        },
        displayCertificates() {
            return this.form.certificates.join(', ');
        },
        nameValidation() {
            return (this.form.displayName.trim().length > 0);
        },
        emailValidation() {
            return (this.form.email.split('@')[1] === 'duke.edu');
        },
        passwordValidation() {
            return this.form.password.trim().length >= 8;
        },
        passwordConfirmationValidation() {
            return (this.passwordValidation && this.form.confirmPassword === this.form.password);
        },
        getThumbnail() {
            if (this.form.picture) {
                return URL.createObjectURL(this.form.picture);
            }
            return '';
        },
    },
    watch: {

    },
    async mounted() {
        this.loading = true;
        await this.getSubjects();
        this.loading = false;
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#major-input {
  font-family: 'Montserrat';
  text-align: center;
}

#minor-input {
  font-family: 'Montserrat';
  text-align: center;
}

#certificate-input {
  font-family: 'Montserrat';
  text-align: center;
}

.sign-up {
  width: 95%;
  margin: auto;
}

@media screen and (min-width: 600px) {
    .sign-up {
        width: 95%;
        margin: auto;
    }
}

@media screen and (min-width: 1000px) {
    .sign-up {
        width: 80%;
    }
}

@media screen and (min-width: 1200px) {
    .sign-up {
        width: 80%;
    }
}
.submit-buttons {
  margin: 10px;
}
.file {
  margin: auto;
  text-align: left;
  font-size: 10pt;
}
</style>
