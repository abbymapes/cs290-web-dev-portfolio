The ClassesSection component displays columns of Class components based on the classes
provided as a prop.

@author Abby Mapes
<template>
    <div>
        <b-overlay :show="classesLoading" no-center class="overlay">
            <h1>Classes</h1>
            <b-card-group columns>
                <class
                    v-for="item in classes"
                    :key="item.courseId"
                    type='course'
                    :course="item"
                    @selected-course="goToCoursePage"
                >
                </class>
            </b-card-group>
        </b-overlay>
    </div>
</template>

<script>
import Class from './Class.vue';

export default {
    name: 'ClassesSection',
    components: {
        Class,
    },
    props: {
        classes: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            classesLoading: false,
        };
    },
    methods: {
        goToCoursePage(course) {
            this.$emit('course-page', course);
        },
    },
};
</script>

<style scoped>
</style>
