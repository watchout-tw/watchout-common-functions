<template>
<div class="array-editor">
  <div class="row editor">
    <div class="col items-container">
      <div class="items">
        <div class="item" v-for="(value, index) of values" :key="index">
          <span>{{ getLabel(values[index]) }}</span>
          <div class="close small" @click="removeValue(index)"></div>
        </div>
        <div class="not-available" v-if="values.length < 1">沒有{{ placeholder ? placeholder : '' }}</div>
      </div>
    </div>
    <div class="col form-field-many-inputs no-wrap">
      <template v-if="type === 'select'">
        <drop-down-select :placeholder="'選擇' + placeholder" :options="options" v-model="newValue" class="small" :style="{ flexShrink: 0 }" /><!-- FIXME: quick hack -->
      </template>
      <template v-else>
        <text-editor :placeholder="'輸入' + placeholder" v-model="newValue" class="watchout" :simple="true" key="newValue" />
      </template>
      <button class="input button small" @click="addValue">新增</button>
      <button class="input button small" @click="clearValues">清空</button>
    </div>
  </div>
</div>
</template>

<script>
import DropDownSelect from 'watchout-common-functions/components/DropDownSelect'
import TextEditor from 'watchout-common-functions/components/TextEditor'
export default {
  props: ['placeholder', 'type', 'options', 'value'],
  data() {
    return {
      values: this.value,
      newValue: null
    }
  },
  methods: {
    addValue() {
      if(this.newValue) {
        this.values.push(this.newValue)
        this.newValue = null
      }
    },
    removeValue(index) {
      this.values.splice(index, 1)
    },
    clearValues() {
      this.values = []
    },
    getLabel(value) {
      let label = value
      if(this.type === 'select') {
        let option = this.options.find(option => option.value === value)
        label = option ? option.label : value
      }
      return label
    }
  },
  components: {
    DropDownSelect,
    TextEditor
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.array-editor {
  width: 100%;
  > .row {
    display: flex;
    align-items: center;
    width: 100%;
    > .col {
      width: 50%;
    }
  }
  > .editor {
    > .items-container {
      > .items {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        font-size: 0.875rem;
        > .item {
          flex-grow: 0;
          position: relative;
          margin: 0.125em;
          padding: 0.25em 0.375em;
          padding-right: 1.5em;
          border-style: solid;
          border-color: $color-light-border-grey;
          border-radius: 1px;
          border-width: 1px;
        }
      }
    }
  }
}
</style>
