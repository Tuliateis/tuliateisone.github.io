// 第2天数据
const day2Data = {
    // 自定义日期显示
    customDateDisplay: '2026.1.7 第 2 天',
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
        { room: '201', admission: '2025.12.20 003因精神分裂症入院治疗', discharge: '', receipt: '' },
        { room: '202', admission: '2025.7.2 192因持续性植物状态入院治疗', discharge: '', receipt: '' }
    ],
    
    // 病人信息 - 每天体征可以变化
    patients: {
        '101': {
            name: '023',
            age: 78,
            diagnosis: '阿尔兹海默症',
            vitals: {
                temperature: '36.7°C',
                bloodPressure: '125/80 mmHg',
                pulse: '70 bpm',
                symptoms: '记忆力减退，方向感差'  // 你修改了这个
            }
        },
        '102': {
            name: '016',
            age: 32,
            diagnosis: '长期失眠',
            vitals: {
                temperature: '36.5°C',
                bloodPressure: '130/75 mmHg',
                pulse: '70 bpm',
                symptoms: '失眠严重，精神萎靡，注意力不集中'
            }
        },
        '201': {
            name: '003',
            age: 25,
            diagnosis: '精神分裂症',
            vitals: {
                temperature: '36.3°C',
                bloodPressure: '120/82 mmHg',
                pulse: '70 bpm',
                symptoms: '自言自语，社交回避'
            }
        },
        '202': {
            name: '192',
            age: 45,
            diagnosis: '持续性植物状态',
            vitals: {
                temperature: '36°C',
                bloodPressure: '110/70 mmHg',
                pulse: '60 bpm',
                symptoms: '无意识，对外界刺激反应微弱'
            }
        }
    },
    
    // 药品信息 - 每天库存可以变化
    medicines: [
        { name: 'A药', stock: 15 },
        { name: 'B药', stock: 10 },
        { name: '糖', stock: 7 },
        { name: 'D药', stock: 8 },
        { name: 'E药', stock: 10 },
        { name: '葱蒜水', stock: 4 },
        { name: '■药', stock: 9 },
        { name: '手术准备', stock: 6},
        { name: '康复训练', stock: 999 },
        { name: '镇静剂', stock: 14 }
    ],
    
    // 药品选项
    medicineOptions: [
        'A药', 'B药', '糖', 'D药', 'E药', '葱蒜水', '■药', '镇静剂',
        '摘除心脏', '摘除眼球', '夫妻肺片', '器官移植', '开颅手术',
        '康复训练', '文娱活动', '心理咨询', '手打肉丸', '户外活动'
    ],
    // 治疗选项配置
    treatmentOptions: {
        'oral': {
            allowedMedicines: ['A药', '糖', 'D药', 'E药','■药'],  // 口服可选的药物
            singleSelect: false,
            isMedicine: true  // 需要药品检查
        },
        'injection': {
            allowedMedicines: ['B药', '镇静剂', '葱蒜水','■药'],  // 注射可选的药物
            singleSelect: true,
            isMedicine: true
        },
        'surgery': {
            allowedMedicines: ['摘除心脏', '摘除眼球', '夫妻肺片', '器官移植', '开颅手术'],  // 手术可选的类型
            singleSelect: true,
            isMedicine: false  // 不需要药品检查
        },
        'activity': {
            allowedMedicines: ['康复训练', '文娱活动', '心理咨询', '手打肉丸', '户外活动'],  // 活动可选的类型
            singleSelect: false,
            isMedicine: false
        }
    },

    // 每日医嘱 - 每天完全不同
    dailyOrders: {
        '101': { type: '口服', medicine: 'A药' },
        '102': { type: '注射', medicine: 'B药' },
        '201': { type: '口服', medicine: '糖' },
        '202': { type: '注射', medicine: 'B药' }
    },
    // 添加图片配置
    patientImages: {
        '101': 'images/101st.png',  // 第2天用png
        '102': 'images/102st.jpg',
        '201': 'images/201st.png',  // 混合格式
        '202': 'images/202st.png'
    },
    // 结算画面配置
    settlementData: {
        // 第一行文本
        firstLine: '第2天的工作圆满完成',
        // 第二行文本（可选）
        secondLine:  ["工作总结：治疗过程很顺利，午餐是南瓜浓汤和全麦面包，汤很暖，适合长时间工作。",
                    "当前护理对象：4；当前病房住用数量：4"
        ],
        dots: [
            'white',
            'white',
            'white',
            'white',
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
            window.location.href = `day3.html`;
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
            "：你来了，我的病怎么才能好！",
            "：头好疼，睡不着..."
        ],
        '201': [
            "：你相信世界上有神吗？",
            "：他们联系我了",
            "你：那是你的幻觉。"
        ],
        '202': [
            "你：192,今天能听到我的声音吗？",
            "：...."
        ]
    }
};