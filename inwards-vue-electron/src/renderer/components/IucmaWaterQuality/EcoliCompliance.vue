<template>
  <div class="card rounded-0 box">
    <div class="card-body table-container">
      <div class="row">
        <div class="col-md-12">
          <table
            class="table table-responsive table-striped table-bordered td-table"
          >
            <thead>
              <tr class="text-xs">
                <th>Station</th>
                <th>IUA:EWR</th>
                <th>Numerical RQO</th>
                <th>TEC</th>
                <th>RQO Narative</th>
                <th>Trend</th>
                <th
                  title="The 95th percentile is the highest value remaining after the top 5% of a data set is removed."
                >
                  Percentile Obs @ specified %
                </th>
                <th>% Samples below RQO</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="log in ecoliData"
                :key="log.id"
                class="text-sm font-weight-light"
              >
                <td>{{ log.station }}</td>
                <td>{{ log.iucma_code }}</td>
                <td>{{ log.desc }}</td>
                <td>{{ log.detect }}</td>
                <td>{{ log.rqo }}</td>
                <td>
                  <i
                    :class="[log.trend]"
                    aria-hidden="true"
                    :style="{ color: log.trend_color }"
                  ></i>
                </td>
                <td :style="{ 'background-color': log.color }">
                  {{ log.nine_fifth }}
                </td>
                <td :style="{ 'background-color': log.perc_color }">
                  {{ log.compliance }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  display: flex;
  flex-direction: column; /* children are stacked vertically */
}

.chart-container {
  flex: 1; /* This will grow to occupy remaining space */
}
.td-table {
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal !important;
  text-align: justify;
}
.text-xs {
  font-size: xx-small;
}
.text-sm {
  font-size: x-small;
}
</style>
<script type="text/javascript">
import axios from 'axios'
export default {
  data() {
    return {
      ecoliData: [],
      station: '',
    }
  },
  mounted() {
    axios
      .get(
        'https://inwards.award.org.za/app_json/wq_dash/rqos/compliance_table.php?stations=X2I050&sd=1972-12-10&ed=2022-11-28&type=0&variable=ECOLI_Susp_Water&unit=mg%2FL&merge=true&type=Rivers'
      )
      .then((response) => {
        this.ecoliData = response.data
        console.log(this.ecoliData)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    showRiskTable() {},
  },
}
</script>
