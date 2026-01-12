// 第10天数据
const day10Data = {
    // 自定义日期显示
    customDateDisplay: '2026.1.15 第 10 天',
    // 跑马灯消息 - 每天可以不同
    marqueeMessages: [
        "甄贴心疗养院，为您服务！",
        "24小时皇家级医疗护理",  
        "米其林星级营养餐",
        "比医院更专业，比酒店更舒适！",
        "术后康复速度提升100%",
        "确保理智值不要低于xx，否则会被祂们发现！"
    ],
    
    // 病房入住记录 - 每天可以不同
    roomRecords: [
        { room: '101', admission: '2025.11.1 023因阿尔兹海默症入院治疗', discharge: '2026.1.12 023康复出院', receipt: '环境很好，状态很新鲜' },
        { room: '102', admission: '2025.10.9 016因长期失眠入院治疗', discharge: '', receipt: '' },
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
            name: '016',
            age: 32,
            diagnosis: '长期失眠',
            vitals: {
                temperature: '36.7°C',
                bloodPressure: '130/85 mmHg',
                pulse: '68 bpm',
                symptoms: '自述头部持续性头痛，用药一直无缓解'
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
       
        '102':[
            { type: '注射', medicine: "F药" },
            { type: '手术', medicine: '器官移植' },
        
        ],
        '201':{ type: '注射', medicine: ["镇静剂","■药"]},
        '202': { type: '注射', medicine: 'F药' }
    },
    // 添加图片配置
    patientImages: {
        
        '102': 'images/102nd.jpg',
        '201':'images/201nd.png',
        '202': 'images/202st.png'
    },
    // 结算画面配置
    settlementData: {
        // 第一行文本
        firstLine: '第10天的工作圆满完成',
        // 第二行文本（可选）
        secondLine:[
             "工作总结：一切都是压力太大的幻觉，午饭是浓稠的蔬菜浓汤，闻起来很熟悉，却想不起具体用了什么,好想吃肉...",
             "请不要离开岗位，你是‘不可替代的’"
        ],
        // 圆圈配置
        dots: [
            'white',
            'red',
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
            window.location.href = `day11.html`;
            dayCommonInstance.defaultGoToNextDay(currentDay, nextDay);
        },
    },
    // 对话系统配置
    dialogues: {
        
        '102': [
            "你：016，你...你还好吗？",
            "：怎么了，我现在好像痊愈了，我这几天都睡得很好，你们疗养院真厉害",
            "你：..."
        ],
        '201': [
            "你：头好痛，我可能需要一些药物",
            "你：我不能看见不该看见的东西",
            "你：..."
        ],
        '202': [
            "你：192,今天能听到我的声音吗？",
            "：...."
        ]
    },
     // 出院系统配置
    dischargeConfig: {
        '101': {
            isDischarged: true,        // 第一个开关：病人是否已出院
            needsCleaning: false,       // 第二个开关：是否需要整理病房
            cleaningTitle: '藏在枕头下的几页纸', // 可选的弹窗标题
            cleaningDialog: [ // 弹窗内容数组，每项是一段文字
                "藏在枕头下的日记本:",
                "11.7",
                "我叫■■■，今年78岁，我老伴的名字叫■■■，我的儿子的名字叫■■■，我来自云城，我喜欢去遛弯...",
                "...",
                "11.23",
                "我叫...，我叫■■■，今年76岁，我老伴的名字叫■■，好像不对....",
                "...",
                "12.17",
                "■■■是谁，我不记得了，今天的阳光很好...",
                "...",
                "1.10",
                "这是什么，这是哪里，哦是医院....",
                "1.11",
                "感谢疗养院，治好了我的阿尔兹海默症，我好像什么都想起来了，身体也轻快很多，就好像年轻了几岁，祂们...没有祂们，我就快要忘记一切了，祂们曾对我说，诶，对我说了什么，我怎么一时间想不起来了，不过没关系，我会把这里的神奇推荐给更多病友..."
            ]
        },
        '102': {
            isDischarged: false,
            needsCleaning: false      // 不需要整理病房
            //cleaningDialog: []         // 空数组表示不需要对话
        },
        '201': {
            isDischarged: false,      
            needsCleaning: false,
            
        },
        '202': {
            isDischarged: false, // 病人未出院
            needsCleaning: false
        }
    }
};