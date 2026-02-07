<template>
		<table class="table">
			<thead class="inwards_card">
				<tr style="color: white; font-size: 0.7rem;">
					<th> Station</th>
					<th> Status</th>
					<th> Compliant (%)</th>
					<th> Non-Complaint (%)</th>
					<th> No Readings</th>
				</tr>
			</thead>
			<tr v-for="station in stations" v-bind:key="station.Station" style="font-size: 0.7rem;">
                    <td>{{ station.Station }}</td>
                    <td>{{ station.Status }}</td>
                    <td>{{ station.Compliant }}</td>
                    <td>{{ station.Non_Complaint }}</td>        
                    <td>{{ station.No_Readings }}</td>             
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
    created () {
      this.$axios.get('https://inwards.award.org.za/app_json/tpc_compliance.php')
        .then(
          response => {
            this.stations = response.data;
            console.log(this.stations);
          })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
</script>