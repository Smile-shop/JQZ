const baseUrl = '/super-mkt/activity-set'
const RatPath = '/activity-type/rat'

const menu = {
    appName: '活动设置',
    appCode: 'activitySet',
    canAccess: false,
    path: baseUrl,
    icon: 'icon-shezhi1',
    hidden: true,
    children: [
        {
            appName: '活动类型',
            appCode: 'asActivityType',
            canAccess: false,
            path: `${baseUrl}/activity-type`,
            children: [
                {
                    appName: '九宫格',
                    appCode: 'asJiugongge',
                    canAccess: false,
                    path: `${baseUrl}/activity-type/nine`,
                    children: [
                        {
                            appName: '九宫格',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/nine/home`,
                        },
                        {
                            appName: '九宫格',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/nine/add`,
                        },
                        {
                            appName: '九宫格',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/nine/edit`,
                        },
                        {
                            appName: '九宫格',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/nine/viewdata`,
                        },
                    ]
                },
                {
                    appName: '鼠年大翻身',
                    appCode: 'asMouseYearWithBigRat',
                    canAccess: false,
                    path: `${baseUrl}${RatPath}`,
                    children: [
                        {
                            appName: '鼠年大翻身',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}${RatPath}/home`,
                        },
                        {
                            appName: '鼠年大翻身',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}${RatPath}/add`,
                        },
                        {
                            appName: '鼠年大翻身',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}${RatPath}/data`,
                        },
                        {
                            appName: '鼠年大翻身',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}${RatPath}/edit`,
                        },
                    ]
                },
                {
                    appName: '翻牌',
                    appCode: 'asFlop',
                    canAccess: false,
                    path: `${baseUrl}/activity-type/playing-card`,
                    children: [
                        {
                            appName: '翻牌',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/playing-card/home`,
                        },
                        {
                            appName: '翻牌',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/playing-card/add`,
                        },
                        {
                            appName: '翻牌',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/playing-card/data`,
                        },
                        {
                            appName: '翻牌',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/playing-card/edit`,
                        },
                    ]
                },
                {
                    appName: '新春翻红包',
                    appCode: 'asRedEnvelope',
                    canAccess: false,
                    path: `${baseUrl}/activity-type/red-envelope`,
                    children: [
                        {
                            appName: '新春翻红包',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/red-envelope/home`,
                        },
                        {
                            appName: '新春翻红包',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/red-envelope/add`,
                        },
                        {
                            appName: '新春翻红包',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/red-envelope/data`,
                        },
                        {
                            appName: '新春翻红包',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/red-envelope/edit`,
                        },
                    ]
                },
                {
                    appName: '老虎机',
                    appCode: 'asTiger',
                    canAccess: false,
                    path: `${baseUrl}/activity-type/tiger`,
                    children: [
                        {
                            appName: '老虎机',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/tiger/home`,
                        },
                        {
                            appName: '老虎机',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/tiger/add`,
                        },
                        {
                            appName: '老虎机',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/tiger/viewdata`,
                        },
                        {
                            appName: '老虎机',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/tiger/edit`
                        },
                    ]
                },
                {
                    appName: '人气值千金',
                    appCode: 'asPopularValue',
                    canAccess: false,
                    path: `${baseUrl}/activity-type/fans`,
                    children: [
                        {
                            appName: '人气值千金',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/fans/home`,
                        },
                        {
                            appName: '人气值千金',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/fans/add`,
                        },
                        {
                            appName: '人气值千金',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/fans/data`,
                        },
                        {
                            appName: '人气值千金',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/fans/recommend`,
                        },
                    ]
                },
                {
                    appName: '人气值千金PLUS',
                    appCode: 'asPopularValuePlus',
                    canAccess: false,
                    path: `${baseUrl}/activity-type/fans_plus`,
                    children: [
                        {
                            appName: '人气值千金PLUS',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/fans_plus/home`,
                        },
                        {
                            appName: '人气值千金PLUS',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/fans_plus/add`,
                        },
                        {
                            appName: '人气值千金',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/fans_plus/data`,
                        },
                        {
                            appName: '人气值千金',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/fans_plus/recommend`,
                        },
                        {
                            appName: '人气值千金PLUS - 奖品列表',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/fans_plus/prizeList`,
                        },
                        {
                            appName: '人气值千金PLUS',
                            appCode: '',
                            canAccess: true,
                            path: `${baseUrl}/activity-type/fans_plus/prizeInfo`,
                        }
                    ]
                },
            ]
        }
    ]
}

export default menu;
