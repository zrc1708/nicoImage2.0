<template>
    <div>
        <div class="apibox">
            <p>本站提供api能在其他项目中将项目上传图床</p>
            <p><strong>接口地址：</strong>http://imgapi.jibei66.com/nicoimageapi/$userkey</p>
            <p><strong>方法：</strong>POST</p>
            <p><strong>请求参数：</strong></p>
            <table>
                <tr>
                    <th class="tablecolum1">参数名</th>
                    <th class="tablecolum1">参数类型</th>
                    <th class="tablecolum2">必须</th>
                    <th>描述</th>
                </tr>
                <tr>
                    <td>userkey</td>
                    <td>string</td>
                    <td>是</td>
                    <td>用户密钥，用来鉴别是否为本站授权用户。</td>
                </tr>
                <tr>
                    <td>fileNames</td>
                    <td>string</td>
                    <td>是</td>
                    <td>保存图片用的文件名（包含后缀），如有多个，使用逗号隔开</td>
                </tr>
                <tr>
                    <td>file</td>
                    <td>file</td>
                    <td>是</td>
                    <td>上传的文件</td>
                </tr>
            </table>
            <p><strong>返回参数</strong></p>
            <table>
                <tr>
                    <th class="tablecolum1">参数名</th>
                    <th class="tablecolum1">参数类型</th>
                    <th>描述</th>
                </tr>
                <tr>
                    <td>message</td>
                    <td>string</td>
                    <td>消息提示</td>
                </tr>
                <tr>
                    <td>imageUrl</td>
                    <td>arr</td>
                    <td>图片地址数组</td>
                </tr>
                <tr>
                    <td>code</td>
                    <td>number</td>
                    <td>状态码，200为成功，440为失败</td>
                </tr>
            </table>
            <p><strong>请求样例</strong></p>
            http://imgapi.jibei66.com/nicoimageapi/1b67sac
            <p><strong>返回样例</strong></p>
            <p>{"message": "上传成功！","imageUrl": ["http://imgapi.jibei66.com/getimage/jibei.jpg"],"code": 200}</p>
            <p><strong>详细教程</strong></p>
            <a href="http://blog.jibei66.com/#/readarticle?articleid=44" target="view_window">http://blog.jibei66.com/#/readarticle?articleid=44</a>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
           
            }
        },
        methods:{
            
        }
    }
</script>
<style lang="less" scoped>
    .apibox{
        max-width: 800px;
        margin: 0 auto;
        padding-top: 20px;
    }
    .tablecolum1{
        width: 120px;
    }
    .tablecolum2{
        width: 60px;
    }
</style>