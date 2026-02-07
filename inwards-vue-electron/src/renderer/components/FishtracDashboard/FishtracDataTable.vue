<template>
  <div class="fishtrac-table-container">
    <div class="table-header">
      <h3 class="table-title">{{ title }}</h3>
      <div v-if="showPagination" class="table-info">
        Showing {{ startIndex + 1 }}-{{ Math.min(endIndex, data.length) }} of {{ data.length }}
      </div>
    </div>

    <div v-if="loading" class="table-loading">
      <i class="fa fa-spinner fa-spin"></i> Loading data...
    </div>

    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th class="row-number">#</th>
            <th
              v-for="col in columns"
              :key="col.key"
              @click="sortBy(col.key)"
              class="sortable"
            >
              {{ col.label }}
              <span v-if="sortColumn === col.key" class="sort-indicator">
                <i :class="sortDirection === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down'"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in paginatedData" :key="index">
            <td class="row-number">{{ startIndex + index }}</td>
            <td v-for="col in columns" :key="col.key">
              {{ formatCell(row[col.key], col.key) }}
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length + 1" class="no-data">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination && totalPages > 1" class="table-pagination">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="currentPage = 1"
      >
        <i class="fa fa-angle-double-left"></i>
      </button>
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <i class="fa fa-angle-left"></i>
      </button>

      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <i class="fa fa-angle-right"></i>
      </button>
      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage = totalPages"
      >
        <i class="fa fa-angle-double-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FishtracDataTable',

  props: {
    title: {
      type: String,
      default: 'Data Table'
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },

  data() {
    return {
      currentPage: 1,
      sortColumn: null,
      sortDirection: 'asc'
    }
  },

  computed: {
    sortedData() {
      if (!this.sortColumn) return this.data

      return [...this.data].sort((a, b) => {
        const aVal = a[this.sortColumn]
        const bVal = b[this.sortColumn]

        if (aVal === bVal) return 0

        const comparison = aVal < bVal ? -1 : 1
        return this.sortDirection === 'asc' ? comparison : -comparison
      })
    },

    totalPages() {
      if (!this.showPagination) return 1
      return Math.ceil(this.data.length / this.pageSize)
    },

    startIndex() {
      return (this.currentPage - 1) * this.pageSize
    },

    endIndex() {
      return this.startIndex + this.pageSize
    },

    paginatedData() {
      if (!this.showPagination) {
        return this.sortedData
      }
      return this.sortedData.slice(this.startIndex, this.endIndex)
    }
  },

  watch: {
    data() {
      this.currentPage = 1
    }
  },

  methods: {
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = column
        this.sortDirection = 'asc'
      }
    },

    formatCell(value, key) {
      if (value === null || value === undefined) return '-'

      // Format numbers
      if (typeof value === 'number') {
        if (key.includes('activity') || key.includes('alarm')) {
          return Math.round(value)
        }
        return value.toFixed(2)
      }

      return value
    }
  }
}
</script>

<style scoped>
.fishtrac-table-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.table-info {
  font-size: 12px;
  color: #7f8c8d;
}

.table-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #7f8c8d;
  font-size: 14px;
}

.table-loading i {
  margin-right: 8px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.data-table th,
.data-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
  position: sticky;
  top: 0;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.data-table th.sortable:hover {
  background: #f0f2f5;
}

.sort-indicator {
  margin-left: 4px;
  color: #3498db;
}

.data-table td {
  color: #34495e;
}

.data-table tr:hover td {
  background: #f8f9fa;
}

.row-number {
  width: 40px;
  color: #95a5a6;
  font-size: 11px;
}

.no-data {
  text-align: center;
  color: #95a5a6;
  padding: 30px !important;
}

/* Pagination */
.table-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #3498db;
  border-color: #3498db;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: #666;
  margin: 0 12px;
}
</style>
