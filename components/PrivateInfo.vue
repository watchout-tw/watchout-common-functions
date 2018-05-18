<template>
<div class="private-info">
  <form @submit.prevent="onSubmit">
    <div class="field">
      <text-editor placeholder="真實姓名" v-model="name" :classes="['park']" :simple="true" key="name" />
    </div>
    <div class="field form-field-many-inputs no-wrap">
      <drop-down-select :options="allYears" placeholder="出生年" v-model="birth_year" />
      <drop-down-select :options="allMonths" placeholder="月" v-model="birth_month" />
      <drop-down-select :options="allDays" placeholder="日" v-model="birth_date" />
    </div>
    <div class="field form-field-many-inputs no-wrap">
      <text-editor placeholder="國碼" v-model="country_code" :classes="['park']" :simple="true" />
      <text-editor placeholder="行動電話" v-model="phone_number" :classes="['park']" :simple="true" />
    </div>
    <div class="section-title with-underline small with-increased-top-margin"><span>性別認同</span></div>
    <div class="field">
      <gender-slider :value.sync="gender" />
    </div>
    <div class="section-title with-underline small with-increased-top-margin"><span>選舉人資訊</span></div>
    <div class="field form-field-many-inputs no-wrap">
      <drop-down-select :options="allVoterTypes" placeholder="選擇類別" v-model="voter_type" />
      <drop-down-select :options="allCities" placeholder="戶籍城市" v-model="voter_city" />
    </div>
    <div class="field form-field-many-inputs no-wrap">
      <drop-down-select :options="allDistricts" placeholder="戶籍區域" v-model="voter_district" />
      <drop-down-select :options="allNeighborhoods" placeholder="戶籍村里" v-model="voter_neighborhood" />
    </div>
    <div class="field form-field-many-inputs no-wrap">
      <button class="input button" @click="clear()">清空</button>
      <submit-button type="submit" :classes="['park']" label="更新" :state.sync="state" :message.sync="message" @reset="onSubmitButtonReset" />
    </div>
  </form>
</div>
</template>

<script>
import * as core from '../lib/core'
import * as ERRORS from '../lib/errors'
import * as STATES from '../lib/states'
import { knowsAuth, knowsError, knowsWindowManagement } from '../interfaces'
import administrativeDivision from '../data/hoods-20170131.json'
import TextEditor from './TextEditor'
import GenderSlider from './GenderSlider'
import DropDownSelect from './DropDownSelect'
import SubmitButton from './button/Submit.vue'

function integerRange(from, to) {
  var range = []
  for(let i = from; i <= to; i++) {
    range.push(i)
  }
  return range
}
export default {
  mixins: [knowsAuth, knowsError, knowsWindowManagement],
  data() {
    return {
      allYears: integerRange(1900, new Date().getFullYear() - 4),
      allMonths: integerRange(1, 12),
      allVoterTypes: [
        '山地原住民',
        '平地原住民',
        '非原住民'
      ],
      cols: ['name', 'gender', 'birth_year', 'birth_month', 'birth_date', 'country_code', 'phone_number', 'voter_type', 'voter_city', 'voter_district', 'voter_neighborhood'],
      name: null,
      gender: 0,
      birth_year: null,
      birth_month: null,
      birth_date: null,
      country_code: null,
      phone_number: null,
      voter_type: null,
      voter_city: null,
      voter_district: null,
      voter_neighborhood: null,
      administrativeDivision,
      state: STATES.DEFAULT,
      message: null
    }
  },
  async beforeMount() {
    core.getCitizen().then(response => {
      this.cols.forEach(col => {
        this[col] = response.data[col]
      })
    }).catch(this.handleError)
  },
  computed: {
    allDays() {
      let days = 31
      if(parseInt(this.birth_month) === 2) {
        days = parseInt(this.birth_year) % 4 === 0 ? 29 : 28
      } else if([4, 6, 9, 11].includes(parseInt(this.birth_month))) {
        days = 30
      }
      return integerRange(1, days)
    },
    allCities() {
      return administrativeDivision.cities
    },
    allDistricts() {
      let city = administrativeDivision.districts.find(city => city.city_name === this.voter_city)
      if(city) {
        return city.districts
      }
    },
    allNeighborhoods() {
      let city = administrativeDivision.neighborhoods.find(city => city.city_name === this.voter_city)
      if(city) {
        let district = city.districts.find(district => district.district_name === this.voter_district)
        if(district) {
          return district.neighborhoods
        }
      }
    }
  },
  methods: {
    clear() {
      this.name = null
      this.gender = 0
      this.birth_year = this.birth_month = this.birth_date = null
      this.country_code = this.phone_number = null
      this.voter_type = this.voter_city = this.voter_district = this.voter_neighborhood = null
    },
    onSubmit() {
      let payload = {}
      this.cols.forEach(col => {
        if(!this[col]) {
          this[col] = null
        }
        payload[col] = this[col]
      })
      console.log(payload)
      if(Object.keys(payload).length > 0) {
        this.state = STATES.LOADING
        core.patchCitizen(payload).then(response => {
          console.log(response)
          this.state = STATES.SUCCESS
          this.message = '更新成功'
        }).catch(error => {
          this.state = STATES.FAILED
          this.message = ERRORS.MAP[error.response.message]
          this.handleError(error)
        })
      }
    },
    onSubmitButtonReset() {
      if(this.state === STATES.SUCCESS) {
        this.removeModal('private-info-registration')
        this.reloadAuth()
      }
    }
  },
  components: {
    TextEditor,
    GenderSlider,
    DropDownSelect,
    SubmitButton
  }
}
</script>
