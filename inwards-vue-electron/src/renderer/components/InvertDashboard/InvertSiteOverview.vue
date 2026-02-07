<template>
  <div class="card rounded-0 box" v-bind:style="styleObject">
    <div class="card-header inwards_card"><img src="../../assets/fbis_icon.png" height="11"> FBIS Site Overview</div>
    <div class="card-body chart-container">
          <table v-for="log in logs" v-bind:key="log.site_code" style="font-size: 0.75rem;" class="table">
                   <tbody>
                   <tr>
                    <th> River Name</th>
                    <td>{{ log.river_name }}</td>
                   </tr>
                    <tr>
                    <th> Quaternary Catchment</th>
                    <td>{{ log.quaternary_catchment_area }}</td>
                    </tr>
                    <tr>
                    <th> Site Code</th>
                    <td>{{ log.site_code }}</td>
                    </tr>
                    <tr>
                    <th> Site Description</th>
                    <td>{{ log.site_description }}</td>
                    </tr>
                    <tr>
                    <th> Protected Area</th>
                    <td>{{ log.national_protected_area }}</td>
                    </tr>
                    <tr>
                    <th> Ecosystem Threat Status</th>
                    <td>{{ log.ecosystem_threat_status }}</td>
                    </tr>
                    <tr>
                    <th> SWA Surface</th>
                    <td>{{ log.strategic_water_source_areas_surface }}</td>
                    </tr>
                    <tr>
                    <th> SWA Ground</th>
                    <td>{{ log.strategic_water_source_areas_ground }}</td>
                    </tr>
                    <tr>
                    <th> PES 2018</th>
                    <td>{{ log.present_ecological_state_2018 }}</td>
                    </tr>
                    <tr>
                    <th> National Critical Biodiversity</th>
                    <td>{{ log.national_critical_biodiversity }}</td>
                    </tr>
                     <tr style="width: 100%; margin: 0 auto;">
                     <td style="width: 100%; margin: 0 auto;" colspan="2"> <button class="btn inwards_button" type="button" style="width: 100%; margin: 0; font-size: 11px" v-on:click="redirectFbis(log.site_code)">View Site on FBIS</button></td>
                    </tr>
                   </tbody>
		</table> 
    </div>
  </div>
</template>
<script type="text/javascript">
import { RingLoader } from 'vue-spinner/dist/vue-spinner.min.js';
import {shell} from 'electron';
// import $ from 'jquery';
export default {
  components: {
    RingLoader
  },
  data () {
    return {
      logs: [],
      styleObject: {
        display: 'none'
      }
    };
  },
  methods: {
    invertsiteTable (site) {
      // console.log('http://inwards.award.org.za/app_json/invert_site.php?site=' + site);
      this.$axios.get('https://inwards.award.org.za/app_json/invert_site.php?site=' + site)
        .then(
          response => {
            this.logs = response.data;
            this.styleObject.display = 'block';
            // console.log(this.logs);
          })
        .catch(function (error) {
          console.log(error);
        });
    },
    redirectFbis (siteCode) {
      let urlFbis = 'https://freshwaterbiodiversity.org/map/#site-detail/taxon=&search=' + siteCode + '&siteId=&collector=&category=&yearFrom=&yearTo=&months=&boundary=&userBoundary=&referenceCategory=&spatialFilter=&reference=&endemic=&conservationStatus=&modules=21&validated=&sourceCollection=&abioticData=&ecologicalCategory=&rank=&siteIdOpen=&orderBy=&polygon=&thermalModule=&dst=';
      //https://freshwaterbiodiversity.org/map/#site-detail/taxon=&search=&siteId=&collector=&category=&yearFrom=&yearTo=&months=&boundary=&userBoundary=&referenceCategory=&spatialFilter=&reference=&endemic=&conservationStatus=&modules=21&validated=&sourceCollection=&abioticData=&ecologicalCategory=&rank=&siteIdOpen=&orderBy=&polygon=&thermalModule=&dst=
      shell.openExternal(urlFbis);
    }
  }
};
</script>