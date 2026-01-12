// 第15天数据
const day15Data = {
    customDateDisplay: '2026.1.20 第 15 天',
    
    marqueeMessages: [
        "甄贴心疗养院，为您服务！",
        "感谢您本次实习期的全部贡献，请向欢愉张开双臂吧",
        "期待与您的下次见面",
        "当然是没有下次啦！"
    ],
    
    roomRecords: [
        { room: '101', admission: '2025.11.1 023因阿尔兹海默症入院治疗', discharge: '2026.1.12 023康复出院', receipt: '环境很好，状态很新鲜' },
        { room: '102', admission: '2025.10.9 016因长期失眠入院治疗', discharge: '2026.1.18 016康复出院', receipt: '睡眠质量显著改善' },
        { room: '201', admission: '2025.12.20 003因精神分裂症入院治疗', discharge: '2026.1.10 003康复出院', receipt: '服务很周到，味道不错' },
        { room: '202', admission: '2025.7.2 192因持续性植物状态入院治疗', discharge: '', receipt: '' }
    ],
    
    patients: {
        '101': { name: '-', age: '', diagnosis: '-', vitals: { temperature: '-', bloodPressure: '-', pulse: '-', symptoms: '-' } },
        '102': { name: '-', age: '', diagnosis: '-', vitals: { temperature: '-', bloodPressure: '-', pulse: '-', symptoms: '-' } },
        '201': { name: '-', age: '', diagnosis: '-', vitals: { temperature: '-', bloodPressure: '-', pulse: '-', symptoms: '-' } },
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
    
    medicines: [
        { name: 'A药', stock: 20 }, { name: 'B药', stock: 15 }, { name: 'C药', stock: 10 },
        { name: 'D药', stock: 8 }, { name: 'E药', stock: 12 }, { name: 'F药', stock: 6 },
        { name: '■药', stock: 3 }, { name: '手术准备', stock: 5 }, { name: '康复训练', stock: 999 },
        { name: '镇静剂', stock: 4 }
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
    
    dailyOrders: {
        '202': { type: '注射', medicine: '■药' }
    },
    
    patientImages: {
        '202': 'images/202rd.png'
    },
    
    // 第15天特殊配置
    specialDay15: {
        enabled: true,
        room202Trigger: {
            delay: 3987, // 3.987秒
            blackoutDuration: 1500, // 1.5秒
            examinationDelay: 1500, // 检查中停留1.5秒
            treatmentDelay: 3000, // 治疗停留3秒
            endingDelay: 2000 // 结算停留2秒
        }
    },
    
    // 特殊结算配置
    settlementData: {
        firstLine: '第15天的工作圆满完成',
        secondLine: [
            '恭喜你结束了实习期，现在，你的新职位是：193号病人'
        ],
        dots: ['red', 'red', 'red', 'red', 'white'],
        finalMessage: '感谢游玩，1秒后跳转到开头',
        redirectUrl: 'index.html',
        redirectDelay: 3000
    },
    // 对话系统配置
    dialogues: {
        '202': [
            "你:!!!怎么是！",
            "你：嘶头好疼！"
        ]
    },
    // 出院系统配置
    dischargeConfig: {
        '101': {
            isDischarged: true,        // 第一个开关：病人是否已出院
            needsCleaning: false       // 第二个开关：是否需要整理病房
        
        },
        '102': {
            isDischarged: true,
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