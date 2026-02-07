<template>
    <div>
      <multiselect 
        v-model="value" 
        placeholder="Select plate sub-mission" 
        label="title" 
        track-by="title" 
        :options="options" 
        :option-height="104" 
        :custom-label="customLabel"
        @input="setValues()"
        :show-labels="false"
      >
        <template v-slot:singleLabel="props">
          <img class="option__image" :src="props.option.img" alt="No photograph">
          <span class="option__desc">
            <span class="option__title">{{ props.option.title  +": "+ props.option.stage}}</span>
          </span>
        </template>
        <template v-slot:option="props">
          <img class="option__image" :src="props.option.img" alt="No photograph">
          <div class="option__desc">
            <span class="option__title">{{ props.option.title }}</span>
            <span class="option__small">{{ props.option.desc }}</span>
            <span class="option__small">{{ props.option.stage }}</span>
          </div>
        </template>
      </multiselect>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        value: null,
        options: []
      }
    },
    created () {
        this.$axios.get('https://inwards.award.org.za/app_json/iucma_verification/plates_list.php')
        .then(
          response => {
            this.options = response.data;
            //console.log(this.stations);
          })
        .catch(function (error) {
          console.log(error);
        });
    },
    methods: {

      setValues () {
        let veriDate = this.value.desc;
        this.$parent.currentDateTimeInput = veriDate.replace(" ", "T") 
      },
      customLabel(option) {
        return option.title;
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add any specific styles for this component here */
  .option__image {
    width: 50px;
    height: 50px;
    /* ... other styles */
  }
  /* ... other styles ... */
  </style>
  