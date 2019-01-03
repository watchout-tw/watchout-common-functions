<template>
<div class="reference">
  <drop-down-select placeholder="類型" :options="types.filter(type => type.category === category)" v-model="type" class="small compact" />
  <text-editor placeholder="ID" v-model="id" :classes="['watchout']" :simple="true" />
</div>
</template>

<script>
import { parseReference, makeReference } from 'watchout-common-functions/lib/bunko'
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
        return parseReference(this.reference).type
      },
      set(value) {
        this.$emit('update:reference', makeReference(value, parseReference(this.reference).id))
      }
    },
    id: {
      get() {
        return parseReference(this.reference).id
      },
      set(value) {
        this.$emit('update:reference', makeReference(parseReference(this.reference).type, value))
      }
    }
  },
  components: {
    DropDownSelect,
    TextEditor
  }
}
</script>
