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
/* eslint-disable */

export default {
  name: "Class",
  components: {
  },
  props: {
    type: String,
    course: Object
  },
  data() {
    return {
    }
  },
  methods: {
      goToCoursePage(course) {
        this.$emit("selected", course);
      }
  },
  computed: {
      getBorderStyle() {
          return (this.type == "like" ? "success" :
                (this.type == "dislike" ? "danger" :
                (this.type == "wishlist" ? "warning" : "light")));
      }
  }, 
  watch : {

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
b-card {
    height: 100%;
}
</style>
