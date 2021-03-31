<template>
  <div id="app">
    <h1>Courses</h1>
    <p>
      To view Duke courses, select a subject by clicking the button below. Feel
      free to select as many subjects as you want. Once selecting a subject, you
      will be able to see all courses Duke offers for your selected subjects.
      Additionally, you will be able to filter the list of course results and
      sort them by name and/or catalog number. If you want to learn more about a
      class, click on the class in the list below. Then, you will be able to
      read the course description, see any attributes associated with the
      course, and see what type of course it is. You can scroll down and
      navigate through different pages to see all the results for your selected
      subjects. Click on the button below and have fun exploring!
    </p>
    <b-overlay :show="loading" no-center class="overlay">
      <b-button
        variant="outline-dark"
        @click="showSidebar = true"
        class="button"
        >Select Subjects</b-button
      >
      <b-sidebar id="subject-sidebar" shadow v-model="showSidebar">
        <div class="px-3 py-2">
          <b-form-group label="Subjects" title="Subjects">
            <b-form-checkbox-group
              id="subject-checkbox"
              v-model="selectedSubjects"
              :options="subjects"
              name="subject"
              stacked
            ></b-form-checkbox-group>
          </b-form-group>
        </div>
      </b-sidebar>
      <br />

      <div class="wide" v-if="selectedSubjects.length > 0">
        <span class="left">
          <b-button @click="getData" variant="outline-dark" class="button"
            >Refresh Results</b-button
          >
          <br />
          <b-button
            @click="selectedSubjects = []"
            variant="outline-danger"
            class="button"
            >Clear Results</b-button
          >
        </span>
        <span class="right">
          <b-button
            variant="outline-dark"
            v-b-modal="'filter-modal'"
            class="button"
            >Filter Results</b-button
          >
          <br />
          <b-button @click="clearFilter" variant="outline-danger" class="button"
            >Clear Filter</b-button
          >
        </span>
        <br />
        <br />
        <br />
      </div>

      <b-modal
        id="filter-modal"
        @ok="filterData"
        @cancel="cancelFilter"
        @hide="cancelFilter"
        scrollable
        content-class="shadow"
        size="lg"
      >
        <b-overlay :show="filterLoading">
          <div class="modal-body">
            <b-form-group>
              <h3>Filter By Catalog Numbers:</h3>

              <b-form-checkbox-group
                id="filter-checkbox"
                v-model="selectedFilter"
                :options="filterCategories"
                name="filterCategory"
                stacked
              ></b-form-checkbox-group>
            </b-form-group>

            <b-form-group>
              <h3>Sort By:</h3>
              <b-form-radio-group
                id="sorting-input"
                v-model="selectedSortBy"
                :options="sortingOptions"
                name="sortingResults"
                stacked
              ></b-form-radio-group>
            </b-form-group>
          </div>
        </b-overlay>
      </b-modal>

      <b-modal
        id="error-modal"
        v-model="showError"
        @ok="selectedSubjects = []"
        scrollable
        content-class="shadow"
        size="lg"
      >
        {{ errorMessage }}
      </b-modal>
      <CourseList
        :classes="classes"
        :totalClasses="totalClasses"
        :currentIndex="currentIndex"
        :subjects="selectedSubjectNames"
        :sorting="selectedSortOption"
        :filtering="filterBy"
        :serverUrl="serverUrl"
      />

      <div class="wide">
        <span class="left">
          <b-button
            v-if="previousClassesToDisplay"
            @click="showPreviousPageOfClasses"
            variant="outline-primary"
            class="button"
            >Previous</b-button
          >
        </span>
        <span class="right">
          <b-button
            v-if="moreClassesToDisplay"
            @click="showNextPageOfClasses"
            variant="outline-primary"
            class="button"
            >Next</b-button
          >
        </span>
      </div>
      <br />
      <br />
    </b-overlay>
  </div>
</template>

<script>
import CourseList from "./components/CourseList.vue";

export default {
  name: "App",
  components: {
    CourseList,
  },
  data() {
    return {
      useRemoteServer: true,
      loading: false,
      showSidebar: false,

      classes: [],
      subjects: [],
      selectedSubjects: [],

      sortingOptions: [],
      sortBy: "",
      selectedSortBy: "",

      currentIndex: 0,
      totalClasses: 0,

      filterLoading: false,
      filterCategories: [],
      filterBy: [],
      selectedFilter: [],

      errorMessage: "",
      showError: false,
    };
  },
  watch: {
    /*
     * Once user selects new subjects, either classes or load new results
     */
    async selectedSubjects() {
      this.showSidebar = false;
      // If the selected subjects changes to an empty list, clear the class list
      if (this.selectedSubjects.length == 0) {
        this.clearClasses();
      } else {
        // Fetch the data
        await this.getData();
        // Fetch appropriate filter categories for the data
        await this.getFilterCategories();
      }
    },
  },
  methods: {
    /*
     * Fetches data from server for selected subjects and displays new results, resets
     * state of the list
     */
    async getData() {
      // Hide results while loading
      this.loading = true;
      // Reset any sort options
      this.selectedSortBy = "";
      this.sortBy = "";
      // Reset any filter categories
      this.selectedFilter = [];
      this.filterBy = [];
      // Reset current index
      this.currentIndex = 0;
      // Fetch classes to display for current selected subjects
      let response = await fetch(`${this.serverUrl}api/getSubjects`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.selectedSubjects),
      });
      let result = await response.json();
      // ensure valid response (HTTP-status is 200-299)
      // and expected data (not error JSON object)
      if (response.ok && result.classes) {
        // convert server data into Vue data or update existing Vue data
        this.classes = result.classes;
        this.totalClasses = result.classCount;
      } else {
        // may not always be wise to simply echo given error
        this.errorMessage = result.message;
        this.showError = true;
      }
      // Show results once they have been fetched
      this.loading = false;
    },

    /*
     * Fetches categories to filter current results by from the server, based on the current results
     */
    async getFilterCategories() {
      // Hide filter modal until options have been fetched
      this.filterLoading = true;
      let response = await fetch(
        `${this.serverUrl}api/getFilterCategories.json`
      );
      let result = await response.json();
      this.filterCategories = result;
      // Show filter categories once they have been loaded
      this.filterLoading = false;
    },

    /*
     * Fetches the appropriate classes from the current results based on current filter and sorting options
     * selected by the user
     */
    async filterData() {
      // Filtering data grabs first results from list, so reset index
      this.filterBy = this.selectedFilter;
      this.sortBy = this.selectedSortBy;
      // Only sends appropriate filter requests to server
      if (this.filterBy.length == 0 && this.sortBy.length == 0) {
        this.clearFilter();
      } else {
        this.loading = true;
        this.currentIndex = 0;
        let body = {
          filterBy: this.filterBy,
          sortBy: this.sortBy,
        };
        let response = await fetch(`${this.serverUrl}api/filterClasses`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        let result = await response.json();
        if (response.ok && result.classes) {
          // convert server data into Vue data or update existing Vue data
          this.classes = result.classes;
          this.totalClasses = result.classCount;
        } else {
          // may not always be wise to simply echo given error
          this.errorMessage = result.message;
          this.showError = true;
        }
        // Show results once they have been fetched
        this.loading = false;
      }
    },

    /*
     * Clears selected filters when users don't click "OK" when choosing a filter
     */
    cancelFilter() {
      this.selectedFilter = this.filterBy;
      this.selectedSortBy = this.sortBy;
    },

    /*
     * Clears classes being displayed in list and clears state in server
     */
    async clearClasses() {
      this.loading = true;
      this.sortBy = "";
      this.selectedSortBy = "";
      this.filterBy = [];
      this.selectedFilter = [];
      this.totalClasses = 0;
      this.currentIndex = 0;
      let response = await fetch(`${this.serverUrl}api/clearClasses`);
      this.classes = await response.json();
      this.loading = false;
    },

    /*
     * Clears filter to display original results for current subjects
     */
    async clearFilter() {
      this.loading = true;
      this.sortBy = "";
      this.selectedSortBy = "";
      this.filterBy = [];
      this.selectedFilter = [];
      this.currentIndex = 0;
      let response = await fetch(`${this.serverUrl}api/clearFilter`);
      let result = await response.json();
      this.classes = result.classes;
      this.totalClasses = result.classCount;
      this.loading = false;
    },

    /*
     * Fetches next page of classes to display based on currentIndex
     */
    async showDifferentPageOfClasses() {
      this.loading = true;
      let response = await fetch(
        `${this.serverUrl}api/newResultPage?index=${this.currentIndex}`
      );
      let result = await response.json();
      if (response.ok && result) {
        // convert server data into Vue data or update existing Vue data
        this.classes = result;
      } else {
        // may not always be wise to simply echo given error
        this.errorMessage = result.message;
        this.showError = true;
      }
      // Show results once they have been fetched
      this.loading = false;
    },

    /*
     * Calculates index for previous page of classes and displays it
     */
    showPreviousPageOfClasses() {
      this.currentIndex =
        this.currentIndex % 20 == 0
          ? this.currentIndex - 20
          : this.currentIndex - (this.currentIndex % 20);
      this.showDifferentPageOfClasses();
    },

    /*
     * Calculates index for next page of classes and displays it
     */
    showNextPageOfClasses() {
      this.currentIndex += 20;
      this.showDifferentPageOfClasses();
    },
  },
  computed: {
    /*
     * String URL of server to fetch from
     */
    serverUrl() {
      return this.useRemoteServer
        ? "https://fierce-tor-09792.herokuapp.com/"
        : "";
    },
    /*
     * Boolean determining whether or not there is another page of results to display
     */
    moreClassesToDisplay() {
      return this.currentIndex + 20 < this.totalClasses ? true : false;
    },
    /*
     * Boolean determining whether or not there is a previous page of results to display
     */
    previousClassesToDisplay() {
      return this.currentIndex == 0 ? false : true;
    },
    /*
     * List of subject names to display
     */
    selectedSubjectNames() {
      let names = [];
      for (var subject of this.subjects) {
        if (this.selectedSubjects.includes(subject.value)) {
          names.push(subject.text);
        }
      }
      return names;
    },
    /*
     * String of sort option to display
     */
    selectedSortOption() {
      let ret = "";
      for (var option of this.sortingOptions) {
        if (this.sortBy == option.value) {
          ret = option.text;
        }
      }
      return ret;
    },
  },
  async mounted() {
    this.loading = true;
    const options = await fetch(`${this.serverUrl}api/subjects.json`);
    this.subjects = await options.json();
    this.loading = false;

    this.filterLoading = true;
    const sorting = await fetch(`${this.serverUrl}api/sortingOptions.json`);
    this.sortingOptions = await sorting.json();
    this.filterLoading = false;
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 10px;
}
.left {
  float: left;
}
.right {
  float: right;
}

.modal-body {
  font-family: "Montserrat";
  font-size: 12pt;
}

h3 {
  font-family: "Montserrat";
  color: hsl(215, 100%, 60%);
  text-align: center;
}

.overlay {
  padding: 10px;
}

.button {
  font-weight: bold;
}
</style>
