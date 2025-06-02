import db from '../datastore';
import axios from 'axios';

const SELECTED_CATCHMENTS = 'selectedCatchments';
const SELECTED_CHARTS = 'selectedCharts';
const SELECTED_WMAS = 'selectedWMAs';
const TIMESTAMP = 'timestamp';
const SELECTED_STATIONS = 'selectedStations';
const SELECTED_BIOSTATIONS = 'selectedBioStations';
const SELECTED_HYDROSTATIONS = 'selectedHydroStations';
const SELECTED_INVERTSTATIONS = 'selectedInvertStations';
const SELECTED_LOAD_STATIONS = 'selectedLoadStations';
const SELECTED_LOAD_SITES = 'selectedLoadSites';
const SELECTED_RQIS_STATIONS = 'selectedRQISstations';
const SELECTED_RQIS_SITES = 'selectedRQISSites';
const SELECTED_IUCMA_STATIONS = 'selectedIUCMAstations';
const SELECTED_IUCMA_SITES = 'selectedIUCMASites';
const SELECTED_HEALTH_SITES = 'selectedHealthSites';
const SELECTED_DAM_SITES = 'selectedDamSites';
const DATE_START = 'dateStart';
const LOGIN_STATUS = 'loginStatus';
const DATE_END = 'dateEnd';
const stateStore = {
  debug: true,
  keys: {
    selectedCatchments: SELECTED_CATCHMENTS,
    selectedDamSites: SELECTED_DAM_SITES,
    selectedWMAs: SELECTED_WMAS,
    selectedCharts: SELECTED_CHARTS,
    timestamp: TIMESTAMP,
    dateStart: DATE_START,
    dateEnd: DATE_END,
    selectedStations: SELECTED_STATIONS,
    selectedBioStations: SELECTED_BIOSTATIONS,
    selectedInvertStations: SELECTED_INVERTSTATIONS,
    selectedHydroStations: SELECTED_HYDROSTATIONS,
    selectedLoadStations: SELECTED_LOAD_STATIONS,
    selectedLoadSites: SELECTED_LOAD_SITES,
    loginStatus: LOGIN_STATUS,
    selectedRQISstations: SELECTED_RQIS_STATIONS,
    selectedRQISSites: SELECTED_RQIS_SITES,
    selectedIUCMAstations: SELECTED_IUCMA_STATIONS,
    selectedIUCMASites: SELECTED_IUCMA_SITES,
    selectedHealthSites: SELECTED_HEALTH_SITES,
    databaseStatus: 'databaseStatus',
    
  },
  keysToUpload: [
    SELECTED_CHARTS,
    SELECTED_CATCHMENTS,
    SELECTED_WMAS,
    SELECTED_STATIONS,
    SELECTED_BIOSTATIONS,
    SELECTED_HYDROSTATIONS,
    SELECTED_INVERTSTATIONS,
    SELECTED_LOAD_SITES,
    SELECTED_LOAD_STATIONS,
    SELECTED_IUCMA_STATIONS,
    SELECTED_IUCMA_SITES,
    SELECTED_RQIS_STATIONS,
    SELECTED_RQIS_SITES,
    SELECTED_HEALTH_SITES,
    SELECTED_DAM_SITES,
    TIMESTAMP
  ],
  state: {},
  print(message) {
    if (this.debug) {
      //console.log(message);
    }
  },
  async setState(key, newValue, uploadToServer = true) {
    const self = this;
    this.print(`Set state ${key} to ${JSON.stringify(newValue)}`);
    this.state[key] = newValue;
    console.log(newValue);
    this.state[TIMESTAMP] = Date.now();
    return new Promise(resolve => {
      db.update({ type: 'user_states' }, {
        $set: self.state
      }, {
        upsert: true
      }, function (err, docs) {
        console.log(err, docs);
        if (uploadToServer) {
          self.uploadToServer(() => resolve('Resolved'));
        }
      });
    });
  },
  getState(key, callback) {
    const self = this;
    this.print(`Get state for ${key}`);
    if (this.state.hasOwnProperty(key)) {
      callback(this.state[key]);
    } else {
      db.find({ type: 'user_states' }, function (err, docs) {
        if (typeof docs === 'undefined') {
          return false;
        }
        if (err) {
          self.print(err);
          return false;
        }
        if (docs.length === 0) {
          callback(null);
        }
        try {
          let jsonData = JSON.stringify(docs[0]);
          if (!jsonData) {
            return;
          }
          self.state = JSON.parse(jsonData.replace(/'/g, ''));
          callback(self.state[key]);
        } catch (err) {
          console.log(err);
        }
      });
    }
  },
  clearState(key) {
    if (this.state.hasOwnProperty(key)) {
      this.print(`Clear state for ${key}`);
      this.state[key] = null;
      this.setState(key, null);
    }
  },
  clearAll() {
    let self = this;
    // Removing all documents with the 'match-all' query
    db.remove({}, { multi: true }, function (err, numRemoved) {
      console.log(err, numRemoved);
      self.state = {};
    });
  },
  uploadToServer(callback = null) {
    // Upload user state to server
    let dataToUpload = {};
    if (!this.state.hasOwnProperty(this.keys.loginStatus)) {
      return;
    }
    for (let i = 0; i < this.keysToUpload.length; i++) {
      dataToUpload[this.keysToUpload[i]] = this.state[this.keysToUpload[i]];
    }
    let url = `https://inwards.award.org.za/user_data/backup.php?user_code=${this.state[this.keys.loginStatus]['uniqueCode']}&json=${JSON.stringify(dataToUpload)}`;
    axios.get(url).then(response => {
      //console.log('User states in server has been updated');
      if (callback) {
        callback();
      }
    });
  },
  updateFromServer(callback) {
    // Get user states from the server, if the server has the latest data then update the local data
    let self = this;
    let url = `https://inwards.award.org.za/user_data/user_pref.php?user_code=${this.state[this.keys.loginStatus]['uniqueCode']}`;
    axios.get(url).then(response => {
      if (!response) {
        return false;
      }
      let data = response['data'];
      for (let key in data) {
        self.setState(key, data[key], false);
      }
      callback();
    });
    
  },
  clearSelectedLoadStations() {
    this.clearState(this.keys.selectedLoadSites)
    console.log('Cleared: ' + this.keys.selectedLoadSites)
  }
}
export default stateStore;
