<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">进程调度</router-link>
            |
            <router-link to="/about">动态分区分配方式</router-link>
        </div>
<!--        <keep-alive>-->
<!--            <router-view/>-->
<!--        </keep-alive>-->
        <router-view/>
    </div>
</template>

<style lang="less">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }



    ::-webkit-scrollbar {
        height: initial!important;
    }
</style>
