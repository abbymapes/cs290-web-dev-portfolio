The ReactionModal component represents the display for modal that pops up when a User reaction
is clicked. The modal contains the information that a reaction does, including all comments for
that reaction.

@author Abby Mapes
<template>
  <b-modal
    v-model="showModal"
    scrollable
    hide-footer
    content-class="shadow"
    @hide="closeModal"
    size="lg"
  >
    <reaction
      :reactionId="reactionId"
      :type="type"
      :course="course"
      :user="user"
      :isAdmin="isAdmin"
      @course-page="goToCoursePage"
      @user-page="goToUserPage"
    >
    </reaction>
  </b-modal>
</template>

<script>
import Reaction from './Reaction.vue';

export default {
    name: 'ReactionModal',
    components: {
        Reaction,
    },
    props: {
        show: Boolean,
        reactionId: String,
        type: String,
        course: Object,
        user: Object,
        isAdmin: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            showModal: false,
            modalLoading: false,
            showReactionError: false,
            errorMessage: '',
            comments: [],
            perPage: 3,
            currentPage: 1,
            totalComments: 0,
            newComment: '',
            commentsLoading: false,
        };
    },
    methods: {
        goToCoursePage(course) {
            this.$emit('course-page', course);
        },

        closeModal() {
            this.$emit('close-reaction');
        },

        goToUserPage(userId) {
            this.$emit('user-page', userId);
        },
    },
    computed: {
    },

    watch: {
        show() {
            this.showModal = this.show;
        },
    },
    async mounted() {
        if (this.showModal === false) {
            this.closeModal();
        }
    },
};
</script>

<style scoped>
</style>
