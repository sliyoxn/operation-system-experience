<template>
    <div class="wrapper InfoView">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="置换算法">
                <el-select v-model="replaceMethod" placeholder="置换算法">
                    <el-option label="FIFO" :value="0"></el-option>
                    <el-option label="LRU" :value="1"></el-option>
                    <el-option label="OPT" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="execute">执行</el-button>
            </el-form-item>
        </el-form>
        <div class="ruaQAQ">
            <p>执行次数 : {{executeCount}}</p>
            <p>缺页次数 : {{emptyPageCount}}</p>
            <p>缺页率: {{(emptyPageCount / executeCount).toFixed(2)}}</p>
        </div>
        <el-table :data="executeStatus" style="width: 100%" height="500">
            <el-table-column align="center" prop="index" label="第i个指令"></el-table-column>
            <el-table-column align="center" prop="instructionAddress" label="指令地址"></el-table-column>
            <el-table-column align="center" prop="pageIndex" label="页号"></el-table-column>
            <el-table-column align="center" prop="prevMemory" label="执行前内存块"></el-table-column>
            <el-table-column align="center" prop="nextMemory" label="执行后内存块"></el-table-column>
            <el-table-column align="center" prop="status" label="是否缺页">
                <template slot-scope="scope">
                    {{scope.row.status ? '是' : '否'}}
                </template>
            </el-table-column>
        </el-table>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {getRandom} from "@/util/randomUtil";
    import EnhancedArray from "@/bean/EnhancedArray";
    enum ReplaceMethod {
        FIFO = 0,
        LRU = 1,
        OPT = 2
    }

    class Status {
        index ?: number = 0;
        instructionAddress ?: number = 0;
        pageIndex ?: number = 0;
        prevMemory ?: string = "";
        nextMemory ?: string = "";
        status ?: boolean = false;
    }

    @Component({
        components: {}
    })
    export default class Info extends Vue {

        private readonly instructionCount: number = 320;    // 指令个数
        private replaceMethod: ReplaceMethod = 0;  // 置换方法
        private curPoint : number = 0;     // 当前指令
        private readonly instructionSequenceCount: number = 320; // 指令序列目标条数
        private readonly instructionSequence : Array<number> = [];
        private generateCount : number = 0;
        private readonly pageSize : number = 10;
        private readonly memory : EnhancedArray<number> = new EnhancedArray<number>();
        private readonly memorySize : number = 4;
        private readonly executeStatus : EnhancedArray<any> = new EnhancedArray<any>();
        private emptyPageCount : number = 0;
        private executeCount : number = 0;
        //  页面容量
        // 最大指令编号
        get endPoint() {
            return this.instructionCount - 1;
        }

        // 左边界
        get leftEdge() {
            return 0;
        }

        // 右边界
        get rightEdge() {
            return this.endPoint;
        }

        get pageSequence() {
            return this.instructionSequence.map((n : number) => {
                return Math.floor(n / this.pageSize);
            });
        }

        execute() {
            this.executeStatus.length = 0;
            this.memory.length = 0;
            this.instructionSequence.length = 0;
            this.generateCount = 0;
            this._generateInstructionSequence();
            let method : ReplaceMethod = this.replaceMethod;
            switch (method) {
                case ReplaceMethod.FIFO:
                    this._executeByFIFO();
                    break;
                case ReplaceMethod.LRU:
                    this._executeByLRU();
                    break;
                case ReplaceMethod.OPT:
                    this._executeByOPT();
                    break;
            }

        }

        _executeByFIFO() {
            let pageSequence = this.pageSequence;
            let memory = this.memory;
            let executeCount = this.pageSequence.length;
            let emptyPageCount = 0;
            for (let i = 0; i < pageSequence.length; i++) {
                let seq = pageSequence[i];
                let o : Status = new Status();
                o.index = i + 1;
                o.pageIndex = seq;
                o.prevMemory = memory.join();
                o.instructionAddress = this.instructionSequence[i];
                // 已经在页面缓存中
                if (memory.indexOf(seq) >= 0) {}
                else {
                    o.status = true;
                    if (memory.length >= this.memorySize) {
                        this.memory.shift();
                    }
                    this.memory.push(seq);
                    emptyPageCount++;
                }
                o.nextMemory = memory.join();
                this.executeStatus.push(o);
            }
            this.emptyPageCount = emptyPageCount;
            this.executeCount = executeCount;
            return emptyPageCount / executeCount;
        }

        _executeByLRU() {
            let pageSequence = this.pageSequence;
            let memory = this.memory;
            let executeCount = this.pageSequence.length;
            let emptyPageCount = 0;
            for (let i = 0; i < pageSequence.length; i++) {
                let seq = pageSequence[i];
                let o : Status = new Status();
                o.index = i + 1;
                o.pageIndex = seq;
                o.prevMemory = memory.join();
                o.instructionAddress = this.instructionSequence[i];
                // 已经在页面缓存中
                if (memory.indexOf(seq) >= 0) {
                    this.memory.remove(seq);
                    this.memory.push(seq);
                } else {
                    o.status = true;
                    if (memory.length >= this.memorySize) {
                        this.memory.shift();
                    }
                    this.memory.push(seq);
                    emptyPageCount++;
                }
                o.nextMemory = memory.join();
                this.executeStatus.push(o);
            }
            this.emptyPageCount = emptyPageCount;
            this.executeCount = executeCount;
            return emptyPageCount / executeCount;
        }

        _executeByOPT() {
            const pageSequence = this.pageSequence;
            const memory = this.memory;
            let executeCount = this.pageSequence.length;
            let emptyPageCount = 0;
            for (let i = 0; i < pageSequence.length; i++) {
                let seq = pageSequence[i];
                let o : Status = new Status();
                o.index = i + 1;
                o.pageIndex = seq;
                o.prevMemory = memory.join();
                o.instructionAddress = this.instructionSequence[i];
                // 已经在页面缓存中
                if (memory.indexOf(seq) >= 0) {}
                else {
                    o.status = true;
                    if (memory.length >= this.memorySize) {
                        let max = -Infinity;
                        let target = -1;
                        for (let j = 0; j < memory.length; j++) {
                            let index = pageSequence.indexOf(memory[j], i);
                            if (index > max) {
                                target = memory[j];
                                max = index;
                            }
                        }
                        memory.remove(target);
                    }
                    this.memory.push(seq);
                    emptyPageCount++;
                }
                o.nextMemory = memory.join();
                this.executeStatus.push(o);
            }
            this.emptyPageCount = emptyPageCount;
            this.executeCount = executeCount;
            return emptyPageCount / executeCount;
        }

        created() {

        }

        _exeNext() : number {
            this.generateCount++;
            return ++this.curPoint;
        };

        _exePrevRan() : number{
            this.generateCount++;
            return this.curPoint = getRandom(this.leftEdge, this.curPoint - 1);
        };

        _exeNextRan() : number {
            this.generateCount++;
            return this.curPoint = getRandom(this.curPoint + 1, this.rightEdge);
        };

        _randomSetCurPoint() : null {
            this.curPoint = getRandom(this.leftEdge, this.rightEdge);
            return null;
        }

        // 生成指令序列
        _generateInstructionSequence() {
            let instructionSequenceCount = this.instructionSequenceCount;
            let arr : Array<Function> = [
                    this._randomSetCurPoint, this._exeNext,
                    this._exePrevRan, this._exeNext,
                    this._exeNextRan, this._exeNext
            ];
            while (this.generateCount < instructionSequenceCount) {
                let fn : Function = arr.shift()!;
                let val : null | number = fn();
                if (val != null) this.instructionSequence.push(val);
                arr.push(fn);
            }
        }



    }
</script>

<style scoped lang="less">

</style>
