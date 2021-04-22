The ClassesSection component displays columns of Class components based on the classes
provided as a prop.

@author Abby Mapes
<template>
    <div>
        <b-overlay :show="classesLoading" no-center class="overlay">
            <h1>Classes</h1>
            <div>
                <waterfall
                    :options="options"
                >
                    <waterfall-item
                        v-for="(item, index) in classes"
                        class="waterfall-item"
                        :order="index"
                        :key="index"
                    >
                        <class
                            type='course'
                            :course="item"
                            @selected-course="goToCoursePage"
                        >
                        </class>
                    </waterfall-item>
                </waterfall>
            </div>
        </b-overlay>
    </div>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall';
import Class from './Class.vue';

export default {
    name: 'ClassesSection',
    components: {
        Class,
        Waterfall,
        WaterfallItem,
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
            options: {},
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
