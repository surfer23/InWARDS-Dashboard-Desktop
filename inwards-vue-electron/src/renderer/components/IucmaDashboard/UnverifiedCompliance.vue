<template>
    <table id="stationsTable">
        <thead>
            <tr>
                <th data-field="Station" data-sortable="true">Station</th>
                <th data-field="sixTh" data-sortable="true">60th (%)</th>
                <th data-field="sevTh" data-sortable="true">70th (%)</th>
                <th data-field="eigTh" data-sortable="true">80th (%)</th>
                <th data-field="ninTh" data-sortable="true">90th (%)</th>
                <th data-field="nininTh" data-sortable="true">99th (%)</th>
                <th data-field="No_Readings" data-sortable="true"># Obs</th>
            </tr>
        </thead>
    </table>
</template>

<script type="text/javascript">
import $ from 'jquery';
export default {
data () {
  return {
    dws: []
  };
},
mounted() {
    $('#stationsTable').bootstrapTable();
},
created () {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let hydrologicalStartDate = new Date(`${year}-10-01`);
  let lastHydrologicalStartDate = new Date(`${year - 1}-10-01`);
  if (currentDate < hydrologicalStartDate) {
    hydrologicalStartDate = lastHydrologicalStartDate;
  }
  let startDate = `${hydrologicalStartDate.getFullYear()}-${String(hydrologicalStartDate.getMonth() + 1).padStart(2, '0')}-${String(hydrologicalStartDate.getDate()).padStart(2, '0')}`;
  let endDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
 
  //console.log('https://inwards.award.org.za/app_json/iucma_unverified_compliance.php?sd=' + startDate + '&ed=' + endDate);
  this.$axios.get('https://inwards.award.org.za/app_json/iucma_unverified_compliance.php?sd=' + startDate + '&ed=' + endDate)
    .then(
      response => {
        this.dws = response.data;
        //console.log(this.dws);
        $('#stationsTable').bootstrapTable('load', this.dws);
      })
    .catch(function (error) {
      console.log(error);
    });
},
methods: {
  updateTable () {
    let dateStartString = $('#dateStart').val();
    let dateEndString = $('#dateEnd').val();
    let startDate = new Date(dateStartString);
    let endDate = new Date(dateEndString);
    // console.log('http://inwards.award.org.za/app_json/iucma_compliance.php?sd=' + this.formatDate(startDate) + '&ed=' + this.formatDate(endDate));
    this.$axios.get('https://inwards.award.org.za/app_json/iucma_unverified_compliance.php?sd=' + this.formatDate(startDate) + '&ed=' + this.formatDate(endDate))
      .then(
        response => {
          this.dws = response.data;
          //console.log(this.dws);
          $('#stationsTable').bootstrapTable('load', this.dws);

        })
      .catch(function (error) {
        console.log(error);
      });

  }
}
};
</script>