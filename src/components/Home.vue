<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/luffy.jpg" alt />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="loginOut">退出</el-button>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleisCollapse">|||</div>
                <!-- 侧边栏菜单区 -->
                <el-menu
                    background-color="#323744"
                    text-color="#fff"
                    active-text-color="#3598ff"
                    :unique-opened="true"
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :router="true"
                    :default-active="activePath"
                >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+'' " v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authname}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            :index="'/'+subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            @click="saveNavState('/' + subItem.path)"
                        >
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{subItem.authname}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 页面主体区域 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>

export default {
    data() {
        return {
            // 左侧菜单数据
            menuList: [],
            iconsObj: {
                101: 'iconfont icon-user',
                110: 'iconfont icon-quanxiankuaizhuang',
                105: 'iconfont icon-shangpinguanli',
                120: 'iconfont icon-dingdanguanli',
                131: 'iconfont icon-shujutongji'
            },
            isCollapse: false, // 是否折叠
            activePath: ''
        }
    },
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        loginOut() {
            // 清除token
            window.sessionStorage.clear()
            // 跳转到登录页
            this.$router.push('/login')
        },
        async getMenuList() {
            const { data: res } = await this.$http.get('/menus')
            console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.menuList = res.data
        },
        toggleisCollapse() {
            this.isCollapse = !this.isCollapse
        },
        // 保存链接激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373c41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        // div 嵌套写法
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #323744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf2;
}

.iconfont {
    margin-right: 10px;
}

.toggle-button {
    background-color: #485164;
    color: #fff;
    height: 24px;
    text-align: center;
    font-size: 15px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
