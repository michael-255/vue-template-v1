<script setup lang="ts">
import { appTitle } from '@/shared/constants'
import { ref } from 'vue'

const showLoginDialog = ref(true)
const text = ref('')

async function onCloseLoginDialog() {
  showLoginDialog.value = false
}
</script>

<template>
  <q-dialog v-model="showLoginDialog" persistent v-on:keyup.enter="onCloseLoginDialog()">
    <q-card flat bordered class="auth-dialog-width">
      <q-card-section class="text-h6"> {{ appTitle }} </q-card-section>

      <q-card-section>
        <q-input outlined v-model="text" label="Project URL" />
      </q-card-section>

      <q-card-section>
        <q-input outlined v-model="text" label="Project Anon API Key" />
      </q-card-section>

      <q-card-section>
        <q-input outlined v-model="text" label="Email" />
      </q-card-section>

      <q-card-section>
        <q-input outlined v-model="text" label="Password" />
      </q-card-section>

      <q-card-actions vertical class="q-mt-md">
        <q-btn no-caps color="primary" size="lg" label="Login" @click="onCloseLoginDialog()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.auth-dialog-width {
  width: 500px;
}
</style>
