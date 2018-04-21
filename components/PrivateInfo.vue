<template>
<div class="private-info">
  <div class="form">
    <div class="form-section-title-small"><span>個人資料</span></div>
    <div class="field">
      <text-editor placeholder="真實姓名" v-model="name" :classes="['park']" :simple="true" key="name" />
    </div>
    <div class="field form-field-many-inputs no-wrap">
      <drop-down-select :options="allYears" v-model="birth.year" />
      <drop-down-select :options="allMonths" v-model="birth.month" />
      <drop-down-select :options="allDays" v-model="birth.date" />
    </div>
    <div class="field form-field-many-inputs no-wrap">
      <text-editor placeholder="+886" v-model="phone.country" :classes="['park']" :simple="true" />
      <text-editor placeholder="行動電話" v-model="phone.number" :classes="['park']" :simple="true" />
    </div>
    <div class="form-section-title-small"><span>性別認同</span></div>
    <div class="field">
      <gender-slider :value.sync="gender" />
    </div>
    <div class="form-section-title-small"><span>選舉人資訊</span></div>
    <div class="field form-field-many-inputs no-wrap">
      <drop-down-select :options="allVoterTypes" placeholder="選擇類別" v-model="voter.type" />
      <drop-down-select :options="allCities" placeholder="選擇戶籍城市" v-model="voter.city" />
    </div>
    <div class="field form-field-many-inputs no-wrap">
      <drop-down-select :options="allDistricts" placeholder="選擇區域" v-model="voter.district" />
      <drop-down-select :options="allNeighborhoods" placeholder="選擇村里" v-model="voter.neighborhood" />
    </div>
    <div class="field with-extra-margin">
      <submit-button :classes="['park']" label="送出" :state.sync="state" :message.sync="message" @click.native="" />
    </div>
  </div>
</div>
</template>

<script>
import * as STATES from '../lib/states'
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
  data() {
    return {
      allYears: integerRange(1900, new Date().getFullYear() - 4),
      allMonths: integerRange(1, 12),
      allVoterTypes: [
        '非原住民',
        '山地原住民',
        '平地原住民'
      ],
      name: null,
      gender: 0,
      birth: {
        year: 1985,
        month: 11,
        date: 1
      },
      phone: {
        country: '+886',
        number: null
      },
      voter: {
        type: null,
        city: null,
        district: null,
        neighborhood: null
      },
      administrativeDivision,
      state: STATES.DEFAULT,
      message: null
    }
  },
  computed: {
    allDays() {
      let days = 31
      if(parseInt(this.birth.month) === 2) {
        days = parseInt(this.birth.year) % 4 === 0 ? 29 : 28
      } else if([4, 6, 9, 11].includes(parseInt(this.birth.month))) {
        days = 30
      }
      return integerRange(1, days)
    },
    allCities() {
      return administrativeDivision.cities
    },
    allDistricts() {
      let city = administrativeDivision.districts.find(city => city.city_name === this.voter.city)
      if(city) {
        return city.districts
      }
    },
    allNeighborhoods() {
      let city = administrativeDivision.neighborhoods.find(city => city.city_name === this.voter.city)
      if(city) {
        let district = city.districts.find(district => district.district_name === this.voter.district)
        if(district) {
          return district.neighborhoods
        }
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
