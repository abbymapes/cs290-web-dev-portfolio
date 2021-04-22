The Reaction component is a card that displays reaction information
for a user, including the reaction type, the class, and the user's name.

@author Abby Mapes

<template>
  <b-overlay :show="loading" rounded="sm">
      <div v-if="!showReactionError && !loading" class="modal-body reaction">
        <div
          class="left"
          @click="goToUserPage(user.userId)"
        >
            <h1>
            <b-avatar size="5rem"
                :src="user.picture"
                :alt="user.displayName + 'Profile Picture'"
            ></b-avatar>
            {{ user.displayName }}</h1>
        </div>
        <span class="type">{{ reactionVerb }}
            <b-icon v-if="type=='like'" icon="hand-thumbs-up" aria-hidden="true"></b-icon>
            <b-icon v-else-if="type=='dislike'" icon="hand-thumbs-down" aria-hidden="true"></b-icon>
            <b-icon v-else-if="type=='wishlist'" icon="bag-plus" aria-hidden="true"></b-icon>
        </span>
        <class
          :type="type"
          :course="course"
          @selected-course="goToCoursePage"
          class="class"
        ></class>
        <br>
        <h2>Comments</h2>
        <b-overlay :show="commentsLoading" rounded="sm">
            <div v-if="loggedIn">
                <b-input-group
                    size="sm"
                    class="mb-3"
                >
                    <b-form-textarea
                        id="comment-textarea"
                        placeholder="Leave a comment here"
                        rows="1"
                        max-rows="8"
                        v-model="newComment"
                        @keyup.enter="postComment"
                    ></b-form-textarea>
                    <b-input-group-append>
                        <b-button
                            size="sm"
                            text="Button"
                            variant="success"
                            :disabled="newComment.trim().length == 0"
                            @click="postComment">
                            Post
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <comment-section
                :comments="displayComments"
                @user-page="goToUserPage"
                @delete-comment="deleteComment"
            >
            </comment-section>
            <b-pagination
                v-model="currentPage"
                :total-rows="totalComments"
                :per-page="perPage"
                aria-controls="comment-section"
                pills
            ></b-pagination>
        </b-overlay>
      </div>
      <div v-else class="modal-body">Error retrieving Reaction: {{errorMessage}}</div>
    </b-overlay>
</template>

<script>
import Class from './Class.vue';
import CommentSection from './CommentSection.vue';
import userState from '../userState';

export default {
    name: 'Reaction',
    components: {
        Class,
        CommentSection,
    },
    props: {
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
            loading: false,
            currentUid: userState.currentUser.userId,
            showReactionError: false,
            errorMessage: '',
            comments: [],
            perPage: 3,
            currentPage: 1,
            newComment: '',
            commentsLoading: false,
        };
    },
    methods: {
        goToCoursePage(course) {
            this.clearData();
            this.$emit('course-page', course);
        },

        closeModal() {
            this.clearData();
            this.$emit('close-reaction');
        },

        goToUserPage(userId) {
            this.clearData();
            this.$emit('user-page', userId);
        },

        clearData() {
            this.showReactionError = false;
            this.errorMessage = '';
            this.comments = [];
            this.newComment = '';
        },

        async displayReactionModal() {
            this.loading = true;
            this.commentsLoading = true;
            this.showReactionError = false;
            this.errorMessage = '';
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getReactionComments?reactionId=${this.reactionId}`);
            const result = await response.json();
            if (response.ok) {
                this.comments = result;
            } else {
                this.errorMessage = result.message;
                this.showReactionError = true;
            }
            this.commentsLoading = false;
            this.loading = false;
        },

        async postComment() {
            this.commentsLoading = true;
            if (this.isValidComment) {
                this.errorMessage = '';
                this.comments = [];
                const comment = {
                    reactionId: this.reactionId,
                    userId: this.currentUid,
                    commentText: this.newComment,
                };
                const response = await fetch(
                    `${userState.SERVER_URL
                    }/bluebook/postReactionComment`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(comment),
                    },
                );
                const result = await response.json();
                this.newComment = '';
                if (response.ok) {
                    this.comments = result;
                } else {
                    this.errorMessage = result.message;
                    this.showReactionError = true;
                }
            } else {
                console.log('BAD USER INPUT: Unable to comment on reaction due to invalid input.');
                this.errorMessage = 'Invalid comment: cannot write comment document with empty userId or courseId. Please try again.';
                this.showReactionError = true;
            }
            this.commentsLoading = false;
        },

        async deleteComment(commentId) {
            this.commentsLoading = true;
            this.errorMessage = '';
            this.comments = [];
            this.newComment = '';
            const response = await fetch(`${userState.SERVER_URL}/bluebook/deleteReactionComment?commentId=${commentId}&reactionId=${this.reactionId}`);
            const result = await response.json();
            if (response.ok) {
                this.comments = result;
            } else {
                this.errorMessage = result.message;
                this.showReactionError = true;
            }
            this.commentsLoading = false;
        },
    },
    computed: {
        loggedIn() {
            if (this.isAdmin) {
                return false;
            }
            return this.currentUid.length > 0;
        },
        reactionVerb() {
            if (['like', 'dislike'].includes(this.type)) {
                return `${this.type.toUpperCase()}S`;
            }
            return 'WANTS TO TAKE';
        },
        numPages() {
            return (Math.ceil(this.totalComments / this.perPage));
        },
        displayComments() {
            const firstComment = ((this.currentPage - 1) * this.perPage);
            return this.comments.slice(firstComment, firstComment + this.perPage);
        },
        totalComments() {
            return this.comments.length;
        },
        isValidComment() {
            return (this.requestedCourseId !== ''
            && this.currentUid !== ''
            && this.newComment.trim() !== '');
        },
    },

    watch: {
    },
    async mounted() {
        await this.displayReactionModal();
    },
};
</script>

<style scoped>
.reaction {
  font-family: 'Montserrat';
  text-align: center;
}

.class {
  width: 80%;
  margin: auto;
}

.left {
    text-align: left;
}

.type {
    font-size: 20pt;
    font-weight: bold;
}
</style>
