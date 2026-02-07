<template>
  <div class="card rounded-0 box">
    <div class="card-body chart-container">           
        <div class="row">
               <div class="col-sm-12">
                <table class="table table-striped">
                  <thead>
                   <tr style="font-size: 0.8rem;">
                        <th>Station</th>
                        <th>Observed</th>                      
                        <th>Hazard Quotient</th>
                        <th>Cancer Risk</th>
                    </tr>
                </thead>
                <tbody>
                  <tr v-for="log in allSites" :key="log.id" style="font-size:x-small; font-weight: lighter;">
                        <th>{{ log.site }}</th>
                        <th>{{ log.conc_observed }}</th>
                        <th :style="{'background-color': log.hazard }">{{ log.hazard_quotient }}</th>                  
                        <th :style="{'background-color': log.cancer }">{{ log.cancer_risk }}</th>
                  </tr>
              </tbody>
            </table>
        </div>
        </div>
        </div>
        </div>

    </template>
    <script type="text/javascript">
      import $ from 'jquery';
      export default {
        data () {
          return {
            allSites: [],
            station: ''
          };
        },
        methods: {
          showRiskTable (url_parameters) {
            this.$axios.get('https://inwards.award.org.za/app_json/wq_dash/variable_overview.php?'+url_parameters)
              .then(
                response => {
                  this.allSites = response.data;
                  console.log(this.allSites);
                })
              .catch(function (error) {
                console.log(error);
              });
  
          }
        }
      };
    </script>