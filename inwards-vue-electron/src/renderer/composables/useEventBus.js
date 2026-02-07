/**
 * useEventBus Composable
 *
 * A Vue 3 composable for safely using the mitt event bus with automatic cleanup.
 * This solves the problem of event listeners accumulating when navigating between
 * components/routes without proper cleanup.
 *
 * Usage:
 * ```
 * import { useEventBus } from '@/composables/useEventBus'
 *
 * export default {
 *   setup() {
 *     const { on, emit, off } = useEventBus()
 *
 *     // Register listeners - they will be automatically removed on unmount
 *     on('stationSelectedFromMap', (payload) => {
 *       console.log('Station selected:', payload)
 *     })
 *
 *     // Emit events
 *     emit('refreshStations')
 *
 *     return { }
 *   }
 * }
 * ```
 */

import { onBeforeUnmount, getCurrentInstance } from 'vue'

/**
 * Creates an event bus interface with automatic cleanup on component unmount.
 *
 * @returns {Object} Event bus methods: on, emit, off, once
 */
export function useEventBus() {
  const instance = getCurrentInstance()

  if (!instance) {
    console.warn('useEventBus must be called within a setup function')
    return {
      on: () => {},
      emit: () => {},
      off: () => {},
      once: () => {}
    }
  }

  // Get the event bus from global properties
  const bus = instance.appContext.config.globalProperties.$bus

  if (!bus) {
    console.warn('Event bus ($bus) not found in global properties. Make sure mitt is configured in main.js')
    return {
      on: () => {},
      emit: () => {},
      off: () => {},
      once: () => {}
    }
  }

  // Track registered events for cleanup
  const registeredEvents = []

  /**
   * Register an event listener
   * The listener will be automatically removed when the component unmounts
   *
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  const on = (event, handler) => {
    bus.on(event, handler)
    registeredEvents.push({ event, handler })
  }

  /**
   * Emit an event with payload
   * Note: mitt only passes ONE argument, so use objects for multiple values
   *
   * @param {string} event - Event name
   * @param {*} payload - Event payload (use object for multiple values)
   */
  const emit = (event, payload) => {
    bus.emit(event, payload)
  }

  /**
   * Remove an event listener
   *
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function (must be same reference)
   */
  const off = (event, handler) => {
    bus.off(event, handler)
    // Remove from our tracking array
    const index = registeredEvents.findIndex(
      (e) => e.event === event && e.handler === handler
    )
    if (index > -1) {
      registeredEvents.splice(index, 1)
    }
  }

  /**
   * Register a one-time event listener
   * The listener will be called once and then automatically removed
   *
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  const once = (event, handler) => {
    const wrappedHandler = (payload) => {
      handler(payload)
      off(event, wrappedHandler)
    }
    on(event, wrappedHandler)
  }

  /**
   * Remove all registered event listeners
   * Called automatically on unmount, but can be called manually
   */
  const removeAllListeners = () => {
    registeredEvents.forEach(({ event, handler }) => {
      bus.off(event, handler)
    })
    registeredEvents.length = 0
  }

  // Automatically clean up all registered listeners when component unmounts
  onBeforeUnmount(() => {
    removeAllListeners()
  })

  return {
    on,
    emit,
    off,
    once,
    removeAllListeners
  }
}

/**
 * Create a scoped event name to avoid conflicts between different dashboards
 *
 * Usage:
 * ```
 * const { scopedEvent } = useScopedEvents('FishDashboard')
 * emit(scopedEvent('stationSelected'), { station: 'X1H001' })
 * // Emits: 'FishDashboard:stationSelected'
 * ```
 *
 * @param {string} scope - Scope prefix (e.g., component name or dashboard name)
 * @returns {Object} Functions for creating scoped event names
 */
export function useScopedEvents(scope) {
  /**
   * Create a scoped event name
   * @param {string} event - Base event name
   * @returns {string} Scoped event name
   */
  const scopedEvent = (event) => `${scope}:${event}`

  /**
   * Check if an event name belongs to this scope
   * @param {string} fullEventName - Full event name to check
   * @returns {boolean} True if event belongs to this scope
   */
  const isOwnEvent = (fullEventName) => fullEventName.startsWith(`${scope}:`)

  /**
   * Extract the base event name from a scoped event
   * @param {string} fullEventName - Full scoped event name
   * @returns {string|null} Base event name or null if not in scope
   */
  const getBaseEventName = (fullEventName) => {
    if (!isOwnEvent(fullEventName)) return null
    return fullEventName.slice(scope.length + 1)
  }

  return {
    scope,
    scopedEvent,
    isOwnEvent,
    getBaseEventName
  }
}

export default useEventBus
