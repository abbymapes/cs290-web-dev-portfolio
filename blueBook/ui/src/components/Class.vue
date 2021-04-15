The Class component is a card that displays class information,
including the title and catalog number.

@author Abby Mapes

<template>
    <b-card
        :title="course.subjectCode + ' ' + course.catalogNumber"
        @click="goToCoursePage(course)"
        :border-variant="getBorderStyle"
    >
        <b-card-text>
            {{course.title}}
        </b-card-text>
    </b-card>
</template>

<script>
export default {
    name: 'Class',
    components: {
    },
    props: {
        type: String,
        course: Object,
        reactionId: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            styles: {
                like: 'success',
                dislike: 'danger',
                wishlist: 'warning',
            },
        };
    },
    methods: {
        goToCoursePage(course) {
            if (this.isReaction) {
                this.$emit('selected-reaction', this.type, this.course, this.reactionId);
            } else {
                this.$emit('selected-course', course);
            }
        },
    },
    computed: {
        getBorderStyle() {
            if (this.styles[this.type]) {
                return this.styles[this.type];
            }
            return 'dark';
        },
        isReaction() {
            return (!!this.reactionId);
        },
    },
};
</script>

<style scoped>
b-card {
    height: 100%;
}
</style>
