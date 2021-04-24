The SubjectPage component represents the display page for a subject. Within this page, users can
view courses for this subject.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="loading" no-center class="overlay">
        <h1 id='page-name'>{{subjectName}}</h1>
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
        <div class="search">
            <b-input-group
                size="sm"
                class="mb-3"
                prepend="Course Titles"
            >
            <b-form-input
                v-model='searchText'
                :aria-label="'Search courses for ' + subjectName"
                @keyup.enter="searchResults"
            ></b-form-input>
            <b-input-group-append>
                <b-button
                v-if="!isFiltered"
                    size="sm"
                    variant="outline-primary"
                    @click="searchResults"
                >Search</b-button>
                <b-button
                    v-if="isFiltered"
                    size="sm"
                    variant="outline-danger"
                    @click="clearSearch"
                >Clear Search</b-button>
            </b-input-group-append>
            </b-input-group>
        </div>
        <classes-section
          :classes="courses"
          @course-page="goToCoursePage"
        >
        </classes-section>
        <b-button
            v-if="courses.length > 0 && hasMoreResults"
            @click='getMoreClasses'
            variant="outline-primary"
        >
            See More Courses
        </b-button>
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
        isAdmin: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            currentUid: userState.currentUser.userId,
            loading: false,
            courses: [],
            showError: false,
            errorMessage: '',
            userMajors: [],
            userMinors: [],
            userCertificates: [],
            userSubjects: [],
            currentStart: 0,
            totalResults: 0,
            perPage: 25,
            lastValue: '',
            searchText: '',
            isFiltered: false,
        };
    },
    methods: {
        goToCoursePage(course) {
            this.$emit('course-page', course);
        },
        async getCourses() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getCoursesForSubject?subjectCode=${encodeURIComponent(this.subjectCode)}&start=${encodeURIComponent(this.lastValue)}&limit=${this.perPage}`);
            const result = await response.json();
            if (response.ok) {
                this.isFiltered = false;
                this.courses = this.courses.concat(result.results);
                this.totalResults = result.totalResults;
                this.lastValue = result.lastValue;
                this.currentStart += this.perPage;
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
            if (this.loggedIn) {
                const response = await fetch(
                    `${userState.SERVER_URL
                    }/bluebook/updateUserSubjects?userId=${
                        this.currentUid}`,
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
            } else {
                console.log('BAD USER INPUT: Unable to add course to profile due to invalid input.');
                this.errorMessage = 'Invalid subjects: cannot update subjects for user document with empty userId. Please try again.';
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
        async getMoreClasses() {
            this.loading = true;
            if (this.hasMoreResults) {
                await this.getCourses();
            }
            this.loading = false;
        },
        async getFilteredResults() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getFilteredCoursesForSubject?subjectCode=${encodeURIComponent(this.subjectCode)}&searchTerm=${encodeURIComponent(this.searchText)}`);
            const result = await response.json();
            if (response.ok) {
                this.isFiltered = true;
                this.courses = this.courses.concat(result.results);
                this.totalResults = result.totalResults;
                this.currentStart += this.totalResults;
                this.lastValue = result.lastValue;
                this.validResults = true;
            } else {
                this.validSubjects = false;
                this.errorMessage = result.message;
                this.showError = true;
            }
        },
        async searchResults() {
            this.loading = true;
            this.courses = [];
            this.lastValue = '';
            this.totalResults = 0;
            this.currentStart = 0;
            await this.getFilteredResults();
            this.loading = false;
        },

        async clearSearch() {
            this.loading = true;
            this.searchText = '';
            this.courses = [];
            this.lastValue = '';
            this.totalResults = 0;
            this.currentStart = 0;
            await this.getCourses();
            this.loading = false;
        },
    },
    computed: {
        loggedIn() {
            if (this.isAdmin) {
                return false;
            }
            return this.currentUid.length > 0;
        },
        hasMoreResults() {
            return (this.currentStart < this.totalResults);
        },
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
        this.loading = true;
        await this.getCourses();
        if (this.loggedIn) {
            await this.getUsersSubjects(
                this.currentUid,
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
