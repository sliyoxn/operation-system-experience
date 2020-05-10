<template>
    <div class="wrapper HomeView">
        <div class="form-box">
            <el-form :inline="true" :model="newProcessData" class="demo-form-inline">
                <el-form-item label="进程名">
                    <el-input placeholder="进程名" v-model="newProcessData.processName"></el-input>
                </el-form-item>
                <el-form-item label="执行时间">
                    <el-input-number :min="1" placeholder="执行时间" v-model="newProcessData.executeTime"></el-input-number>
                </el-form-item>
                <el-form-item label="到达时间">
                    <el-input-number :min="0" placeholder="到达时间" v-model="newProcessData.arriveTime"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onAdd" type="primary">添加</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleExecute" type="primary">执行</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-box">
            <el-table :data="processData" style="width: 100%" max-height="500">
                <el-table-column align="center" prop="processName" label="进程名"></el-table-column>
                <el-table-column align="center" prop="arriveTime" label="到达时间"></el-table-column>
                <el-table-column align="center" prop="executeTime" label="运行时间"></el-table-column>
                <el-table-column align="center" prop="startTime" label="开始执行时间"></el-table-column>
                <el-table-column align="center" prop="endTime" label="停止执行时间"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="table-box" style="margin-top: 20px">
            <el-table :data="executeResult" style="width: 100%" max-height="2000">
                <el-table-column align="center" prop="time" label="时间"></el-table-column>
                <el-table-column align="center" prop="curProcessName" label="正在执行的进程"></el-table-column>
            </el-table>
        </div>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import Process from "@/bean/Process";
    import EnhancedArray from "@/bean/EnhancedArray";
    @Component({
        components: {}
    })
    export default class Home extends Vue {

        private newProcessData : Process = new Process();

        private processData : EnhancedArray<Process> = new EnhancedArray<Process>();

        public readonly executeResult = new EnhancedArray();



        onAdd() {
            this.processData.push(this.newProcessData.clone());
        }
        handleDelete(process : Process) {
            this.processData.remove(process);
        };

        mounted() {
            this.processData.push(
                new Process("A", 2,0),
                new Process("B", 3,1),
                new Process("C",4,2),
                new Process("D", 1,3),
                new Process("E", 3, 3)
            )
        }

        handleExecute() {
            let executeQueue : EnhancedArray<Process> = new EnhancedArray<Process>();
            let waitQueue : EnhancedArray<Process> = EnhancedArray.generateFromArray(this.processData);
            let current;
            let currentTime = 0;
            let loopCount = 0;
            this.executeResult.clear();
            waitQueue.sort((a : Process, b : Process) => {
                return Number(a.arriveTime < b.arriveTime);
            });
            while ((waitQueue.length || executeQueue.length || current) && (loopCount < 1000)) {
                while (waitQueue.length && waitQueue.getTop().arriveTime <= currentTime) {
                    executeQueue.push(<Process>waitQueue.shift())
                }
                // 空闲
                if (!current) {
                    if (executeQueue.getTop()) {
                        current = executeQueue.shift();
                        (<Process>current).execute(currentTime);
                    }
                } else if (current.getEndTime() <= currentTime){
                    current = null;
                    if (executeQueue.getTop()) {
                        current = executeQueue.shift();
                        (<Process>current).execute(currentTime);
                    }
                }

                this.executeResult.push({
                    time : currentTime,
                    curProcessName : current ? current.processName : "空闲"
                });
                currentTime++;
                loopCount ++;
            }
            this.executeResult.pop();
        }

    }
</script>

<style lang="less" scoped>

</style>
