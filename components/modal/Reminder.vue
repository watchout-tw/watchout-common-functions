<template>
  <div class="modal reminder">
    <div class="title">
      {{ data.title }}
    </div>
    <div class="contentBox">
      <div class="content">
        {{ data.content }}
      </div>
      <div class="collapse">
        <button class="button watchout" @click="getLink">
          {{ data.targetText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'

export default {
  mixins: [knowsWindowManagement],
  props: ['data'],
  methods: {
    getLink() {
      this.removeModal('reminder')
      this.$router.push({ name: this.data.targetLink })
    }
  }
}
</script>

<style lang="scss">
@import "~watchout-common-assets/styles/resources";

.modal.reminder {
  width: 18rem;
  background-color: $color-watchout-light;
  @include shadow;

  > .title {
    padding: 1rem;
    font-weight: bold;
    background-color: $color-watchout-light;
  }

  > .contentBox {
    .content {
      padding: 1rem 1rem 0.5rem 1rem
    }

    .collapse {
      width: 100%;
      padding: 0.5rem 1rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
