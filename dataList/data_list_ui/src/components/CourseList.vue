<template>
  <div class="course-list">
    <div v-if="subjects.length > 0" class="stat-label">
      {{ totalClasses }} Classes for Subjects:
    </div>
    <ul v-if="subjects.length > 0">
      <li v-for="(name, j) in subjects" :key="j">
        {{ name }}
      </li>
    </ul>
    <div v-if="filtering.length > 0" class="stat-label">
      With Catalog Numbers:
    </div>
    <ul v-if="filtering.length > 0">
      <li v-for="(category, k) in filtering" :key="k">
        {{ category }}
      </li>
    </ul>
    <div v-if="sorting.length > 0" class="stat-label">Sorted By:</div>
    <ul v-if="sorting.length > 0">
      <li>
        {{ sorting }}
      </li>
    </ul>
    <b-list-group>
      <b-list-group-item
        v-for="(crse, i) in classes"
        :key="i"
        v-b-modal="'modal-' + i"
      >
        <b>{{ crse.subjectCode }} {{ crse.catalogNumber }}</b>
        <br />
        {{ crse.title }}

        <b-modal
          :id="'modal-' + i"
          @show="showModal(crse)"
          scrollable
          content-class="shadow"
          size="lg"
        >
          <b-overlay :show="modalLoading" rounded="sm">
            <span class="center">
              <h3 class="modal-title">
                <b>{{ crse.subjectCode }} {{ crse.catalogNumber }}</b>
                <br />
                {{ crse.title }}
              </h3>
            </span>
            <div v-if="!showError" class="modal-body">
              <span> <b>Class Type:</b> {{ courseType }} <br /><br /> </span>
              <span> <b>Description:</b> {{ description }} <br /><br /> </span>
              <span>
                <b>Course Attributes:</b>
                <ul>
                  <li v-for="(code, j) in codes" :key="j">
                    {{ code }}
                  </li>
                </ul>
              </span>
            </div>
            <div v-else class="modal-body">
              {{ errorMessage }} {{ crse.subjectCode }}
              {{ crse.catalogNumber }} {{ crse.title }}
            </div>
          </b-overlay>
        </b-modal>
      </b-list-group-item>
    </b-list-group>
    <div class="footer-text">
      Displaying courses <b>{{ startingIndex }}{{ endIndex }}</b> out of
      <b>{{ totalClasses }}</b> results
    </div>
  </div>
</template>

<script>
export default {
  name: "CourseList",
  props: {
    classes: {
      type: Array,
      default: () => [],
    },
    subjects: {
      type: Array,
      default: () => [],
    },
    totalClasses: Number,
    currentIndex: Number,
    sorting: String,
    serverUrl: String,
    filtering: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      useRemoteServer: false,
      isOpening: false,
      modalLoading: false,
      currentModal: {},
      errorMessage: "",
      showError: false,
    };
  },
  methods: {
    /*
     * Fetches course information from server when class is selected from thee list
     */
    async showModal(course) {
      this.showError = false;
      this.errorMsesage = "";
      this.modalLoading = true;
      let response = await fetch(`${this.serverUrl}api/getCourseInfo`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });
      let result = await response.json();
      // ensure valid response (HTTP-status is 200-299)
      // and expected data (not error JSON object)
      if (response.ok) {
        // convert server data into Vue data or update existing Vue data
        this.currentModal = result;
      } else {
        // may not always be wise to simply echo given error
        this.errorMessage = result.message;
        this.showError = true;
      }
      // Show results once they have been fetched
      this.modalLoading = false;
    },
  },
  computed: {
    // Start index of current results to display in stats at bottom of list
    startingIndex() {
      return this.currentIndex != this.classes.length
        ? this.currentIndex + 1
        : this.currentIndex;
    },
    // End index of current results to display in stats at bottom of list
    endIndex() {
      let end = this.currentIndex + this.classes.length;
      return end != 0 ? "-" + end : "";
    },
    // Description to display in modal
    description() {
      return this.currentModal.description &&
        this.currentModal.description.length > 0
        ? this.currentModal.description
        : "N/A";
    },
    // Course type to display in modal
    courseType() {
      return this.currentModal.type && this.currentModal.type.length > 0
        ? this.currentModal.type
        : "N/A";
    },
    // Course codes to display in modal
    codes() {
      return this.currentModal.courseCodes &&
        this.currentModal.courseCodes.length > 0
        ? this.currentModal.courseCodes
        : ["N/A"];
    },
  },
};
</script>

<style scoped>
.stat-label {
  color: hsl(215, 100%, 60%);
  font-size: 12;
  font-weight: bold;
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
  text-align: center;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.course-list {
  padding: 10px;
}
.center {
  text-align: center;
}

.footer-text {
  padding: 10px;
  font-size: 12pt;
}

.modal-body {
  font-family: "Montserrat";
  font-size: 12pt;
}
</style>
