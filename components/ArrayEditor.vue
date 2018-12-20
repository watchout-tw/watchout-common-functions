<template>
<div class="array-editor">
  <div class="values">
    <div class="value" v-for="(value, index) of values" :key="index">
      <span>{{ getLabel(values[index]) }}</span>
      <div class="close" @click="removeValue(index)"></div>
    </div>
    <div class="not-available" v-if="values.length < 1">沒有{{ placeholder ? placeholder : '' }}</div>
  </div>
  <div class="new-value-input form-field-many-inputs no-wrap">
    <template v-if="type === 'select'">
      <drop-down-select :placeholder="'選擇' + placeholder" :options="options" v-model="newValue" />
    </template>
    <template v-else>
      <text-editor :placeholder="'輸入' + placeholder" v-model="newValue" class="watchout" :simple="true" key="newValue" />
    </template>
    <button class="input button small" @click="addValue">新增</button>
    <button class="input button small" @click="clearValues">清空</button>
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
  > .values {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    padding: 0.25rem 0;
    > .value {
      flex-grow: 0;
      position: relative;
      padding: 0.25rem 0.375rem;
      padding-right: 1.5rem;
      border-style: solid;
      border-color: $color-light-border-grey;
      border-radius: 1px;
      border-width: 1px;
    }
    > .not-available {
      flex-shrink: 0;
      padding: 0.25rem 0.375rem;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
    }
  }
  > .new-value-input {
    flex-grow: 0;
    flex-shrink: 1;
  }
}
</style>
