<template>
<div class="modal auth">
  <div class="actions" v-if="true">
    <div class="action join">
      <div class="title" @click.stop.prevent="showJoin">
        <h2>成為草民</h2>
      </div>
      <div class="content" v-if="joinOrLogin === 'join'">
        <form>
          <div class="field">
            <input type="text" name="id" placeholder="草民代號" v-model="credentials.join.handle" />
            <button class="button small park" @click.prevent="generateHandle">隨機</button>
          </div>
          <div class="font-size-smaller text-color-nice-grey">草民代號是你在沃草共有地的身份識別，無法更改，請謹慎選擇。你可以使用A-Z、a-z（大小寫不同）、0-9、底線（_）以及連字號（-）。</div>
          <div class="field">
            <input type="email" name="email" placeholder="Email" v-model="credentials.join.email" />
          </div>
          <div class="field">
            <input type="password" name="password" placeholder="密碼" v-model="credentials.join.password" />
          </div>
          <div class="field">
            <label class="form-field-check-label"><input type="checkbox" class="park" v-model="credentials.join.iAgree"><span>我同意使用條款</span></label>
          </div>
          <div class="field">
            <button class="button park" @click.prevent="join">註冊</button>
          </div>
        </form>
      </div>
    </div>
    <div class="action login">
      <div class="title" @click.stop.prevent="showLogin">
        <h2>草民登入</h2>
      </div>
      <div class="content" v-if="joinOrLogin === 'login'">
        <form>
          <div class="field">
            <input type="text" name="account" placeholder="草民代號或Email" v-model="credentials.login.account" />
          </div>
          <div class="field">
            <input type="password" name="password" placeholder="密碼" v-model="credentials.login.password" />
          </div>
          <div class="field">
            <button class="button park" @click.prevent="login">登入</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="reactions" v-else>
    <div v-if="verificationEmailSent" class="paragraphs tight">
      <p>請收信，並按照信件中的步驟啟動認證流程</p>
    </div>
    <div v-if="loginSuccessful" class="paragraphs tight">
      <p>歡迎回到沃草共有地</p>
    </div>
    <div v-if="requireEmailVerification">
      <p>你的Email尚未通過認證</p>
      <button class="button park" @click.prevent="requestEmailVerification">重發認證信</button>
    </div>
  </div>
</div>
</template>

<script>
import { knowsWindowManagement } from '../../interfaces'

const nameGenerator = require('project-name-generator')

export default {
  mixins: [knowsWindowManagement],
  data() {
    return {
      credentials: {
        join: {
          handle: null,
          email: null,
          password: null,
          iAgree: false
        },
        login: {
          account: null,
          password: null
        }
      }
    }
  },
  methods: {
    join() {
    },
    login() {
    },
    generateHandle() {
      this.credentials.join.handle = nameGenerator({ words: Math.ceil(Math.random() * 2) + 1 }).raw.join('_')
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.auth {
  width: 18rem;
  background-color: $color-park-light;
  @include shadow;
  > .actions {
    > .action {
      padding: 1rem;
      > .title {
        cursor: pointer;
      }
      > .content {
        > form {
          > .field {
            margin: 0.25rem 0;
          }
        }
      }
    }
  }
}
</style>
