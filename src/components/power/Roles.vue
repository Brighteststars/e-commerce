<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRole">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="roleList" stripe border>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row
                            :class="['bd-bottom',i1 == 0 ? 'bd-top': '' ,'vcenter']"
                            v-for="(item1,i1) in scope.row.children"
                            :key="item1.id"
                        >
                            <!-- 渲染 一级权限 -->
                            <el-col :span="5">
                                <el-tag
                                    closable
                                    @close="removeRightById(scope.row,item1.id)"
                                >{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染 二级 三级 权限 -->
                            <el-col :span="19">
                                <!-- 二级权限 -->
                                <el-row
                                    :class="[i2 == 0 ? '': 'bd-top', 'vcenter']"
                                    v-for="(item2,i2) in item1.children"
                                    :key="item2.id"
                                >
                                    <el-col :span="6">
                                        <el-tag
                                            type="success"
                                            closable
                                            @close="removeRightById(scope.row,item2.id)"
                                        >{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag
                                            v-for="(item3) in item2.children"
                                            :key="item3.id"
                                            type="warning"
                                            closable
                                            @close="removeRightById(scope.row,item3.id)"
                                        >{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre> {{scope.row}} </pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="编辑"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showEditDialog(scope.row.id)"
                            >编辑</el-button>
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
                                @click="removeRoleById(scope.row.id)"
                            >删除</el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="分配权限"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="showRightDialog(scope.row)"
                            >分配权限</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加角色对话框 -->
            <el-dialog
                title="添加角色"
                :visible.sync="addRoleDialogVisible"
                width="30%"
                @close="addDialogClosed"
            >
                <!-- 内容主体区 -->
                <el-form
                    :model="addForm"
                    :rules="addFormRules"
                    ref="addFormRef"
                    label-width="100px"
                >
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRoleBtn">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 修改角色对话框 -->
            <el-dialog
                title="修改角色"
                :visible.sync="editDialogVisible"
                width="30%"
                @close="editDialogClosed"
            >
                <!-- 内容主体区 -->
                <el-form
                    :model="editForm"
                    :rules="editFormRules"
                    ref="editFormRef"
                    label-width="100px"
                >
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="editForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="editForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配权限对话框 -->

            <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%"
                @close="setRightDialogClosed"
            >
                <el-tree
                    :data="rightsList"
                    :props="treeProps"
                    default-expand-all
                    show-checkbox
                    node-key="id"
                    ref="treeRef"
                    :default-checked-keys="defKeys"
                ></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.getRoleList()
    },
    data() {
        return {
            roleList: [],
            // 角色id
            roleId: '',
            // 添加角色对话框 可视
            addRoleDialogVisible: false,
            // 编辑对话框 可视
            editDialogVisible: false,
            // 分配权限对话框
            setRightDialogVisible: false,
            // 添加角色form
            addForm: {
                roleName: '',
                roleDesc: ''
            },
            editForm: {},
            // 所有权限数据
            rightsList: [],
            // 树形控件默认id
            defKeys: [],
            // 树形控件属性绑定
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 添加用户表单，验证规则
            addFormRules: {
                roleName: [
                    {
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 15,
                        message: '长度在 2 到 15 个字符之间',
                        trigger: 'blur'
                    }
                ],
                roleDesc: [
                    {
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 15,
                        message: '长度在 3 到 15 个字符之间',
                        trigger: 'blur'
                    }
                ]
            },
            editFormRules: {
                roleName: [
                    {
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 15,
                        message: '长度在 2 到 15 个字符之间',
                        trigger: 'blur'
                    }
                ],
                roleDesc: [
                    {
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 15,
                        message: '长度在 3 到 15 个字符之间',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        async getRoleList() {
            const { data: res } = await this.$http.get('roles')
            console.log(res)

            if (res.status !== 200) {
                return this.$message.error('获取角色列表失败!')
            }

            this.roleList = res.data.roles
        },
        // 添加角色
        addRole() {
            this.addRoleDialogVisible = true
        },
        // 添加对话框关闭
        addDialogClosed() {
            // 清空表单的值和提示
            this.$refs.addFormRef.resetFields()
        },
        // 添加角色btn
        addRoleBtn() {
            // 数据预校验
            this.$refs.addFormRef.validate(async valid => {
                // 提交前验证
                // console.log(valid)
                if (valid) {
                    const { data: res } = await this.$http.post(
                        '/roles',
                        this.addForm
                    )

                    if (res.status !== 200) {
                        return this.$message.error('添加角色失败!')
                    }
                    console.log(res)
                    this.$message.success('添加角色成功!')
                    this.addRoleDialogVisible = false

                    // 重新获取角色列表
                    this.getRoleList()
                }
            })
        },
        // 编辑对话框关闭
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        editRoleInfo() {
            // 表单数据预校验
            this.$refs.editFormRef.validate(async valid => {
                console.log(valid)
                if (valid) {
                    const { data: res } = await this.$http.post(
                        'roles/' + this.editForm.id,
                        {
                            roleName: this.editForm.roleName,
                            roleDesc: this.editForm.roleDesc
                        }
                    )
                    if (res.status !== 200) {
                        return this.$message.error('更新数据失败!')
                    }
                    console.log(res)
                    // 提示更新成功
                    this.$message.success('更新用户数据成功!')
                    // 刷新角色列表
                    this.getRoleList()
                    // 关闭对话框
                    this.editDialogVisible = false
                }
            })
        },
        // 展示修改角色对话框
        async showEditDialog(id) {
            console.log(id)
            this.editDialogVisible = true

            const { data: res } = await this.$http.get('roles/' + id)
            console.log(res)
            if (res.code !== 200) {
                return this.$message.error('获取角色数据失败!')
            }

            this.editForm = res.data
            // console.log(this.editForm)
        },
        async removeRoleById(id) {
            // 询问用户是否删除数据
            const confirmResult = await this.$confirm(
                '此操作将永久删除该角色, 是否继续?',
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
                return this.$message.info('已经取消删除角色!')
            }

            const { data: res } = await this.$http.delete('roles/' + id)
            console.log(res)
            if (res.status !== 200) {
                return this.$message.error('删除数据失败!')
            }
            this.$message.success('删除数据成功!')
            this.getRoleList()
        },
        // 根据权限id 移除right
        async removeRightById(role, rightId) {
            console.log(rightId)
            // 询问用户是否删除数据
            const confirmResult = await this.$confirm(
                '此操作将永久删除该权限, 是否继续?',
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
                return this.$message.info('已经取消删除权限!')
            }

            const { data: res } = await this.$http.delete(
                `/role/${role.id}/right/${rightId}`
            )
            console.log(res)

            role.children = res.data
        },
        // 展示权限对话框
        async showRightDialog(role) {
            this.roleId = role.id
            const { data: res } = await this.$http.get('rights/tree')
            this.rightsList = res.data
            console.log(this.rightsList)

            this.getLeafKeys(role, this.defKeys)

            // 显示添加权限对话框
            this.setRightDialogVisible = true
        },
        // 通过递归获取叶子节点key
        getLeafKeys(node, arr) {
            // 三级节点
            if (!node.children) {
                return arr.push(node.id)
            }

            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            })
        },
        // 树形对话框关闭
        setRightDialogClosed() {
            this.defKeys = []
        },
        // 确定按钮分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]

            const idsStr = keys.join(',')
            // console.log(keys)
            const { data: res } = await this.$http.post(
                `role/${this.roleId}/right`,
                {
                    rIds: idsStr
                }
            )

            console.log(res)

            // 刷新列表
            this.getRoleList()

            this.$message.success('分配权限成功!')

            this.setRightDialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}

.bd-top {
    border-top: 1px solid #eee;
}
.bd-bottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>
