The AttributePage component represents the display page for a course attribute. Within this
page, users can view courses for this course attribute.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="loading" no-center class="overlay">
        <h1>{{attributeName}}</h1>
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
        };
    },
    methods: {
        goToCoursePage(course) {
            this.$emit('course-page', course);
        },
        async getCourses() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getCoursesForAttribute?attribute=${encodeURIComponent(this.attributeName)}`);
            const result = await response.json();
            if (response.ok) {
                this.courses = result;
            } else {
                this.errorMessage = result.message;
                this.showError = true;
            }
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
