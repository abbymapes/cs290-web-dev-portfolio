The EditProfile component represents the display for a user to edit
their profile on their user page.

@author Abby Mapes
<template>
  <div class="edit-profile">
    <h1 class='modal-title'>Edit Profile</h1>
    <b-overlay :show="loading" rounded="sm">
      <div v-if="validPage" class="sign-up">
        <b-form @submit="onSubmit" @reset="onReset">
            <b-avatar size="10rem"
              v-if="form.picture"
              :src="getThumbnail"
            >
            </b-avatar>
            <b-avatar size="10rem"
              v-else
              :src="form.oldPicture">
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
              <div v-if="form.oldPicture.length > 0">
                <b-button
                  @click="removePhoto"
                  class="mr-2"
                  variant="outline-danger"
                >Remove Photo</b-button>
              </div>
              <div v-if="form.picture">
                <b-button
                  @click="clearFiles"
                  class="mr-2"
                  variant="outline-danger"
                >Reset Photo</b-button>
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
                You cannot have an empty display name.
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="nameValidation" v-if="showState">
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
              class="submit-buttons">Update Profile</b-button>
            <b-button
              type="reset"
              variant="outline-danger"
              class="submit-buttons">Cancel Changes</b-button>
          </b-form>
        </div>
        <div v-else>
            Sorry! There was an error. Please refresh and try again.
        </div>
      </b-overlay>
  </div>
</template>

<script>
import userState from '../userState';

export default {
    name: 'EditProfile',
    props: {
        user: Object,
    },
    data() {
        return {
            loading: false,
            form: {
                displayName: this.user.displayName,
                oldPicture: this.user.picture,
                picture: null,
                majors: this.user.majors,
                minors: this.user.minors,
                certificates: this.user.certificates,
            },
            subjects: [],
            errorMessage: '',
            validPage: true,
            showState: false,
        };
    },
    methods: {
        async onSubmit(event) {
            this.loading = true;
            event.preventDefault();
            this.showState = true;
            if (this.nameValidation) {
                try {
                    let pictureRef = (this.form.oldPicture !== null ? this.form.oldPicture : '');
                    if (this.form.picture) {
                        pictureRef = await userState.storeProfileImage(
                            this.user.userId, this.form.picture,
                        );
                    }
                    const newUser = {
                        userId: this.user.userId,
                        displayName: this.form.displayName,
                        email: this.user.email,
                        majors: (this.form.majors !== null ? this.form.majors : []),
                        minors: (this.form.minors !== null ? this.form.minors : []),
                        certificates: (this.form.certificates !== null
                            ? this.form.certificates : []),
                        subjects: this.user.subjects,
                        picture: pictureRef,
                        isAdmin: this.user.isAdmin,
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
                        this.$emit('refresh-user');
                    } else {
                        this.$emit('show-error', result.message);
                    }
                } catch {
                    this.$emit('show-error', 'There was an error updating your account. Please try again.');
                }
            } else {
                console.log('BAD USER INPUT: Unable to edit user profile due to invalid display name.');
                this.$emit('show-error', 'We were unable to edit your profile. You must enter a valid display name for your account.');
            }
            this.loading = false;
        },
        onReset() {
            this.form = {
                displayName: this.user.displayName,
                picture: null,
                oldPicture: this.user.picture,
                majors: this.user.majors,
                minors: this.user.minors,
                certificates: this.user.certificates,
            };
            this.$emit('cancel-edit');
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
        removePhoto() {
            this.form.oldPicture = '';
        },
        async getSubjects() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getAllSubjects`);
            const result = await response.json();
            if (response.ok) {
                this.subjects = result;
                this.validPage = true;
            } else {
                this.$emit('show-error', result.message);
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

.edit-profile {
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
