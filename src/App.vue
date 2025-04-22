<script setup lang="ts">
import { colors, useMeta, useQuasar } from 'quasar'
import { onMounted, onUnmounted } from 'vue'
import DialogLogin from './components/dialogs/DialogLogin.vue'
import useLogger from './composables/useLogger'
import { localDatabase } from './services/local-database'
import { appDescription, appTitle } from './shared/constants'
import { errorIcon } from './shared/icons'
import { useBackendStore } from './stores/backend'
import { useSettingsStore } from './stores/settings'

/**
 * Do NOT overwrite these specific properties in another useMeta call
 */
useMeta({
  title: appTitle,
  meta: {
    description: { name: 'description', content: appDescription },
    charset: { charset: 'UTF-8' },
    viewport: {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    },
    // Color values MUST match the manifest
    themeColor: {
      name: 'theme-color',
      content: `${colors.getPaletteColor('primary')}`,
    },
    backgroundColor: {
      name: 'background-color',
      content: `${colors.getPaletteColor('black')}`,
    },
  },
  link: {
    manifest: {
      rel: 'manifest',
      href: `${import.meta.env.BASE_URL}site.webmanifest`,
    },
    appleTouchIcon: {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: `${import.meta.env.BASE_URL}apple-touch-icon.png`,
    },
    favicon96: {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      href: `${import.meta.env.BASE_URL}favicon-96x96.png`,
    },
  },
  noscript: {
    default:
      'Your browser does not support JavaScript or has it disabled. Please enable JavaScript in your web browser settings or white-list our domain in your JavaScript blocker for the best experience.',
  },
})

const notify = useQuasar().notify
const { log } = useLogger()
const settingsStore = useSettingsStore()
const backendStore = useBackendStore()

// Loading live Settings into the store on startup for use throughout the app.
const subscription = localDatabase.liveSettings().subscribe({
  next: (records) => (settingsStore.settings = records),
  error: (error) => log.error('Error loading live Settings', error as Error),
})

onMounted(async () => {
  // Initializes the local database settings
  try {
    await localDatabase.initializeSettings()
  } catch (error) {
    // Output the error and notify user since it could be a database or logger failure
    notify({
      message: 'Error initializing settings',
      icon: errorIcon,
      color: 'negative',
    })
    console.error(error)
  }

  // Delete expired logs
  try {
    const logsDeleted = await localDatabase.deleteExpiredLogs()
    log.silentDebug('Expired logs deleted', { logsDeleted })
  } catch (error) {
    log.error('Error deleting expired logs', error as Error)
  }

  // Initialize Auth
  try {
    const client = backendStore.getSupabase()

    const { data: sessionData } = await client.auth.getSession()

    // If there's an active session, get the user from the session
    if (sessionData?.session?.user) {
      backendStore.user = sessionData.session.user
    } else {
      backendStore.user = null
    }

    client.auth.onAuthStateChange((_event, session) => {
      log.info('Auth state changed', { event: _event })
      backendStore.user = session?.user ?? null
    })
  } catch (error) {
    log.error('Auth Error', error as Error)
  }
})

onUnmounted(() => {
  subscription.unsubscribe()
})
</script>

<template>
  <DialogLogin />
  <RouterView />
</template>
