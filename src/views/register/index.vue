<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { registerApi } from '@/api/auth'
import { ApiError } from '@/api/request'
import type { LoginForm, LoginPayload } from '@/types/login'

const router: Router = useRouter()

const form = reactive<LoginForm>({
  username: '',
  password: '',
  remember: false,
})

const loading = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const errorMessage = ref<string>('')

const isFormValid = (data: LoginForm): boolean => {
  return Boolean(data.username.trim().length >= 3 && data.password.length >= 6)
}

const buildPayload = (data: LoginForm): LoginPayload => ({
  username: data.username.trim(),
  password: data.password,
})

const togglePasswordVisibility = (): void => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async (): Promise<void> => {
  if (!isFormValid(form)) {
    errorMessage.value = '用户名至少 3 位，密码至少 6 位'
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    await registerApi(buildPayload(form))
    await router.push('/home')
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const goLogin = async (): Promise<void> => {
  await router.push('/login')
}
</script>

<template>
  <div class="login-page">
    <div class="login-bg" aria-hidden="true">
      <div class="login-bg__orb login-bg__orb--1" />
      <div class="login-bg__orb login-bg__orb--2" />
    </div>

    <main class="login-card">
      <header class="login-header">
        <div class="login-logo">V</div>
        <h1 class="login-title">创建账户</h1>
        <p class="login-subtitle">注册后即可登录使用</p>
      </header>

      <form class="login-form" @submit.prevent="handleSubmit">
        <label class="field">
          <span class="field__label">用户名</span>
          <input
            v-model="form.username"
            class="field__input"
            type="text"
            placeholder="至少 3 个字符"
            autocomplete="username"
            required
          />
        </label>

        <label class="field">
          <span class="field__label">密码</span>
          <div class="field__password">
            <input
              v-model="form.password"
              class="field__input"
              :type="showPassword ? 'text' : 'password'"
              placeholder="至少 6 个字符"
              autocomplete="new-password"
              required
            />
            <button
              type="button"
              class="field__toggle"
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
              @click="togglePasswordVisibility"
            >
              <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path d="M3 3l18 18M10.5 10.5a3 3 0 0 0 4.24 4.24" />
                <path d="M6.7 6.7C4.6 8.2 3 10.5 2 12c2.5 4 6.5 7 10 7 1.5 0 2.9-.4 4.2-1.1M9.9 5.1A9.7 9.7 0 0 1 12 5c3.5 0 7.5 3 10 7-.8 1.3-1.9 2.5-3.1 3.5" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </label>

        <div v-if="errorMessage" class="login-error" role="alert">
          {{ errorMessage }}
        </div>

        <button class="login-btn" type="submit" :disabled="loading">
          <span v-if="loading" class="login-btn__spinner" />
          {{ loading ? '注册中…' : '注 册' }}
        </button>
      </form>

      <footer class="login-footer">
        <span>已有账户？</span>
        <a href="#" class="login-link" @click.prevent="goLogin">返回登录</a>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  height: 100dvh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.login-bg__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
}

.login-bg__orb--1 {
  width: 420px;
  height: 420px;
  top: -120px;
  right: -80px;
  background: var(--accent);
}

.login-bg__orb--2 {
  width: 320px;
  height: 320px;
  bottom: -100px;
  left: -60px;
  background: var(--accent-border);
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 40px 36px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  color: var(--accent);
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: 14px;
}

.login-title {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin: 0 0 8px;
  color: var(--text-h);
}

.login-subtitle {
  font-size: 14px;
  color: var(--text);
  opacity: 0.85;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-h);
}

.field__input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  font-size: 15px;
  font-family: inherit;
  color: var(--text-h);
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.field__input::placeholder {
  color: var(--text);
  opacity: 0.5;
}

.field__input:focus {
  border-color: var(--accent-border);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.field__password {
  position: relative;
}

.field__password .field__input {
  padding-right: 44px;
}

.field__toggle {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}

.field__toggle:hover {
  color: var(--text-h);
  background: var(--accent-bg);
}

.field__toggle svg {
  width: 18px;
  height: 18px;
}

.login-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.login-link:hover {
  opacity: 0.75;
}

.login-error {
  padding: 10px 12px;
  font-size: 13px;
  color: #b42318;
  background: #fef3f2;
  border: 1px solid #fecdca;
  border-radius: 10px;
}

.login-btn {
  height: 46px;
  margin-top: 4px;
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
  letter-spacing: 2px;
  color: #fff;
  background: var(--accent);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s, transform 0.15s;
}

.login-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  margin-top: 28px;
  text-align: center;
  font-size: 14px;
  color: var(--text);
}

.login-footer .login-link {
  margin-left: 4px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
    border-radius: 16px;
  }

  .login-title {
    font-size: 22px;
  }
}
</style>
