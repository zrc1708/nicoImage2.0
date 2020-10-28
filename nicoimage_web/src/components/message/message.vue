<template>
    <div class="mymessage" :class="[state?'show':'hide']" v-if="show">
        <i :class="[type]"></i><span>{{text}}</span>
    </div>
</template>
<script>
    export default {
        // type有三种形式，success，error，none
        props: ['type','text'],
        data(){
            return{
                state:true,
                show:true,
            }
        },
        mounted(){
            setTimeout(() => {
                this.state = false
            }, 1600);
        }
    }
</script>
<style lang="less" scoped>
.mymessage{
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.9);
    height: 40px;
    min-width: 150px;
    border-radius: 5px;
    text-align: center;
}
.show{
    animation: showMessage .6s ease-out forwards;
}
.hide{
    animation: hideMessage .6s ease-out forwards;
}
@keyframes showMessage{
    from {
        top:-40px
    }
    to {
        top:15px;
    }
}
@keyframes hideMessage{
    from {
        top:15px
    }
    to {
        top:-40px;
    }
}

span{
    line-height: 40px;
    margin-right: 10px;
}
.success{
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url(./messageIcon.png) no-repeat;
    background-size: cover;
    vertical-align: middle;
    transform: translateY(-2px);
    margin: 0 10px;
}
.error{
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url(./messageIcon.png) no-repeat;
    background-size: cover;
    background-position: -20px 0;
    vertical-align: middle;
    transform: translateY(-2px);
    margin: 0 10px;
}
</style>