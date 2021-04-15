The SubjectPage component represents the display page for a subject. Within this page, users can
view courses for this subject.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="loading" no-center class="overlay">
        <h1>{{subjectName}}</h1>
        <div class="reactions" v-if="loggedIn">
            <b-button
                class="reaction"
                variant="outline-danger"
                @click="removeSubject"
                v-if="likesSubject"
            >
                Remove Subject from Profile
            </b-button>
            <b-button
                class="reaction"
                variant="outline-primary"
                disabled
                v-else-if="isMajor"
            >
                Majoring in {{subjectName}}
            </b-button>
            <b-button
                class="reaction"
                variant="outline-primary"
                disabled
                v-else-if="isMinor"
            >
                Minoring in {{subjectName}}
            </b-button>
            <b-button
                class="reaction"
                variant="outline-primary"
                disabled
                v-else-if="isCertificate"
            >
                Pursuing Certificate in {{subjectName}}
            </b-button>
            <b-button
                class="reaction"
                variant="outline-success"
                @click="addSubject"
                v-else
            >
                Add Subject to Profile
            </b-button>
        </div>
        <classes-section
          :classes="courses"
          @course-page="goToCoursePage"
        >
        </classes-section>
        <b-modal v-model="showError">
            <div class="modal-body">
              {{ errorMessage }}
            </div>
        </b-modal>
    </b-overlay>
  </div>
</template>

<script>
import userState from '../userState';
import ClassesSection from './ClassesSection.vue';

export default {
    name: 'SubjectPage',
    components: {
        ClassesSection,
    },
    props: {
        subjectCode: String,
        subjectName: String,
    },
    data() {
        return {
            loading: false,
            courses: [],
            showError: false,
            errorMessage: '',
            loggedIn: false,
            userMajors: [],
            userMinors: [],
            userCertificates: [],
            userSubjects: [],
        };
    },
    methods: {
        goToCoursePage(course) {
            this.$emit('course-page', course);
        },
        async getCourses() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getCoursesForSubject?subjectCode=${encodeURIComponent(this.subjectCode)}`);
            const result = await response.json();
            if (response.ok) {
                this.courses = result;
            } else {
                this.errorMessage = result.message;
                this.showError = true;
            }
        },
        async getUsersSubjects(userId) {
            const response = await fetch(
                `${userState.SERVER_URL
                }/bluebook/getUserSubjects?userId=${
                    userId}`,
            );
            const result = await response.json();
            if (response.ok) {
                this.userMajors = result.majors;
                this.userMinors = result.minors;
                this.userCertificates = result.certificates;
                this.userSubjects = result.subjects;
            } else {
                this.errorMessage = result.message;
                this.showError = true;
            }
        },
        async updateUserSubjects(subjects) {
            this.loading = true;
            const response = await fetch(
                `${userState.SERVER_URL
                }/bluebook/updateUserSubjects?userId=${
                    userState.currentUid}`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subjects),
                },
            );
            const result = await response.json();
            if (response.ok) {
                this.userSubjects = result;
            } else {
                this.errorMessage = result.message;
                this.showError = true;
            }
            this.loading = false;
        },
        async removeSubject() {
            const index = this.userSubjects.indexOf(this.subjectCode);
            const newSubjects = this.userSubjects;
            newSubjects.splice(index, index + 1);
            await this.updateUserSubjects(newSubjects);
        },
        async addSubject() {
            const newSubjects = this.userSubjects;
            newSubjects.push(this.subjectCode);
            await this.updateUserSubjects(newSubjects);
        },
    },
    computed: {
        likesSubject() {
            return (this.userSubjects.includes(this.subjectCode));
        },
        isMajor() {
            return (this.userMajors.includes(this.subjectCode));
        },
        isMinor() {
            return (this.userMinors.includes(this.subjectCode));
        },
        isCertificate() {
            return (this.userCertificates.includes(this.subjectCode));
        },
    },
    watch: {
    },
    async mounted() {
        this.loggedIn = userState.loggedIn;
        this.loading = true;
        await this.getCourses();
        if (this.loggedIn) {
            await this.getUsersSubjects(
                userState.currentUid,
            );
        }
        this.loading = false;
    },
};
</script>

<style scoped>
.reactions {
  margin: 20px;
  padding: 20px;
}
</style>
