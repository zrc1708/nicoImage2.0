<template>
    <div class="container">
        <ul>
            <li class="tab" @click="cloudMove($event);clickTab(item.name) " v-for="(item,index) in items" :key="index">{{item.name}}</li>
        </ul>
        <span class="cloud"><span></span></span>
    </div>
</template>
<script>
    export default {
        props: ['items'],
        data(){
            return{
           
            }
        },
        mounted(){
            this.cloud = document.querySelector('.cloud')
            this.cloud.style.width=100/this.items.length+'%'
            const left = window.sessionStorage.getItem('bar')
            if(left){
                this.cloud.style.marginLeft = left+'px'
            }
        },
        methods:{
            animate(obj, target, callback) {
                // 先清除以前的定时器，只保留当前的一个定时器执行
                clearInterval(obj.timer);
                obj.timer = setInterval(function () {
                    var step = (target - obj.offsetLeft) / 10
                    step = step > 0 ? Math.ceil(step) : Math.floor(step)
                    if (obj.offsetLeft == target) {
                        // 停止动画 本质是停止定时器
                        clearInterval(obj.timer);
                        // 如果有回调函数，就调用回调函数
                        callback && callback()
                    }
                    // 慢慢变小实现缓动效果 步长公式：（目标值-现在位置）/10
                    obj.style.marginLeft = obj.offsetLeft + step + 'px';
                }, 15);
            },
            cloudMove(e){
                this.animate(this.cloud,e.target.offsetLeft)
                window.sessionStorage.setItem('bar',e.target.offsetLeft)
            },
            // 父组件回调
            clickTab(item){
                this.$emit('clickbar',item); 
            },
        }
    }
</script>
<style lang="less" scoped>
    .container{
        position: relative;
    }
    ul {
        display: flex;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    li {
        // padding: 20px;
        font-size: 24px;
        flex: 1;
        text-align: center;
        color: #000;
        list-style: none;
        cursor: pointer;
    }
    .cloud{
        height:6px;
        display: block;
        span{
            background-color: rgb(43,128,185);
            border-radius: 3px;
            width: 40%;
            height:6px;
            display: block;
            margin: 0 auto;
        }
    }
</style>