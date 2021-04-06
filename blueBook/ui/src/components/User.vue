The User component represents the display for a user's name and profile picture,
which is shown in the Friends section or the search section.

@author Abby Mapes
<template>
    <b-card
        :img-src="user.picture"
        :img-alt="user.name + ' Profile Picture'"
        img-top
        :title="user.displayName"
        @click="goToUserPage"
        border-variant="light"
    >
    </b-card>
</template>

<script>
/* eslint-disable */

export default {
  name: "User",
  components: {
  },
  props: {
    user: Object
  },
  data() {
    return {
    }
  },
  methods: {
      goToUserPage() {
        this.$emit('selected', this.user.uid);
      }
  },
  computed: {
  }, 
  watch : {

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    b-card {
        height: 100%;
        margin: 1%;
    }
    img {
        height: 200px;
        width: 200px;
        border-radius: 50%;
        border: black;
        border-width: 1px;
        border-style: solid;
    }
</style>
