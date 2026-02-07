<template>
  <div class="modal rounded-0 fade modal_center" tabindex="-1" id="log-modal" style="height:800px;">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">RIVER MANAGEMENT COMMUNICATION LOGSHEET KNP</h5>
        </div>
        <div class="modal-body">
         <div class="row">
                             <div class="col-sm-6" style="padding-right: 2px;">
                  <div class="form-group">
                    <label for="dateStart" style="padding-left: 8px;">Start Date:</label> 
                    <input type="date" class="form-control" id="dateStart" style="margin-left: 4px;">
                  </div>
                </div>
                <div class="col-sm-6" style="padding-left: 2px;">
                  <div class="form-group">
                    <label for="dateEnd" style="padding-left: 8px;">End Date:</label>
                    <input type="date" class="form-control" id="dateEnd" style="margin-right: 10px;" @onload="setDates()">
                  </div>
                </div>
         </div>
         <div class="row">
             <div class="col-sm-12">
          <div class="form-group">
            <table class="table">
			<thead class="inwards_card">
				<tr style="color: white; font-size: 1rem;">
					<th> Management Problem</th>
                    <th> Date</th>
					<th> Management Options</th>
					<th> Management Action</th>
					<th> Result</th>
					<th> Image</th>
					<th> Attachments</th>
				</tr>
			</thead>
			<tr v-for="log in logs" :key="log" style="font-size: 0.7rem;">
                    <td>{{ log.mg_problems }}</td>
                    <td>{{ log.date }}</td>
                    <td>{{ log.mg_options }}</td>
                    <td>{{ log.mg_actions }}</td>
                    <td>{{ log.result }}</td>        
                    <td>{{ log.image }}</td> 
                    <td>{{ log.attachments }}</td> 
                    <td>{{ log.No_Readings }}</td>             
			</tr>
		</table>
          </div>
          </div>
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
        logs: []
      };
    },
    methods: {
      showLogModal () {
        this.$axios.get('https://inwards.award.org.za/app_json/knp_log.php')
          .then(
            response => {
              this.logs = response.data;
              //console.log(this.logs);
            })
          .catch(function (error) {
            console.log(error);
          });
        let logModal = $('#log-modal');
        logModal.modal({
          keyboard: true
        });
      }
    }
  };
</script>