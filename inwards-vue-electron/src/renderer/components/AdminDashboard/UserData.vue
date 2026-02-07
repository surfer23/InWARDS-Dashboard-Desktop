<template>
    <table ref="table" class="table table-bordered table-striped table-hover" style="padding: 0; margin-bottom: 0; overflow:auto; height: 100%;">
        <thead class="inwards_card">
            <tr style="color: white; font-size: 1rem; font-weight: lighter;">
                <th style="color: white; font-size: 1rem; font-weight: lighter;">DB ID</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">First Name</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Last Name</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Designation</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Sector</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Reason</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Email</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Registration Date</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Access Count</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Last Data Request</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Role</th>
                <th style="color: white; font-size: 1rem; font-weight: lighter;">Action</th>
            </tr>
        </thead>
        <tbody>
        <tr v-for="station in stations" v-bind:key="station.Station" style="font-size: 0.9rem;">
                <td style="background-color: white;">{{ station.id }}</td>
                <td style="background-color: white;">{{ station.first_name }}</td>
                <td style="background-color: white;">{{ station.last_name }}</td>
                <td style="background-color: white;">{{ station.designation }}</td>        
                <td style="background-color: white;">{{ station.sector }}</td>     
                <td style="background-color: white;">{{ station.reason }}</td>        
                <td style="background-color: white;">{{ station.email }}</td>         
                <td style="background-color: white;">{{ station.registration_date }}</td>                


            <td style="background-color: white;">{{ station.access_count }}</td>
            <td style="background-color: white;">{{ station.last_request }}</td>
            <td  style="background-color: white;">
                  <select class="custom-select" style="width:130px;" id="privilege">
                    <option v-if="station.privilege === 'Super Admin'" selected>Super Admin</option>
                    <option v-else>Super Admin</option>

                    <option v-if="station.privilege === 'Admin'" selected>Admin</option>
                    <option v-else>Admin</option>
                    
                    <option v-if="station.privilege === 'Technician'" selected>Technician</option>
                    <option v-else>Technician</option>

                    <option v-if="station.privilege === 'Operations'" selected>Operations</option>
                    <option v-else>Operations</option>

                    <option v-if="station.privilege === 'General'" selected>General</option>
                    <option v-else>General</option>
                    
                  </select>

            <button class="btn inwards_button" @click="updateAdmin(station.id)" type="button" style="width: 100%">Update</button>
          </td>
          <td style="background-color: white;">

            <button v-if="station.accepted === 'Accept User'" class="btn inwards_button" @click="updateStatus(station.user_code, station.email)" type="button" :style="station.hidden">Accept User</button>
            <button v-else class="btn inwards_button" @click="removeUser(station.id)" type="button" :style="station.hidden">Remove User</button>
          
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
  console.log('https://inwards.award.org.za/app_json/admin/usersTable.php?user_code='+this.userCode);
  this.$axios.get('https://inwards.award.org.za/app_json/admin/usersTable.php?user_code='+this.userCode)
    .then(
      response => {
        this.stations = response.data;
        if(this.stations == false){
          router.push({ path: 'user-support' });
        }
        console.log(this.stations);

      })
    .catch(function (error) {
      console.log(error);
    });
},
methods: {

    updateAdmin (updateId) {
      var UserOption = document.getElementById('privilege').value;
      let button = $(updateId.target);
      button.prop('disabled', true);
      button.html(`Submitting...`);
      console.log('https://inwards.award.org.za/app_json/admin/updatePrivilege.php?user_code=' + updateId + '&privilege=' + UserOption + '&super=' + this.userCode);
      $.get('https://inwards.award.org.za/app_json/admin/updatePrivilege.php?user_code=' + updateId + '&privilege=' + UserOption + '&super=' + this.userCode, function (data) {
        if (data === 'true') {
          dialog.showMessageBox(null, {
            type: 'info',
            message: 'Successfully Updated!',
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
    },
    updateStatus (user_id, email) {

        console.log('Accept User '+user_id);
        console.log('https://inwards.award.org.za/app_json/accept_user_request.php?user_code=' + user_id + '&email=' + email);
        $.get('https://inwards.award.org.za/app_json/accept_user_request.php?user_code=' + user_id + '&email=' + email, function (data) {
          if (data === 'true') {
            dialog.showMessageBox(null, {
              type: 'info',
              message: 'Successfully Accepted a Email was Sent to! '+email,
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

    },
    removeUser (userID) {
      console.log('https://inwards.award.org.za/app_json/admin/removeUser.php?user_code=' + userID);
      console.log('Accept User '+userID);
      let response = dialog.showMessageBoxSync(null, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to remove this user?'
    });
    console.log(response);
    if(response == 0){
      
      $.get('https://inwards.award.org.za/app_json/admin/removeUser.php?user_code=' + userID, function (data) {
        if (data === 'true') {
          dialog.showMessageBox(null, {
            type: 'info',
            message: 'Successfully Removed User!',
            buttons: ['OK']
          });
        } else {
          dialog.showMessageBox(null, {
            type: 'info',
            message: 'Failed to Remove User!',
            buttons: ['OK']
          });
        }
      });
      //window.location.reload();
     }   
}
}
};
</script>