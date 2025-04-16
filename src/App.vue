<script setup lang="ts">
import { colors, useMeta } from 'quasar'
import { appDescription, appTitle } from './shared/constants'

/**
 * Do NOT overwrite these specific properties in another useMeta call.
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
    // Color values need to match whats in the public manifest
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
</script>

<template>
  <RouterView />
</template>
