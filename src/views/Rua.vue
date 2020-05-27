<template>
    <div class="wrapper RuaView">
        <div class="form-box">
            <el-form :inline="true" :model="newQueueData" class="demo-form-inline">
                <el-form-item label="队列名">
                    <el-input placeholder="队列名" v-model="newQueueData.queueName"></el-input>
                </el-form-item>
                <el-form-item label="分配给每个任务的时间片">
                    <el-input-number :min="1" placeholder="时间片" v-model="newQueueData.timeSlice"></el-input-number>
                </el-form-item>
                <el-button @click="addQueue" type="primary">添加</el-button>
            </el-form>
        </div>
        <div class="form-box">
            <el-form :inline="true" :model="newWorkData" class="demo-form-inline">
                <el-form-item label="任务名">
                    <el-input placeholder="任务名" v-model="newWorkData.taskName"></el-input>
                </el-form-item>
                <el-form-item label="任务到达时间">
                    <el-input-number :min="0" placeholder="任务到达时间" v-model="newWorkData.arriveTime"></el-input-number>
                </el-form-item>
                <el-form-item label="执行所需时间">
                    <el-input-number :min="1" placeholder="执行所需时间" v-model="newWorkData.executeTime"></el-input-number>
                </el-form-item>
                <el-button @click="addWork" type="primary">添加</el-button>
            </el-form>
        </div>
        <div class="table-box" style="margin-bottom: 30px">
            <el-table :data="workQueues" style="width: 100%">
                <el-table-column align="center" prop="queueName" label="队列名"></el-table-column>
                <el-table-column align="center" prop="timeSlice" label="时间片"></el-table-column>
            </el-table>
        </div>
        <div class="table-box">
            <el-table :data="workTableData" style="width: 100%" :row-class-name="tableRowClassName">
                <el-table-column align="center" prop="workName" label="任务名"></el-table-column>
                <el-table-column align="center" prop="arriveTime" label="到达时间"></el-table-column>
                <el-table-column align="center" prop="executeTime" label="需执行时间"></el-table-column>
                <el-table-column align="center" prop="timeSli" label="执行时间"></el-table-column>
            </el-table>
        </div>
        <div class="execute-box" style="margin-top: 20px">
            <div class="status-box" style="display: flex; justify-content: center; align-items: center">
                <el-button type="primary" style="height: 40px; margin-right: 20px" @click="executeNext" v-show="pending">开始执行</el-button>
                <el-button type="primary" style="height: 40px; margin-right: 20px" @click="executeNext" v-show="!pending">执行next</el-button>
                <p style="font-size: 16px">当前时间 : <span style="color: #12b5ff">{{time}}</span></p>
            </div>
        </div>
        <div class="view-box" style="display: flex; justify-content: left">
<!--            <div class="work-wait-view">-->
<!--                <div class="wait-work" v-for="(work, index) in workTableData"></div>-->
<!--            </div>-->
            <div class="queue-view" style="display: flex; flex-direction: column">
                <div class="queue-visibility" v-for="(queue, data) in workQueues"
                     style="display: flex; flex-direction: column; align-items: start;
                     border: 1px solid black;margin-bottom: 15px;
                     padding: 0px 10px 10px 10px;
                     cursor: pointer;
                "
                >
                    <p style="margin: 10px 0">队列 : {{queue.queueName}}  <span style="margin-left: 20px">时间片 : {{queue.timeSlice}}</span></p>
                    <div class="work-view" style="width: 100%; display: flex; flex-wrap: wrap">
                        <div class="work" v-for="(work, index) in queue.queue" style="border: 1px solid black; padding: 5px 8px;">
                            {{work.workName}} : {{work.hasExecuteTime}} / {{work.executeTime}}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>

</template>

<script lang="ts">
    import {Component, Emit, Inject, Model, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import EnhancedArray from "@/bean/EnhancedArray";
    import WorkQueue from "@/bean/WorkQueue";
    import Work from "@/bean/Work";
    import Stack from "@/bean/Stack";

    class Task {
        work : Work;
        remain : number;
        constructor(work : Work, remain : number) {
            this.work = work;
            this.remain = remain;
        }
    }

    @Component({
        components: {}
    })
    export default class Rua extends Vue {

        private workQueues : EnhancedArray<WorkQueue> = new EnhancedArray<WorkQueue>();
        private waitWork : EnhancedArray<Array<Work>> = new EnhancedArray<Array<Work>>();
        private time : number = 0;
        private pending : boolean = true;
        private taskStack : Stack<Task> = new Stack();
        private readonly completeWorkNameSet : Set<string> = new Set();
        private workQueueIndex : number = 0;

        get curWork() {
            return this.workQueues[this.workQueueIndex].queue.getTop();
        }

        get queueNameSet() {
            return new Set<string>(...this.workQueues.map(queue => queue.queueName));
        }

        get workNameSet() {
            return new Set<string>(this.workTableData.map(work => work.workName))
        }


        get workTableData() {
            return this.waitWork.flat(2);
        }


        private pushTask(t : Task) {
            this.taskStack.push(t);
        }

        private popTask() {
            return this.taskStack.pop();
        }


        private newQueueData = {
            queueName : "",
            timeSlice : 0
        };

        private newWorkData = {
            taskName : "",
            arriveTime : 0,
            executeTime : 0
        };




        private addQueue() {
            if (!this.newQueueData.queueName || this.queueNameSet.has(this.newQueueData.queueName)) {
                this.$message.warning("请检查字段是否填写完毕&有无重名");
                return;
            }
            this._addQueue(this.newQueueData.queueName, this.newQueueData.timeSlice);
        }

        private addWork() {
            if (!this.newWorkData.taskName || this.workNameSet.has(this.newWorkData.taskName)) {
                this.$message.warning("请检查字段是否填写完毕&有无重名");
                return;
            }
            this._addWork(this.newWorkData.taskName, this.newWorkData.arriveTime, this.newWorkData.executeTime);
        }

        private init() {
            this.time = 0;
        }

        private _addWork(workName : string, arriveTime : number, executeTime : number) {
            let work = new Work(workName, arriveTime, executeTime);
            if (this.waitWork[work.arriveTime]) {
                this.waitWork[work.arriveTime].push(work);
            } else {
                if (this.waitWork.length < work.arriveTime) {
                    this.waitWork.length = work.arriveTime;
                }
                this.waitWork.splice(work.arriveTime, 1, [work]);
            }
        }

        private _addQueue(queueName : string, timeSlice : number) {
            this.workQueues.push(new WorkQueue(queueName, timeSlice));
        }

        private executeNext() {
            if (this.pending) {
                this.init();
                this.pending = !this.pending;
            } else {
                this.time++;
            }
            this._addToExecuteQueue();
            this.workQueueIndex = 0;
            while (true) {
                if (this.curWork) {
                    // console.log(JSON.parse(JSON.stringify(this.taskStack)));
                    if (!this.taskStack.getTop() || (this.taskStack.getTop().work !== this.curWork)) {
                        this.taskStack.push(new Task(this.curWork, this.workQueues[this.workQueueIndex].timeSlice));
                    }
                    break;
                }
                if (this.workQueueIndex >= this.workQueues.length - 1) {
                    return;
                }
                this.workQueueIndex++;
            }
            let curTask = this.taskStack.getTop();
            if (curTask) {
                let work = curTask.work;
                curTask.remain--;
                work.executeAS(this.time);
                if (work.hasExecuteTime >= work.executeTime) {
                    this.completeWorkNameSet.add(work.workName);
                    this.taskStack.pop();
                    this.workQueues[this.workQueueIndex].queue.dequeue();
                }
                else if (!curTask.remain) {
                    this.taskStack.pop();
                    this._pushToNextQueue(work);
                }
            } else {
                // 0s时执行
                this.taskStack.push(curTask = new Task(this.curWork, this.workQueues[this.workQueueIndex].timeSlice));
            }



        }

        staticLog(o : any) {
            console.log(JSON.parse(JSON.stringify(o)));
        }

        _addToExecuteQueue() {
            let curTime = this.time;
            let workArr = this.waitWork[curTime];
            if (workArr) {
                this.workQueues.getTop().addWork(...workArr);
                console.log(JSON.parse(JSON.stringify(this.workQueues.getTop().queue)));
            }
        }

        _pushToNextQueue(work : Work) {
            let index = -1;
            for (let i = 0; i < this.workQueues.length; i++) {
                let idx = this.workQueues[i].queue.indexOf(work);
                if (idx != -1) {
                    index = i;
                    this.workQueues[i].queue.remove(work);
                    break;
                }
            }
            if (index != -1) {
                this.workQueues[index + 1].queue && this.workQueues[index + 1].queue.enqueue(work);
            }
        }

        mounted() {
            this._addWork("A",0,5);
            this._addWork("B", 1,5);
            this._addWork("C", 1,7);
            this._addWork("D",2, 9);
            this._addWork("E",3,3);
            this._addWork("F", 3,5);
            this._addWork("G", 4,10);
            this._addWork("H", 5,16);
            this._addWork("I", 25,5);
            this._addQueue("队列1",3);
            this._addQueue("队列2", 5);
            this._addQueue("底队列", Infinity);
        }

        // @ts-ignore
        private tableRowClassName({row, rowIndex}) {
            if (this.completeWorkNameSet.has(row.workName)) {
                return 'success-row';
            }
            if (row.arriveTime <= this.time && !this.pending) {
                return 'warning-row'
            }
            return '';
        }
    }
</script>

<style scoped lang="less">
    .RuaView {
        .work-view {
            & > div:nth-of-type(n + 1) {
                margin-right: 10px
            }
        }
    }

</style>

<style lang="less">
    .RuaView {
        .warning-row {
            background: oldlace;
        }

        .success-row {
            background: #b3f9b4;
        }
    }
</style>
