import { type SupabaseClient, type User, createClient } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { useSettingsStore } from './settings'

export const useBackendStore = defineStore('backend', {
  state: () => ({
    supabase: null as SupabaseClient | null,
    user: null as User | null,
  }),

  actions: {
    /**
     * Ensures that the Supabase client is initialized and returns it.
     */
    getSupabase() {
      // Return existing Supabase client if found
      if (this.supabase) {
        return this.supabase
      }

      const settingsStore = useSettingsStore()

      if (!settingsStore.projectUrl || !settingsStore.projectApiKey) {
        throw new Error('Supabase project settings are not set')
      }

      // Initialize the Supabase client
      try {
        this.supabase = createClient(settingsStore.projectUrl, settingsStore.projectApiKey)
        return this.supabase
      } catch (error) {
        throw error
      }
    },

    /**
     * Login with email and password.
     */
    async login(email: string, password: string) {
      const client = this.getSupabase()

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      this.user = data?.user ?? null
    },

    /**
     * Logout the user and clear the auth token.
     */
    async logout() {
      const client = this.getSupabase()

      const { error } = await client.auth.signOut()

      if (error) {
        throw error
      }

      this.user = null
    },
  },

  getters: {
    isAuthenticated: (state) => {
      return !!state.user?.id && !!state.user?.email
    },
  },
})
