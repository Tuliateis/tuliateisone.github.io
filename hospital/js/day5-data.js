// 第4天数据
const day5Data = {
    // 自定义日期显示
    customDateDisplay: '2026.1.10 第 5 天',
    // 跑马灯消息 - 每天可以不同
    marqueeMessages: [
        "甄贴心疗养院，为您服务！",
        "24小时皇家级医疗护理",  
        "米其林星级营养餐",
        "比医院更专业，比酒店更舒适！",
        "术后康复速度提升100%",
        "这里没有'病人'，只有'健康追求者'！"
    ],
    
    // 病房入住记录 - 每天可以不同
    roomRecords: [
        { room: '101', admission: '2025.11.1 023因阿尔兹海默症入院治疗', discharge: '', receipt: '' },
        { room: '102', admission: '2025.10.9 016因长期失眠入院治疗', discharge: '', receipt: '' },
        { room: '201', admission: '2025.12.20 003因精神分裂症入院治疗', discharge: '2026.1.9 003康复出院', receipt: '服务很周到，味道不错'},
        { room: '202', admission: '2025.7.2 192因持续性植物状态入院治疗', discharge: '', receipt: '' }
    ],
    
    // 病人信息 - 每天体征可以变化
    patients: {
        '101': {
            name: '023',
            age: 78,
            diagnosis: '阿尔兹海默症',
            vitals: {
                temperature: '36.5°C',
                bloodPressure: '120/80 mmHg',
                pulse: '72 bpm',
                symptoms: '记忆力减退，方向感差'  // 你修改了这个
            }
        },
        '102': {
            name: '016',
            age: 32,
            diagnosis: '长期失眠',
            vitals: {
                temperature: '36.7°C',
                bloodPressure: '130/85 mmHg',
                pulse: '68 bpm',
                symptoms: '精神萎靡，注意力不集中'
            }
        },
        '201': {
            name: ' ',
            age: '',
            diagnosis: ' ',
            vitals: {
                temperature: ' ',
                bloodPressure: '-',
                pulse: '-',
                symptoms: '-'
            }
        },
        '202': {
            name: '192',
            age: 45,
            diagnosis: '持续性植物状态',
            vitals: {
                temperature: '36.8°C',
                bloodPressure: '110/70 mmHg',
                pulse: '60 bpm',
                symptoms: '无意识，对外界刺激反应微弱'
            }
        }
    },
    
    // 药品信息 - 每天库存可以变化
    medicines: [
        { name: 'A药', stock: 20 },
        { name: 'B药', stock: 15 },
        { name: 'C药', stock: 10 },
        { name: 'D药', stock: 8 },
        { name: 'E药', stock: 12 },
        { name: 'F药', stock: 6 },
        { name: '■药', stock: 3 },
        { name: '手术准备', stock: 5 },
        { name: '康复训练', stock: 999 },
        { name: '镇静剂', stock: 4 }
    ],
    
    // 药品选项
    // medicineOptions: [
    //     'A药', 'B药', 'C药', 'D药', 'E药', 'F药', 'G药', '手术准备', '康复训练', '镇静剂'
    // ],
    // 所有可用的药品和项目
    medicineOptions: [
        'A药', 'B药', 'C药', 'D药', 'E药', 'F药', '■药', '镇静剂',
        '摘除心脏', '摘除眼球', '摘除肺叶', '器官移植', '开颅手术',
        '康复训练', '文娱活动', '心理咨询', '物理治疗', '户外活动'
    ],

    // 治疗选项配置
    treatmentOptions: {
        'oral': {
            allowedMedicines: ['A药', 'C药', 'D药', 'E药','■药'],  // 口服可选的药物
            singleSelect: false,
            isMedicine: true  // 需要药品检查
        },
        'injection': {
            allowedMedicines: ['B药', '镇静剂', 'F药','■药'],  // 注射可选的药物
            singleSelect: true,
            isMedicine: true
        },
        'surgery': {
            allowedMedicines: ['摘除心脏', '摘除眼球', '摘除肺叶', '器官移植', '开颅手术'],  // 手术可选的类型
            singleSelect: true,
            isMedicine: false  // 不需要药品检查
        },
        'activity': {
            allowedMedicines: ['康复训练', '文娱活动', '心理咨询', '物理治疗', '户外活动'],  // 活动可选的类型
            singleSelect: false,
            isMedicine: false
        }
    },
    
    // 每日医嘱 - 每天完全不同
    dailyOrders: {
        '101': [
            { type: '口服', medicine: "A药"},
            {type: '注射', medicine: "B药"}
        ],
        '102': { type: '口服', medicine: 'D药' },
        
        '202': { type: '注射', medicine: 'B药' }
    },
    // 添加图片配置
    patientImages: {
        '101': 'images/101st.png',  // 第1天用png
        '102': 'images/102st.jpg',
        
        '202': 'images/202st.png'
    },
    // 结算画面配置
    settlementData: {
        // 第一行文本
        firstLine: '第5天的工作圆满完成',
        // 第二行文本（可选）
        secondLine: '工作总结：今日无异常，今天的午餐是菌菇炒青菜和藜麦饭，分量刚好。',
        dots: [
            'white',
            'white',
            'white',
            'red',
            'white'
        ],
        // 圆圈显示间隔（毫秒）
        dotDelay: 500,
        // 最后等待时间（毫秒）
        endDelay: 2000
    },
    // 跳转导航配置
    navigation: {
        // 跳转到下一天的自定义函数
        goToNextDay: function(currentDay, nextDay, dayCommonInstance) { 
            window.location.href = `day6.html`;
            dayCommonInstance.defaultGoToNextDay(currentDay, nextDay);
        },
    },
    // 对话系统配置
    dialogues: {
        '101': [
            "：你是医生吗？你叫什么名字？",
            "你：我是护士，我叫小乐",
            "：...我怎么没见过你？"
        ],
        '102': [
            "：头好疼，睡不着...",
            "：眼睛，眼睛看不见了",
            "你：请放松，深呼吸"
        ],
        
        '202': [
            "你：192,今天能听到我的声音吗？",
            "：...."
        ]
    },
    // 出院系统配置
    dischargeConfig: {
        '101': {
            isDischarged: false,        // 第一个开关：病人是否已出院
            needsCleaning: false       // 第二个开关：是否需要整理病房
        
        },
        '102': {
            isDischarged: false,
            needsCleaning: false      // 不需要整理病房
            //cleaningDialog: []         // 空数组表示不需要对话
        },
        '201': {
            isDischarged: true,      
            needsCleaning: false,
            cleaningTitle: '藏在枕头下的几页纸', // 可选的弹窗标题
            cleaningDialog: [ // 弹窗内容数组，每项是一段文字
                "藏在枕头下的几页纸:",
                "12.26",
                "有人在看我有人在看我有人在看我它们要杀了我它们要杀了我它们要杀了我！！！！好黑，为什么永远都是黑的，为什么一直说我有病，我没病我真的没病相信我相信我为什么不相信我！！！",
                "12.30",
                "它们在偷偷控制我的大脑，控制我的思想，它们窃取我脑子里的秘密，救救我救救我救救我救救我救救我救救我救救我救救我救救我救救我救救我救救我救救我",
                "1.4",
                "祂们教我怎么分辨，祂们无处不在，祂们■■■■",
                "1.9",
                "我已经痊愈了，祂们也建议我出院，去寻找自由，对，我要去寻找属于我的自由！"
            ]
        },
        '202': {
            isDischarged: false, // 病人未出院
            needsCleaning: false
        }
    }
};