The AttributeSection component represents the display for a collection of Attribute names,
 based on the attributeList prop.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="loading" no-center class="overlay">
      <h1 id='section-title'>Course Attributes</h1>
        <waterfall
            :options="options"
        >
            <waterfall-item
                v-for="(item, i) in attributeList"
                class="waterfall-item"
                :order="i"
                :key="i"
            >
                <b-card
                    :id='getItemCode(item.name)'
                    @click="goToAttributePage(item.name)"
                >
                    <b-card-text class="attribute-name">
                        {{ item.name }}
                    </b-card-text>
                </b-card>
            </waterfall-item>
        </waterfall>
    </b-overlay>
  </div>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall';

export default {
    name: 'AttributeSection',
    components: {
        Waterfall,
        WaterfallItem,
    },
    props: {
        attributeList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            loading: false,
            options: {},
        };
    },
    methods: {
        goToAttributePage(name) {
            this.$emit('attribute-page', name);
        },
        getItemCode(name) {
            return name.split(' ')[0];
        },
    },
};
</script>
<style scoped>
.attribute-name {
  font-size: 25pt;
}
</style>
