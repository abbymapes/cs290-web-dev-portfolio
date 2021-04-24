The AttributePage component represents the display page for a course attribute. Within this
page, users can view courses for this course attribute.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="loading" no-center class="overlay">
        <h1 id='page-name'>{{attributeName}}</h1>
        <div class="search">
            <b-input-group
                size="sm"
                class="mb-3"
                prepend="Course Titles"
            >
            <b-form-input
                v-model='searchText'
                :aria-label="'Search courses for ' + attributeName"
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
    name: 'AttributePage',
    components: {
        ClassesSection,
    },
    props: {
        attributeName: String,
    },
    data() {
        return {
            loading: false,
            courses: [],
            showError: false,
            errorMessage: '',
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
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getCoursesForAttribute?attribute=${encodeURIComponent(this.attributeName)}&start=${encodeURIComponent(this.lastValue)}&limit=${this.perPage}`);
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
        async getMoreClasses() {
            this.loading = true;
            if (this.hasMoreResults) {
                await this.getCourses();
            }
            this.loading = false;
        },
        async getFilteredResults() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getFilteredCoursesForAttribute?attribute=${encodeURIComponent(this.attributeName)}&searchTerm=${encodeURIComponent(this.searchText)}`);
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
        hasMoreResults() {
            return (this.currentStart < this.totalResults);
        },
    },
    async mounted() {
        this.loading = true;
        await this.getCourses();
        this.loading = false;
    },
};
</script>

<style scoped>
</style>
