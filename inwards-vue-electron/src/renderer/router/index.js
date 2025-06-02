import Vue from 'vue'
import Router from 'vue-router'
import MapLandingPage from '@/components/LandingPage/MapLandingPage.vue'
import Dashboard from '@/components/Dashboard/Dashboard.vue'
import UserDashboard from '@/components/UserDashboard/Dashboard.vue'
import KnpDashboard from '@/components/KnpDashboard/Dashboard.vue'
import WaterQuality from '@/components/WaterQuality/Dashboard.vue'
import IucmaDashboard from '@/components/IucmaDashboard/Dashboard.vue'
import FishDashboard from '@/components/FishDashboard/Dashboard.vue'
import InvertDashboard from '@/components/InvertDashboard/Dashboard.vue'
import EbaDashboard from '@/components/EbaDashboard/Dashboard.vue'
import IucmaWqDashboard from '@/components/IucmaWaterQuality/Dashboard.vue'
import WQHealthDashboard from '@/components/WQHealthDashboard/Dashboard.vue'
import EffectsTable from '@/components/WQHealthDashboard/EffectsTable.vue'
import LimitsTable from '@/components/WQHealthDashboard/LimitsTable.vue'
import AdminDashboard from '@/components/AdminDashboard/Dashboard.vue'
import UserSupport from '@/components/UserSupport/Dashboard.vue'
import LoadDashboard from '@/components/LoadDashboard/Dashboard.vue'
import DamDashboard from '@/components/DamDashboard/Dashboard.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'map-landing-page',
      component: MapLandingPage
    },
    {
      path: '/dashboard',
      name: 'dashboard-page',
      component: Dashboard
    },
    {
      path: '/user-dashboard',
      name: 'user-dashboard-page',
      component: UserDashboard
    },
    {
      path: '/knp-dashboard',
      name: 'knp-dashboard-page',
      component: KnpDashboard
    },
    {
      path: '/wq-dashboard',
      name: 'wq-dashboard-page',
      component: WaterQuality
    },
    {
      path: '/iucma-dashboard',
      name: 'iucma-dashboard-page',
      component: IucmaDashboard
    },
      {
      path: '/load-dashboard',
      name: 'load-dashboard-page',
      component: LoadDashboard
    },
    {
      path: '/fish-dashboard',
      name: 'fish-dashboard-page',
      component: FishDashboard
    },
    {
      path: '/invert-dashboard',
      name: 'invert-dashboard-page',
      component: InvertDashboard
    },
    {
      path: '/eba-dashboard',
      name: 'eba-dashboard-page',
      component: EbaDashboard
    },
    {
      path: '/iucma-wq-dashboard',
      name: 'iucma-wq-dashboard-page',
      component: IucmaWqDashboard
    },
    {
      path: '/wq-health-dashboard',
      name: 'wq-health-dashboard-page',
      component: WQHealthDashboard
    },
    {
      path: '/naratives-dashboard',
      name: 'naratives-dashboard-page',
      component: EffectsTable
    },
    {
      path: '/limits-dashboard',
      name: 'limits-dashboard-page',
      component: LimitsTable
    },
    {
      path: '/admin-dashboard',
      name: 'admin-dashboard-page',
      component: AdminDashboard
    },
    {
      path: '/user-support',
      name: 'user-support-page',
      component: UserSupport
    },
    {
      path: '/dam-dashboard',
      name: 'dam-dashboard-page',
      component: DamDashboard
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});