<template>
    <div style="height: 100%; margin-top: 10px;">
        <el-table
            class="common-table"
            border
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            style="width: 100%;"
            height="calc(100% - 40px)"
            :data="tableData"
            row-key="id"
            size="medium"
            ref="multipleTable"
            @sort-change="handleSort"
            @filter-change="filterHandler"
            @selection-change="handleSelectionChange"
            @cell-mouse-enter="cellMouseEnter"
        >
          <el-table-column type="expand" v-if="tableProp.expand">
            <template slot-scope="props">
              <slot name="expand" :row="props.row"></slot>
            </template>
          </el-table-column>
            <!-- 多选框 -->
            <el-table-column
                v-if="type"
                :label="type === 'index' && '序号'"
                :type="type"
                width="55"
                align="center"
            >
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                v-for="(th, key) in tableHeader"
                min-height="46"
                :key="key"
                :prop="th.prop"
                :label="th.label"
                :fixed="th.fixed"
                :sortable="th.custom ? 'custom' : false"
                :filters="th.filters"
                :column-key="th.columnKey"
                :filtered-value="th.filteredValue"
                :filter-multiple="th.filterMultiple"
                :width="th.minWidth"
                align="center"
            >
                <template slot-scope="scope">
                    <!-- 操作按钮 -->
                    <div v-if="th.operation">
                        <el-button
                            v-for="(o, key) in th.operation"
                            :key="key"
                            :style="{ ...th.style, ...o.style }"
                            @click="o.clickFun(scope.row, scope.$index)"
                            :type="o.btnType ? o.btnType : 'primary'"
                            size="mini"
                            v-if="colVisibleFormatters(scope.row, o.format)"
                        >
                            {{ o.name }}
                        </el-button>
                    </div>
                    <!-- 点击跳转页面 -->
                    <div v-else-if="th.router">
                        <router-link
                            :to="{
                                path: th.router.path,
                                query: { expertFields: scope.row['fieldName'] }
                            }"
                        >
                            {{ scope.row[th.prop] }}
                        </router-link>
                    </div>
                    <div v-else-if="th.cellClk">
                        <a
                            class="aStyle"
                            @click="cellClk(scope.row)"
                            title="点击查看详情"
                        >
                            {{ scope.row[th.prop] }}
                        </a>
                    </div>
                    <div v-else-if="th.switch">
                        <el-switch
                            v-model="scope.row[th.prop]"
                            active-text="是"
                            inactive-text="否"
                        >
                        </el-switch>
                    </div>
                    <div v-else-if="th.formatText">
                        <span>
                            {{ th.formatText(scope.row, th.prop) }}
                        </span>
                    </div>
                    <div v-else-if="th.slot">
                      <slot :name="th.slot" :row="scope.row"></slot>
                    </div>
                    <div v-else>
                        <!-- 鼠标滑过显示气泡框 -->
                        <el-popover
                            v-if="th.describe"
                            popper-class="popover-el-class"
                            placement="bottom"
                            trigger="hover"
                            :content="scope.row[th.prop]"
                        >
                            <slot name="popover-table"></slot>
                            <span
                                class="describe-wrap"
                                slot="reference"
                                style="-webkit-box-orient: vertical;"
                            >
                                {{ scope.row[th.prop] }}
                            </span>
                        </el-popover>
                        <!-- 输入框 -->
                        <el-input
                            v-else-if="th.input"
                            v-model="scope.row[th.prop]"
                            clearable
                        />
                        <!-- 下拉选择框 -->
                        <el-select
                            v-else-if="th.selected"
                            v-model="scope.row[th.prop]"
                            @change="th.changeFunc"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in th.selected"
                                :value="item.value"
                                :label="item.text"
                                :key="index"
                            ></el-option>
                        </el-select>
                        <!-- 需要格式化的图片 -->
                        <img
                            v-else-if="th.formImage"
                            :src="scope.row[th.prop]"
                            class="formImageClass"
                            :class="th.isBorder ? 'border' : ''"
                            @click="th.imgBigFunc(scope.row)"
                        />
                        <!-- Icon 图标 -->
                        <i v-else-if="th.icon" class="el-icon-rank"></i>

                        <!-- 纯展示数据 -->
                        <span v-else-if="!th.formatData && !th.formImage">{{
                            scope.row[th.prop]
                        }}</span>
                        <!-- format 文字格式化。因为 prop 不能解析这种类型而写的一套【obj.a】 -->
                        <!-- 需要格式化的数据结构 -->
                        <span date-item="123" v-else>{{
                            scope.row[th.prop] | formatters(th.formatData)
                        }}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" v-if="isPaging">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageInfo.pageNum"
                :page-count="pageInfo.pages"
                :page-sizes="[10]"
                :page-size="pageInfo.pageSize"
                prev-text="上一页"
                next-text="下一页"
                layout="prev, pager, next"
                :total="pageInfo.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
  name: 'quickly-table',
  props: {
    type: String,
    loading: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    tableProp:{
      type:Object,default: function () {
        return {}
      }
    },
    tableData: {
      type: Array,
      default: function () {
        return []
      }
    },
    tableHeader: {
      type: Array,
      default: function () {
        return []
      }
    },
    multipleSelection: {
      type: Array,
      default: function () {
        return []
      }
    },
    isPaging: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    pageInfo: {
      type: Object,
      default: function () {
        return {
            // 总页数
          pages: 0,
            // 总条数
          total: 0,
            // 页大小
          pageSize: 10,
            // 页码
          pageNum: 1
        }
      }
    }
  },
  filters: {
    formatters (val, format) {
      if (format && typeof format.fn === 'function') {
        return format.fn(val)
      } else return val
            //  if (typeof format[1] === 'function') {
            //     return format[1](val, format[0]);
            // } else return val;
    }
  },
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    colVisibleFormatters (row, format) {
      if (format === undefined) {
        return true
      }
      if (typeof format === 'function') {
        return format(row)
      } else return format
    },
    handleSelectionChange (val) {
      this.$emit('multipleSelection', val)
    },
    cellMouseEnter (row) {
      this.$emit('cell-mouse-enter', row)
    },
    cellClk (row) {
      this.$emit('cell-events', row)
    },
    handleSort (sort) {
      this.$emit('sort-events', sort)
    },
    filterHandler (filters) {
      this.$emit('filter-events', filters)
    },
    handleSizeChange (num) {
      this.$emit('size-change', num)
    }, // pageSize 改变时会触发
    handleCurrentChange (num) {
      this.$emit('current-change', num)
    } // current 改变时会触发
  },
  beforeDestroy () {}
}
</script>
<style>
.el-table--border {
    border: 1px solid #ebeef5 !important;
}
/* element-ui 固定表头 固定列 最后一行错位问题解决 */
/* 设置滚动条的样式 */
::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
    background-color: #8487879e;
}

.el-table__fixed::before,
.el-table__fixed-right::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: unset;
    z-index: 4;
}
/* element-ui 固定表头 固定列 最后一行错位问题解决 */
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.block {
    padding: 5px;
    text-align: center;
}
.aStyle {
    cursor: pointer;
    &:hover {
        text-decoration: underline;
        color: #409eff;
    }
}
div span {
    cursor: context-menu;
}
.formImageClass {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    border: 0;
    display: inline-block;
}
.border{
    border-radius: 50%;
}
</style>
