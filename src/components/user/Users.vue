<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <!-- 搜素与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input
                        v-model="queryInfo.query"
                        placeholder="请输入内容"
                        clearable
                        @clear="getUserList"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUser">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userList" style="width: 100%" stripe border>
                <!-- 索引类 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名" width="180"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="roleName" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.userState"
                            @change="userStateChanged(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="修改"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showEditDialog(scope.row.id)"
                            ></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="删除"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="removeUserById(scope.row.id)"
                            ></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="allotRole(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>

            <!-- 添加用户对话框 -->
            <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="30%"
                @close="addDialogClose"
            >
                <!-- 内容主体区 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="rolename">
                        <el-input v-model="addForm.rolename"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUserBtn">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 修改用户对话框 -->
            <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="30%"
                @close="editDialogClosed"
            >
                <!-- 内容主体区 -->
                <el-form
                    :model="editForm"
                    :rules="editFormRules"
                    ref="editFormRef"
                    label-width="70px"
                >
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配角色对话框 -->
            <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
                <div>
                    <p>
                        当前的用户:
                        <span class="allotRole">{{userInfo.username}}</span>
                    </p>
                    <p>
                        当前的角色:
                        <span class="allotRole">{{userInfo.roleName}}</span>
                    </p>
                    <p>
                        分配新角色:
                        <el-select v-model="selectedRoleId" placeholder="请选择">
                            <el-option
                                v-for="item in rolesList"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="allotRoleBtnClick">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
// import { get } from '../network/request'

export default {
    created() {
        this.getUserList()
    },
    data() {
        // 验证邮箱
        var checkEmail = (rule, value, cb) => {
            var reg = /^[0-9a-zA-Z_.-]+@([0-9a-zA-Z_.-])+([.][a-zA-Z])+/
            if (reg.test(value)) {
                return cb()
            }
            cb(new Error('邮箱输入错误'))
        }

        // 验证手机
        var checkMobile = (rule, value, cb) => {
            var reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/
            if (reg.test(value)) {
                return cb()
            }
            cb(new Error('手机号码输入错误'))
        }
        return {
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 当前每页页数
                pagesize: 2
            },
            userList: [],
            total: 0,
            // 对话框可见
            dialogVisible: false,
            // 添加用户表单
            addForm: {
                username: '',
                rolename: '',
                email: '',
                mobile: ''
            },
            // 修改用户表单数据
            editForm: {},
            editDialogVisible: false,
            // 分配角色对话框可见
            setRoleDialogVisible: false,
            userInfo: {},
            rolesList: [],
            // 已选择角色id值
            selectedRoleId: '',
            // 添加用户表单，验证规则
            addFormRules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 15,
                        message: '长度在 3 到 15 个字符之间',
                        trigger: 'blur'
                    }
                ],
                rolename: [
                    {
                        required: true,
                        message: '请输入角色名',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 15,
                        message: '长度在 3 到 15 个字符之间',
                        trigger: 'blur'
                    }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur'
                    },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur'
                    },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('/users', {
                params: this.queryInfo
            })
            console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.userList = res.data
            this.total = res.total
        },
        // 监听pagesize改变
        handleSizeChange(newPageSize) {
            console.log(newPageSize)
            this.queryInfo.pagesize = newPageSize
            this.queryInfo.pagenum = 1
            this.getUserList()
        },
        // 监听pagenum改变
        handleCurrentChange(newPageNum) {
            console.log(newPageNum)
            this.queryInfo.pagenum = newPageNum
            this.getUserList()
        },
        // 监听switch开关状态改变
        async userStateChanged(userInfo) {
            // console.log(userInfo)
            // 反引号 es6拼接字符串 用法
            const { data: res } = await this.$http.put(
                `/users/${userInfo.id}/state/${userInfo.userState}`
            )
            if (res.code !== 200) {
                this.$message.error('修改用户数据失败!')
            }
            this.$message.success('修改用户数据成功!')
            console.log(res)
        },
        // 添加用户
        addUser() {
            this.dialogVisible = true
        },
        // 添加用户对话框关闭
        addDialogClose() {
            // 清空表单的值和提示
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户按钮
        addUserBtn() {
            // 数据预校验
            this.$refs.addFormRef.validate(async valid => {
                // 提交前验证
                // console.log(valid)
                if (valid) {
                    const { data: res } = await this.$http.post(
                        '/users',
                        this.addForm
                    )

                    if (res.status !== 200) {
                        return this.$message.error('添加用户失败!')
                    }
                    console.log(res)
                    this.$message.success('添加用户成功')
                    this.dialogVisible = false

                    // 重新获取用户列表
                    this.getUserList()
                }
            })
        },
        // 修改用户对话框
        async showEditDialog(id) {
            this.editDialogVisible = true

            const { data: res } = await this.$http.get('users/' + id)
            console.log(res)
            if (res.code !== 200) {
                return this.$message.error('获取用户数据失败!')
            }
            this.editForm = res.data
        },
        // 修改用户对话框关闭
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 编辑用户信息，确定按钮
        editUserInfo() {
            // 表单数据预校验
            this.$refs.editFormRef.validate(async valid => {
                console.log(valid)
                if (valid) {
                    const { data: res } = await this.$http.post(
                        'users/' + this.editForm.id,
                        {
                            email: this.editForm.email,
                            mobile: this.editForm.mobile
                        }
                    )
                    if (res.status !== 200) {
                        return this.$message.error('更新数据失败!')
                    }
                    console.log(res)
                    // 提示更新成功
                    this.$message.success('更新用户数据成功!')
                    // 刷新用户列表
                    this.getUserList()
                    // 关闭对话框
                    this.editDialogVisible = false
                }
            })
        },
        // 移除用户，通过id
        async removeUserById(id) {
            // console.log(id)
            // 询问用户是否删除数据
            const confirmResult = await this.$confirm(
                '此操作将永久删除该用户, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)

            // 打印的结果是字符串 点击确定 返回 'confirm'
            // 用户点击取消，返回值为 字符串 'cancel'
            console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已经取消删除用户!')
            }

            const { data: res } = await this.$http.delete('users/' + id)
            console.log(res)
            if (res.status !== 200) {
                return this.$message.error('删除数据失败!')
            }
            this.$message.success('删除数据成功!')
            this.getUserList()
        },
        // 分配角色按钮点击
        async allotRole(userInfo) {
            this.userInfo = userInfo

            const { data: res } = await this.$http.get('roles')

            this.rolesList = res.data.roles
            console.log(this.rolesList)
            this.setRoleDialogVisible = true
        },
        // 分配角色确定按钮
        async allotRoleBtnClick() {
            console.log(typeof this.selectedRoleId, this.selectedRoleId)
            if (!this.selectedRoleId) {
                return this.$message.error('请选择角色!')
            }

            const { data: ret } = await this.$http.put(
                `user/${this.userInfo.id}/role`,
                {
                    rId: this.selectedRoleId
                }
            )
            console.log(ret)

            if (ret.status !== 200) {
                this.$message.error('分配角色错误!')
            } else {
                this.$message.success('分配角色成功!')
                this.getUserList()
            }
            this.setRoleDialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.allotRole {
    padding-left: 20px;
}
.el-select {
    padding-left: 20px;
}
</style>
