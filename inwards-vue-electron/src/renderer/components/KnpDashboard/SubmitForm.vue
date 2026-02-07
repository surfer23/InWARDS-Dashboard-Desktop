<template>
    <div class="modal rounded-0 fade modal_center" tabindex="-1" id="operational-modal">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5><img class="modal-title" src="../../assets/knp.png" style="width: 10%;">Gauge Plate Submission</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
            <div class="row">
                <div class="col-sm-6">                    
                    <h4>Guide to Submitting</h4>
                    <p>Please ensure that the photograph of the gauge plate shows the current water line against the gaugeplate clearly. In addition, please specify the meter segment that the water line represents.</p>
            </div>
            <div class="col-sm-6">
                <img src="../../assets/guide.png" width="30%" class="right">
            </div>
            </div>
            <hr>
            <div class="row" style="margin-top: 10px;">
            <div class="col-sm-6">
                    <img id="gaugeThumbnail" src="../../assets/upload.png" width="100%" @click="uploadImageFile ()">
            </div>
            <div class="col-sm-6">
                <div class="col-sm-12">
                        <h4>Submission Details:</h4>
                        <label>Date and Time of Photograph:</label>
                    </div>                
                  <div class="col-sm-12">
                    <div class="form-group">
                        <input type="datetime-local" name="to" value="2014-12-08T15:43:00" class="form-control" id="dateObserved">
                    </div>
                  </div>                   
                    <div class="col-sm-12">
                        <label>Select station:</label>
                    </div>
                    <div class="col-sm-12">
                        <div class="form-group">
                             <multiselect placeholder="Select Station" :options="stations" v-model="selectedStations" :multiple="false"></multiselect>
                        </div>       
                  </div>
                  <div class="col-sm-12">
                        <label>Plate reading (m) <b>optional</b></label>
                  </div>
                  <div class="col-sm-12">
                    <div class="form-group">
                        <multiselect placeholder="Optional: select plate reading" :options="gaugeHeights" v-model="selectedGaugeHeight" :multiple="false" @input="fetchDischarge()"></multiselect>
                    </div>
                  </div>
                  <div class="col-sm-12">
                        <label>Plate Segment <b>only if plate reading not entered</b>:</label>
                    </div>
                    <div class="col-sm-12">
                    <div class="form-group">
                        <select class="custom-select" style="width:130px;" id="segment">
                            <option>1m</option>
                            <option>2m</option>
                            <option>3m</option>
                            <option>4m</option>
                            <option>5m</option>
                            <option>6m</option>    
                        </select>
                        </div>
                         </div>
                         <div class="col-sm-12">
                            <label>Discharge<b> extracted from rating curve for site selected</b>:</label>
                        </div>
                         <div class="col-sm-12">
                            <div class="form-group">
                                <input placeholder="Height to discharge calculation" type="text" class="form-control" id="dischargeEstimate" disabled>
                                <button>Verify with Rating Table</button>
                            </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row" style="margin-top: 10px;">
                    <div class="col-md-2" align="left">
                    <label>Select Image</label>
                    </div>
                    <div class="col-md-4">
                        <input class="btn inwards_button btn-labeled" type="file" id="file" ref="file" v-on:change="onChangeFileUpload()"/>
                    </div>
                    <div class="col-md-6">
                        <button class="btn inwards_button btn-labeled" v-on:click="submitForm()"><span class="btn-label"><i class="fa fa-file-image-o"></i></span>Upload Gauge Plate Reading<i class="fa fa-upload" style="padding-left: 10px;"></i></button>
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
        </div>
  </template>
  <script>
  import $ from 'jquery';
  import { remote } from '../../services/electron-compat';
  const { dialog } = remote;
  import stateStore from '../../store/state_handler';
  export default {
    data: function() {
        return {
            stations: [],
            uploadPercentage: 0,
            selectedStations: null,
            gaugeHeights: [],
            selectedGaugeHeight: null,
            fileURL: '',
            fileName: '',
            userCode: '',
            file:'',
            successAlert: false,
            errorAlert: false,
            uploadedImage:'',
            discharge: [],
        };
    },
    created () {
    stateStore.getState(
        stateStore.keys.loginStatus, (status) => {
            this.userCode = status['uniqueCode'];
            console.log(this.userCode);
        }
        );
        this.$axios.get('https://inwards.award.org.za/app_json/stations_all.php')
        .then(
          response => {
            this.stations = response.data;
            //console.log(this.stations);
          })
        .catch(function (error) {
          console.log(error);
        });
        this.$axios.get('https://inwards.award.org.za/app_json/gauge_heights.php')
        .then(
          response => {
            this.gaugeHeights = response.data;
            //console.log(this.stations);
          })
        .catch(function (error) {
          console.log(error);
        });
    },     
    methods: {
        showSubmitForm () {
        let operationalModel = $('#operational-modal');
        var today  = new Date();
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var H = today.getHours();
        var i = today.getMinutes();
        var s = today.getSeconds();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (i < 10) {
            i = '0' + i;
        }
        if (s < 10) {
            s = '0' + s;
        }
        today = yyyy + '-' + mm + '-' + dd+'T'+H+':'+i+':'+s;
        console.log(today);
        document.getElementById('dateObserved').value = today;
        operationalModel.modal({
          keyboard: true
        });
      },
      onChangeFileUpload(){
        this.file = this.$refs.file.files[0];
        document.getElementById("gaugeThumbnail").src = this.file.path;
      },
      uploadImage (imageId) {    
            let dateObserved = $('#dateObserved').val();
            let stationsAll = this.selectedStations;
            let stationSplit = stationsAll.split(':');
            let siteCode = stationSplit[0];
            console.log(siteCode);
            let segment = $('#segment').val();
            let height = this.selectedGaugeHeight;
            let discharge =   $('#dischargeEstimate').val();
            let api = 'https://inwards.award.org.za/app_json/upload_data/stage.php?image_url='+imageId+'&user_code=' + this.userCode + '&station=' + siteCode + '&date_taken=' + dateObserved + '&plate=' + segment + '&stage_height=' + height + '&discharge=' + discharge;
            $.get(api, function (dataAPI) {
                if (dataAPI === 'true') {
                dialog.showMessageBox(null, {
                    type: 'info',
                    message: 'Successfully Submited!',
                    buttons: ['OK']
                });
                
                } else {
                dialog.showMessageBox(null, {
                    type: 'info',
                    message: 'Failed to Submit Please Try Again or Contact Admin!',
                    buttons: ['OK']
                });
                }
            }); 
    },
    fetchDischarge(){
        let stationsAll = this.selectedStations;
        let stationSplit = stationsAll.split(':');
        let siteCode = stationSplit[0];
        let heightPlate = this.selectedGaugeHeight;
        console.log('https://inwards.award.org.za/app_json/plate_convert.php?station='+siteCode+'&height='+heightPlate);
        this.$axios.get('https://inwards.award.org.za/app_json/plate_convert.php?station='+siteCode+'&height='+heightPlate)
        .then(
          response => {
            this.discharge = response.data;
            console.log(this.discharge);
            console.log(this.discharge[0].flow);
            document.getElementById("dischargeEstimate").value = this.discharge[0].flow;
          })
        .catch(function (error) {
          console.log(error);
        });


    },
    submitForm(){
            let userCodeglobal = this.userCode;
            let dateObserved = $('#dateObserved').val();
            let stationsAll = this.selectedStations;
            let stationSplit = stationsAll.split(':');
            let siteCode = stationSplit[0];
            console.log(siteCode);
            let segment = $('#segment').val();
            let height = this.selectedGaugeHeight;
            let dischargeEst = $('#dischargeEstimate').val(); 
            let formData = new FormData();

            const config = {
                //Choose upload
                onUploadProgress: event => {
                    this.imageUploadPercentage = Math.round(
                        (event.loaded * 100) / event.total
                    );
                },
            };
            var imageURL = '';        
            formData.append('file', this.file);
            this.axios.post('https://inwards.award.org.za/app_json/data_upload/image.php',
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
              imageURL = data.data.message; 
            },
            ).then(function(){
                let callApi = 'https://inwards.award.org.za/app_json/data_upload/stage.php?image_url='+imageURL+'&user_code=' + userCodeglobal + '&station=' + siteCode + '&date_taken=' + dateObserved + '&plate=' + segment + '&stage_height=' + height + '&discharge=' + dischargeEst;
                $.get(callApi, function (data) {
                    if (data === 'true') {
                    dialog.showMessageBox(null, {
                        type: 'info',
                        message: 'Successfully Submited!',
                        buttons: ['OK']
                    });
                    $('#operational-modal').modal('hide');
                    } else {
                    dialog.showMessageBox(null, {
                        type: 'info',
                        message: 'Failed to Submit Please Try Again or Contact Admin!',
                        buttons: ['OK']
                    });
                    }
                });               
            }           
            ).catch(function(){
                console.log('FAILURE!!');
            });
      }
    }
  };
  </script>