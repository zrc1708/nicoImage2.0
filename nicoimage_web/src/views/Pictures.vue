<template>
    <div class="picturescontainer">
        <my-message :type='messageType' :text='messageText' v-if="messageShow"></my-message>
        <ul ref="picturesUl">
            <li v-for="(item) in imagesArr" :key="item.id">
                <my-imagecard :image="item" 
                @copyCallBack="copyCallBack" 
                @delCallBack="delCallBack"
                @delFailCallBack="delFailCallBack"></my-imagecard>
            </li>
            <li v-for="(item,index) in 10" :key="index" class="white-list"></li>
        </ul>
    </div>
</template>
<script>
import imagecard from '../components/imagecard/imagecard.vue'
import Message from '../components/message/message.vue'

    export default {
        data(){
            return{
                imagesArr:[],
                messageShow:false
            }
        },
        created(){
            this.getAllImages()
        },
        components:{
            'my-imagecard':imagecard,
            'my-message':Message,
        },
        methods:{
            async getAllImages(){
                const res = await this.$http.get('/getallimages')
                this.imagesArr = res.data.rs
            },
            copyCallBack(){
                this.message('success','复制成功')
            },
            delCallBack(){
                this.message('success','删除成功')
                this.getAllImages()
            },
            delFailCallBack(){
                this.message('error','删除失败')
            },
            message(type,text){
                this.messageShow = false
                this.messageType = type
                this.messageText = text
                setTimeout(() => {
                    this.messageShow = true
                }, 50);
            },
        }
    }
</script>
<style lang="less" scoped>
.picturescontainer{
    ul{
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        li{
            list-style: none;
        }
        .white-list{
            width: 300px;
            height: 0;
            margin: 10px;
        }
    }
}
</style>