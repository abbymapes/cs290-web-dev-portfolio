The ClassesSection component displays columns of Class components based on the classes
provided as a prop.

@author Abby Mapes
<template>
    <div>
        <b-overlay :show="classesLoading" no-center class="overlay">
            <h1>Classes</h1>
            <b-card-group columns>
                <class
                    v-for="(item, i) in classes"
                    :key="i"
                    :type="type"
                    @selected="goToCoursePage"
                >
                </class>
            </b-card-group>
        </b-overlay>
    </div>
</template>

<script>
/* eslint-disable */
import Class from "./Class"

export default {
  name: "ClassesSection",
  components: {
      Class
  },
  props: {
    classes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
        classesLoading: false
    }
  },
  methods: {
      goToCoursePage(course) {
        this.$emit("selected", course);
      }
  },
  computed: {

  }, 
  watch : {

  },
  async mounted () {
    this.classesLoading = true;
    this.classesLoading = false;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
