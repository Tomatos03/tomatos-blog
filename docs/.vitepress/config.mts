import { defineConfig } from 'vitepress';
import { MermaidMarkdown, MermaidPlugin } from 'vitepress-plugin-mermaid';
import tailwindcss from '@tailwindcss/vite'
import mathjax3 from 'markdown-it-mathjax3';
import { plantUmlPlugin } from './utils/plantumlPlugin';

export default defineConfig({
    markdown: {
        theme: {
            light: 'catppuccin-latte',
            dark: 'catppuccin-macchiato',
        },
        config(md) {
            md.use(MermaidMarkdown);
            md.use(mathjax3);
            md.use(plantUmlPlugin);
        },
    },
    vite: {
        plugins: [MermaidPlugin(), tailwindcss()],
        optimizeDeps: {
            include: ['mermaid'],
        },
        ssr: {
            noExternal: ['mermaid'],
        },
    },
    lang: 'zh-cn',
    title: "Tomatos's Blog",
    description: 'Welcome',
    head: [['link', { rel: 'icon', href: '/logo.png' }]],
    lastUpdated: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: '/logo.png',
        search: {
            provider: 'local',
        },
        outline: {
            level: [2, 6],
            label: '大纲',
        },
        nav: [
            {
                text: '操作系统',
                items: [
                    {
                        text: 'Linux',
                        link: '/nav/os/linux/desktop-env-config/',
                    },
                    {
                        text: 'Windows',
                        link: '/nav/os/windows/skill/',
                    },
                ],
            },
            {
                text: 'UML',
                link: '/nav/uml/structure-diagrams/class-diagram/',
            },
            {
                text: '设计模式',
                link: '/nav/design-pattern/builder/',
            },
            {
                text: '框架',
                items: [
                    {
                        text: 'Spring',
                        link: '/nav/framework/spring/aop/',
                    },
                ],
            },
            {
                text: '开发工具',
                items: [
                    {
                        text: 'VSCode',
                        link: '/nav/dev-tools/vscode/',
                    },
                    {
                        text: 'Jmeter',
                        link: '/nav/dev-tools/jmeter/',
                    },
                    {
                        text: 'IDEA',
                        link: '/nav/dev-tools/idea/',
                    },
                    {
                        text: 'Clash Party',
                        link: '/nav/dev-tools/clash-party/',
                    },
                ],
            },
            {
                text: '版本控制',
                items: [
                    {
                        text: 'Git',
                        link: '/nav/version-control/git/config/',
                    },
                ],
            },
            {
                text: '编程组件',
                items: [
                    {
                        text: '数据库',
                        items: [
                            {
                                text: 'MySQL',
                                link: '/nav/env-config/dev/mysql/basics/',
                            },
                        ],
                    },
                    {
                        text: '容器化平台',
                        items: [
                            {
                                text: 'Docker',
                                link: '/nav/env-config/deploy/docker/container/',
                            },
                        ],
                    },
                    {
                        text: 'Web服务器',
                        items: [
                            {
                                text: 'Nginx',
                                link: '/nav/env-config/deploy/nginx/',
                            },
                        ],
                    },
                ],
            },
            {
                text: '编程基础',
                items: [
                    { text: '协议', link: '/nav/fundamentals/protocol/http/http-protocol/' },
                    { text: '算法', link: '/nav/fundamentals/algorithm/' },
                    { text: '技术名词', link: '/nav/fundamentals/terminology/' },
                    { text: '伪代码', link: '/nav/fundamentals/pseudocode/' },
                    { text: '缓存', link: '/nav/fundamentals/cache/' },
                    { text: '数学', link: '/nav/fundamentals/math/matrix/' },
                ],
            },
            {
                text: '系统架构',
                items: [
                    { text: '分布式系统', link: '/nav/system-architecture/distributed/' },
                    { text: '集中式系统', link: '/nav/system-architecture/centralized-system/' },
                ],
            },
            {
                text: '编程语言',
                items: [
                    {
                        text: 'Java',
                        link: '/nav/languages/java/data-type/',
                    },
                    {
                        text: 'Ts',
                        link: '/nav/languages/ts/data-types/',
                    },
                    {
                        text: 'Js',
                        link: '/nav/languages/js/data-types/',
                    },
                    {
                        text: 'CSS',
                        link: '/nav/languages/css/selector/',
                    },
                    {
                        text: 'Rust',
                        link: '/nav/languages/rust/ownership/',
                    },
                    {
                        text: 'Python',
                        link: '/nav/languages/python/data-type/',
                    },
                ],
            },
            {
                text: 'AI 工具',
                items: [
                    {
                        text: 'Claude Code',
                        link: '/nav/ai-tools/claude-code/custom-commands/',
                    },
                ],
            },
            {
                text: '关于',
                link: '/nav/about.md',
            },
        ],
        docFooter: {
            prev: '上一页',
            next: '下一页',
        },
        sidebar: {
            '/nav/uml/': [
                {
                    text: '结构图',
                    collapsed: false,
                    items: [
                        { text: '类图', link: '/nav/uml/structure-diagrams/class-diagram/' },
                        { text: '对象图', link: '/nav/uml/structure-diagrams/object-diagram/' },
                        { text: '组件图', link: '/nav/uml/structure-diagrams/component-diagram/' },
                        { text: '部署图', link: '/nav/uml/structure-diagrams/deployment-diagram/' },
                        { text: '包图', link: '/nav/uml/structure-diagrams/package-diagram/' },
                    ],
                },
                {
                    text: '行为图',
                    collapsed: false,
                    items: [
                        { text: '用例图', link: '/nav/uml/behavior-diagrams/use-case-diagram/' },
                        { text: '活动图', link: '/nav/uml/behavior-diagrams/activity-diagram/' },
                        {
                            text: '状态机图',
                            link: '/nav/uml/behavior-diagrams/state-machine-diagram/',
                        },
                        { text: '时序图', link: '/nav/uml/behavior-diagrams/sequence-diagram/' },
                        { text: '定时图', link: '/nav/uml/behavior-diagrams/timing-diagram/' },
                    ],
                },
            ],
            '/nav/system-architecture/distributed/': [
                {
                    text: '集群架构',
                    link: '/nav/system-architecture/distributed/cluster-architecture/',
                },
                {
                    text: '微服务架构',
                    link: '/nav/system-architecture/distributed/microservice-architecture/',
                },
            ],

            '/nav/version-control/': [
                {
                    text: 'Git',
                    collapsed: false,
                    items: [
                        {
                            text: '配置',
                            link: '/nav/version-control/git/config/',
                        },
                        {
                            text: '仓库管理',
                            link: '/nav/version-control/git/repository-management/',
                        },
                        {
                            text: '分支',
                            link: '/nav/version-control/git/branch/',
                        },
                        {
                            text: 'Worktree',
                            link: '/nav/version-control/git/worktree/',
                        },
                        {
                            text: '恢复与重置',
                            link: '/nav/version-control/git/restore-and-reset/',
                        },
                        {
                            text: '日志管理',
                            link: '/nav/version-control/git/log-management/',
                        },
                        {
                            text: '高级',
                            link: '/nav/version-control/git/advanced/',
                        },
                    ],
                },
            ],
            '/nav/design-pattern/': [
                {
                    text: '设计模式',
                    collapsed: false,
                    items: [
                        { text: '建造者模式', link: '/nav/design-pattern/builder/' },
                        { text: '单例模式', link: '/nav/design-pattern/singleton/' },
                        // { text: '工厂模式', link: '/nav/design-pattern/factory/' },
                        // { text: '代理模式', link: '/nav/design-pattern/proxy/' },
                        // { text: '观察者模式', link: '/nav/design-pattern/observer/' },
                        // { text: '策略模式', link: '/nav/design-pattern/strategy/' },
                        // { text: '模板方法模式', link: '/nav/design-pattern/template-method/' },
                        // { text: '适配器模式', link: '/nav/design-pattern/adapter/' },
                        // { text: '装饰器模式', link: '/nav/design-pattern/decorator/' }
                    ],
                },
                {
                    text: '多线程设计模式',
                    collapsed: false,
                    items: [
                        {
                            text: '顺序控制',
                            link: '/nav/design-pattern/thread/sequencing-control/',
                        },
                        { text: '犹豫模式', link: '/nav/design-pattern/thread/balking-pattern/' },
                        {
                            text: '单例模式',
                            link: '/nav/design-pattern/thread/singleton-pattern/',
                        },
                        {
                            text: '生产者消费者模式',
                            link: '/nav/design-pattern/thread/producer-consumer/',
                        },
                        {
                            text: '保护性暂停',
                            link: '/nav/design-pattern/thread/guarded-suspension/',
                        },
                        {
                            text: '两阶段终止',
                            link: '/nav/design-pattern/thread/two-phase-termination/',
                        },
                    ],
                },
            ],
            '/nav/fundamentals/protocol/': [
                {
                    text: '计算机协议',
                    collapsed: false,
                    items: [
                        {
                            text: 'HTTP',
                            collapsed: false,
                            items: [
                                { text: '概述', link: '/nav/fundamentals/protocol/http/http-protocol/' },
                                { text: 'Basic Auth', link: '/nav/fundamentals/protocol/http/http-basic-auth/' },
                                { text: 'RESTful API', link: '/nav/fundamentals/protocol/restful-api/' },
                            ],
                        },
                        { text: 'SSH', link: '/nav/fundamentals/protocol/ssh/ssh-protocol/' },
                        { text: 'OAuth', link: '/nav/fundamentals/protocol/oauth/oauth-protocol/' },
                        { text: 'TCP', link: '/nav/fundamentals/protocol/tcp/tcp-protocol/' },
                        { text: 'UDP', link: '/nav/fundamentals/protocol/udp/udp-protocol/' },
                    ],
                },
            ],
            '/nav/fundamentals/math/': [
                {
                    text: '数学',
                    collapsed: false,
                    items: [
                        { text: '不等式', link: '/nav/fundamentals/math/inequality/' },
                        { text: '矩阵', link: '/nav/fundamentals/math/matrix/' },
                    ],
                },
            ],
            '/nav/os/windows/': [
                {
                    text: 'Windows',
                    collapsed: false,
                    items: [{ text: '技巧', link: '/nav/os/windows/skill/' }],
                },
            ],
            '/nav/os/linux/': [
                {
                    text: 'Linux',
                    collapsed: false,
                    items: [
                        { text: '终端', link: '/nav/os/linux/terminal/' },
                        { text: '按键映射', link: '/nav/os/linux/key-mapping/' },
                        { text: '桌面环境配置', link: '/nav/os/linux/desktop-env-config/' },
                        { text: '系统设置', link: '/nav/os/linux/system-settings/' },
                        { text: '网络配置', link: '/nav/os/linux/network-config/' },
                        { text: '系统文件', link: '/nav/os/linux/system-files/' },
                        { text: '疑难杂症', link: '/nav/os/linux/troubleshooting/' },
                    ],
                },
            ],
            '/nav/languages/rust/': [
                {
                    text: 'Rust',
                    collapsed: false,
                    items: [
                        { text: '所有权', link: '/nav/languages/rust/ownership/' },
                        { text: '生命周期', link: '/nav/languages/rust/lifetime/' },
                        { text: '控制流', link: '/nav/languages/rust/control-flow/' },
                    ],
                },
            ],
            '/nav/languages/ts/': [
                {
                    text: '基础',
                    collapsed: false,
                    items: [
                        { text: '环境配置', link: '/nav/languages/ts/env-config/' },
                        { text: '数据类型', link: '/nav/languages/ts/data-types/' },
                        { text: '修饰符', link: '/nav/languages/ts/modifiers/' },
                        { text: '高级特性', link: '/nav/languages/ts/advanced-features/' },
                        { text: '类', link: '/nav/languages/ts/class/' },
                        { text: '函数', link: '/nav/languages/ts/function/' },
                        { text: '正则表达式', link: '/nav/languages/ts/regexp/' },
                    ],
                },
            ],
            '/nav/languages/js/': [
                {
                    text: '基础',
                    collapsed: false,
                    items: [
                        { text: '数据类型', link: '/nav/languages/js/data-types/' },
                        { text: '正则表达式', link: '/nav/languages/js/regex/' },
                        {
                            text: '变量与作用域',
                            link: '/nav/languages/js/variables-and-scope/',
                        },
                        { text: '运算符', link: '/nav/languages/js/operators/' },
                        { text: '流程控制', link: '/nav/languages/js/control-flow/' },
                        { text: '函数', link: '/nav/languages/js/function/' },
                        { text: '字符串', link: '/nav/languages/js/string/' },
                        { text: '数组', link: '/nav/languages/js/array/' },
                        { text: '对象', link: '/nav/languages/js/object/' },
                        { text: '类', link: '/nav/languages/js/class/' },
                        { text: '异步编程', link: '/nav/languages/js/async/' },
                        { text: '事件循环', link: '/nav/languages/js/event-loop/' },
                        { text: '错误处理', link: '/nav/languages/js/error-handling/' },
                        { text: '模块化', link: '/nav/languages/js/module/' },
                    ],
                },
            ],
            '/nav/languages/css/': [
                {
                    text: '基础',
                    collapsed: false,
                    items: [
                        { text: '选择器', link: '/nav/languages/css/selector/' },
                        { text: '盒子模型', link: '/nav/languages/css/box-model/' },
                        { text: '布局', link: '/nav/languages/css/layout/' },
                    ],
                },
            ],
            '/nav/languages/python/': [
                {
                    text: '基础',
                    collapsed: false,
                    items: [
                        { text: '数据类型', link: '/nav/languages/python/data-type/' },
                        { text: '字符串', link: '/nav/languages/python/string/' },
                        { text: '运算符', link: '/nav/languages/python/operator/' },
                        { text: '流程控制', link: '/nav/languages/python/control-flow/' },
                        { text: '函数', link: '/nav/languages/python/function/' },
                        { text: '容器类型', link: '/nav/languages/python/compound-types/' },
                        { text: '类', link: '/nav/languages/python/class/' },
                        { text: '异常处理', link: '/nav/languages/python/exception/' },
                        { text: '模块与包', link: '/nav/languages/python/module/' },
                        { text: 'IO编程', link: '/nav/languages/python/io-stream/' },
                        { text: '正则表达式', link: '/nav/languages/python/regex/' },
                    ],
                },
                {
                    text: '进阶特性',
                    collapsed: false,
                    items: [
                        { text: '迭代器与生成器', link: '/nav/languages/python/iterator-generator/' },
                        { text: '装饰器', link: '/nav/languages/python/decorator/' },
                        { text: '上下文管理器', link: '/nav/languages/python/context-manager/' },
                        { text: '并发编程', link: '/nav/languages/python/concurrency/' },
                        { text: '类型提示', link: '/nav/languages/python/type-hints/' },
                    ],
                },
                {
                    text: '工具链',
                    collapsed: false,
                    items: [
                        { text: 'pip', link: '/nav/languages/python/tool-chains/pip/' },
                        { text: '虚拟环境', link: '/nav/languages/python/tool-chains/virtualenv/' },
                    ],
                },
            ],
            '/nav/languages/java/': [
                {
                    text: '基础',
                    collapsed: false,
                    items: [
                        { text: '数据类型', link: '/nav/languages/java/data-type/' },
                        { text: '修饰符', link: '/nav/languages/java/modifiers/' },
                        {
                            text: '默认行为',
                            link: '/nav/languages/java/default-behavior/',
                        },
                        { text: '字符串', link: '/nav/languages/java/string/' },
                        { text: '类', link: '/nav/languages/java/class/' },
                        { text: '接口', link: '/nav/languages/java/interface/' },
                        { text: '枚举', link: '/nav/languages/java/enum/' },
                        { text: '方法', link: '/nav/languages/java/methods/' },
                        { text: '异常', link: '/nav/languages/java/exception/' },
                        { text: '集合', link: '/nav/languages/java/collections/' },
                        { text: 'IO流', link: '/nav/languages/java/io-stream/' },
                        { text: '正则表达式', link: '/nav/languages/java/regex/' },
                    ],
                },
                {
                    text: '进阶特性',
                    collapsed: false,
                    items: [
                        { text: '多线程', link: '/nav/languages/java/multithreading/' },
                        { text: 'JUC', link: '/nav/languages/java/juc/' },
                        {
                            text: '内存结构',
                            link: '/nav/languages/java/memoery-struct/',
                        },
                        { text: '泛型', link: '/nav/languages/java/generics/' },
                        { text: '注解', link: '/nav/languages/java/annotation/' },
                        {
                            text: '核心机制',
                            link: '/nav/languages/java/core-mechanism/',
                        },
                        {
                            text: '版本特性',
                            link: '/nav/languages/java/version-features/',
                        },
                        { text: 'Jar 包', link: '/nav/languages/java/jar/' },
                        { text: '虚拟机', link: '/nav/languages/java/jvm/' },
                    ],
                },
                {
                    text: '工具链',
                    collapsed: false,
                    items: [
                        { text: 'Maven', link: '/nav/languages/java/tool-chains/maven/' },
                        { text: 'Lombok', link: '/nav/languages/java/tool-chains/lombok/' },
                    ],
                },
            ],
            '/nav/env-config/deploy/docker/': [
                {
                    text: '基础',
                    collapsed: false,
                    items: [
                        { text: '容器', link: '/nav/env-config/deploy/docker/container/' },
                        { text: '镜像', link: '/nav/env-config/deploy/docker/image/' },
                        { text: '端口映射', link: '/nav/env-config/deploy/docker/port/' },
                        { text: '数据卷', link: '/nav/env-config/deploy/docker/volume/' },
                        { text: '网络', link: '/nav/env-config/deploy/docker/network/' },
                    ],
                },
                {
                    text: '高级',
                    collapsed: false,
                    items: [
                        { text: 'Dockerfile', link: '/nav/env-config/deploy/docker/dockerfile/' },
                        { text: 'Compose', link: '/nav/env-config/deploy/docker/compose/' },
                    ],
                },
            ],
            '/nav/env-config/dev/mysql/': [
                {
                    text: 'MySQL',
                    collapsed: false,
                    items: [
                        { text: '概述', link: '/nav/env-config/dev/mysql/basics/' },
                        { text: 'SQL操作', link: '/nav/env-config/dev/mysql/sql-operate/' },
                        { text: '事务', link: '/nav/env-config/dev/mysql/transaction/' },
                        { text: 'MVCC', link: '/nav/env-config/dev/mysql/mvcc/' },
                        { text: '锁', link: '/nav/env-config/dev/mysql/lock/' },
                        { text: '索引', link: '/nav/env-config/dev/mysql/indexing/' },
                        { text: '日志', link: '/nav/env-config/dev/mysql/log/' },
                        { text: '信息查询', link: '/nav/env-config/dev/mysql/info-query/' },
                        { text: 'SQL优化', link: '/nav/env-config/dev/mysql/sql-refine/' },
                    ],
                },
            ],
            '/nav/framework/spring/': [
                {
                    text: 'Spring',
                    collapsed: false,
                    items: [
                        { text: 'Bean', link: '/nav/framework/spring/bean/' },
                        { text: 'AOP', link: '/nav/framework/spring/aop/' },
                        { text: 'Event', link: '/nav/framework/spring/event/' },
                        {
                            text: 'Transaction',
                            link: '/nav/framework/spring/transaction/',
                        },
                        { text: 'Config', link: '/nav/framework/spring/config/' },
                    ],
                },
            ],
            '/nav/ai-tools/': [
                {
                    text: 'Claude Code',
                    collapsed: false,
                    items: [
                        {
                            text: '自定义 Commands',
                            link: '/nav/ai-tools/claude-code/custom-commands/',
                        },
                        {
                            text: 'Rules 规则系统',
                            link: '/nav/ai-tools/claude-code/rules/',
                        },
                        {
                            text: 'Memory 记忆系统',
                            link: '/nav/ai-tools/claude-code/memory/',
                        },
                        {
                            text: 'MCP 集成',
                            link: '/nav/ai-tools/claude-code/mcp-integration/',
                        },
                        {
                            text: 'Skills',
                            link: '/nav/ai-tools/claude-code/skills/',
                        },
                        {
                            text: '命令白名单',
                            link: '/nav/ai-tools/claude-code/command-allowlist/',
                        },
                    ],
                },
            ],
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/Tomatos03' }],
        footer: {
            message: 'Released under the MIT License.',
            copyright: `Copyright © 2025-${new Date().getFullYear()} present Tomatos`,
        },
    },
});
