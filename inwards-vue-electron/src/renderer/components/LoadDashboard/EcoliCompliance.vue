<template>
    <div class="card rounded-0 box">
      <div class="card-body chart-container">           
          <div class="row no-gutters">
                 <div class="col-md-12">
                  <table class="table table-stripped">
                    <thead>
                     <tr style="font-size: 0.8rem;">
                          <th style="font-size:xx-small; white-space:nowrap;">Station</th>
                          <th style="font-size:xx-small; white-space:nowrap;">IUCMA Site Code</th>
                          <th style="font-size:xx-small; white-space:nowrap;">Site Desc</th>
                          <th style="font-size:xx-small; white-space:nowrap;">Detection Limit</th>
                          <th style="font-size:xx-small; white-space:nowrap;">RQO Concentration</th>
                          <th style="font-size:xx-small; white-space:nowrap;" title="The 95th percentile is the highest value remaining after the top 5% of a data set is removed.">95th Percentile Observed</th>                      
                          <th style="font-size:xx-small; white-space:nowrap;">% Samples below RQO</th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in ecoliData" :key="log.id" style="font-size:x-small; font-weight: lighter;">
                          <th style="font-size:xx-small">{{ log.station }}</th>
                          <th style="font-size:xx-small">{{ log.iucma_code }}</th>
                          <th style="font-size:xx-small; width: 30%; white-space:nowrap;">{{ log.desc }}</th>
                          <th style="font-size:xx-small">{{ log.detect }}</th>
                          <th style="font-size:xx-small">{{ log.rqo }}</th>
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
              this.$axios.get('https://inwards.award.org.za/app_json/wq_dash/rqos/compliance_table.php?stations=X2I050&sd=1972-12-10&ed=2022-11-28&type=0&variable=ECOLI_Susp_Water&unit=mg%2FL&merge=true&type=Rivers')
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