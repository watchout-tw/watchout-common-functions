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
        <nuxt-link v-if="isCompact" class="read-more a-text font-size-small" :to="linkToSelf">繼續閱讀</nuxt-link>
      </div>
      <authorship v-if="!isFull" :avatar="question.persona.avatar" :name="question.persona.name" :link="getParkPersonaProfileURL(question.persona.id)" :date="question.push.startDate" />
    </div>
    <share-button :classes="['top-right']" :url="shareURL" />
  </div>
  <div class="status" :class="subcontainerClasses" v-if="!isPreview && pushable">
    <div class="status-description secondary-text">
      <div class="font-size-small"><span class="latin-within-han first">{{ pushCount }}</span>人已連署；還需要<span class="latin-within-han">{{ pushThreshold - pushCount < 0 ? 0 : pushThreshold - pushCount }}</span>人</div>
      <div class="font-size-small"><span class="latin-within-han first">{{ questionEndDate }}</span>截止</div>
    </div>
    <submit-button :classes="pushClasses" :label="pushText" :state.sync="pushButton.state" :message.sync="pushButton.message" @click.native="push(question.id)" @reset="onPushButtonReset" />
  </div>
  <div class="detail" :class="subcontainerClasses" v-if="isFull">
    <div class="content">{{ question.content }}</div>
    <authorship :avatar="question.persona.avatar" :name="question.persona.name" :link="getParkPersonaProfileURL(question.persona.id)" :date="question.push.startDate" />
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
        <avatar :avatar="player.persona.avatar" :classes="['shadow']" />
        <div class="name">{{ player.persona.id === 0 ? '所有參賽選手' : player.persona.name }}</div>
      </div>
    </div>
  </div>
  <div :class="subcontainerClasses"><!-- filler --></div>
</div>
</template>

<script>
import * as core from '../../lib/core'
import * as STATES from '../../lib/states'
import * as util from '../../lib/util'
import { knowsAuth, knowsError, knowsWatchout, knowsWindowManagement } from '../../interfaces'
import CoverImage from '../CoverImage'
import Authorship from './Authorship'
import Avatar from '../Avatar'
import ShareButton from '../button/Share'
import SubmitButton from '../button/Submit'
import Quiero from './Quiero'

export default {
  mixins: [knowsAuth, knowsError, knowsWatchout, knowsWindowManagement],
  props: ['game', 'question', 'pushCount', 'topics', 'mode', 'pushable', 'preview'],
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
        let topic = this.topics.find(topic => topic.id === this.question.topic_id)
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
  methods: {
    personaIsAssigned(id) {
      return this.question.assigned_personas.find(persona => persona.id === id)
    },
    push(id) {
      if(!this.isCitizen) {
        this.addModal({ id: 'auth', joinOrLogin: 'login' })
      } else if(!this.activePersonaIsWithInfo) {
        this.addModal('private-info-registration')
      } else if(!util.questionIsPushedByMe(this.question)) {
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
    onPushButtonReset() {
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
    Authorship,
    Avatar,
    CoverImage,
    Quiero,
    ShareButton,
    SubmitButton
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
