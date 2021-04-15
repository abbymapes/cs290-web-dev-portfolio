This represents a comment, including the name, picture, and text of the user
who left the comment.
<template>
  <table id="comment-section" v-if="comments.length > 0">
    <tr v-for="(comment, i) in comments" :key="i">
      <div v-if="!isCreator(comment.user.userId)" class="not-creator">
        <div class="not-creator">
          <span class="avatar" @click="goToUserPage(comment.user.userId)">
            <img :src="comment.user.picture" />
          </span>
          <span class="name" @click="goToUserPage(comment.user.userId)">{{
            comment.user.displayName
          }}</span>
        </div>
        <span class="body">
          <span class="content">
            <span class="text">{{ comment.commentText }}</span>
          </span>
        </span>
      </div>
      <div v-else class="creator">
        <span @click="goToUserPage(comment.user.userId)">
          <span class="body">
            <span class="content">
              <span class="text">{{ comment.commentText }}</span>
            </span>
          </span>
          <span class="avatar">
            <img :src="comment.user.picture" />
          </span>
        </span>
        <b-button
          class="delete-button"
          variant="outline-danger"
          @click="deleteComment(comment.commentId)"
        >
          X
        </b-button>
      </div>
    </tr>
  </table>
  <table id="comment-section" v-else>
    <tr class="center">
      No Comments Yet
    </tr>
  </table>
</template>

<script>
import userState from '../userState';

export default {
    name: 'CommentSection',
    props: {
        comments: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        isCreator(userId) {
            return userId === userState.currentUid;
        },

        goToUserPage(userId) {
            this.$emit('user-page', userId);
        },

        deleteComment(commentId) {
            this.$emit('delete-comment', commentId);
        },
    },
};
</script>

<style scoped>
.comment {
  display: flex;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 192, 203, 0.2);
  display: inline-block;
  text-align: center;
}

img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.name {
  font-weight: bold;
  padding: 1em;
  padding-bottom: 2em;
}

.body {
  padding: 1em;
  font-size: 16px;
  max-width: 560px;
  word-break: break-word;
}

.content {
  position: relative;
  display: inline-block;
  color: #000;
  background-color: aliceblue;
  border-radius: 15px;
  padding: 0.5em 1em;
}

.creator {
  text-align: right;
  margin: 10px;
}

.not-creator {
  margin: 10px;
}

table {
  width: 100%;
}

tr {
  text-align: left;
}

.center {
  text-align: center;
}

.delete-button {
  margin-left: 10px;
}
</style>
