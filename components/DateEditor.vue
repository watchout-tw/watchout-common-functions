<template>
<div class="date-editor form-field-many-inputs no-wrap tight">
  <drop-down-select v-model="year" :options="yearOptions" placeholder="年" class="small compact" />
  <drop-down-select v-model="month" :options="monthOptions" placeholder="月" class="small compact" />
  <drop-down-select v-model="day" :options="dayOptions()" placeholder="日" class="small compact" />
</div>
</template>

<script>
import * as util from 'watchout-common-functions/lib/util'
import DropDownSelect from 'watchout-common-functions/components/DropDownSelect'

const TYPES = {
  OBJ: 'object',
  FS: 'firestore',
  MYSQL: 'mysql',
  ISO: 'iso',
  STR: 'string'
}

const DEFAULT_DATE = '2016/5/15'

export default {
  props: ['value'],
  data() {
    let yearOptions = []
    for(let i = new Date().getFullYear(); i >= 1990; i--) {
      yearOptions.push(i)
    }
    let monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    return {
      yearOptions,
      monthOptions
    }
  },
  computed: {
    type() {
      let type = TYPES.OBJ
      if(this.value && util.isFsTS(this.value)) {
        type = TYPES.FS
      } else if(this.value && util.isMysqlTS(this.value)) {
        type = TYPES.MYSQL
      } else if(this.value && util.isIsoTS(this.value)) {
        type = TYPES.ISO
      } else if(this.value && typeof this.value === 'string' && !isNaN(new Date(this.value))) {
        type = TYPES.STR
      }
      return type
    },
    dateObj: {
      get() {
        let obj = this.value
        if(this.type === TYPES.FS) {
          obj = util.fsTSToDateObj(this.value)
        } else if(this.type === TYPES.MYSQL) {
          obj = util.mysqlTSToDateObj(this.value)
        } else if(this.type === TYPES.ISO) {
          obj = util.isoTSToDateObj(this.value)
        } else if(this.type === TYPES.STR) {
          obj = new Date(this.value)
        }
        return obj
      },
      set(newDateObj) {
        let newValue = newDateObj
        if(this.type === TYPES.ISO) {
          newValue = util.dateObjToIsoTS(newDateObj)
        } else if(this.type === TYPES.MYSQL) {
          newValue = util.dateObjToMysqlTS(newDateObj)
        } else if(this.type === TYPES.FS) {
          newValue = util.dateObjToFsTS(newDateObj)
        } else if(this.type === TYPES.STR) {
          newValue = util.formatter.datetime(newDateObj) // FIXME: placeholder solution for now
        }
        this.$emit('update:value', newValue)
      }
    },
    year: {
      get() {
        return this.dateObj ? this.dateObj.getFullYear() : null
      },
      set(newValue) {
        let newDate = new Date((this.dateObj ? this.dateObj : new Date(DEFAULT_DATE)).getTime())
        newDate.setYear(newValue)
        this.dateObj = newDate
      }
    },
    month: {
      get() {
        return this.dateObj ? this.dateObj.getMonth() + 1 : null
      },
      set(newValue) {
        let newDate = new Date((this.dateObj ? this.dateObj : new Date(DEFAULT_DATE)).getTime())
        newDate.setMonth(newValue - 1)
        this.dateObj = newDate
      }
    },
    day: {
      get() {
        return this.dateObj ? this.dateObj.getDate() : null
      },
      set(newValue) {
        let newDate = new Date((this.dateObj ? this.dateObj : new Date(DEFAULT_DATE)).getTime())
        newDate.setDate(newValue)
        this.dateObj = newDate
      }
    }
  },
  methods: {
    dayOptions() {
      let days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
      if(this.month === 2) {
        if((this.year % 4 === 0 && this.year % 100 !== 0) || (this.year % 400 === 0 && this.year % 3200 !== 0)) {
          days.splice(29) // 1-29
        } else {
          days.splice(28) // 1-28
        }
      } else if([4, 6, 9, 11].includes(this.month)) {
        days.splice(30) // 1-30
      }
      return days
    }
  },
  components: {
    DropDownSelect
  }
}
</script>
