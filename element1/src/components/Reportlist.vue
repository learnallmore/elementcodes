<template>
  <div class="testProject">
    <div class="function">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="输入posterid"
              icon="search"
              v-model="inputPid">
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click.native="onselectpid">查找</el-button>
        </el-col>
      </el-row>
    </div>
    <div id="table">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="pid"
          label="动态id">
        </el-table-column>
        <el-table-column
          prop="content"
          label="正文">
        </el-table-column>
        <el-table-column
          prop="uid"
          label="用户id">
        </el-table-column>
        <el-table-column
          prop="datetime"
          label="发送时间">
        </el-table-column>
        <el-table-column
          prop="likecount"
          label="点赞">
        </el-table-column>
        <el-table-column
          prop="commentcount"
          label="评论">
        </el-table-column>
        <el-table-column
          prop="clickcount"
          label="点击">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {postRequest} from "../utils/api";
export default {
  data(){
    return {
      inputPid: '',
      tableData:[],
    }
  },
  mounted() {
    this.getTabledata()
  },

  methods: {
    getTabledata(){
      let _this=this
      postRequest("posters/getreports"
      ).then((res)=>{
        console.log(res)
        _this.tableData=res.data.posters
        console.log(_this.tableData)
      })
    },

    onselectpid(){
      let _this = this
      if(this.inputPid==''){
        this.getTabledata()
        return
      }
      let pid = parseInt(this.inputPid)
      postRequest("posters/selectreport",
        {posterid:pid}
      ).then((res)=>{
        console.log(res)
        if(res.data.msg!=null){
          _this.$alert(res.data.msg)
        }
        _this.tableData=res.data.posters

      })
    },

    // 表格内删除按钮点击实现
    handleDelete: function(index,row){
      this.$confirm('要删除这条动态吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          postRequest("posters/delete",
            {
              //这里的this指向外层调用者，因为在方法中，也是指向组件login
              posterId: row.pid
            }).then(response=> {
            if (response.status == 200) {//这个status是服务器返回请求的对象的status
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTabledata()
       //     this.tableData.splice(index,1);
          }else{
              this.$message({
                type: 'success',
                message: '删除失败!'
              });
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  }
}
</script>

<style media="screen">
.function{
  margin-bottom:10px;
}
.function button{
  float:right;
}
</style>
