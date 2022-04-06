<template>
  <div class="modal menuAndAuth">
    <div class="section-title with-underline small text-align-center margin-bottom-4">
      <span>菜單</span>
    </div>
    <menu-double :menu="data.menu" @itemClicked="removeModal('menu-and-auth')" />
    <div class="section-title with-underline small text-align-center margin-top-4 margin-bottom-4">
      <span>會員</span>
    </div>
    <div class="memberText" @click="clickMemberBlock()">
      <span class="a-text">{{ memberText }}</span>
    </div>
  </div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import MenuDouble from 'watchout-common-functions/components/MenuDouble'

export default {
  mixins: [knowsWindowManagement],
  props: ['data'],
  data() {
    const memberText = !this.data.isCitizen ? '登入' : '狀態'
    return {
      memberText
    }
  },
  methods: {
    clickMemberBlock() {
      !this.data.isCitizen ? this.addModal({ id: 'auth', joinOrLogin: 'login' }) : this.addModal('swiss-knife')
      this.removeModal('menu-and-auth')
    }
  },
  components: {
    MenuDouble
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.menuAndAuth {
  width: 18rem;
  padding: 1rem;
  background-color: rgba(#000000, 0.8);
  color: #ffffff;
  @include shadow;

  > .menu.double {
    > .tree {
      text-align: center;
      > .item {
        > a {
          border-color: rgba(255, 255, 255, 0.35);
        }
      }
    }
  }

  > .memberText {
    padding: 0.5rem;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    text-align: center;

    > span {
      border-bottom: 2px rgba(255, 255, 255, 0.35) solid;
    }
  }
}

</style>
