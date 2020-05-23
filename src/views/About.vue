<template>
    <div class="wrapper AboutView">
        <div class="form-box">
            <el-form :inline="true" :model="newTaskModel" class="demo-form-inline">
                <el-form-item label="作业名">
                    <el-input v-model="newTaskModel.taskName" placeholder="作业名" style=""></el-input>
                </el-form-item>
                <el-form-item label="作业内存">
                    <el-input-number v-model="newTaskModel.taskMemory" placeholder="作业类型" :min="1" style="width: 221px; box-sizing: border-box">
                        <el-option label="释放" :value="0"></el-option>
                        <el-option label="申请" :value="1"></el-option>
                    </el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addTask">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-box">
            <el-form :inline="true" :model="newExecuteEvent" class="demo-form-inline">
                <el-form-item label="作业名">
                    <el-input v-model="newExecuteEvent.taskName" placeholder="作业名"></el-input>
                </el-form-item>
                <el-form-item label="作业类型">
                    <el-select v-model="newExecuteEvent.taskType" placeholder="作业类型" style="width: 221px; box-sizing: border-box">
                        <el-option label="释放" :value="0"></el-option>
                        <el-option label="申请" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addExecuteEvent">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-box" >
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="算法类型">
                    <el-select v-model="useType" :disabled="disabled">
                        <el-option :value="0" label="首次适应算法">首次适应算法</el-option>
                        <el-option :value="1" label="最佳适应算法">最佳适应算法</el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container" style="display: flex">
            <el-table :data="taskData" style="width: 100%" max-height="500">
                <el-table-column align="center" prop="taskName" label="作业名"></el-table-column>
                <el-table-column align="center" prop="taskMemory" label="作业所需内存"></el-table-column>
                <el-table-column align="center" label="申请内存事件">
                    <template slot-scope="scope">
                        <p>{{scope.row.applyMemoryEvent ? "已添加" : "未添加"}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="释放内存事件">
                    <template slot-scope="scope">
                        <p>{{scope.row.freeMemoryEvent  ? "已添加" : "未添加"}}</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="memory-container" style="margin-top: 30px; display: flex">
            <div class="memory-box" style="width: 300px; box-sizing: border-box; margin-right: 20px; border: solid black 1px; height: 500px">
                <div class="item" :style="{
                    backgroundColor : memory.status ? 'rgb(151, 150, 151)' : '#ffffff',
                    border : 'solid black 1px',
                    height : `${memory.size / 640 * 500}px`,
                    lineHeight : `${memory.size / 640 * 500}px`
                }" v-for="(memory, index) in memoryLinkedList">
                    {{memory.size}}  {{memory.msg}}
                </div>
            </div>
            <el-table :data="executeEventData" style="width: 40%" max-height="500" :row-class-name="tableRowClassName">
                <el-table-column align="center" prop="taskName" label="作业名"></el-table-column>
                <el-table-column align="center" label="事件">
                    <template slot-scope="scope">
                        <p>{{scope.row.eventType ? "申请" : "释放"}}{{nameToTaskMap.get(scope.row.taskName).taskMemory}}内存</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 20px; margin-bottom: 50px">
            <el-button type="primary" @click="execute">执行</el-button>
        </div>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import LinkedList from "@/bean/LinkList";
    import Task, {EventType, TaskEvent} from "@/bean/Task";
    import EnhancedArray from "@/bean/EnhancedArray";
    import MemoryPartition, {Status} from "@/bean/MemoryPartition";

    type ExecuteEventModel = {
        taskName : string,
        eventType : EventType
    }


    @Component({
        components: {}
    })
    export default class About extends Vue {

        private linkList = new LinkedList<any>();
        private newTaskModel = {
            taskName : "",
            taskMemory : 0
        };
        private newExecuteEvent = {
            taskName : "",
            taskType : 0
        };
        private index : number = 0;

        private nameToTaskMap = new Map<string, Task>();
        private WorkEventQueue : Array<ExecuteEventModel> = [];

        private taskData : Array<Task> = new EnhancedArray();
        private executeEventData : Array<ExecuteEventModel> = new EnhancedArray();
        private memoryLinkedList : LinkedList<MemoryPartition> = new LinkedList();
        private useType : number = 1;

        private disabled : boolean = false;

        mounted() {
            this._addTask("作业1", 130);
            this._addTask("作业2", 60);
            this._addTask("作业3", 100);
            this._addTask("作业4", 200);
            this._addTask("作业5", 140);
            this._addTask("作业6", 60);
            this._addTask("作业7", 50);
            this._addTask("作业8", 60);
            this._addExecuteEvent("作业1", EventType.ApplyMemory);
            this._addExecuteEvent("作业2", EventType.ApplyMemory);
            this._addExecuteEvent("作业3", EventType.ApplyMemory);
            this._addExecuteEvent("作业2", EventType.FreeMemory);
            this._addExecuteEvent("作业4", EventType.ApplyMemory);
            this._addExecuteEvent("作业3", EventType.FreeMemory);
            this._addExecuteEvent("作业1", EventType.FreeMemory);
            this._addExecuteEvent("作业5", EventType.ApplyMemory);
            this._addExecuteEvent("作业6", EventType.ApplyMemory);
            this._addExecuteEvent("作业7", EventType.ApplyMemory);
            this._addExecuteEvent("作业8", EventType.ApplyMemory);
            this.memoryLinkedList.append(new MemoryPartition(640));
        }

        // @ts-ignore
        tableRowClassName({row, rowIndex}) {
            if (this.index == rowIndex) {
                return 'warning-row';
            } else if (this.index > rowIndex) {
                return 'success-row'
            }
            return '';
        }
        addExecuteEvent() {
            let executeEvent = this._clone(this.newExecuteEvent);
            let task = this.nameToTaskMap.get(executeEvent.taskName);
            if (!task) {
                this.$message.warning("这个作业还没有被添加哦");
                return;
            }
            if (executeEvent.taskType === EventType.FreeMemory) {
                if (!task.freeMemoryEvent) {
                    task.freeMemoryEvent = new TaskEvent(task, EventType.FreeMemory);
                } else {
                    this.$message.warning("这个事件已经被添加了");
                }
            } else {
                if (!task.applyMemoryEvent) {
                    task.applyMemoryEvent = new TaskEvent(task, EventType.ApplyMemory);
                } else {
                    this.$message.warning("这个事件已经被添加了");
                }
            }
        }

        addTask() {
            if (this.nameToTaskMap.get(this.newTaskModel.taskName)) {
                this.$message.warning("这个作业已经被添加了");
                return;
            }
            this._addTask(this.newTaskModel.taskName, this.newTaskModel.taskMemory);
        }

        _addTask(taskName : string, taskMemory : number) {
            let task = new Task(taskName, taskMemory);
            this.taskData.push(task);
            this.nameToTaskMap.set(task.taskName, task);
        }

        _clone<T extends Object>(o : T) : T{
            return JSON.parse(JSON.stringify(o));
        }

        _addExecuteEvent(taskName : string, eventType : EventType) {

            this.executeEventData.push({
                taskName,
                eventType
            });
            let task : Task = <Task>this.nameToTaskMap.get(taskName);
            if (eventType === EventType.FreeMemory) {
                task.freeMemoryEvent = new TaskEvent(task, EventType.FreeMemory);
            } else {
                task.applyMemoryEvent = new TaskEvent(task, EventType.ApplyMemory);
            }
        }

        execute() {
            if (this.index >= this.executeEventData.length) {
                this.$message.warning("任务已经执行完了哦");
                return;
            }
            if (this.index === 0) {
                this.disabled = true;
            }
            let curTask = this.executeEventData[this.index];
            let task = this.nameToTaskMap.get(curTask.taskName)!;
            let eventType = curTask.eventType;
            if (eventType === EventType.ApplyMemory) {
                let insertIndex = 0;
                let flag = false;
                for (let i = 0; i < this.memoryLinkedList.getLength(); i++, insertIndex ++) {
                    let memory = this.memoryLinkedList.getElementByIndex(i);
                    if (memory!.size > task.taskMemory && memory?.status === Status.Idle) {
                        memory!.size -= task.taskMemory;
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    this.memoryLinkedList.insert(insertIndex, new MemoryPartition(task!.taskMemory, task!.taskId, Status.Using, task!.taskName));
                } else {
                    this.$message.warning("内存不足, 无法分配");
                }
            } else {
                let res = this.memoryLinkedList.searchNode((node) => {
                    return node.taskId === task.taskId;
                });
                let index : number = res?.index!;
                let element : MemoryPartition = res?.element!;
                let prevMemory = this.memoryLinkedList.getElementByIndex(index - 1);
                let nextMemory = this.memoryLinkedList.getElementByIndex(index + 1);
                element.status = Status.Idle;
                element.msg = "";
                if (prevMemory?.status === Status.Idle) {
                    element.size += prevMemory.size;
                    console.log(this.memoryLinkedList.indexOf(prevMemory), index - 1);
                    this.memoryLinkedList.remove(prevMemory);
                }
                if (nextMemory?.status === Status.Idle) {
                    element.size += nextMemory.size;
                    this.memoryLinkedList.remove(nextMemory);
                }
            }
            if (this.useType === 1) {
                let prevLength = this.memoryLinkedList.getLength();
                this.memoryLinkedList.sort((memoryA, memoryB) => {
                    return memoryA.size - memoryB.size;
                });
                let curLength = 0;
                do {
                    prevLength = this.memoryLinkedList.getLength();
                    for (let i = 0; i < this.memoryLinkedList.getLength() - 1; i++) {
                        let memory = this.memoryLinkedList.getElementByIndex(i)!;
                        let nextMemory = this.memoryLinkedList.getElementByIndex(i + 1)!;
                        if ((memory?.status === Status.Idle) && (nextMemory.status === Status.Idle)) {
                            memory.size += nextMemory.size;
                            this.memoryLinkedList.remove(nextMemory);
                        }
                    }
                    curLength = this.memoryLinkedList.getLength();
                }while (curLength !== prevLength);

            }
            this.index ++;
        }


    }
</script>

<style lang="less" scoped>


</style>

<style lang="less">
    .AboutView {
        .el-table .warning-row {
            background: oldlace;
        }

        .el-table .success-row {
            background: #f0f9eb;
        }
    }
</style>
