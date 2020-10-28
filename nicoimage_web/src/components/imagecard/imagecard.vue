<template>
    <div class="imagecardcontainer">
        <img v-lazy="image.url" alt="">
        <ul>
            <li><div class="button watch" @click="watchBigImage"></div></li>
            <li><div class="button url" @click="copyUrl"></div></li>
            <li><div class="button delete" @click="showMask"></div></li>
        </ul>
        <div class="name">
            <p>{{image.filename}}</p>
        </div>
        <transition name="fade">
            <div class="mask" v-show="showmask">
                <div>确定要删除吗</div>
                <div>
                    <span @click="delImg">确定</span>
                    <span @click="nodel">取消</span>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        props: ['image'],
        data(){
            return{
                showmask: false,
                // openmask: false
            }
        },
        computed:{
            
        },
        methods:{
            watchBigImage(){
                window.open(this.image.url);
            },
            copyUrl(){
                this.copyToClip(this.image.url)
                this.copyCallBack()
            },
            copyCallBack(){
                this.$emit('copyCallBack')
            },
            copyToClip(content){
                var aux = document.createElement("input"); 
                aux.setAttribute("value", content); 
                document.body.appendChild(aux); 
                aux.select();
                document.execCommand("copy"); 
                document.body.removeChild(aux);
            },
            // 显示删除遮罩
            showMask(){
                this.showmask = true
            },
            async delImg(){
                const path = this.image.path
                const res = await this.$http.post('/remove',{path})
                if(res.data.code==200){
                    this.delCallBack()
                }else{
                    this.delFailCallBack()
                }
            },
            // 取消删除
            nodel(){
                this.showmask = false                
            },
            // 删除回调
            delCallBack(){
                this.$emit('delCallBack')
            },
            // 删除失败
            delFailCallBack(){
                this.$emit('delFailCallBack')
            }
        }
    }
</script>
<style lang="less" scoped>
.imagecardcontainer{
    display: inline-block;
    margin: 10px;
    position: relative;
    width: 300px;
    height: 300px;
    background-color: rgba(0, 0, 0, 0.08);
    overflow: hidden;

    &:hover ul{
        transform: translateX(0);
    }

    img{
        width:100%;
        height:100%;
        object-fit: contain;
    }
    
    ul{
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
        padding: 0;
        transition: all .35s ease-in-out;
        transform: translateX(100%);

        li{
            list-style: none;
            background-color: rgba(0, 0, 0, 0.6);
            margin-bottom: 5px;
            padding: 6px;

            .button{
                width: 30px;
                height: 30px;
                cursor: pointer;
            }
            .url{
                background: url(./nico.png) no-repeat;
                background-size: cover;
                background-position: 50% 0;
                vertical-align: middle;
            }
            .watch{
                background: url(./nico.png) no-repeat;
                background-size: cover;
                vertical-align: middle;
            }
            .delete{
                background: url(./nico.png) no-repeat;
                background-size: cover;
                background-position: 100% 0;
                vertical-align: middle;
            }
        }
    }

    .name{
        position: absolute;
        bottom: 0;
        height: 30%;
        width: 100%;
        background: linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,0.55) 100%);
        overflow: hidden;
        p{
            position: absolute;
            font-size: 20px;
            color: white;
            font-size: 20px;
            display: block;
            width: 100%;
            box-sizing: border-box;
            bottom: 0;
            padding: 0 15px;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
        }
    }
    .mask{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 2;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 20px;

        div:nth-child(2){
            margin-top: 20px;
            
            span{
                margin: 20px;
                border: 1px solid white;
                padding: 5px;
                cursor: pointer;

                &:hover{
                    background-color: rgba(255, 255, 255 ,0.5);
                }
            }
        }
    }   
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>