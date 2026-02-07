<template>
  <div id="loader-modal" class="modal" tabindex="-1" role="dialog" style="margin-top: 100px;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Database</h5>
        </div>
        <div class="modal-body loader-modal-body">
          <div class="modal-content-template">
            <span class="modal-text"></span>
            <img class="modal-loading" src="../assets/small-loading.svg" width="20" alt="Loading view">
            <span class="badge badge-success">OK</span>
            <span class="badge badge-danger">FAILED</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .modal-text {
    margin-right: 10px;
  }
  .badge {
    display: none;
  }
  .modal-content-template {
    display: none;
  }
</style>
<script>
  import $ from 'jquery';
  import stateStore from '../store/state_handler';
  import {rawQuery, getDatabasePath, dbUrl, isDbExist, initDatabase} from '../sqlite/index';
  // Note: 'request' and 'fs' are no longer used directly - we use electronAPI.downloadDatabase
  export default {
    data () {
      return {
        dbFileName: ''
      };
    },
    methods: {
      showModal () {
        let self = this;
        stateStore.getState(
          stateStore.keys.databaseStatus, (status) => {
            let databaseValidated = false;
            if (status && status.hasOwnProperty('databaseValidated')) {
              databaseValidated = status['databaseValidated'];
            }
            if (!databaseValidated) {
              let loaderModal = $('#loader-modal');
              loaderModal.modal({
                backdrop: 'static',
                keyboard: false
              });
              this.checkDatabaseInLocal();
            } else {
              self.$bus.emit('databaseValidated');
            }
          }
        );
      },
      addStatus (text, promise) {
        $('.modal-content-template').first().clone().appendTo('.loader-modal-body');
        let content = $('.modal-content-template').last();
        content.show();
        content.find('.modal-text').html(text);
        promise.then(function () {
          content.find('.modal-loading').hide();
          content.find('.badge-success').show();
        }, function () {
          content.find('.modal-loading').hide();
          content.find('.badge-danger').show();
        });
      },
      checkDatabaseInLocal () {
        let self = this;
        var promise = new Promise(async function (resolve, reject) {
          setTimeout(async () => {
            try {
              // isDbExist is now async
              const exists = await isDbExist();
              if (exists) {
                resolve('Database exist');
                self.initAndTestDatabase();
              } else {
                reject(Error('Database does not exist in local'));
                self.fetchDatabase();
              }
            } catch (err) {
              console.error('Error checking database:', err);
              reject(err);
              self.fetchDatabase();
            }
          }, 1000);
        });
        this.addStatus('Checking database in local...', promise);
      },
      fetchDatabase () {
        let self = this;
        var promise = new Promise(async function (resolve, reject) {
          try {
            // Use the IPC-based download instead of deprecated 'request' module
            const destPath = await getDatabasePath();
            await window.electronAPI.downloadDatabase(dbUrl, destPath);
            resolve();
            self.initAndTestDatabase();
          } catch (err) {
            console.error(err);
            reject(Error('Could not get a database from remote'));
          }
        });
        this.addStatus('Fetching database from remote...', promise);
      },
      initAndTestDatabase () {
        let self = this;
        var promise = new Promise(async function (resolve, reject) {
          try {
            // Initialize sql.js database first
            await initDatabase();
            console.log('Database initialized successfully');
            resolve('Database initialized');
            self.testDatabase();
          } catch (err) {
            console.error('Failed to initialize database:', err);
            reject(Error('Failed to initialize database'));
          }
        });
        this.addStatus('Initializing database...', promise);
      },
      testDatabase () {
        let self = this;
        var promise = new Promise(function (resolve, reject) {
          setTimeout(() => {
            rawQuery('SELECT id, email, user_pref FROM users', function (row, err) {
              if (err) {
                console.error(err);
                reject(Error(err));
                self.fetchDatabase();
                return false;
              }
              resolve('Database tested');
              stateStore.setState(stateStore.keys.databaseStatus, {
                'databaseValidated': true
              }, false);
              setTimeout(() => {
                $('#loader-modal').modal('hide');
                self.$bus.emit('databaseValidated');
              }, 500);
            });
          }, 1000);
        });
        this.addStatus('Testing database...', promise);
      }
    }
  };
</script>
