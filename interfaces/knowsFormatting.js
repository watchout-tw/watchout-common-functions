import * as util from 'watchout-common-functions/lib/util'

export default {
  methods: {
    getDateString(d) {
      return util.formatter.date(d)
    },
    getDateTimeString(d) {
      return util.formatter.datetime(d)
    },
    getDateTimeStringForFile(d) {
      return util.formatter.datetimeForFile(d)
    }
  }
}
