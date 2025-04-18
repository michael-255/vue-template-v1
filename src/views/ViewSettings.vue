<script setup lang="ts">
import { appTitle } from '@/shared/constants'
import { settingsIcon } from '@/shared/icons'
import { useMeta } from 'quasar'
import { ref, type Ref } from 'vue'

useMeta({ title: `${appTitle} - Settings` })

const test: Ref<string> = ref('')
</script>

<template>
  <q-list padding>
    <q-item-label header>
      <q-icon class="on-left" size="sm" :name="settingsIcon" />
      Account
    </q-item-label>

    <q-item>
      <q-item-section top>
        <q-item-label>Email</q-item-label>
        <q-item-label>
          <q-input v-model="test" type="text" dense outlined color="primary" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section top>
        <q-item-label>Password</q-item-label>
        <q-item-label>
          <q-input v-model="test" type="password" dense outlined color="primary" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>

  <q-separator />

  <p v-for="i in 25" :key="i">
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic nihil pariatur doloremque ab,
    perferendis aperiam unde odit minus sed earum, incidunt, atque ullam vel animi necessitatibus
    consequatur dolores! Ducimus, quam.
  </p>
</template>
