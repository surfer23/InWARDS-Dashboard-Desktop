<template>
  <div class="card rounded-0 box">
    <div class="card-body chart-container">           
        <div class="row">
               <div class="col-sm-12">
                <table class="table table-m table-striped">
                <thead>
			          	<tr style="font-size: 0.8rem;">
                      <th>Parameters</th>                      
                      <th>Outputs</th>
                      <th>Safe Level</th>
                  </tr>
              </thead>
              <tbody v-for="log in riskData" :key="log.id" style="font-size:x-small; font-weight: lighter;">
                <tr>
                    <th>Water Quality Parameter</th>
                      <th>{{ log.variable }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>Site</th>
                      <th>{{ log.site }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>Date</th>
                      <th>{{ log.date }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>Conc water mg/l</th>
                      <th>{{ log.conc_observed }}</th>
                      <th>-</th>
                    </tr>

                    <tr>
                      <th>Ingestion rate L</th>
                      <th>{{ log.ingestion_rate }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>RfD mg/kg/d</th>
                      <th>{{ log.RfD }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>Slope factor (β)</th>
                      <th>{{ log.slope_factor }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>Exp duration ED (years)</th>
                      <th>{{ log.duration_ED_years }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>Exp frequency EF (days/y)</th>
                      <th>{{ log.frequency_EF_days }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>Body weight BW (kg)</th>
                      <th>{{ log.Body_weight_BW }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>Av time days (days xED)</th>
                      <th>{{ log.average_time_xED }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>Lifetime Lft (years)</th>
                      <th>{{ log.lifetime_years }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>ADD (Avg Daily Dose)</th>
                      <th>{{ log.avg_daily_dose }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>LADD</th>
                      <th>{{ log.LADD }}</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <th>Hazard quotient</th>
                      <th :style="{'background-color': log.hazard }">{{ log.hazard_quotient }}</th>
                      <th>1</th>
                    </tr>
                    <tr>
                      <th>Cancer risk</th>                      
                      <th :style="{'background-color': log.cancer }">{{ log.cancer_risk }}</th>
                      <th>0.0001</th>
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
          riskData: [],
          station: ''
        };
      },
      methods: {
        showRiskTable (url_parameters) {
          this.$axios.get('https://inwards.award.org.za/app_json/wq_dash/site_risk.php?'+url_parameters)
            .then(
              response => {
                this.riskData = response.data;
                console.log(this.riskData);
              })
            .catch(function (error) {
              console.log(error);
            });

        }
      }
    };
  </script>