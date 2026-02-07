<template>
  <div class="modal rounded-0 fade modal_center" tabindex="-1" id="logbook-modal">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
            <h5><img class="modal-title" src="../../assets/knp.png" style="width: 10%;">River Logbook Submission</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
          </div>
        <div class="modal-body">
          <div class="row">
          <div class="col-sm-8">        
          <div class="form-group">
            <input type="password" class="form-control rounded-0" id="operationalCode" placeholder="Enter code">
          </div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <input type="date" class="form-control" id="operationalStart">
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <input placeholder="Station" type="text" class="form-control" id="stationAdd">
                  </div>
                </div>
              </div>
            <div class="row">
             <div class="col-sm-12">
            <div class="form-group">
               <input placeholder="Entry Label" type="text" class="form-control" id="labelAdd">
            </div>
            </div>
            </div>
            <div class="row">
             <div class="col-sm-12">
            <div class="form-group">
               <input placeholder="Site desc. e.g. Olifants river at mamba weir" type="text" class="form-control" id="siteDesc">
            </div>
            </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
            <div class="form-group">
             <textarea class="form-control" placeholder="Management Issue" rows="4" cols="50" name="comment" id="mgProblems"></textarea>
             </div>
            </div>


            <div class="col-sm-12">
            <div class="form-group">
               <input placeholder="Management Options" type="text" class="form-control" id="mgOptions">
            </div>
            </div>
            </div>
            <div class="row">
             <div class="col-sm-12">
              <div class="form-group">
             <textarea  class="form-control" placeholder="Management Actions" rows="4" cols="50" name="comment" id="mgActions"></textarea>
            </div>
            </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <div class="form-group">
                  <input placeholder="Result" type="text" class="form-control" id="resultAdd">
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
                        <input class="btn inwards_button btn-labeled" type="file" id="imageFile" ref="imageFile" v-on:change="onChangeImageUpload()"/>
                    </div>
                    <div class="col-sm-12">
                    <label for="imageThumbnail">Selected Image:</label>
                    <img class="thumb-upload" id="imageThumbnail" src="../../assets/image_thumbnail.png" width="100%">
                </div> 

                </div>
              </div>
              <div class="col-md-12" align="left">                  
                    <label>Select File (Zip files if multiple)</label>
                     <input class="btn inwards_button btn-labeled" type="file" id="file" ref="file" v-on:change="onChangeFileUpload()"/>
                      <label for="fileSelected">Selected File:</label>
                      <div class="form-group">
                        <input placeholder="" type="text" class="form-control" id="fileSelected">
                      </div>
              </div>

              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="col-md-12" align="left">
                <button class="btn inwards_button btn-labeled" v-on:click="uploadLog()"><span class="btn-label"><i class="fa fa-file-image-o"></i></span>Submit Log<i class="fa fa-upload" style="padding-left: 10px;"></i></button>
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
            fileName: '',
            userCode: '',
            file:'',
            imageFile: '',
            successAlert: false,
            errorAlert: false,
            uploadedImage:'',
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
      submitRiverLog () {
        let logbookModal = $('#logbook-modal');
        document.getElementById('operationalStart').valueAsDate = new Date();
        logbookModal.modal({
          keyboard: true
        });
      },
      onChangeFileUpload(){
        
        
        
        this.file = this.$refs.file.files[0];
        this.fileName = getBasename(this.file.path);
        document.getElementById("fileSelected").value = this.fileName;



      },
      onChangeImageUpload(){
        this.imageFile = this.$refs.imageFile.files[0];
        document.getElementById("imageThumbnail").src = this.imageFile.path;
      },
      uploadLog(){
            let userCodeglobal = this.userCode;
            let formData = new FormData();
            var filesURL = '';     
            var imageURL = '';  
            formData.append('image', this.imageFile);
            formData.append('file', this.file);

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
              filesURL = data.data.file;
              imageURL = data.data.image;
              //imageURL = data.data.image;
              
              //console.log(filesURL);
              //console.log(imageURL);
            },
            ).then(function(){
                let verifyCode = $('#operationalCode').val();
                let station = $('#stationAdd').val();
                let siteDescText = $('#siteDesc').val();
                let dateStartString = $('#operationalStart').val();
                //console.log(dateStartString);
                let dateStart = new Date(dateStartString);
                let labelAdd = $('#labelAdd').val();
                let MgProblems = $('#mgProblems').val();
                let MgOptions = $('#mgOptions').val();
                let MgActions = $('#mgActions').val();
                let ResultAdd = $('#resultAdd').val();
                //console.log(ResultAdd);
                let api = 'https://inwards.award.org.za/app_json/data_upload/logbook_knp_submit.php?code=' + verifyCode + '&station=' + station + '&site_desc=' + siteDescText + '&date_event=' + dateStartString + '&chart_label=' + labelAdd + '&mg_problems=' + MgProblems + '&mg_options=' + MgOptions + '&mg_actions=' + MgActions + '&result=' + ResultAdd + '&attachments=' + filesURL + '&image=' + imageURL;
                //console.log(api);
                $.get(api, function (data) {
                  if (data === 'true') {
                    dialog.showMessageBox(null, {
                      type: 'info',
                      message: 'Successfully Submitted Log!',
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
            ).catch(function(){
                console.log('FAILURE!!');
            });
      },
      submit (e) {
        let verifyCode = $('#operationalCode').val();
        let station = $('#stationAdd').val();
        let dateStartString = $('#operationalStart').val();
        //console.log(dateStartString);
        let dateStart = new Date(dateStartString);
        let labelAdd = $('#labelAdd').val();
        let MgProblems = $('#mgProblems').val();
        let MgOptions = $('#mgOptions').val();
        let MgActions = $('#mgActions').val();
        let ResultAdd = $('#resultAdd').val();
        let api = 'https://inwards.award.org.za/app_json/operational_reserve.php?code=' + verifyCode + '&station=' + station + '&sd=' + this.formatDate(dateStart) + '&label=' + labelAdd + '&mg_problems' + MgProblems + '&mg_options=' + MgOptions + '&mg_actions=' + MgActions + '&result=' + ResultAdd;
       // console.log(api);
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