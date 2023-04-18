<template>
  <div class="modal reminder">
    <div class="prompt-overlay">
      <div class="prompt with-dismiss correct">
        <div class="tcl-panel with-double-top-bottom-margin">
          <h2 class="title">{{ data.data.title }}</h2>
          <div class="message margin-top-bottom-single">{{ data.data.message }}</div>
          <div class="button-block margin-top-bottom-single">
            <submit-button type="primary" :classes="['medium', 'compact']" @click.native="removeModal('reminder')" label="取消" />
            <submit-button type="primary" :classes="['medium', 'watchout', 'compact']" @click.native="submit" label="確定" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import SubmitButton from 'watchout-common-functions/components/button/Submit'

export default {
  mixins: [knowsWindowManagement],
  props: ['data'],
  methods: {
    submit: function() {
      this.data.data.action()
      this.removeModal('reminder')
    }
  },
  components: {
    SubmitButton
  }
}
</script>

<style lang="scss">
@import 'watchout-common-functions/assets/mapbox.scss';

.modal.reminder {

  .title {
    text-align : center;
  }

  .button-block {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
