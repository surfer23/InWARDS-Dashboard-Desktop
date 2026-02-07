<template>
    <table ref="table" class="table table-bordered table-striped table-hover" style="padding: 0; margin-bottom: 0; overflow:auto; height: 100%;">
        <thead class="inwards_card">
            <tr style="color: white; font-size: 1rem; font-weight: lighter;">
                <th style="color: white; font-size: 1rem; font-weight: lighter;">DB ID</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">First Name</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Last Name</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Type of Issue</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Support Message</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Date Submitted</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Closed By</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Date Closed</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Action</th>

            </tr>
        </thead>
        <tbody>
        <tr v-for="station in stations" v-bind:key="station.Station" style="background-color:white; font-size: 0.9rem;">
                <td style="background-color: white;">{{ station.id }}</td>
                <td style="background-color: white;">{{ station.first_name }}</td>
                <td style="background-color: white;">{{ station.last_name }}</td>
                <td style="background-color: white;">{{ station.request_select }}</td>        
                <td style="background-color: white;">{{ station.support_message }}</td>     
                <td style="background-color: white;">{{ station.date_submitted }}</td>

          <td v-if="station.support_status === 'Open'"  style="background-color: salmon">Still open</td>
          <td v-else style="background-color: white;">{{ station.closed_by }}</td>

          <td v-if="station.support_status === 'Open'" style="background-color: salmon">Still open</td>
          <td v-else style="background-color: white;">{{ station.date_closed }}</td>
          
          <td v-if="station.support_status === 'Open'">
            <button class="btn inwards_button" @click="updateStatus(station.id)" type="button" :style="station.hidden">Close Support Ticket</button>
            
          </td>
          <td v-else style="background-color:forestgreen">
          <h5 >Closed</h5>
        </td>
        </tr>
      </tbody>
    </table>
</template>

<script type="text/javascript">
import $ from 'jquery';
import router from '../../router/index';
const { dialog } = require('electron').remote;
import stateStore from '../../store/state_handler';
export default {
data () {
  return {
    stations: [],
    userCode: ''
  };
},
created () {
stateStore.getState(
      stateStore.keys.loginStatus, (status) => {
        this.userCode = status['uniqueCode'];
      }
    );
  console.log('https://inwards.award.org.za/app_json/admin/support_tickets.php?user_code='+this.userCode);
  this.$axios.get('https://inwards.award.org.za/app_json/admin/support_tickets.php?user_code='+this.userCode)
    .then(
      response => {
        this.stations = response.data;
        if(this.stations == "false"){
          router.push({ path: 'user-support' });
        }
        console.log(this.stations);

      })
    .catch(function (error) {
      console.log(error);
    });
},
methods: {
    updateStatus (ticket_id) {

        console.log('https://inwards.award.org.za/app_json/admin/update_ticket.php?ticket_id=' + ticket_id + '&user_code=' + this.userCode);
        $.get('https://inwards.award.org.za/app_json/admin/update_ticket.php?ticket_id=' + ticket_id + '&user_code=' + this.userCode, function (data) {
          if (data === 'true') {
            dialog.showMessageBox(null, {
              type: 'info',
              message: 'Successfully Closed Ticket!',
              buttons: ['OK']
            });
          } else {
            dialog.showMessageBox(null, {
              type: 'info',
              message: 'Failed to Update!',
              buttons: ['OK']
            });
          }
        });

    }
}
};
</script>