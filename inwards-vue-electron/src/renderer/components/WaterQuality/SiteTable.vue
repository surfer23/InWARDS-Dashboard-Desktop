<template>
            		<table id="site_info">
                    <tr style="color: white; font-size: 0.7rem;">
                      <th>Station</th>
                      <td>{{stations.station}}</td>
                    </tr>
                    <tr style="color: white; font-size: 0.7rem;">
                      <th>Station</th>
                      <td>{{stations.Station}}</td>
                    </tr>
                    <tr style="color: white; font-size: 0.7rem;">
                      <th>Description</th>
                      <td>{{stations.desc}}</td>
                    </tr>
                    <tr style="color: white; font-size: 0.7rem;">
                      <th>Sample Size</th>
                      <td>{{stations.sample_size}}</td>
                    </tr>
                    <tr style="color: white; font-size: 0.7rem;">
                      <th>Type</th>
                      <td>{{stations.station_type}}</td>
                    </tr>
                    <tr style="color: white; font-size: 0.7rem;">
                      <th>Start Date</th>
                      <td>{{stations.start}}</td>
                    </tr>
                    <tr style="color: white; font-size: 0.7rem;">
                      <th>End Date</th>
                      <td>{{stations.latest}}</td>
                    </tr>
                    <tr style="color: white; font-size: 0.7rem;">
                      <th>Quaternary</th>
                      <td>{{stations.quaternary}}</td>
                    </tr>        
                    <tr style="color: white; font-size: 0.7rem;">
                      <th>Hydro ID</th>
                      <td>{{stations.hydro}}</td>
                    </tr>                                                       
                  
                </table>
              
</template>

<script type="text/javascript">
  export default {
    data () {
      return {
        stations: []
      };
    },
    methods: {
      updateTable (stations) {
        console.log('Updating for:' + stations);
        this.$axios.get('https://inwards.award.org.za/app_json/tpc_compliance.php?stations=' + stations)
          .then(
            response => {
              this.stations = response.data;
            })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  };
</script>