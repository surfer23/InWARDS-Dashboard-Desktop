import { computed } from 'vue'
import { useFishtracStore } from '../store/fishtracStore'

const THEME_COLORS = {
  dark: {
    plotly: {
      paper_bgcolor: '#1E1E1E',
      plot_bgcolor: '#1E1E1E',
      font: { family: 'Open Sans, sans-serif', color: '#CCCCCC', size: 11 },
      gridcolor: '#2D2D30',
      zerolinecolor: '#3E3E42',
      legendBg: 'rgba(30,30,30,0.8)'
    },
    map: {
      tileUrl: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    }
  },
  light: {
    plotly: {
      paper_bgcolor: '#FFFFFF',
      plot_bgcolor: '#FFFFFF',
      font: { family: 'Open Sans, sans-serif', color: '#2D3748', size: 11 },
      gridcolor: '#EDF2F7',
      zerolinecolor: '#CBD5E0',
      legendBg: 'rgba(255,255,255,0.9)'
    },
    map: {
      tileUrl: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    }
  }
}

export function useFishtracTheme() {
  const store = useFishtracStore()

  const colors = computed(() => THEME_COLORS[store.theme] || THEME_COLORS.light)

  const plotlyLayout = computed(() => {
    const c = colors.value.plotly
    return {
      paper_bgcolor: c.paper_bgcolor,
      plot_bgcolor: c.plot_bgcolor,
      font: c.font,
      margin: { t: 20, r: 20, b: 40, l: 60 },
      xaxis: { gridcolor: c.gridcolor, zerolinecolor: c.zerolinecolor },
      yaxis: { gridcolor: c.gridcolor, zerolinecolor: c.zerolinecolor }
    }
  })

  const tileUrl = computed(() => colors.value.map.tileUrl)

  const legendBg = computed(() => colors.value.plotly.legendBg)

  return {
    colors,
    plotlyLayout,
    tileUrl,
    legendBg,
    isDark: computed(() => store.theme === 'dark')
  }
}
