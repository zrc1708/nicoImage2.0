<template>
    <div class="container">
        <my-message :type='messageType' :text='messageText' v-if="messageShow"></my-message>
        <input type="file" ref="file" @change="checkField($event)" accept="image/*" multiple="multiple" v-show="false"/> 
        <div class="upload" ref="uploadbox">
            <div class="uploadboxOperation">
                <ul>
                    <li v-for="(item,index) in imgarr" :key="index">
                        <img :src="item" alt="">
                        <input type="text" v-model="filesNameArr[index]">
                    </li>
                </ul>
                <span class="uploadboxText">
                    拖动图片至此或
                    <span class="choose" @click="upload">选择文件</span>
                    <span v-if="imgarr.length!=0" @click="clear" class="clear">清除选择</span>
                </span>
            </div>
            <div class="uploadButton" @click="uploadImage" v-if="imgarr.length!=0">上传</div>
        </div>
        <div v-if="imageUrl">
            <my-imagebox v-for="(item,index) in imageUrl" :key="index" :imagesrc="imgarr2[index]" :imageurl="imageUrl[index]" @copyfinish="copyOK"></my-imagebox>
        </div>
    </div>
</template>
<script>
import Message from '../components/message/message.vue'
import ImageBox from '../components/imagebox/imagebox.vue'

    export default {
        data(){
            return{
                // 选择的图片本地地址
                imgarr:[],
                imgarr2:[],
                // 选择的图片文件对象
                filesArr:[],
                // 返回的图片图床地址
                imageUrl:[],
                filesNameArr:[],
                messageShow:false
            }
        },
        mounted(){
            const uploadbox = this.$refs.uploadbox
            uploadbox.addEventListener("dragenter", this.dragenter, false);
            uploadbox.addEventListener("dragover", this.dragover, false);
            uploadbox.addEventListener("drop", this.drop, false);
        },
        methods:{
            upload(){
                this.$refs.file.click()
            },       
            //获取所选文件的信息并进行上传
            checkField(e){
                window.URL = window.URL || window.webkitURL;
                this.message('success','选择图片成功')
                // 数量判断
                if(this.imgarr.length+this.$refs.file.files.length>16){
                    return this.message('error','最多一次上传16张图片')
                }
                this.$refs.file.files.forEach(item => {
                    // 上传前展示选择的图片
                    this.imgarr.push(window.URL.createObjectURL(item))
                    // 上传成功后使用
                    this.imgarr2.push(window.URL.createObjectURL(item))
                    this.filesArr.push(item)
                    this.filesNameArr.push(item.name)
                });
            },
            // 文件上传
            async uploadImage(){
                // 检测文件后缀是否被修改
                let nameArr = this.filesNameArr
                let flag = true
                this.filesArr.forEach((item,index)=>{
                    const name = item.name
                    if(name.split('.')[1]!==nameArr[index].split('.')[1]){
                        this.message('error','请不要修改文件后缀')
                        flag = false
                    }
                })
                if(!flag) return

                // 上传文件
                const formData = new FormData()
                const files = this.filesArr
                files.forEach(item=>{
                    formData.append("file",item)
                })
                const fileNames = this.filesNameArr
                formData.append('fileNames',fileNames)
                const res = await this.$http.post("uploadimage",formData)
                if(res.data.code==200){
                    this.message('success','图片上传成功')
                    // 保存图片地址
                    this.imageUrl = res.data.imageUrl
                    // 清除已上传图片相关信息
                    this.imgarr = []
                    this.filesArr = []
                    this.filesNameArr = []
                }else{
                    this.message('error','图片上传失败')
                }
            },

            // 清除选择
            clear(){
                this.message('success','已清除选择')
                this.imgarr = []
                // this.imgarr2 = []
                this.filesArr = []
                this.filesNameArr = []
            },

            message(type,text){
                this.messageShow = false
                this.messageType = type
                this.messageText = text
                setTimeout(() => {
                    this.messageShow = true
                }, 50);
            },

            // 禁止事件传播和阻止默认事件
            dragenter(e) {
                e.stopPropagation();
                e.preventDefault();
            },
            dragover(e) {
                e.stopPropagation();
                e.preventDefault();
            } ,
            // 拖拽上传
            drop(e) {
                e.stopPropagation();
                e.preventDefault();
                let files = e.dataTransfer.files;
                // 数量判断
                if(this.imgarr.length+files.length>16){
                    return this.message('error','最多一次上传16张图片')
                }
                // 内容判断
                let flag = 0
                files.forEach(item => {
                    if(item.type.split('/')[0]!=='image'){
                        flag=1
                    }
                });
                if(flag){
                    return this.message('error','请选择图片文件')
                }

                this.message('success','选择图片成功')
                files.forEach(item => {
                    this.imgarr.push(window.URL.createObjectURL(item))
                    this.filesArr.push(item)
                    this.filesNameArr.push(item.name)
                });
            },
            // 拷贝成功回调
            copyOK(){
                this.message('success','拷贝成功')
            }
        },
        components:{
            'my-message':Message,
            'my-imagebox':ImageBox
        },
    }
</script>
<style lang="less" scoped>
.upload{
    position: relative;
    border: 3px #8b8b8b dashed;
    box-sizing: border-box;
    width: 98%;
    min-height: 500px;
    border-radius: 10px;
    margin: 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .choose{
        text-decoration: underline;
        color: blue;
        cursor: pointer;
        &:active{
            color: blueviolet;
        }
    }
    .clear{
        text-decoration: underline;
        color: blue;
        margin-left: 10px;
        cursor: pointer;
        &:active{
            color: blueviolet;
        }
    }
    .uploadButton{
        box-sizing: border-box;
        position: absolute;
        bottom: 10px;
        right: 10px;
        border: 1px solid #8b8b8b;
        border-radius: 10px;
        width: 90px;
        height: 35px;
        text-align: center;
        line-height: 35px;
        cursor: pointer;
        transition: all .25s;
        &:hover{
            background-color: #38b7ea;
            color: white;
        }
    }
}

.uploadboxOperation{
    display: flex;
    flex-direction: column;

    .uploadboxText{
        text-align: center;
    }
}

ul{
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    li{
        list-style: none;
        margin: 10px;
        border: 1px solid lightblue;
        text-align: center;
        img{
            height: 180px;
            display: block;
            margin: 0 auto;
        }
        input{
            width: 95%;
            border: none;
            height: 25px;
            outline-style: none;
            text-align: center;
        }
    }
}
</style>