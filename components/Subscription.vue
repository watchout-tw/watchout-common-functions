<template>
<div class="subscription">
  <form @submit.prevent="onSubmit">
    <div class="form-field-many-inputs no-wrap">
      <drop-down-select :options="amountOptions" placeholder="金額" v-model="selectedAmount" />
      <text-editor v-if="selectedAmount === 'custom'" placeholder="自訂金額" v-model="customAmount" :classes="['park']" :simple="true" />
    </div>
    <div class="form-field">
      <drop-down-select :options="recurrenceOptions" placeholder="定期" v-model="selectedRecurrence" />
    </div>
    <div class="form-field">
      <text-editor placeholder="Email" v-model="email" :classes="['park']" :simple="true" />
    </div>
    <div class="form-field">
      <text-editor placeholder="暱稱" v-model="name" :classes="['park']" :simple="true" />
    </div>
    <div class="form-field">
      <submit-button type="submit" :classes="['park']" label="送出" :state.sync="submit.state" :message.sync="submit.message" @success="onSubmitSuccess" />
    </div>
  </form>
</div>
</template>

<script>
import * as STATES from '../lib/states'
import { isEmail } from '../lib/util'
import DropDownSelect from './DropDownSelect'
import TextEditor from './TextEditor'
import SubmitButton from './button/Submit'

const CUSTOM = 'custom'
const amountOptions = [
  {
    value: 100,
    label: '100'
  },
  {
    value: 250,
    label: '250'
  },
  {
    value: 500,
    label: '500'
  },
  {
    value: CUSTOM,
    label: '自訂'
  }
]
const recurrenceOptions = [
  {
    value: 'monthly',
    label: '每月定期'
  },
  {
    value: 'once',
    label: '一次支持'
  }
]

export default {
  data() {
    return {
      amountOptions,
      selectedAmount: 100,
      customAmount: null,
      recurrenceOptions,
      selectedRecurrence: 'monthly',
      email: null,
      name: null,
      submit: {
        state: STATES.DEFAULT,
        message: null
      }
    }
  },
  methods: {
    onSubmit() {
      let amount = this.selectedAmount === CUSTOM ? parseInt(this.customAmount) : this.selectedAmount
      let ok = false
      let message = null
      if(Number.isInteger(amount) && amount > 0) {
        if(this.selectedRecurrence) {
          if(isEmail(this.email)) {
            ok = true
          } else {
            message = '請填入有效 Email'
          }
        } else {
          message = '請選擇定期或單次支持'
        }
      } else {
        message = '請填入有效金額'
      }
      if(ok) {
        this.submit.state = STATES.LOADING
        console.log('submit')
        this.submit.state = STATES.SUCCESS
      } else {
        this.submit.state = STATES.FAILED
        this.submit.message = message
      }
    },
    onSubmitSuccess() {
      console.log('success')
    }
  },
  components: {
    DropDownSelect,
    TextEditor,
    SubmitButton
  }
}
</script>
