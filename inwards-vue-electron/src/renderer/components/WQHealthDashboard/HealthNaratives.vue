<template>
        <div >
          <div class="row no-gutters" v-for="log in healthNara" :key="log.id">
            <div class="row">
            <div class="col-md-12">
                <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 5px;">
                  <div class="justify-content-center align-items-center"><img src="../../assets/formula-2-svgrepo-com.svg" alt="" height="50"></div></div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 5px;"><h5 style="color:#5C5F62;">Overview of {{ log.mon_variable_name }}</h5></div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 5px;">
                   <div class="col-md-1"></div>
                    <div class="col-md-10">
                    <p style="color:#5C5F62;">
                      {{ log.overview }}                 
                     </p>   
                  </div> 
                <div class="col-md-1"></div>              
                </div>
                </div>
                </div>
                <div class="row">
                <div class="col-md-6">
                <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;">
                  <div class="justify-content-center align-items-center">
                    <img src="../../assets/naturemajor-svgrepo-com.svg" alt="" height="50">
                  </div>
                </div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;"><h5 style="color:#5C5F62;">Natural Sources of {{ log.mon_variable_name }}</h5></div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;">
                   <div class="col-md-1"></div>
                   <div class="col-md-10">
                    <p style="color:#5C5F62;">
                      {{log.source_natural}}                 
                     </p>   
                   </div> 
                   <div class="col-md-1"></div>              
                </div>
                </div>
                <div class="col-md-6">
                <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;">
                  <div class="justify-content-center align-items-center">
                    <img src="../../assets/bucket-valve-svgrepo-com.svg" alt="" height="50">
                  </div>
                </div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;"><h5 style="color:#5C5F62;">Other Sources of {{ log.mon_variable_name }}</h5></div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;">
                   <div class="col-md-1"></div>
                   <div class="col-md-10">
                    <p style="color:#5C5F62;">
                      {{log.source_other}}                 
                     </p>   
                   </div> 
                   <div class="col-md-1"></div>              
                </div>
                </div>                              
              </div>
              <div class="col-md-12">
                <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;">
                  <div class="justify-content-center align-items-center">
                    <img src="../../assets/heart-illustration-1-svgrepo-com.svg" alt="" height="50">
                  </div>
                </div>
                <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;"><h5 style="color:#5C5F62;">Toxic Acute Health Effects of {{ log.mon_variable_name }}</h5></div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;">
                   <div class="col-md-1"></div>
                   <div class="col-md-10">
                    <p style="color:#5C5F62;">
                      {{log.health_effect_toxic_acute}}                 
                     </p>   
                   </div> 
                   <div class="col-md-1"></div>              
                </div>

                </div>
                <div class="col-md-12">
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 5px;">
                  <div class="justify-content-center align-items-center">
                    <img src="../../assets/arsenic.svg" alt="" height="250">                  
                  </div>
                </div>
                </div>
                <div class="row">
                <div class="col-md-6">
                <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;">
                  <div class="justify-content-center align-items-center">
                    <img src="../../assets/riskminor-svgrepo-com.svg" alt="" height="50">
                  </div>
                </div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;">
                    <h5 style="color:#5C5F62;">Toxic Chronic Health Effects of {{ log.mon_variable_name }}</h5></div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;">
                   <div class="col-md-1"></div>
                   <div class="col-md-10">
                    <p style="color:#5C5F62;">
                      {{log.health_effect_chronic}}                 
                     </p>   
                   </div> 
                   <div class="col-md-1"></div>              
                </div>
                </div>
                <div class="col-md-6">
                <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;">
                  <div class="justify-content-center align-items-center">
                    <img src="../../assets/bucket-valve-svgrepo-com.svg" alt="" height="50">
                  </div>
                </div>
                <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 1px;"><h5 style="color:#5C5F62;">Carcinogenic Health Effects of {{ log.mon_variable_name }}</h5></div>
                  <div class="row h-20 justify-content-center align-items-center" style="margin-bottom: 1px;">
                   <div class="col-md-1"></div>
                    <div class="col-md-10">
                    <p style="color:#5C5F62;">
                      {{ log.health_effects }}                 
                     </p>   
                  </div> 
                <div class="col-md-1"></div>              
                </div>
                </div>                              
              </div>
                <div class="row">
                <div class="col-md-12">
                <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 5px;">
                  <div class="justify-content-center align-items-center">
                    <img src="../../assets/bucket-valve-svgrepo-com.svg" alt="" height="50">
                  </div>
                </div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 5px;"><h5 style="color:#5C5F62;">Water Treatment Methods for {{ log.mon_variable_name }}</h5></div>
                  <div class="row h-10 justify-content-center align-items-center" style="margin-bottom: 5px;">
                   <div class="col-md-1"></div>
                    <div class="col-md-10">
                    <p style="color:#5C5F62;">
                      {{ log.treatment }}                 
                     </p>   
                  </div> 
                <div class="col-md-1"></div>              
                </div>
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
              healthNara: [],
              station: ''
            };
          },
          methods: {
            showNarativesTable (urlPara) {
              this.$axios.get('https://inwards.award.org.za/app_json/wq_dash/health/health_overview.php?'+urlPara)
                .then(
                  response => {
                    this.healthNara = response.data;
                    console.log(this.healthNara);
                  })
                .catch(function (error) {
                  console.log(error);
                });
    
            }
          }
        };
      </script>