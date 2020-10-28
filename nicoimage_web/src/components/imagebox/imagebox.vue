<template>
    <div class="container">
        <img :src="imagesrc" alt="">
        <div class="urlbox">
            <p><span class="title">URL:</span>{{imageurl}}<span class="copy" @click="copy(imageurl)">copy</span></p>
            <p><span class="title">HTML:</span>{{imagehtml}}<span class="copy" @click="copy(imagehtml)">copy</span></p>
            <p><span class="title">Markdown:</span>{{imagemarkdown}}<span class="copy" @click="copy(imagemarkdown)">copy</span></p>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['imagesrc','imageurl'],
        data(){
            return{
                
            }
        },
        computed:{
            imagehtml(){
                return `<img src="${this.imageurl}" alt="">`
            },
            imagemarkdown(){
                let arr = this.imageurl.split('/')
                return `![${arr[arr.length-1]}](${this.imageurl})`
            }
        },
        methods:{
            copy(url){
                this.copyToClip(url)
                this.copyFinish()
            },
            // 父组件回调,复制成功后触发
            copyFinish(){
                this.$emit('copyfinish'); 
            },
            copyToClip(content){
                var aux = document.createElement("input"); 
                aux.setAttribute("value", content); 
                document.body.appendChild(aux); 
                aux.select();
                document.execCommand("copy"); 
                document.body.removeChild(aux);
            }
        }
    }
</script>
<style lang="less" scoped>
    .container{
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        img{
            display: block;
            height: 180px;
        }
        .urlbox{
            display: grid;
            grid-template-rows: 1fr 1fr 1fr;
            p{
                position: relative;
                color: #3F3F3F;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break:keep-all;
                padding-right: 50px;
                .title{
                    display: inline-block;
                    font-weight: bold;
                    width: 100px;
                    text-align: right;
                    padding-right: 20px;
                    color: black;
                }
                .copy{
                    position: absolute;
                    display: block;
                    right: 0;
                    top: 0;
                    color: white;
                    background-color: #2b80b9;
                    width: 45px;
                    height: 25px;
                    text-align: center;
                    line-height: 25px;
                    border-radius: 5px;
                    cursor: pointer;
                }
            }
        }
    }
</style>