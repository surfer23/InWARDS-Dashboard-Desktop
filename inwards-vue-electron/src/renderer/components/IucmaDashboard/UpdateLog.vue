<template>
    <div class="modal rounded-0 fade modal_center" tabindex="-1" id="update-logbook-modal">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
              <h5><img class="modal-title" src="../../assets/knp.png" style="width: 10%;">River Logbook Edit</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>
          <div class="modal-body">
            <div class="row">
            <div class="col-sm-8">        
            <div class="form-group">
              <input type="password" class="form-control rounded-0" id="knpCode" placeholder="Enter code">
            </div>
                <div class="row">
                  <div class="col-sm-6">
                    <div class="form-group">
                      <input type="date" class="form-control" id="dateEvent">
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group">
                      <input placeholder="Station" type="text" class="form-control" id="stationUpdate">
                    </div>
                  </div>
                </div>
              <div class="row">
               <div class="col-sm-12">
              <div class="form-group">
                 <input placeholder="Entry Label" type="text" class="form-control" id="labelUpdate">
              </div>
              </div>
              </div>
              <div class="row">
               <div class="col-sm-12">
              <div class="form-group">
                 <input placeholder="Site desc. e.g. Olifants river at mamba weir" type="text" class="form-control" id="descUpdate">
              </div>
              </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
              <div class="form-group">
               <textarea class="form-control" placeholder="Management Issue" rows="4" cols="50" name="comment" id="problemsUpdate"></textarea>
               </div>
              </div>
  
  
              <div class="col-sm-12">
              <div class="form-group">
                 <input placeholder="Management Options" type="text" class="form-control" id="optionsUpdate">
              </div>
              </div>
              </div>
              <div class="row">
               <div class="col-sm-12">
                <div class="form-group">
               <textarea  class="form-control" placeholder="Management Actions" rows="4" cols="50" name="comment" id="actionsUpdate"></textarea>
              </div>
              </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <div class="form-group">
                    <input placeholder="Result" type="text" class="form-control" id="resultUpdate">
                  </div>
                  </div>
                </div>
                </div>
                
            <div class="col-sm-4">
                <div class="row" style="margin-top: 10px;">
                  <div class="col-md-12" align="left">
                      <div class="col-md-12" align="left">
                      <label>Select Primary Image</label>
                      </div>
                      <div class="col-md-12">
                          <input class="btn inwards_button btn-labeled" type="file" id="imageFile" ref="imageFile" v-on:change="onUpdateImageUpload()"/>
                      </div>
                      <div class="col-sm-12">
                      <label for="imageUpdateThumbnail">Selected Image:</label>
                      <img class="thumb-upload" id="imageUpdateThumbnail" width="100%">
                  </div> 
  
                  </div>
                </div>
                <div class="col-md-12" align="left">                  
                      <label>Select File (Zip files if multiple)</label>
                       <input class="btn inwards_button btn-labeled" type="file" id="attachFile" ref="attachFile" v-on:change="onUpdateFileUpload()"/>
                        <label for="fileUpdate">Selected File:</label>
                        <div class="form-group">
                          <input placeholder="" type="text" class="form-control" id="fileUpdate">
                        </div>
                </div>
  
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div class="col-md-12" align="left">
                  <button class="btn inwards_button btn-labeled" v-on:click="uploadLog()"><span class="btn-label"><i class="fa fa-file-image-o"></i></span>Submit record<i class="fa fa-upload" style="padding-left: 10px;"></i></button>
                </div>
                <div class="col-md-12">
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" max="100" :value.prop="uploadPercentage" :style="'width: '+uploadPercentage+'%;'"><strong>{{ Math.ceil(uploadPercentage) }}%</strong></div>
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
  </template>
  <script>
  import $ from 'jquery';
  import { remote } from '../../services/electron-compat';
  const { dialog } = remote;
  import stateStore from '../../store/state_handler';

  // Helper function to get filename from path (replaces path.basename)
  function getBasename(filePath) {
    if (!filePath) return '';
    return filePath.split(/[\\/]/).pop();
  }
  export default {
      data: function() {
          return {
              fileURL: '',
              uploadPercentage: 0,
              id: '',
              records: [],
              fileName: '',
              userCode: '',
              file:'',
              attachFile: '',
              imageFile: '',
              successAlert: false,
              errorAlert: false,
              uploadedImage:'',
              idCurrent: '', 
              imageCurrent: '', 
              fileCurrent: ''
          };
      },
      created () {
      stateStore.getState(
          stateStore.keys.loginStatus, (status) => {
              this.userCode = status['uniqueCode'];
              //console.log(this.userCode);
          }
          );
        }, 
      methods: {
        submitLogUpdate (id) {
            let idSend = id;
            //console.log('https://inwards.award.org.za/app_json/knp_log_edit.php?id='+idSend+'&user_code='+this.userCode);
            this.$axios.get('https://inwards.award.org.za/app_json/knp_log_edit.php?id='+idSend+'&user_code='+this.userCode)
            .then(
            response => {
                this.records = response.data;
                document.getElementById("imageUpdateThumbnail").src = this.records[0].image;
                document.getElementById("stationUpdate").value = this.records[0].station;
                document.getElementById("dateEvent").value = this.records[0].date;
                document.getElementById("descUpdate").value = this.records[0].site_desc;
                document.getElementById("labelUpdate").value = this.records[0].label;
                document.getElementById("problemsUpdate").value = this.records[0].mg_problems;
                document.getElementById("actionsUpdate").value = this.records[0].mg_actions;
                document.getElementById("resultUpdate").value = this.records[0].result;
                document.getElementById("optionsUpdate").value = this.records[0].mg_options;
                document.getElementById("fileUpdate").value = this.records[0].attachments;
                this.imageCurrent = this.records[0].image_url;
                this.idCurrent = this.records[0].id;
                this.fileCurrent = this.records[0].attachments;
            })
            .catch(function (error) {
            console.log(error);
          });
          let logbookModalUpdate = $('#update-logbook-modal');
          logbookModalUpdate.modal({
            keyboard: true
          });
        },
        onUpdateFileUpload(){
            this.attachFile = this.$refs.attachFile.files[0];
            this.fileName = getBasename(this.attachFile.path);
            document.getElementById("fileUpdate").value = this.fileName;
            this.fileCurrent = this.fileName;
        },
        onUpdateImageUpload(){
            this.imageFile = this.$refs.imageFile.files[0];
            //console.log(this.imageFile.path);
            document.getElementById("imageUpdateThumbnail").src = this.imageFile.path;
            this.imageCurrent = this.imageFile.path;
        },
        uploadLog(){
              let userCodeglobal = this.userCode;
              var filesURL = '';
              var imageURL = '';
              let formData = new FormData();

              if(this.fileCurrent != ''){
                 filesURL = this.fileCurrent;
                 formData.append('file', this.attachFile);
              }
              else{
                filesURL = "";
              }
              if(this.imageCurrent != ''){                
                imageURL = this.imageCurrent;
                formData.append('image', this.imageFile);
              }
              else{
                filesURL = "";
              }
              
              let verifyCode = $('#knpCode').val();
              let station = $('#stationUpdate').val();
              let descUpdateText = $('#descUpdate').val();
              let dateStartString = $('#dateEvent').val();
              //console.log(dateStartString);
              let dateStart = new Date(dateStartString);
              let labelUpdate = $('#labelUpdate').val();
              let problemsUpdate = $('#problemsUpdate').val();
              let optionsUpdate = $('#optionsUpdate').val();
              let actionsUpdate = $('#actionsUpdate').val();
              let resultUpdate = $('#resultUpdate').val();
              let id = this.idCurrent;
             // console.log(resultUpdate);
  
              this.axios.post('https://inwards.award.org.za/app_json/data_upload/log_image.php',
              formData,
                  {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  },
                onUploadProgress: function( progressEvent ) {
                  this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ) );
                }.bind(this) 
                }
              ).then(
              function(data){
                if(data.data.file != ''){
                    filesURL = data.data.file;
                }
                if(data.data.image != ''){
                    imageURL = data.data.image;
                }                           
                //console.log(filesURL);
                //console.log(imageURL);
              },
              ).then(function(){
                  let api = 'https://inwards.award.org.za/app_json/data_upload/knp_submit_update.php?id='+id+'&code=' + verifyCode + '&station=' + station + '&site_desc=' + descUpdateText + '&date_event=' + dateStartString + '&chart_label=' + labelUpdate + '&mg_problems=' + problemsUpdate + '&mg_options=' + optionsUpdate + '&mg_actions=' + actionsUpdate + '&result=' + resultUpdate + '&attachments=' + filesURL + '&image=' + imageURL;
                  //console.log(api);
                  $.get(api, function (data) {
                    if (data === 'true') {
                      dialog.showMessageBox(null, {
                        type: 'info',
                        message: 'Successfully Submitted record!',
                        buttons: ['OK']
                      });
                      $('#update-logbook-modal').modal('hide');
                    } else {
                      dialog.showMessageBox(null, {
                        type: 'error',
                        message: 'Failed to Submit!',
                        buttons: ['OK']
                      });                     
                    }
                  });             
              }           
              ).catch(function(){
                  console.log('FAILURE!!');
              });
        },
        submit (e) {
          let verifyCode = $('#knpCode').val();
          let station = $('#stationUpdate').val();
          let dateStartString = $('#dateEvent').val();
          //console.log(dateStartString);
          let dateStart = new Date(dateStartString);
          let labelUpdate = $('#labelUpdate').val();
          let problemsUpdate = $('#problemsUpdate').val();
          let optionsUpdate = $('#optionsUpdate').val();
          let actionsUpdate = $('#actionsUpdate').val();
          let resultUpdate = $('#resultUpdate').val();
          let api = 'https://inwards.award.org.za/app_json/operational_reserve.php?code=' + verifyCode + '&station=' + station + '&sd=' + this.formatDate(dateStart) + '&label=' + labelUpdate + '&mg_problems' + problemsUpdate + '&mg_options=' + optionsUpdate + '&mg_actions=' + actionsUpdate + '&result=' + resultUpdate;
          //console.log(api);
          $.get(api, function (data) {
            if (data === 'true') {
              dialog.showMessageBox(null, {
                type: 'info',
                message: 'Successfully Submitted Reserve!',
                buttons: ['OK']
              });
            } else {
              dialog.showMessageBox(null, {
                type: 'error',
                message: 'Failed to Submit!',
                buttons: ['OK']
              });
            }
          });
        }
      }
    };
  </script>