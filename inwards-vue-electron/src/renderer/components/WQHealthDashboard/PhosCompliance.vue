<template>
    <div class="card rounded-0 box">
      <div class="card-body chart-container">           
          <div class="row">
                 <div class="col-sm-12">
                  <table class="table table-striped">
                    <thead>
                     <tr style="font-size: 0.8rem;">
                          <th>Station</th>
                          <th>IUCMA Site Code</th>
                          <th>Detection Limit</th>
                          <th>RQO Concentration</th>
                          <th>95th Percentile Observed</th>                      
                          <th>% Samples below RQO</th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in ecoliData" :key="log.id" style="font-size:x-small; font-weight: lighter;">
                          <th>{{ log.station }}</th>
                          <th>{{ log.iucma_code }}</th>
                          <th>{{ log.detect }}</th>
                          <th>{{ log.rqo }}</th>
                          <th :style="{'background-color': log.color }">{{ log.nine_fifth }}</th>
                          <th :style="{'background-color': log.perc_color }">{{ log.compliance }}</th>                  
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
              ecoliData: [],
              station: ''
            };
          },
          methods: {
            showRiskTable () {
              this.$axios.get('https://inwards.award.org.za/app_json/wq_dash/rqos/compliance_table.php?stations=X2I050&sd=1972-12-10&ed=2022-11-28&type=0&variable=PO4_P_Diss_Water&unit=mg%2FL&merge=true&type=Rivers')
                .then(
                  response => {
                    this.ecoliData = response.data;
                    console.log(this.ecoliData);
                  })
                .catch(function (error) {
                  console.log(error);
                });
    
            }
          }
        };
      </script>