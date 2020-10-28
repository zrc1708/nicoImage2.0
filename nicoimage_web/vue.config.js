module.exports={
    chainWebpack:config =>{
        
  
        config.set('externals', {
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'js-cookie':'Cookies',
            'vue-lazyload':'VueLazyload'
        })
    },
    publicPath: './',  //输出的根路径  默认是/ 如果你的网站是app.com/vue 这更改此配置项
}