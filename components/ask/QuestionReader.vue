<template>
<div class="question-reader" :class="containerClasses">
  <div class="signature" :class="fullWidthSubcontainerClasses">
    <cover-image :url="question.image" :label="topicTitle" :secondary-label="question.data.keyword" type="topic" width="4" />
    <div class="text tcl-left-right-margin">
      <component :is="isFull ? 'h1' : 'h2'" class="title" :class="isFull ? 'medium' : ''">
        <nuxt-link class="a-text" :to="linkToSelf">{{ question.title }}</nuxt-link>
      </component>
      <div class="excerpt" v-if="isCompact">
        <span>{{ excerpt }}</span>
        <nuxt-link class="read-more a-text font-size-small" :to="linkToSelf">繼續閱讀</nuxt-link>
      </div>
      <authorship v-if="!isFull" :persona="question.persona" :parties="parties" :date="question.push.startDate" />
    </div>
    <share-button :classes="['top-right']" :url="shareURL" />
  </div>
  <div class="status" :class="subcontainerClasses" v-if="!isPreview">
    <div class="progress push-count">
      <div class="description font-size-tiny" v-if="pushCount < pushThreshold">
        <span>連署</span>
        <span class="latin-within-han">{{ pushCount }}</span>
        <span>､尚須</span>
        <span class="latin-within-han">{{ pushThreshold - pushCount < 0 ? 0 : pushThreshold - pushCount }}</span>
      </div>
      <div class="description font-size-tiny" v-else>
        <span>連署</span>
        <span class="latin-within-han first">{{ pushCount }}</span>
        <span>､門檻已過</span>
      </div>
      <progress-bar :p="pushCount" :q="pushThreshold" />
    </div>
    <div class="progress push-duration" v-if="pushCount < pushThreshold && pushable">
      <div class="description font-size-tiny">
        <span class="latin-within-han first">{{ pushDuration - pushElapsedDuration }}</span>
        <span>天後截止</span>
      </div>
      <progress-bar :p="pushElapsedDuration" :q="pushDuration" />
    </div>
    <submit-button :classes="pushClasses" v-if="pushable" :label="pushText" :state.sync="pushButton.state" :message.sync="pushButton.message" @click.native="push(question.id)" @success="onPushSuccess" />
  </div>
  <div class="detail" :class="subcontainerClasses" v-if="isFull">
    <div class="content paragraphs first" v-html="minimalMarkdown(question.content)"></div>
    <authorship :persona="question.persona" :parties="parties" :date="question.push.startDate" />
  </div>
  <div class="references-container" :class="subcontainerClasses" v-if="isFull">
    <div class="section-title with-underline small">
      <span>參考資料</span>
    </div>
    <div v-if="question.references.length < 1" class="not-available">沒有參考資料</div>
    <ul class="bulleted-list references">
      <li class="reference" v-for="reference of question.references">
        <div class="title">
          <template v-if="reference.url">
            <a class="a-text" :href="reference.url" target="_blank">{{ reference.title }}</a>
          </template>
          <template v-else>{{ reference.title }}</template>
        </div>
        <div v-if="reference.description" class="font-size-small">{{ reference.description }}</div>
      </li>
    </ul>
  </div>
  <div class="assigned-personas-container" :class="subcontainerClasses" v-if="isFull">
    <div class="section-title with-underline small">
      <span>指定回答者</span>
    </div>
    <div class="personas">
      <div class="persona" v-for="player of game.players">
        <input type="checkbox" class="assigned ask" :checked="personaIsAssigned(player.persona.id)" disabled />
        <avatar :show="['avatar', 'name']" :persona="player.persona" :link="true" :classes="['horizontal', 'shadow']" :parties="parties" />
      </div>
    </div>
  </div>
  <div :class="subcontainerClasses"><!-- filler --></div>
</div>
</template>

<script>
import * as core from 'watchout-common-functions/lib/core'
import * as STATES from 'watchout-common-functions/lib/states'
import * as util from 'watchout-common-functions/lib/util'
import { knowsAuth, knowsError, knowsMarkdown, knowsWatchout, knowsWindowManagement } from 'watchout-common-functions/interfaces'
import CoverImage from 'watchout-common-functions/components/CoverImage'
import Authorship from 'watchout-common-functions/components/ask/Authorship'
import Avatar from 'watchout-common-functions/components/Avatar'
import ShareButton from 'watchout-common-functions/components/button/Share'
import SubmitButton from 'watchout-common-functions/components/button/Submit'
import Quiero from 'watchout-common-functions/components/ask/Quiero'
import ProgressBar from 'watchout-common-functions/components/ProgressBar'

export default {
  mixins: [knowsAuth, knowsError, knowsMarkdown, knowsWatchout, knowsWindowManagement],
  props: ['game', 'question', 'pushCount', 'topics', 'mode', 'pushable', 'preview', 'parties'],
  data() {
    return {
      currentTime: util.formatter.date(new Date()),
      pushButton: {
        state: STATES.DEFAULT,
        message: null
      }
    }
  },
  computed: {
    isCompact() {
      return this.mode === 'compact'
    },
    isFull() {
      return this.mode === 'full'
    },
    isPreview() {
      return this.preview
    },
    questionStartDate() {
      return util.formatter.date(this.question.push.startDate)
    },
    questionEndDate() {
      return util.formatter.date(util.getQuestionEndDate(this.question))
    },
    pushDuration() {
      let startDate = new Date(this.questionStartDate)
      let endDate = new Date(this.questionEndDate)
      return Math.floor((endDate - startDate) / 24 / 60 / 60 / 1000)
    },
    pushElapsedDuration() {
      let startDate = new Date(this.questionStartDate)
      let now = new Date()
      return Math.floor((now - startDate) / 24 / 60 / 60 / 1000)
    },
    pushThreshold() {
      return this.question.data.threshold ? this.question.data.threshold : 0
    },
    containerClasses() {
      var classes = []
      if(this.isCompact) {
        classes = ['tcl-panel', 'compact']
      } else if(this.isFull) {
        classes = ['tcl-container', 'full']
      }
      return classes
    },
    fullWidthSubcontainerClasses() {
      return this.isFull ? ['tcl-panel'] : []
    },
    subcontainerClasses() {
      return this.isFull ? ['tcl-panel', 'tcl-left-right-margin'] : ['tcl-left-right-margin']
    },
    linkToSelf() {
      return {
        name: 'games-gameSlug-questions-id',
        params: {
          gameSlug: this.question.game.slug,
          id: this.question.id
        }
      }
    },
    titleTag() {
      return this.isFull ? 'h1' : 'h3'
    },
    excerpt() {
      return this.question.content ? this.question.content.substr(0, 50) + '⋯' : ''
    },
    pushClasses() {
      return util.getPushButtonClasses(this.question)
    },
    pushText() {
      return util.getPushButtonText(this.question)
    },
    topicTitle() {
      if(this.topics && this.question) {
        let topic = this.topics.find(topic => topic.id === this.question.topic)
        if(topic) {
          return topic.title
        }
      }
    },
    shareURL() {
      return this.game && this.question ? this.getAskQuestionURL(this.game.slug, this.question.id) : null
    }
  },
  beforeMount() {
    if(!this.isPreview) {
      this.clientSideReload()
    }
  },
  watch: {
    'isCitizen'() {
      this.clientSideReload()
    }
  },
  methods: {
    personaIsAssigned(id) {
      return this.question.assigned_personas.find(persona => persona.id === id)
    },
    push(id) {
      if(!this.isCitizen) {
        this.addModal({ id: 'auth', joinOrLogin: 'login' })
      } else if(!this.activePersonaIsWithInfo) {
        this.addModal('private-info-registration')
      } else if(!util.questionIsPushedByMe(this.question) && !util.questionIsOverdue(this.question)) {
        this.pushButton.state = STATES.LOADING
        core.pushQuestion(id).then(response => {
          this.pushButton.state = STATES.SUCCESS
          this.pushButton.message = '已連署'
          this.pushed(response.data)
        }).catch(error => {
          this.pushButton.state = STATES.FAILED
          this.pushButton.message = '連署失敗'
          this.handleError(error)
        })
      }
    },
    onPushSuccess() {
      // TODO: pushQuestion callback & pushButton reset - which one finishes first?
    },
    pushed(pushedQuestion) {
      this.clientSideUpdate(pushedQuestion)
      this.$emit('pushed')
    },
    clientSideReload() {
      core.getQuestion(this.question.id).then(responses => {
        this.clientSideUpdate(responses.data)
      })
    },
    clientSideUpdate(question) {
      this.$emit('update:personaSpeeches', question.persona_speeches)
      this.$emit('update:pushCount', question.push.count)
    }
  },
  components: {
    Avatar,
    Authorship,
    CoverImage,
    Quiero,
    ShareButton,
    SubmitButton,
    ProgressBar
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.question-reader {
  position: relative;
  > .signature {
    > .cover {
      @include rect(5/1);
      background-size: 100%;
      background-position: center center;
    }
    > .text {
      > .title {
        margin: 0.25rem 0;
      }
      > .excerpt {
        > .read-more {
          margin: 0 0.25rem;
        }
      }
    }
  }
  &.compact {
    > .signature {
      margin-bottom: 1rem;
    }
  }
  > .status {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 0.25rem;
    margin-bottom: 1rem;
    > .progress {
      flex-grow: 1;
      margin-right: 0.5rem;
      > .description {
      }
    }
  }
  > .references-container {
    > .section-title {
      margin: 1em 0 0.5rem;
    }
  }
  > .assigned-personas-container {
    > .section-title {
      margin: 1em 0 0.5rem;
    }
    > .personas {
      > .persona {
        display: flex;
        align-items: center;
        > .assigned {
          margin-right: 0.5rem;
        }
        > .name {
          margin-left: 0.5rem;
        }
      }
    }
  }
}
</style>
