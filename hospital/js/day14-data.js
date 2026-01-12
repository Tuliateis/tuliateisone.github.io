// 第14天数据
const day14Data = {
    // 自定义日期显示
    customDateDisplay: '2026.1.19 第 14 天',
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
        { room: '101', admission: '2025.11.1 023因阿尔兹海默症入院治疗', discharge: '2026.1.12 023康复出院', receipt: '环境很好，很新鲜' },
        { room: '102', admission: '2025.10.9 016因长期失眠入院治疗', discharge: '2026.1.17 016康复出院', receipt: '效果很满意，符合我的预期' },
        { room: '201', admission: '2025.12.20 003因精神分裂症入院治疗', discharge: '2026.1.10 003康复出院', receipt: '服务很周到，味道不错' },
        { room: '202', admission: '2025.7.2 192因持续性植物状态入院治疗', discharge: '', receipt: '' }
    ],
    
    // 病人信息 - 每天体征可以变化
    patients: {
        '101': {
            name: '-',
            age: '',
            diagnosis: '-',
            vitals: {
                temperature: '-',
                bloodPressure: '-',
                pulse: '-',
                symptoms: '-'  
            }
        },
        '102': {
            name: '-',
            age: '',
            diagnosis: '-',
            vitals: {
                temperature: '-',
                bloodPressure: '-',
                pulse: '-',
                symptoms: '-'
            }
        },
        '201': {
            name: ' ',
            age: ' ',
            diagnosis: ' ',
            vitals: {
                temperature: '37.9',
                bloodPressure: '125/89 mmHg',
                pulse: '70 bpm',
                symptoms: '状态不太好，精神恍惚'
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
        
        '202': { type: '注射', medicine: ['镇静剂'] }
    },
    // 添加图片配置
    patientImages: {
        
        '201': 'images/201nd.png',
        '202': 'images/202st.png'
    },
    // 结算画面配置
    settlementData: {
        // 第一行文本
        firstLine: '第14天的工作圆满完成',
        // 第二行文本（可选）
        secondLine: [
            "工作总结：202病房那个植物人病人似乎快要醒来了，午餐是蔬菜沙拉和香菇馅饺子，吃了很多还是好像没有饱一样...",
            ".......",
          
        ],
        // 圆圈配置
        dots: [
            'white',
            'red',
            'red',
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
            window.location.href = `day15.html`;
            dayCommonInstance.defaultGoToNextDay(currentDay, nextDay);
        },
    },
    // 对话系统配置
    dialogues: {
    
        '202': [
            "：你叫小乐对吗...",
            "你：192,你有意识了？",
            "：我们很喜欢你...",
            ":新世界就要向你敞开怀抱，加入吧..."
        ]
    },
     // 出院系统配置
    dischargeConfig: {
        '101': {
            isDischarged: true,        // 第一个开关：病人是否已出院
            needsCleaning: false,       // 第二个开关：是否需要整理病房
            
        },
        '102': {
            isDischarged: true,
            needsCleaning: false,      // 不需要整理病房
            cleaningTitle: '藏在枕头下的几页纸', // 可选的弹窗标题
            cleaningDialog: [ // 弹窗内容数组，每项是一段文字
                "充满抓痕的床单:",
                "我看见了它们，我为什么能看见它们，它们就要来了...来了....",
                "噩梦，都是噩梦，我醒了吗..."
            ]
        },
        '201': {
            isDischarged: true,      
            needsCleaning: false,
            
        },
        '202': {
            isDischarged: false, // 病人未出院
            needsCleaning: false
        }
    }
};