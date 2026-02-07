import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = 'https://inwards.award.org.za/api/fishtrac'

export const useFishtracStore = defineStore('fishtrac', {
  state: () => ({
    activeTab: 'pulse',
    theme: localStorage.getItem('fishtrac-theme') || 'light',

    // Filter state
    selectedRiver: 'Sabie River',
    selectedFish: [],
    selectedProbe: null,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    isLive: false,

    // Reference data
    rivers: ['Crocodile River', 'Letaba River', 'Olifants River', 'Sabie River', 'uMngeni River'],
    fishList: [],
    probeList: [],
    records: [],

    // Pulse data
    pulseData: {
      activeFish: 0,
      activeProbes: 0,
      recentAlarms: 0,
      latestData: null,
      riverSummaries: []
    },
    sparklineData: {},

    // Tracker data
    fishPositions: [],
    probePositions: [],
    playback: {
      playing: false,
      speed: 1,
      currentDate: null
    },

    // Alarm data
    alarmHeatmapData: [],
    ewmaDetailData: [],
    alarmSummaryData: [],

    // Environment data
    envTimeseriesData: {},
    correlationData: [],
    dielPatternData: [],

    // Research data
    phdMultivariateData: [],
    phdBoxplotData: {},
    phdTaggingData: [],

    // Loading states
    loading: {
      pulse: false,
      tracker: false,
      alarms: false,
      environment: false,
      research: false,
      registry: false,
      export: false
    }
  }),

  getters: {
    activeFishList: (state) => state.fishList.filter(f => f.active),
    activeProbeList: (state) => state.probeList.filter(p => p.active),
    selectedFishNames: (state) => state.selectedFish.map(f => f.name || f),
    isDarkTheme: (state) => state.theme === 'dark',
    themeClass: (state) => state.theme === 'dark' ? 'theme-dark' : 'theme-light'
  },

  actions: {
    // ── Theme ────────────────────────────────────
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('fishtrac-theme', this.theme)
    },

    // ── Reference Data ─────────────────────────
    async fetchRivers() {
      try {
        const res = await axios.get(`${API_BASE}/rivers`)
        if (res.data && res.data.length) {
          this.rivers = res.data
          // Update selectedRiver if current selection isn't in the list
          if (!this.rivers.includes(this.selectedRiver)) {
            this.selectedRiver = this.rivers[0]
          }
        }
      } catch (e) {
        console.warn('Using default rivers list:', e.message)
      }
    },

    async fetchFishList(river) {
      try {
        const res = await axios.get(`${API_BASE}/fish_list`, { params: { river } })
        if (res.data && res.data.length) {
          // Ensure every fish has a display name
          this.fishList = res.data.map(f => ({
            ...f,
            name: f.name || f.project_fish_id || f.ciduid
          }))
        } else {
          this.fishList = this._dummyFishList()
        }
      } catch (e) {
        console.warn('Using dummy fish list:', e.message)
        this.fishList = this._dummyFishList()
      }
    },

    async fetchProbeList(river) {
      try {
        const res = await axios.get(`${API_BASE}/probe_list`, { params: { river } })
        if (res.data && res.data.length) {
          this.probeList = res.data.map(p => ({
            ...p,
            name: p.name || p.ciduid
          }))
        } else {
          this.probeList = this._dummyProbeList()
        }
      } catch (e) {
        console.warn('Using dummy probe list:', e.message)
        this.probeList = this._dummyProbeList()
      }
    },

    async fetchRecords(type) {
      this.loading.registry = true
      try {
        const params = { type: type || 'all' }
        const res = await axios.get(`${API_BASE}/records`, { params })
        if (res.data && res.data.length) {
          // Normalize fish_wq: API returns 'WQ' for probes, UI expects 'probe'
          this.records = res.data.map(r => ({
            ...r,
            fish_wq: r.fish_wq === 'WQ' ? 'probe' : r.fish_wq
          }))
        } else {
          this.records = this._dummyRecords()
        }
      } catch (e) {
        console.warn('Using dummy records:', e.message)
        this.records = this._dummyRecords()
      } finally {
        this.loading.registry = false
      }
    },

    // ── Pulse Tab ──────────────────────────────
    async fetchPulseData() {
      this.loading.pulse = true
      try {
        const res = await axios.get(`${API_BASE}/pulse_summary`)
        if (res.data && res.data.activeFish > 0) {
          this.pulseData = res.data
          // If riverSummaries is empty, keep the KPI cards but use dummy river data
          if (!this.pulseData.riverSummaries || !this.pulseData.riverSummaries.length) {
            this.pulseData.riverSummaries = this._dummyPulseData().riverSummaries
          }
        } else {
          this.pulseData = this._dummyPulseData()
        }
      } catch (e) {
        console.warn('Using dummy pulse data:', e.message)
        this.pulseData = this._dummyPulseData()
      } finally {
        this.loading.pulse = false
      }
    },

    async fetchSparklines(river, hours = 24) {
      try {
        const res = await axios.get(`${API_BASE}/sparklines`, { params: { river, hours } })
        if (res.data && Object.keys(res.data).length) {
          this.sparklineData = res.data
        } else {
          this.sparklineData = this._dummySparklines()
        }
      } catch (e) {
        this.sparklineData = this._dummySparklines()
      }
    },

    // ── Tracker Tab ────────────────────────────
    async fetchFishPositions(river, start, end) {
      this.loading.tracker = true
      try {
        const res = await axios.get(`${API_BASE}/fish_positions`, { params: { river, start, end } })
        if (res.data && res.data.length) {
          this.fishPositions = res.data.map(p => ({
            ...p,
            name: p.name || p.ciduid || 'Unknown'
          }))
        } else {
          this.fishPositions = this._dummyFishPositions()
        }
      } catch (e) {
        this.fishPositions = this._dummyFishPositions()
      } finally {
        this.loading.tracker = false
      }
    },

    async fetchProbePositions(river) {
      try {
        const res = await axios.get(`${API_BASE}/probe_positions`, { params: { river } })
        if (res.data && res.data.length) {
          this.probePositions = res.data.map(p => ({
            ...p,
            name: p.name || p.ciduid || 'Probe'
          }))
        } else {
          this.probePositions = this._dummyProbePositions()
        }
      } catch (e) {
        this.probePositions = this._dummyProbePositions()
      }
    },

    // ── Alarms Tab ─────────────────────────────
    async fetchAlarmHeatmap(fish, start, end) {
      this.loading.alarms = true
      try {
        const res = await axios.get(`${API_BASE}/alarm_heatmap`, { params: { fish, start, end } })
        if (res.data && res.data.length) {
          this.alarmHeatmapData = res.data
        } else {
          this.alarmHeatmapData = this._dummyAlarmHeatmap()
        }
      } catch (e) {
        this.alarmHeatmapData = this._dummyAlarmHeatmap()
      } finally {
        this.loading.alarms = false
      }
    },

    async fetchEwmaDetail(fish, start, end) {
      try {
        const res = await axios.get(`${API_BASE}/ewma_detail`, { params: { fish, start, end } })
        if (res.data && res.data.length) {
          this.ewmaDetailData = res.data
        } else {
          this.ewmaDetailData = this._dummyEwmaDetail()
        }
      } catch (e) {
        this.ewmaDetailData = this._dummyEwmaDetail()
      }
    },

    async fetchAlarmSummary(river) {
      try {
        const res = await axios.get(`${API_BASE}/alarm_summary`, { params: { river } })
        if (res.data && res.data.length) {
          this.alarmSummaryData = res.data
        } else {
          this.alarmSummaryData = this._dummyAlarmSummary()
        }
      } catch (e) {
        this.alarmSummaryData = this._dummyAlarmSummary()
      }
    },

    // ── Environment Tab ────────────────────────
    async fetchEnvTimeseries(fish, probe, start, end) {
      this.loading.environment = true
      try {
        const res = await axios.get(`${API_BASE}/env_timeseries`, { params: { fish, probe, start, end } })
        if (res.data && res.data.timestamps && res.data.timestamps.length) {
          this.envTimeseriesData = res.data
        } else {
          this.envTimeseriesData = this._dummyEnvTimeseries()
        }
      } catch (e) {
        this.envTimeseriesData = this._dummyEnvTimeseries()
      } finally {
        this.loading.environment = false
      }
    },

    async fetchCorrelation(fish, envParam, start, end) {
      try {
        const res = await axios.get(`${API_BASE}/correlation`, { params: { fish, env_param: envParam, start, end } })
        if (res.data && res.data.length) {
          this.correlationData = res.data
        } else {
          this.correlationData = this._dummyCorrelation()
        }
      } catch (e) {
        this.correlationData = this._dummyCorrelation()
      }
    },

    async fetchDielPattern(fish, river) {
      try {
        const res = await axios.get(`${API_BASE}/diel_pattern`, { params: { fish, river } })
        if (res.data && res.data.length) {
          this.dielPatternData = res.data
        } else {
          this.dielPatternData = this._dummyDielPattern()
        }
      } catch (e) {
        this.dielPatternData = this._dummyDielPattern()
      }
    },

    // ── Research Tab ───────────────────────────
    async fetchPhdMultivariate(fish) {
      this.loading.research = true
      try {
        const res = await axios.get(`${API_BASE}/phd_multivariate`, { params: { fish } })
        if (res.data && res.data.length) {
          this.phdMultivariateData = res.data
        } else {
          this.phdMultivariateData = this._dummyPhdMultivariate()
        }
      } catch (e) {
        this.phdMultivariateData = this._dummyPhdMultivariate()
      } finally {
        this.loading.research = false
      }
    },

    async fetchPhdBoxplot(groupBy, variable) {
      try {
        const res = await axios.get(`${API_BASE}/phd_boxplot`, { params: { group_by: groupBy, variable } })
        if (res.data && Object.keys(res.data).length) {
          this.phdBoxplotData = res.data
        } else {
          this.phdBoxplotData = this._dummyPhdBoxplot()
        }
      } catch (e) {
        this.phdBoxplotData = this._dummyPhdBoxplot()
      }
    },

    async fetchPhdTaggingResponse(fish) {
      try {
        const res = await axios.get(`${API_BASE}/phd_tagging_response`, { params: { fish } })
        if (res.data && res.data.length) {
          this.phdTaggingData = res.data
        } else {
          this.phdTaggingData = this._dummyPhdTagging()
        }
      } catch (e) {
        this.phdTaggingData = this._dummyPhdTagging()
      }
    },

    // ── Dummy Data Generators ──────────────────
    _dummyFishList() {
      return [
        { ciduid: '650:48', name: 'Tag48- 3 Musket', species: 'L. marequensis', sl_mm: 380, weight_g: 1200, active: true },
        { ciduid: '650:49', name: 'Tag49- Largemouth', species: 'S. intermedius', sl_mm: 420, weight_g: 1800, active: true },
        { ciduid: '650:51', name: 'Tag51- Yellowfish', species: 'L. natalensis', sl_mm: 450, weight_g: 2100, active: true },
        { ciduid: '455:90', name: 'Tag90- Patricia', species: 'L. natalensis', sl_mm: 505, weight_g: 2370, active: false }
      ]
    },

    _dummyProbeList() {
      return [
        { ciduid: '650:50', name: 'Tag50- LS Bridge', active: true },
        { ciduid: '650:53', name: 'Tag53- LS weir', active: true },
        { ciduid: '650:52', name: 'Tag52- Croc Probe', active: true }
      ]
    },

    _dummyRecords() {
      return [
        { project: 'SANParks Sabie', fish_wq: 'fish', cid: 650, uid: 48, ciduid: '650:48', project_fish_id: 'Tag48', active: 1, species: 'L. marequensis', sl_mm: 380, weight_g: 1200, x: -25.119, y: 31.915, river: 'Sabie River', nearest_location: 'Lower Sabie Weir', start: '2024-01-09', end: null, days_tracked: 180, no_data_points: 9444 },
        { project: 'SANParks Sabie', fish_wq: 'fish', cid: 650, uid: 49, ciduid: '650:49', project_fish_id: 'Tag49', active: 1, species: 'S. intermedius', sl_mm: 420, weight_g: 1800, x: -25.112, y: 31.920, river: 'Sabie River', nearest_location: 'Lower Sabie Bridge', start: '2024-01-15', end: null, days_tracked: 145, no_data_points: 6200 },
        { project: 'SANParks Sabie', fish_wq: 'probe', cid: 650, uid: 53, ciduid: '650:53', project_fish_id: 'Tag53', active: 1, species: null, sl_mm: null, weight_g: null, x: -25.125, y: 31.910, river: 'Sabie River', nearest_location: 'LS weir', start: '2024-01-05', end: null, days_tracked: 200, no_data_points: 43797 },
        { project: 'Umgeni Water', fish_wq: 'fish', cid: 455, uid: 90, ciduid: '455:90', project_fish_id: 'Tag90', active: 0, species: 'L. natalensis', sl_mm: 505, weight_g: 2370, x: -29.48, y: 29.44, river: 'uMngeni River', nearest_location: 'Albert Falls Dam', start: '2022-11-01', end: '2023-05-01', days_tracked: 181, no_data_points: 64 }
      ]
    },

    _dummyPulseData() {
      return {
        activeFish: 3,
        activeProbes: 3,
        recentAlarms: 12,
        latestData: '2024-03-21 14:00:00',
        riverSummaries: [
          { river: 'Sabie River', fish_count: 2, avg_apm: 78.4, alarm_count: 8, latest_reading: '2024-03-21 14:00:00', temperature: 22.3, conductivity: 68.5, depth: 1.15, discharge: 28.7 },
          { river: 'Crocodile River', fish_count: 1, avg_apm: 45.2, alarm_count: 3, latest_reading: '2024-03-21 13:00:00', temperature: 20.1, conductivity: 142.3, depth: 0.85, discharge: 12.4 },
          { river: 'uMngeni River', fish_count: 0, avg_apm: 0, alarm_count: 0, latest_reading: '2023-05-01 08:00:00', temperature: 17.8, conductivity: 95.1, depth: 2.1, discharge: 45.6 }
        ]
      }
    },

    _dummySparklines() {
      const result = {}
      const names = ['Tag48- 3 Musket', 'Tag49- Largemouth', 'Tag51- Yellowfish']
      names.forEach(name => {
        const values = []
        for (let h = 0; h < 24; h++) {
          const base = 40 + Math.random() * 30
          const spike = Math.random() > 0.9 ? Math.random() * 300 : 0
          values.push({ hour: h, apm: Math.round(base + spike) })
        }
        result[name] = values
      })
      return result
    },

    _dummyFishPositions() {
      const positions = []
      const baseLat = -25.119
      const baseLng = 31.915
      const names = ['Tag48- 3 Musket', 'Tag49- Largemouth']
      const startDate = new Date('2024-02-22')

      names.forEach(name => {
        let lat = baseLat + (Math.random() - 0.5) * 0.01
        let lng = baseLng + (Math.random() - 0.5) * 0.01
        for (let d = 0; d < 30; d++) {
          for (let h = 0; h < 24; h += 3) {
            const date = new Date(startDate)
            date.setDate(date.getDate() + d)
            date.setHours(h)
            lat += (Math.random() - 0.5) * 0.002
            lng += (Math.random() - 0.5) * 0.002
            positions.push({
              name,
              date_h_rounded: date.toISOString().replace('T', ' ').substring(0, 19),
              lat, lng,
              activity_per_minute: Math.round(Math.random() * 200 + 20),
              temp_fish: Math.round((20 + Math.random() * 5) * 10) / 10
            })
          }
        }
      })
      return positions
    },

    _dummyProbePositions() {
      return [
        { name: 'Tag50- LS Bridge', lat: -25.105, lng: 31.940, temp_probe: 21.5, conductivity_us_cm: 72.3, pressure_mbar: 1108.5, water_depth: 1.15, discharge: 28.7 },
        { name: 'Tag53- LS weir', lat: -25.125, lng: 31.910, temp_probe: 22.1, conductivity_us_cm: 68.1, pressure_mbar: 1106.2, water_depth: 0.95, discharge: 24.3 },
        { name: 'Tag52- Croc Probe', lat: -25.150, lng: 31.920, temp_probe: 20.8, conductivity_us_cm: 145.7, pressure_mbar: 1112.1, water_depth: 0.82, discharge: 11.8 }
      ]
    },

    _dummyAlarmHeatmap() {
      const data = []
      const startDate = new Date('2024-02-01')
      for (let d = 0; d < 50; d++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + d)
        const dateStr = date.toISOString().split('T')[0]
        for (let h = 0; h < 24; h++) {
          const r = Math.random()
          let code = 0
          if (r > 0.92) code = 3
          else if (r > 0.88) code = 2
          else if (r > 0.82) code = 1
          else if (r > 0.78) code = -1
          else if (r > 0.75) code = -2
          else if (r > 0.73) code = -3
          data.push({ date_val: dateStr, hour: h, alarm_class_code: code })
        }
      }
      return data
    },

    _dummyEwmaDetail() {
      const data = []
      const startDate = new Date('2024-02-01')
      let ewma = 50
      for (let d = 0; d < 60; d++) {
        for (let h = 0; h < 24; h += 1) {
          const date = new Date(startDate)
          date.setDate(date.getDate() + d)
          date.setHours(h)
          const apm = Math.max(0, 50 + Math.random() * 80 - 30 + (Math.random() > 0.92 ? 300 : 0))
          ewma = ewma * 0.95 + apm * 0.05
          const upper = ewma + 45
          const lower = Math.max(0, ewma - 35)
          let code = 0
          if (apm > upper + 40) code = 3
          else if (apm > upper + 15) code = 2
          else if (apm > upper) code = 1
          else if (apm < lower - 20) code = -3
          else if (apm < lower - 10) code = -2
          else if (apm < lower) code = -1

          data.push({
            date_h_rounded: date.toISOString().replace('T', ' ').substring(0, 19),
            apm: Math.round(apm * 10) / 10,
            ewma: Math.round(ewma * 10) / 10,
            upper_bound: Math.round(upper * 10) / 10,
            lower_bound: Math.round(lower * 10) / 10,
            alarm_class_code: code,
            alarm_trigger: Math.abs(code) >= 2 ? 1 : 0
          })
        }
      }
      return data
    },

    _dummyAlarmSummary() {
      return [
        { name: 'Tag48- 3 Musket', total_points: 2800, alarm_count: 340, alarm_pct: 12.1, most_common_alarm: 'high_increased', max_alarm_code: 3, min_alarm_code: -2 },
        { name: 'Tag49- Largemouth', total_points: 2100, alarm_count: 180, alarm_pct: 8.6, most_common_alarm: 'low_increase', max_alarm_code: 2, min_alarm_code: -3 },
        { name: 'Tag51- Yellowfish', total_points: 1500, alarm_count: 95, alarm_pct: 6.3, most_common_alarm: 'expected activity', max_alarm_code: 1, min_alarm_code: -1 }
      ]
    },

    _dummyEnvTimeseries() {
      const data = { timestamps: [], apm: [], temp_fish: [], temp_probe: [], conductivity: [], pressure: [], depth: [], discharge: [], alarm_code: [] }
      const startDate = new Date('2024-02-22')
      for (let d = 0; d < 30; d++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + d)
        data.timestamps.push(date.toISOString().split('T')[0])
        data.apm.push(Math.round(Math.random() * 150 + 30))
        data.temp_fish.push(Math.round((20 + Math.random() * 5 + Math.sin(d / 7) * 2) * 10) / 10)
        data.temp_probe.push(Math.round((19 + Math.random() * 5 + Math.sin(d / 7) * 2) * 10) / 10)
        data.conductivity.push(Math.round((60 + Math.random() * 40) * 10) / 10)
        data.pressure.push(Math.round((1100 + Math.random() * 20) * 10) / 10)
        data.depth.push(Math.round((0.8 + Math.random() * 0.6 + Math.sin(d / 5) * 0.2) * 100) / 100)
        data.discharge.push(Math.round((15 + Math.random() * 30 + Math.sin(d / 5) * 8) * 10) / 10)
        const r = Math.random()
        data.alarm_code.push(r > 0.9 ? 3 : r > 0.85 ? 2 : r > 0.8 ? 1 : r < 0.1 ? -2 : 0)
      }
      return data
    },

    _dummyCorrelation() {
      const data = []
      for (let i = 0; i < 200; i++) {
        const temp = 16 + Math.random() * 12
        const apm = Math.max(0, 30 + temp * 3 + Math.random() * 60 - 30)
        const code = apm > 100 ? (Math.random() > 0.5 ? 2 : 1) : 0
        data.push({ apm: Math.round(apm), env_value: Math.round(temp * 10) / 10, alarm_class_code: code })
      }
      return data
    },

    _dummyDielPattern() {
      const data = []
      const names = ['Tag48- 3 Musket', 'Tag49- Largemouth']
      names.forEach(name => {
        for (let h = 0; h < 24; h++) {
          const nightBoost = (h >= 18 || h <= 5) ? 30 : 0
          const avg = 40 + nightBoost + Math.random() * 20
          data.push({ name, hour: h, avg_apm: Math.round(avg * 10) / 10, std_apm: Math.round(Math.random() * 15 * 10) / 10, n: Math.floor(Math.random() * 50 + 20) })
        }
      })
      return data
    },

    _dummyPhdMultivariate() {
      const data = []
      for (let i = 0; i < 300; i++) {
        data.push({
          name: i % 3 === 0 ? 'LNAT01' : i % 3 === 1 ? 'LNAT02' : 'SINT01',
          apm: Math.round(Math.random() * 200),
          tag_temp: Math.round((18 + Math.random() * 8) * 10) / 10,
          water_temp: Math.round((16 + Math.random() * 10) * 10) / 10,
          discharge: Math.round(Math.random() * 50 * 10) / 10,
          conductivity: Math.round(Math.random() * 200 * 10) / 10,
          air_temp: Math.round((15 + Math.random() * 15) * 10) / 10,
          pressure: Math.round((1000 + Math.random() * 30) * 10) / 10,
          days_from_tag: Math.floor(Math.random() * 200),
          tod: Math.floor(Math.random() * 24)
        })
      }
      return data
    },

    _dummyPhdBoxplot() {
      const data = {}
      const groups = ['LNAT01', 'LNAT02', 'SINT01']
      groups.forEach(g => {
        data[g] = Array.from({ length: 100 }, () => Math.round(Math.random() * 200))
      })
      return data
    },

    _dummyPhdTagging() {
      const data = []
      for (let d = 0; d <= 180; d++) {
        const stressDecay = Math.max(0, 80 * Math.exp(-d / 20))
        const base = 50 + Math.random() * 30
        data.push({
          day_from_tag: d,
          avg_apm: Math.round((base + stressDecay) * 10) / 10,
          std_apm: Math.round(Math.random() * 20 * 10) / 10,
          n: Math.floor(Math.random() * 10 + 5)
        })
      }
      return data
    }
  }
})
