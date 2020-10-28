<template>
    <div class="container" v-if="showLogin">
        <my-message :type='messageType' :text='messageText' v-if="messageShow"></my-message>
        <div class="loginBox">
            <h3>妮可图床</h3>
            <form @submit.prevent="handleSubmit">
                <div class="line">
                    <span>用 户 名 ：</span>
                    <input type="text" v-model="username">
                </div>
                <div class="line">
                    <span>密 码 ：</span>
                    <input type="password" v-model="password">
                </div>
                <div class="finalLine">
                    <input type="checkbox" name="checkbox" id="checkbox" v-model="rememberme">
                    <label class="remme" for="checkbox">记住我</label>
                    <input class="submitInput" type="submit" value="登录" @keyup.enter="submit">
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import Message from '../components/message/message.vue'

export default {
    data() {
      return {
         username:'',
         password:'',
         rememberme:false,
         messageShow:false,
         showLogin:false
      }
    },
    components:{
        'my-message':Message
    },
    mounted(){
        if(this.$cookie.get('token')){
            this.quickLogin()
        }else{
            this.showLogin = true
        }
    },
    methods: {
        // 登录
        async handleSubmit(){
            // 先将消息提示销毁备用
            this.messageShow = false
            let username = this.username
            let password = this.password

            // 用户没有输入信息
            if(username==''||password==''){
                this.messageType = 'error'
                this.messageText = '信息输入不全'
                setTimeout(() => {
                    this.messageShow = true
                }, 50);
                return
            }

            // 用户输入了信息，进行请求
            const res = await this.$http.post('/checkuser',{username,password})
            if(res.data.code==200){
                window.sessionStorage.setItem('token',res.data.token)
                this.$cookie.set('username', res.data.rs[0].username, { 
                    expires: 7,
                    path: '',
                })
                if(this.rememberme){
                    this.$cookie.set('token', res.data.token, { 
                        expires: 7,
                        path: '',
                    })
                }else{
                    this.$cookie.remove('token')
                }
                this.$router.push('/home')
            }else{
                this.messageType = 'error'
                this.messageText = '登录失败'
                this.messageShow = true
                this.username = ''
                this.password = '',
                this.rememberme = false
            }
        },

        // 自动登录
        async quickLogin(){
            const token = this.$cookie.get('token')

            const res = await this.$http.post('/quickcheckuser',{token}).catch(function (error) {})
            if(res==undefined) return

            if(res.data.code==200){
                // 更新token
                window.sessionStorage.setItem('token',res.data.token)
                this.$cookie.set('token', res.data.token, { 
                        expires: 7,
                        path: '',
                })
                this.$router.push('/home')
            }else{
                this.showLogin = true
                this.messageType = 'error'
                this.messageText = '自动登录失败'
                this.$cookie.remove('token')
            }
            this.messageShow = true
        }
    },
}
</script>

<style lang="less" scoped>
.container{
    position: relative;
    width: 100%;
    height: 100%;
    background: url('../assets/xingkong.webp');
    background-size: 100% 100%;
    color: #3F3F3F;

    .loginBox{
        position: absolute;
        width: 500px;
        height: 350px;
        left: 50%;
        top: 50%;
        background-color: rgba(255, 255, 255, 0.85);
        transform: translate(-50%,-50%);
        border-radius: 10px;

        h3{
            text-align: center;
            font-size: 40px;
        }

        form{
            .line{
                text-align: center;
                margin-bottom: 20px;
                span{
                    display: inline-block;
                    width: 130px;
                    text-align: right;
                    font-size: 23px;
                }
                input{
                    border-radius: 4px;
                    border: 1px solid #DCDFE6;
                    background-color: rgba(255, 255, 255, 0.55);
                    width: 200px;
                    height: 30px;
                    outline-style: none ;
                    font-size: 20px;
                    color: #3F3F3F;
                    padding-left: 20px;
                }
            }
            .finalLine{
                text-align: center;

                .submitInput{
                    display: inline-block;
                    width: 150px;
                    height: 30px;
                    background-color: rgba(255, 255, 255, 0.85);
                    border: 1px solid lightblue;
                    outline-style: none ;
                    color: #3F3F3F;
                }
                input{
                        width: 14px;
                        height: 14px;
                        vertical-align: middle;
                }
                .remme{
                    display: inline-block;
                    margin-right: 25px;
                    vertical-align: middle;
                }
            }
        }
    }
}
</style>