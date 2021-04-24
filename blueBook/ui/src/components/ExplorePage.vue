The ExplorePage component represents the display for the explore page, where users can search for
classes, subjects, subject codes, or users.

@author Abby Mapes
<template>
  <div>
  <h1 id='page-name'>Explore</h1>
    <b-overlay :show="pageLoading" no-center class="overlay">
      <div class="search">
        <b-input-group
          size="sm"
          class="mb-3"
          :prepend="searchLabel"
        >
          <b-form-input
            v-model='searchText'
            :aria-label="'Search text for ' + currentSection"
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
      <nav-bar
          :sections="sectionTitles"
          :currentPage="currentSection"
          :isCentered="true"
          @change-page="changeSection"
      ></nav-bar>

      <span v-if="currentSection !='attributes' && validResults">
        <subjects-section
            v-if="currentSection =='subjects'"
            :subjectList="results"
            :hasSubjectNames="true"
            @subject-page="goToSubjectPage"
        ></subjects-section>

        <classes-section
          v-else-if="currentSection =='courses'"
          :classes="results"
          @course-page="goToCoursePage"
        >
        </classes-section>

        <user-section
          v-else-if="currentSection =='users'"
          :userList="results"
          @user-page="goToUserPage"
        >
        </user-section>
        <b-button
            v-if="results.length > 0 && hasMoreResults"
            @click='getMoreClasses'
            variant="outline-primary"
        >
            See More Courses
        </b-button>
      </span>
      <span v-else-if="currentSection=='attributes' && validResults">
        <attribute-section
            :attributeList="results"
            @attribute-page="goToAttributePage"
        ></attribute-section>
      </span>
      <span v-else-if="!validResults">
          We couldn't load the {{currentSection}}. Please refresh the page and try again.
      </span>
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
import AttributeSection from './AttributeSection.vue';
import ClassesSection from './ClassesSection.vue';
import NavBar from './NavBar.vue';
import SubjectsSection from './SubjectsSection.vue';
import UserSection from './UserSection.vue';

export default {
    name: 'ExplorePage',
    components: {
        AttributeSection,
        ClassesSection,
        NavBar,
        SubjectsSection,
        UserSection,
    },
    props: {
    },
    data() {
        return {
            showError: false,
            errorMessage: '',
            pageLoading: false,
            currentSection: 'subjects',
            sectionTitles: [
                {
                    name: 'Subjects',
                    value: 'subjects',
                },
                {
                    name: 'Attributes',
                    value: 'attributes',
                },
                {
                    name: 'Users',
                    value: 'users',
                },
            ],
            validResults: true,
            results: [],
            currentStart: 0,
            totalResults: 0,
            perPage: 25,
            lastValue: '',
            searchText: '',
            isFiltered: false,
        };
    },
    methods: {
        changeSection(newSection) {
            this.pageLoading = true;
            this.currentSection = newSection;
            this.pageLoading = false;
        },
        goToSubjectPage(code, name) {
            this.$emit('subject-page', code, name);
        },
        goToUserPage(userId) {
            this.$emit('user-page', userId);
        },
        goToCoursePage(course) {
            this.$emit('course-page', course);
        },
        goToAttributePage(attribute) {
            this.$emit('attribute-page', attribute);
        },
        async getAllResults() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getDocuments?collection=${this.currentSection}&start=${encodeURIComponent(this.lastValue)}&numResults=${this.perPage}`);
            const result = await response.json();
            if (response.ok) {
                this.isFiltered = false;
                this.results = this.results.concat(result.results);
                this.totalResults = result.totalResults;
                this.lastValue = result.lastValue;
                this.validResults = true;
                this.currentStart += this.perPage;
            } else {
                this.validSubjects = false;
                this.errorMessage = result.message;
                this.showError = true;
            }
        },
        async getFilteredResults() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getFilteredDocuments?collection=${this.currentSection}&searchTerm=${encodeURIComponent(this.searchText)}`);
            const result = await response.json();
            if (response.ok) {
                this.isFiltered = true;
                this.results = this.results.concat(result.results);
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
        async getMoreClasses() {
            this.pageLoading = true;
            if (this.hasMoreResults && !this.isFiltered) {
                await this.getAllResults();
            }
            this.pageLoading = false;
        },

        async searchResults() {
            this.pageLoading = true;
            this.results = [];
            this.lastValue = '';
            this.totalResults = 0;
            this.currentStart = 0;
            await this.getFilteredResults();
            this.pageLoading = false;
        },

        async clearSearch() {
            this.pageLoading = true;
            this.searchText = '';
            this.results = [];
            this.lastValue = '';
            this.totalResults = 0;
            this.currentStart = 0;
            await this.getAllResults();
            this.pageLoading = false;
        },
    },
    computed: {
        hasMoreResults() {
            return (this.currentStart < this.totalResults);
        },
        searchLabel() {
            let label = '';
            this.sectionTitles.forEach((title) => {
                if (title.value === this.currentSection) {
                    label = title.name;
                }
            });
            return label;
        },
    },
    watch: {
        async currentSection() {
            this.pageLoading = true;
            this.isFiltered = false;
            this.searchText = '';
            this.results = [];
            this.lastValue = '';
            this.totalResults = 0;
            this.currentStart = 0;
            await this.getAllResults();
            this.pageLoading = false;
        },
    },
    async mounted() {
        this.pageLoading = true;
        await this.getAllResults();
        this.pageLoading = false;
    },
};
</script>

<style scoped>
.active {
  color: hsl(215, 100%, 60%);
}
.center {
  text-align: center;
  margin: auto;
}
</style>
