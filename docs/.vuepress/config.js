const {appId, appKey} = require('../../secret')

module.exports = {
    base: '/',
    title: 'share and record',
    description: 'Programming, learning and enjoying life.',
    head: [
        ['meta', {name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no'}]
    ],
    dest: 'deploy/dist', // .vuepress/dist
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    }, // undefined

    // theme
    theme: 'reco', //

    themeConfig: {
        type: 'blog',
        mode: 'light', // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
        modePicker: false, // 默认 true，false 不显示模式调节按钮，true 则显示
        noFoundPageByTencent: false, //
        smoothScroll: true,
        nav: [
            {text: '首页', link: '/', icon: 'reco-home'},
            {text: '时间线', link: '/timeline/', icon: 'reco-date'},
        ],
        sidebar: 'auto',
        // 博客配置
        blogConfig: {
            category: {
                location: 2,     // 在导航栏菜单中所占的位置，默认2
                text: '分类' // 默认文案 “分类”
            },
            tag: {
                location: 3,     // 在导航栏菜单中所占的位置，默认3
                text: '标签'      // 默认文案 “标签”
            },
            socialLinks: [     // 信息栏展示社交信息
                {icon: 'reco-github', link: 'https://github.com/JinHsu'},
            ]
        },

        friendLink: [
            {
                title: 'vuepress',
                desc: 'Vue-powered Static Site Generator.',
                logo: "https://v1.vuepress.vuejs.org/hero.png",
                link: 'https://v1.vuepress.vuejs.org/'
            },
            {
                title: 'vuepress-theme-reco',
                desc: 'A simple and beautiful vuepress Blog & Doc theme.',
                logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
                link: 'https://vuepress-theme-reco.recoluan.com'
            },
        ],

        logo: '/avatar.png',

        // 备案
        record: '京ICP备19020199号-1',
        recordLink: 'https://beian.miit.gov.cn',
        // cyberSecurityRecord: '公安部备案文案',
        // cyberSecurityLink: '公安部备案指向链接',
        startYear: '2019', // 项目开始时间，只填写年份

        // author
        author: 'JinHsu',
        authorAvatar: '/avatar.png',

        // 评论
        valineConfig: {
            appId: appId,
            appKey: appKey
        }
    },

    plugins: [],

    markdown: {
        // 是否在每个代码块的左侧显示行号。
        lineNumbers: true,
    }


}