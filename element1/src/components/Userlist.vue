<template>
  <div class="testUser">
      <div class="function">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-input
                placeholder="输入用户ID"
                icon="search"
                v-model="inputUid">
              </el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click.native="onselectUid">查找</el-button>
          </el-col>
        </el-row>
      </div>
    <div id="table">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="uid"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          prop="isAdmin"
          label="是否是管理员">
        </el-table-column>
        <el-table-column   label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-unlock"
              type="success"
              v-if="scope.row.ifsuspend==false"
              @click="handleSuspend(scope.$index, scope.row)"></el-button>
            <el-button
              icon="el-icon-lock"
              type="danger"
              v-if="scope.row.ifsuspend"
              @click="handleNotSuspend(scope.$index, scope.row)"></el-button>
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
      inputUid: '',
      tableData:[]
    }

  },

  mounted() {
    this.getTabledata()
  },
  methods: {
    getTabledata() {
      let _this=this
      postRequest("user/getusers"
      ).then((res)=>{
        console.log(res)
       let users =  res.data.users
        for(let i=0;i<users.length;i++){
          if(users[i].isAdmin){
            users[i].isAdmin="是"
          }else{
            users[i].isAdmin="否"
          }

        }
        _this.tableData = users
        console.log(_this.tableData)
      })
    },
    onselectUid(){
      let _this = this
      if(this.inputUid==''){
        this.getTabledata()
        return
      }
      let uid = this.inputUid
      postRequest("user/getuser",
        {uid:uid}
      ).then((res)=>{
        console.log(res)
        if(res.data.msg!=null){
          _this.$alert(res.data.msg)
          _this.tableData=res.data.user
          return
        }
      let user = res.data.user
        if(user[0].isAdmin){
          user[0].isAdmin="是"
        }else{
          user[0].isAdmin="否"
        }
        _this.tableData=user
      })
    },
    handleSuspend: function(index,row){
      this.$confirm('要停用该账号吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postRequest("user/suspend",
          {
            //这里的this指向外层调用者，因为在方法中，也是指向组件login
            userid: row.uid
          }).then(response=> {
          if (response.status == 200) {//这个status是服务器返回请求的对象的status
            this.$message({
              type: 'success',
              message: '已停用该账号!'
            });
            this.getTabledata()
          }else{
            this.$message({
              type: 'error',
              message: 'fail'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消停用该账号'
        });
      });

    },
    handleNotSuspend: function(index,row){
      this.$confirm('要恢复该账号的使用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postRequest("user/suspend",
          {
            //这里的this指向外层调用者，因为在方法中，也是指向组件login
            userid: row.uid
          }).then(response=> {
          if (response.status == 200) {//这个status是服务器返回请求的对象的status
            this.$message({
              type: 'success',
              message: '已恢复该账号使用!'
            });
            this.getTabledata()
          }else{
            this.$message({
              type: 'error',
              message: 'fail'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消停用'
        });
      });
    }
  }
}
</script>

<style media="screen">

</style>
