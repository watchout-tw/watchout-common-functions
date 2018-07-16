import * as util from 'watchout-common-functions/lib/util'

export default {
  methods: {
    getDateString(d) {
      return util.formatter.date(this.date)
    }
  }
}
