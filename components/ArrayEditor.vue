<template>
<div class="array-editor">
  <div class="row editor">
    <div class="col items-container">
      <div class="items">
        <div class="item" v-for="(valueItem, index) of values" :key="index">
          <span>{{ getLabel(valueItem) }}</span>
          <div class="close small" @click="removeValue(index)"></div>
        </div>
        <div class="item placeholder not-available" v-if="!(values && values.length > 0)">沒有{{ placeholder ? placeholder : '' }}</div>
      </div>
    </div>
    <div class="col form-field-many-inputs no-wrap no-margin">
      <template v-if="type === 'select'">
        <drop-down-select :placeholder="'選擇' + placeholder" :options="options" v-model="newValue" class="small shrink" />
      </template>
      <template v-else>
        <text-editor :placeholder="'輸入' + placeholder" v-model="newValue" class="watchout" :simple="true" key="newValue" />
      </template>
      <button class="input button tiny" @click="addValue">新增</button>
      <button class="input button tiny" @click="clearValues">⤬</button>
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
  watch: {
    value(newValue, oldValue) {
      const isOldDataSame = JSON.stringify(oldValue) === JSON.stringify(this.values)
      const isNewDataDifferent = JSON.stringify(newValue) !== JSON.stringify(oldValue)
      if(isOldDataSame && isNewDataDifferent) {
        this.values = newValue
      }
    }
  },
  methods: {
    addValue() {
      if(this.newValue) {
        if(!this.values.includes(this.newValue)) {
          this.values.push(this.newValue)
          this.newValue = null
        }
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
        let option = this.options.find(option => {
          // During firebase migration, also lookup firebase_id
          return option.value.toString() === value.toString() ||
            (option.data && option.data.firebase_id && option.data.firebase_id === value)
        })
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
          border-style: solid;
          border-color: transparent;
          border-radius: 1px;
          border-width: 1px;
          &:not(.placeholder) {
            padding-right: 1.5em;
            border-color: $color-light-border-grey;
          }
          &.placeholder {
            background-color: $color-light-border-grey;
          }
        }
      }
    }
  }
}
</style>
