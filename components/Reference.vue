<template>
<div class="reference">
  <drop-down-select placeholder="類型" :options="types.filter(type => type.category === category)" v-model="type" class="small compact" />
  <text-editor placeholder="ID" v-model="id" :classes="['watchout']" :simple="true" />
</div>
</template>

<script>
import DropDownSelect from 'watchout-common-functions/components/DropDownSelect'
import TextEditor from 'watchout-common-functions/components/TextEditor'

const types = [
  {
    category: 'video',
    value: 'youtube',
    label: 'YouTube'
  },
  {
    category: 'video',
    value: 'facebook',
    label: 'Facebook'
  },
  {
    category: 'video',
    value: 'livehouseIn',
    label: 'LIVEhouse.in'
  },
  {
    category: 'watchout',
    value: 'doc',
    label: '文件'
  },
  {
    category: 'watchout',
    value: 'video',
    label: '影片'
  },
  {
    category: 'watchout',
    value: 'external',
    label: '外部連結'
  }
]

const SEPARATOR = '://'
export default {
  props: {
    reference: String,
    category: {
      type: String,
      default: 'watchout'
    }
  },
  data() {
    return {
      types
    }
  },
  computed: {
    type: {
      get() {
        let tokens = this.split()
        return tokens[0]
      },
      set(value) {
        let [type, id] = this.split()
        type = value
        this.$emit('update:reference', type + SEPARATOR + (id !== null ? id : ''))
      }
    },
    id: {
      get() {
        let tokens = this.split()
        return tokens[1]
      },
      set(value) {
        let [type, id] = this.split()
        id = value
        this.$emit('update:reference', (type !== null ? type : '') + SEPARATOR + id)
      }
    }
  },
  methods: {
    split() {
      return this.reference && this.reference.indexOf(SEPARATOR) > -1 ? this.reference.split(SEPARATOR) : [null, null]
    }
  },
  components: {
    DropDownSelect,
    TextEditor
  }
}
</script>
