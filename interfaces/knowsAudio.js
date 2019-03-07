export default {
  methods: {
    playAudio(el) {
      el.currentTime = 0.0
      el.volume = 1.0
      el.play()
    },
    fadeOutAudio(el, callback) {
      let volume = el.volume
      let timer = setInterval(function() {
        volume = (parseFloat(volume) - 0.1).toFixed(1)
        if(volume >= 0) {
          el.volume = volume
        } else {
          el.pause()
          clearInterval(timer)
          callback()
        }
      }, 50)
    }
  }
}
