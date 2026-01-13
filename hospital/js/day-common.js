// 全局药品选择函数
function toggleMedicineSelection(element, medicine, type, room) {
    const hiddenInput = document.getElementById(`${type}-medicine-${room}`);
    const displayDiv = document.getElementById(`${type}-display-${room}`);
    
    if (!hiddenInput || !displayDiv) return;
    
    const currentSelections = hiddenInput.value ? hiddenInput.value.split(',').filter(Boolean) : [];
    
    if (currentSelections.includes(medicine)) {
        const newSelections = currentSelections.filter(m => m !== medicine);
        hiddenInput.value = newSelections.join(',');
        element.classList.remove('selected');
        element.innerHTML = `${medicine}`;
    } else {
        currentSelections.push(medicine);
        hiddenInput.value = currentSelections.join(',');
        element.classList.add('selected');
        element.innerHTML = `${medicine} ✓`;
    }
    
    displayDiv.textContent = hiddenInput.value ? hiddenInput.value.split(',').join(', ') : '请选择...';
    
    setTimeout(() => {
        const dropdown = document.getElementById(`${type}-dropdown-${room}`);
        if (dropdown && !dropdown.matches(':hover')) {
            dropdown.style.display = 'none';
        }
    }, 200);
}

// 关闭所有下拉菜单
function closeAllDropdowns() {
    document.querySelectorAll('.multiselect-dropdown').forEach(dropdown => {
        dropdown.style.display = 'none';
    });
}

// 页面点击时关闭下拉菜单
document.addEventListener('click', function(e) {
    if (!e.target.closest('.multiselect-container')) {
        closeAllDropdowns();
    }
});

// 治疗类型映射
const TREATMENT_TYPE_MAP = {
    '口服': 'oral',
    '注射': 'injection', 
    '手术': 'surgery',
    '活动': 'activity'
};

// 强制清除所有保存的状态
localStorage.removeItem('hospitalGameState');
sessionStorage.removeItem('hospitalGameState');

console.log('游戏状态已清除，开始新游戏');

class DayCommon {
    constructor(dayData) {
        this.dayData = dayData;
        this.gameState = null;
        // 对话系统状态
        this.dialogueStates = {}; // 每个病房的对话状态
        this.currentRoom = null;  // 当前显示的病房
        this.dialogueTimer = null; // 对话计时器
        
        // 绑定方法
        this.ensureReceptionActive = this.ensureReceptionActive.bind(this);
        this.checkMedicineTaken = this.checkMedicineTaken.bind(this);
        this.getRequiredMedicines = this.getRequiredMedicines.bind(this);
        this.getRoomRequiredMedicine = this.getRoomRequiredMedicine.bind(this);
        this.generateTreatmentForm = this.generateTreatmentForm.bind(this);
        this.submitTreatment = this.submitTreatment.bind(this);
        this.loadMedicineInventory = this.loadMedicineInventory.bind(this);
        this.checkAllMedicinesTaken = this.checkAllMedicinesTaken.bind(this);
        this.showBedModal = this.showBedModal.bind(this);
        this.clearAllTreatments = this.clearAllTreatments.bind(this);
        this.showDialogue = this.showDialogue.bind(this);
        this.startDialogue = this.startDialogue.bind(this);
        this.pauseDialogue = this.pauseDialogue.bind(this);
        this.resumeDialogue = this.resumeDialogue.bind(this);
        this.hideDialogue = this.hideDialogue.bind(this);
    }
// 初始化每日页面
    initDay(dayNumber) {
        console.log(`初始化第${dayNumber}天，数据:`, this.dayData);
        
        this.loadGameState();
        this.gameState.currentDay = dayNumber;
        this.gameState.dailyOrders = this.dayData.dailyOrders || {};

        this.initMarquee();
        this.initTabs();
        this.initGameModals();
        this.initPharmacy();
        this.initStaffRoom();
        this.updateDateDisplay(dayNumber);
        
        // 确保前台页面是激活状态
        this.ensureReceptionActive();
        
        // 加载前台内容
        this.loadReceptionContent('patient-records');
        
        this.saveGameState();
    }
    
    // 确保前台页面是激活状态
    ensureReceptionActive() {
        console.log('确保前台页面激活...');
        
        // 移除所有active类
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        
        // 设置前台为激活状态
        const receptionTab = document.getElementById('tab-reception');
        const receptionPage = document.getElementById('page-reception');
        
        if (receptionTab) {
            receptionTab.classList.add('active');
        }
        
        if (receptionPage) {
            receptionPage.classList.add('active');
        }
        
        console.log('前台页面已激活');
    }

    // 检查药品是否已取用
    checkMedicineTaken(medicineName) {
        return this.gameState.medicineTaken && this.gameState.medicineTaken[medicineName] === true;
    }

    // 获取医嘱需要的药品
    getRequiredMedicines() {
        const orders = this.dayData.dailyOrders || {};
        const requiredMedicines = [];
        
        Object.values(orders).forEach(order => {
            if (order.medicine && !requiredMedicines.includes(order.medicine)) {
                requiredMedicines.push(order.medicine);
            }
        });
        
        return requiredMedicines;
    }

    // 检查每个病房所需的药品是否已取用
    getRoomRequiredMedicine(room) {
        const checkResult = this.checkAllMedicinesTaken(room);
        // 返回第一个需要的药品（兼容旧代码）
        return checkResult.required.length > 0 ? checkResult.required[0] : null;
    }
    
    // 加载游戏状态
    loadGameState() {
        if (!window.gameState) {
            window.gameState = {
                currentDay: 1,
                startDate: new Date(2026, 0, 6),
                examinedPatients: {},
                patientTreatments: {},
                medicineTaken: {},
                dialoguesShown: {}, // 添加对话显示记录
                allExamined: false,
                dailyOrders: {},
                treatmentOrder: ['101', '102', '201', '202'],
                currentTreatmentIndex: 0
            };
        }
        
        const savedState = localStorage.getItem('hospitalGameState');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                
                // 只恢复状态，不覆盖dayData
                window.gameState = { 
                    ...window.gameState, 
                    ...parsed
                };
            } catch (e) {
                console.log('无法加载游戏状态，使用默认状态');
            }
        }
        
        this.gameState = window.gameState;
    }
    
    // 保存游戏状态
    saveGameState() {
        localStorage.setItem('hospitalGameState', JSON.stringify(this.gameState));
    }
    
    // 更新日期显示
    updateDateDisplay(day) {
        const dateDisplay = document.getElementById('date-display');
        if (!dateDisplay) return;
        
        // 检查是否有自定义的日期显示格式
        if (this.dayData.customDateDisplay) {
            dateDisplay.textContent = this.dayData.customDateDisplay;
            return;
        }
        
        // 默认日期计算
        const date = new Date(this.gameState.startDate);
        date.setDate(date.getDate() + (day - 1));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const dayOfMonth = date.getDate();
        dateDisplay.textContent = `${year}.${month}.${dayOfMonth} 第${day}天`;
    }
    
    // 初始化跑马灯
    initMarquee() {
        const marqueeContent = document.querySelector('.marquee-content');
        if (!marqueeContent) return;
        
        const messages = this.dayData.marqueeMessages || [
            "甄贴心疗养院，为您服务！",
            "24小时皇家级医疗护理",
            "米其林星级营养餐",
            "全智能医疗监护系统"
        ];
        
        // 所有文案首尾相连，用空格分隔
        let combinedText = '';
        messages.forEach(msg => {
            combinedText += msg + ' ';
        });
        
        // 重复确保无缝循环
        const repeatedText = combinedText.repeat(10);
        marqueeContent.textContent = repeatedText;
        
        // 立即开始动画
        marqueeContent.style.animation = 'none';
        setTimeout(() => {
            marqueeContent.style.animation = 'marquee 100s linear infinite';
            marqueeContent.classList.add('glow-text');
        }, 10);
    }
// 初始化标签页切换
    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.page-content').forEach(page => {
                    page.classList.remove('active');
                });
                
                button.classList.add('active');
                const pageId = button.getAttribute('data-page');
                const pageElement = document.getElementById(`page-${pageId}`);
                if (pageElement) pageElement.classList.add('active');
                
                switch(pageId) {
                    case 'reception':
                        this.loadReceptionContent('patient-records');
                        break;
                    case 'ward':
                        this.loadWardContent('101');
                        break;
                }
            });
        });
        
        const receptionSidebarButtons = document.querySelectorAll('#page-reception .sidebar-btn');
        receptionSidebarButtons.forEach(button => {
            button.addEventListener('click', () => {
                receptionSidebarButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const subpage = button.getAttribute('data-subpage');
                this.loadReceptionContent(subpage);
            });
        });
        
        const wardSidebarButtons = document.querySelectorAll('#page-ward .sidebar-btn');
        wardSidebarButtons.forEach(button => {
            button.addEventListener('click', () => {
                wardSidebarButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const room = button.getAttribute('data-room');
                this.loadWardContent(room);
            });
        });
    }
    
    // 加载前台页面内容
    loadReceptionContent(subpage) {
        const sections = ['patient-records', 'medicine-inventory', 'daily-orders'];
        sections.forEach(section => {
            const element = document.getElementById(`${section}-content`);
            if (element) element.classList.remove('active');
        });
        
        const currentSection = document.getElementById(`${subpage}-content`);
        if (currentSection) currentSection.classList.add('active');
        
        switch(subpage) {
            case 'patient-records': this.loadPatientRecords(); break;
            case 'medicine-inventory': this.loadMedicineInventory(); break;
            case 'daily-orders': this.loadDailyOrders(); break;
        }
    }
    
    
    // 显示病人对话（支持暂停/恢复）
    showDialogue(room) {
        // 如果正在显示其他病房的对话，先暂停
        if (this.currentRoom && this.currentRoom !== room) {
            this.pauseDialogue();
        }
        
        // 检查是否已经显示过对话
        if (!this.gameState.dialoguesShown) {
            this.gameState.dialoguesShown = {};
        }
        
        if (this.gameState.dialoguesShown[room]) {
            return;
        }
        
        // 获取对话内容
        const dialogues = this.dayData.dialogues && this.dayData.dialogues[room];
        if (!dialogues || dialogues.length === 0) {
            return;
        }
        
        // 初始化或恢复对话状态
        if (!this.dialogueStates[room]) {
            this.dialogueStates[room] = {
                dialogues: dialogues,
                currentIndex: 0,
                isCompleted: false
            };
        }
        
        this.currentRoom = room;
        
        // 显示对话容器
        const dialogueSystem = document.getElementById('dialogue-system');
        if (dialogueSystem) {
            dialogueSystem.style.display = 'block';
        }
        
        // 开始或恢复对话
        if (this.dialogueStates[room].currentIndex === 0) {
            this.startDialogue(room);
        } else {
            this.resumeDialogue(room);
        }
    }
    
    // 开始新对话
    startDialogue(room) {
        const state = this.dialogueStates[room];
        state.currentIndex = 0;
        state.isCompleted = false;
         // 新增：对话令牌
        state.sessionToken = Date.now() + Math.random();
        this.clearAllBubbles();
        this.showDialogueSequence(room);
    }
    // 暂停当前对话
    pauseDialogue() {
        if (this.dialogueTimer) {
            clearTimeout(this.dialogueTimer);
            this.dialogueTimer = null;
        }
        // 使当前对话所有旧回调失效
        if (this.currentRoom && this.dialogueStates[this.currentRoom]) {
            this.dialogueStates[this.currentRoom].sessionToken = null;
        }

        // 隐藏对话容器但不清除内容
        const dialogueSystem = document.getElementById('dialogue-system');
        if (dialogueSystem) {
            dialogueSystem.style.display = 'none';
        }
    }
    // 恢复对话
    resumeDialogue(room) {
        const dialogueSystem = document.getElementById('dialogue-system');
        if (dialogueSystem) {
            dialogueSystem.style.display = 'block';
        }
        
        // 重新显示当前状态
        this.showCurrentDialogueState(room);
        
        // 继续序列
        this.showDialogueSequence(room);
    }
    // 显示当前对话状态
    showCurrentDialogueState(room) {
        const state = this.dialogueStates[room];
        this.clearAllBubbles();
        
        // 重新显示当前应该显示的所有对话
        for (let i = 1; i <= 4; i++) {
            const dialogueIndex = state.currentIndex - i;
            if (dialogueIndex >= 0 && dialogueIndex < state.dialogues.length) {
                this.showBubbleAtPosition(i, state.dialogues[dialogueIndex]);
            }
        }
    }
    // 辅助方法
    clearAllBubbles() {
        for (let i = 1; i <= 4; i++) {
            this.showBubbleAtPosition(i, '');
        }
    }
    // ===============================
    // 对话序列主控制（唯一计时器）
    // ===============================
    showDialogueSequence(room) {
        const state = this.dialogueStates[room];
        if (!state || state.isCompleted) return;
        const token = state.sessionToken; // 捕获当前 token
        // 清理旧计时器
        if (this.dialogueTimer) {
            clearTimeout(this.dialogueTimer);
            this.dialogueTimer = null;
        }
        // 如果页面切换 / 房间切换导致 token 改变，直接终止
        if (token !== state.sessionToken) return;

        // 已播放完全部文案
        if (state.currentIndex >= state.dialogues.length) {
            this.dialogueTimer = setTimeout(() => {
                this.hideAllBubbles();
                state.isCompleted = true;
                this.gameState.dialoguesShown[room] = true;
                this.saveGameState();

                setTimeout(() => {
                    this.hideDialogue();
                }, 500);
            }, 2500); // 2.5 秒后整体消失
            return;
        }

        // 显示当前帧
        this.renderDialogueFrame(room);

        // 推进索引
        state.currentIndex++;

        // 下一帧
        this.dialogueTimer = setTimeout(() => {
            this.showDialogueSequence(room);
        }, 1000);
    }


    // ===============================
    // 渲染 4 行气泡（从下向上滚动）
    // ===============================
    renderDialogueFrame(room) {
        const state = this.dialogueStates[room];
        this.clearAllBubbles();

        for (let row = 4; row >= 1; row--) {
            const dialogueIndex = state.currentIndex - (4 - row);
            if (dialogueIndex >= 0 && dialogueIndex < state.dialogues.length) {
                this.showBubbleAtPosition(row, state.dialogues[dialogueIndex]);
            }
        }
    }


    showBubbleAtPosition(position, text) {
        const bubble = document.getElementById(`dialogue-pos-${position}`);
        if (bubble) {
            bubble.textContent = text;
            bubble.classList.remove('hidden');
        }
    }

    hideAllBubbles() {
        for (let i = 1; i <= 4; i++) {
            const bubble = document.getElementById(`dialogue-pos-${i}`);
            if (bubble) {
                bubble.classList.add('hidden');
            }
        }
    }
    // 隐藏对话系统
    hideDialogue() {
        // 清除计时器
        if (this.dialogueTimer) {
            clearTimeout(this.dialogueTimer);
            this.dialogueTimer = null;
        }
        
        this.hideAllBubbles();
        
        setTimeout(() => {
            const dialogueSystem = document.getElementById('dialogue-system');
            if (dialogueSystem) {
                dialogueSystem.style.display = 'none';
            }
            this.currentRoom = null;
        }, 1000);
    }


    // 加载病房详情
    loadWardContent = function(room) {
        const wardDetails = document.getElementById('ward-details');
        if (!wardDetails) return;
        
        const patients = this.dayData.patients || this.getDefaultPatients();
        const patient = patients[room];
        if (!patient) {
            console.error(`病人数据不存在: ${room}`);
            wardDetails.innerHTML = `<div style="padding: 20px; color: red;">错误：病人数据不存在</div>`;
            return;
        }
        
        const isExamined = this.gameState.examinedPatients && this.gameState.examinedPatients[room] || false;
        const hasTreatment = this.gameState.patientTreatments && this.gameState.patientTreatments[room] || false;
        
        // 检查这个病房需要的药品
        const requiredMedicine = this.getRoomRequiredMedicine(room);
        const medicineTaken = requiredMedicine ? this.checkMedicineTaken(requiredMedicine) : false;
        // === 修复：使用新的多种药物检查方法 ===
        const medicineCheck = this.checkAllMedicinesTaken(room);
        const canTreat = isExamined && medicineCheck.allTaken;
        
        
        // 从当天数据获取图片路径
        const imagePath = this.dayData.patientImages && this.dayData.patientImages[room] 
            ? this.dayData.patientImages[room] 
            : `images/default_patient.jpg`;
        
        wardDetails.innerHTML = `
            <div class="patient-detail-container">
                <div class="patient-info-section">
                    <div class="patient-image-container">
                        <img src="${imagePath}" alt="${patient.name}" class="patient-image">
            
                    </div>
                    
                    <div class="examine-section" id="examine-section-${room}">
                        ${!isExamined ? `
                            <button class="examine-btn" id="examine-btn-${room}">例行检查</button>
                        ` : ''}
                    </div>
                    
                    <div class="vitals-container ${isExamined ? 'show' : ''}" id="vitals-${room}" style="margin-top: 30px;">
                        <div class="vital-row"><span class="vital-label">体温</span><span class="vital-value">${patient.vitals.temperature}</span></div>
                        <div class="vital-row"><span class="vital-label">血压</span><span class="vital-value">${patient.vitals.bloodPressure}</span></div>
                        <div class="vital-row"><span class="vital-label">脉搏</span><span class="vital-value">${patient.vitals.pulse}</span></div>
                        <div class="vital-row"><span class="vital-label">表现</span><span class="vital-value" style="font-family: inherit;">${patient.vitals.symptoms}</span></div>
                    </div>
                </div>
                <div class="treatment-form-section">
            
                    ${isExamined && !medicineCheck.allTaken ? `
                        <div class="medicine-warning" id="medicine-warning-${room}" 
                            style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin-bottom: 15px; color: #856404;">
                            <strong>⚠ 需要先取药</strong>
                        </div>
                    ` : ''}
                    
                    <form class="treatment-form" id="treatment-form-${room}" 
                        ${!canTreat ? 'style="opacity:0.5;pointer-events:none;"' : ''}>
                        ${this.generateTreatmentForm(room, hasTreatment, canTreat)}
                        <button type="button" class="submit-treatment" id="submit-treatment-${room}" 
                            ${!canTreat ? 'disabled' : hasTreatment ? 'disabled style="background-color:#32cd32;"' : ''}>
                            ${hasTreatment ? '✓ 已确认' : '确认治疗'}
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        if (!isExamined) {
            const examineBtn = document.getElementById(`examine-btn-${room}`);
            if (examineBtn) examineBtn.addEventListener('click', () => this.performExamination(room));
        }
        
        if (canTreat && !hasTreatment) {
            this.bindTreatmentForm(room, false);
        } else if (hasTreatment) {
            this.bindTreatmentForm(room, true);
        }

         // 在方法末尾添加对话触发（延迟确保页面加载完成）
        setTimeout(() => {
            this.showDialogue(room);
        }, 300);
    };
    // 生成治疗表单
    generateTreatmentForm(room, hasTreatment, canTreat) {
        const treatmentTypes = [
            { id: 'oral', label: '口服', typeClass: 'medicine-type' },
            { id: 'injection', label: '注射', typeClass: 'medicine-type' },
            { id: 'surgery', label: '手术', typeClass: 'surgery-type' },
            { id: 'activity', label: '活动', typeClass: 'activity-type' }
        ];
        
        // 获取这个病房的医嘱（可能是数组）
        const orders = this.dayData.dailyOrders || {};
        const roomOrders = Array.isArray(orders[room]) ? orders[room] : [orders[room]].filter(Boolean);
        
        // 生成医嘱提示
        let orderHint = '';
        if (roomOrders.length > 0 && canTreat && !hasTreatment) {
            // 处理多种治疗方式的显示
            const orderDetails = roomOrders.map(order => {
                if (!order) return '';
                
                // 安全处理medicine字段
                let medicineText;
                if (Array.isArray(order.medicine)) {
                    medicineText = order.medicine.join('+');
                } else if (order.medicine) {
                    medicineText = order.medicine;
                } else {
                    medicineText = '无';
                }
                
                return `• ${order.type}【${medicineText}】`;
            }).filter(Boolean).join('<br>');
            
            orderHint = `
                <div class="order-hint" style="background: #e8f4fd; border: 1px solid #b3d9ff; border-radius: 4px; padding: 10px; margin-bottom: 15px; color: #0066cc;">
                    <strong>💡 医嘱提示：</strong><br>
                    ${orderDetails}
                </div>
            `;
        }
        const savedTreatment = this.gameState.patientTreatments && this.gameState.patientTreatments[room] || {};
        
        let html = '';
        treatmentTypes.forEach(type => {
            const savedData = savedTreatment[type.id];
            const isEnabled = savedData?.enabled || false;
            const selectedMedicines = savedData?.medicines || [];
            // 检查医嘱是否要求这个治疗类型
            const orderForThisType = roomOrders.find(order => 
                order && TREATMENT_TYPE_MAP[order.type] === type.id
            );
            // 获取这个治疗类型的自定义选项
            const treatmentOptions = this.dayData.treatmentOptions?.[type.id] || {};
            // 获取允许的药物列表
            let allowedMedicines;
            if (treatmentOptions.allowedMedicines && treatmentOptions.allowedMedicines.length > 0) {
                allowedMedicines = treatmentOptions.allowedMedicines;
            }
            // 为已选择的药物生成显示文本
            const displayText = selectedMedicines.length > 0 ? selectedMedicines.join(', ') : '请选择...';
            
            html += `
                <div class="treatment-row">
                    <span class="treatment-label">${type.label}</span>
                    <div class="treatment-options">
                        <div class="checkbox-group">
                            <input type="checkbox" class="checkbox-input" id="${type.id}-yes-${room}" 
                                name="${type.id}-${room}" value="yes" 
                                ${isEnabled ? 'checked' : ''}
                                ${hasTreatment || !canTreat ? 'disabled' : ''}>
                            <label class="checkbox-label" for="${type.id}-yes-${room}">是</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" class="checkbox-input" id="${type.id}-no-${room}" 
                                name="${type.id}-${room}" value="no" 
                                ${!isEnabled ? 'checked' : ''}
                                ${hasTreatment || !canTreat ? 'disabled' : ''}>
                            <label class="checkbox-label" for="${type.id}-no-${room}">否</label>
                        </div>
                        <div class="multiselect-container">
                            <div class="multiselect-display" id="${type.id}-display-${room}" 
                                style="${!isEnabled || hasTreatment || !canTreat ? 'opacity:0.5;pointer-events:none;' : 'cursor:pointer;'}"
                                ${!isEnabled || hasTreatment || !canTreat ? '' : 'onclick="this.nextElementSibling.style.display=\'block\'" onmouseover="this.nextElementSibling.style.display=\'block\'"'}>
                                ${displayText}
                            </div>
                            <div class="multiselect-dropdown" id="${type.id}-dropdown-${room}" 
                                style="display:none;"
                                onmouseover="this.style.display='block'"
                                onmouseout="setTimeout(() => { if (!this.matches(':hover')) this.style.display='none'; }, 100)">
                                ${allowedMedicines.map(med => {
                                    const isSelected = selectedMedicines.includes(med);
                                    return `
                                        <div class="dropdown-item ${type.typeClass} ${isSelected ? 'selected' : ''}" 
                                            data-medicine="${med}"
                                            data-type="${type.id}"
                                            data-room="${room}"
                                            onclick="toggleMedicineSelection(this, '${med}', '${type.id}', '${room}')">
                                            ${med} 
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                            <input type="hidden" id="${type.id}-medicine-${room}" value="${selectedMedicines.join(',')}">
                        </div>
                    </div>
                </div>
            `;
        });
        
        return html;
    }
    
    // 执行检查
    performExamination(room) {
        const examineBtn = document.getElementById(`examine-btn-${room}`);
        if (!examineBtn) return;
        
        examineBtn.disabled = true;
        examineBtn.textContent = '检查中...';
        
        setTimeout(() => {
            if (!this.gameState.examinedPatients) {
                this.gameState.examinedPatients = {};
            }
            this.gameState.examinedPatients[room] = true;
            
            const examineSection = document.getElementById(`examine-section-${room}`);
            if (examineSection) examineSection.style.display = 'none';
            
            this.saveGameState();
            
            // 重新加载病房
            this.loadWardContent(room);
            
            // 如果在前台，刷新医嘱
            if (document.querySelector('#tab-reception')?.classList.contains('active')) {
                this.loadDailyOrders();
            }
        }, 2000);
    }
    
    // 绑定治疗表单
    bindTreatmentForm(room, hasTreatment) {
        if (hasTreatment) {
            // 已治疗，禁用所有
            ['oral', 'injection', 'surgery', 'activity'].forEach(type => {
                const yesCheckbox = document.getElementById(`${type}-yes-${room}`);
                const noCheckbox = document.getElementById(`${type}-no-${room}`);
                const displayDiv = document.getElementById(`${type}-display-${room}`);
                
                if (yesCheckbox) yesCheckbox.disabled = true;
                if (noCheckbox) noCheckbox.disabled = true;
                if (displayDiv) {
                    displayDiv.style.opacity = '0.5';
                    displayDiv.style.pointerEvents = 'none';
                }
            });
        } else {
            // 正常绑定事件
            ['oral', 'injection', 'surgery', 'activity'].forEach(type => {
                const yesCheckbox = document.getElementById(`${type}-yes-${room}`);
                const noCheckbox = document.getElementById(`${type}-no-${room}`);
                const displayDiv = document.getElementById(`${type}-display-${room}`);
                const dropdown = document.getElementById(`${type}-dropdown-${room}`);
                
                if (yesCheckbox && noCheckbox && displayDiv && dropdown) {
                    // 修复下拉菜单显示
                    yesCheckbox.addEventListener('change', function() {
                        if (this.checked) {
                            noCheckbox.checked = false;
                            displayDiv.style.opacity = '1';
                            displayDiv.style.pointerEvents = 'all';
                            displayDiv.style.cursor = 'pointer';
                            
                            // 修复点击事件
                            displayDiv.onclick = function() {
                                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                            };
                            
                            displayDiv.onmouseover = function() {
                                dropdown.style.display = 'block';
                            };
                        } else {
                            noCheckbox.checked = true;
                            displayDiv.style.opacity = '0.5';
                            displayDiv.style.pointerEvents = 'none';
                            displayDiv.style.cursor = 'default';
                            displayDiv.onclick = null;
                            displayDiv.onmouseover = null;
                            dropdown.style.display = 'none';
                        }
                    });
                    
                    noCheckbox.addEventListener('change', function() {
                        if (this.checked) {
                            yesCheckbox.checked = false;
                            displayDiv.style.opacity = '0.5';
                            displayDiv.style.pointerEvents = 'none';
                            displayDiv.style.cursor = 'default';
                            displayDiv.onclick = null;
                            displayDiv.onmouseover = null;
                            dropdown.style.display = 'none';
                        } else {
                            yesCheckbox.checked = true;
                            displayDiv.style.opacity = '1';
                            displayDiv.style.pointerEvents = 'all';
                            displayDiv.style.cursor = 'pointer';
                            
                            displayDiv.onclick = function() {
                                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                            };
                            
                            displayDiv.onmouseover = function() {
                                dropdown.style.display = 'block';
                            };
                        }
                    });
                    
                    // 初始状态绑定
                    if (yesCheckbox.checked) {
                        displayDiv.onclick = function() {
                            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                        };
                        
                        displayDiv.onmouseover = function() {
                            dropdown.style.display = 'block';
                        };
                    }
                    
                    // 下拉菜单鼠标离开事件
                    dropdown.onmouseleave = function() {
                        setTimeout(() => {
                            if (!dropdown.matches(':hover')) {
                                dropdown.style.display = 'none';
                            }
                        }, 100);
                    };
                }
            });
            
            // 绑定提交按钮
            const submitBtn = document.getElementById(`submit-treatment-${room}`);
            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.submitTreatment(room));
            }
        }
    }
// 提交治疗
    submitTreatment(room) {
        console.log(`开始保存${room}病房治疗...`);
        
        const treatmentTypes = ['oral', 'injection', 'surgery', 'activity'];
        const treatmentData = {};
        
        // 保存治疗记录（无论是否正确）
        treatmentTypes.forEach(type => {
            const yesCheckbox = document.getElementById(`${type}-yes-${room}`);
            const noCheckbox = document.getElementById(`${type}-no-${room}`);
            const hiddenInput = document.getElementById(`${type}-medicine-${room}`);
            
            if (yesCheckbox && noCheckbox && hiddenInput) {
                if (yesCheckbox.checked) {
                    const selectedItems = hiddenInput.value ? hiddenInput.value.split(',').filter(Boolean) : [];
                    treatmentData[type] = { enabled: true, medicines: selectedItems };
                } else {
                    treatmentData[type] = { enabled: false, medicines: [] };
                }
            }
        });
        
        // 保存到游戏状态
        if (!this.gameState.patientTreatments) {
            this.gameState.patientTreatments = {};
        }
        this.gameState.patientTreatments[room] = treatmentData;
        this.saveGameState();
        
        console.log(`${room}病房治疗保存:`, treatmentData);
        
        // 更新按钮状态
        const submitBtn = document.getElementById(`submit-treatment-${room}`);
        if (submitBtn) {
            submitBtn.textContent = '✓ 已确认';
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = '#32cd32';
        }
        
        // 禁用表单
        treatmentTypes.forEach(type => {
            const yesCheckbox = document.getElementById(`${type}-yes-${room}`);
            const noCheckbox = document.getElementById(`${type}-no-${room}`);
            const displayDiv = document.getElementById(`${type}-display-${room}`);
            const dropdown = document.getElementById(`${type}-dropdown-${room}`);
            
            if (yesCheckbox) yesCheckbox.disabled = true;
            if (noCheckbox) noCheckbox.disabled = true;
            if (displayDiv) {
                displayDiv.style.opacity = '0.5';
                displayDiv.style.pointerEvents = 'none';
                displayDiv.style.cursor = 'default';
            }
            if (dropdown) {
                dropdown.style.opacity = '0.5';
                dropdown.style.pointerEvents = 'none';
            }
        });
        
        // 检查是否四个病房都确认了
        this.checkAllRoomsTreated();
    }

    // 新增方法：检查所有病房是否都确认了治疗
    checkAllRoomsTreated() {
        const rooms = ['101', '102', '201', '202'];
        const allConfirmed = rooms.every(room => {
            const submitBtn = document.getElementById(`submit-treatment-${room}`);
            return submitBtn && submitBtn.textContent.includes('✓ 已确认');
        });
        
        if (allConfirmed) {
            console.log('所有病房都已确认治疗，开始检查医嘱匹配...');
            this.validateAllTreatments();
        }
    }

    // 新增方法：验证所有治疗是否严格按医嘱
    validateAllTreatments() {
        const rooms = ['101', '102', '201', '202'];
        const orders = this.dayData.dailyOrders || {};
        let allCorrect = true;
        let errorMessages = [];
        
        for (const room of rooms) {
            const roomOrders = Array.isArray(orders[room]) ? orders[room] : [orders[room]].filter(Boolean);
            const treatment = this.gameState.patientTreatments && this.gameState.patientTreatments[room];
            
            if (!treatment) {
                allCorrect = false;
                errorMessages.push(`${room}病房：无治疗记录`);
                continue;
            }
            
            // 检查每个医嘱是否被正确执行
            for (const order of roomOrders) {
                if (!order) continue;
                
                const treatmentType = TREATMENT_TYPE_MAP[order.type];
                if (!treatmentType) {
                    allCorrect = false;
                    errorMessages.push(`${room}病房：未知治疗类型【${order.type}】`);
                    continue;
                }
                
                const treatmentData = treatment[treatmentType];
                if (!treatmentData || !treatmentData.enabled) {
                    allCorrect = false;
                    errorMessages.push(`${room}病房：${order.type}治疗未启用`);
                    continue;
                }
                
                const selectedMedicines = treatmentData.medicines || [];
                const requiredMedicines = Array.isArray(order.medicine) ? order.medicine : [order.medicine];
                
                // 严格检查：必须选择所有必需药物且不能多选
                const hasAllRequired = requiredMedicines.every(med => selectedMedicines.includes(med));
                const hasNoExtra = selectedMedicines.length === requiredMedicines.length;
                
                if (!hasAllRequired || !hasNoExtra) {
                    allCorrect = false;
                    const requiredText = requiredMedicines.join('+');
                    const selectedText = selectedMedicines.join('+') || '未选择';
                    errorMessages.push(`${room}病房：${order.type}治疗应该选择【${requiredText}】，但选择了【${selectedText}】`);
                }
            }
            
            // 检查是否有额外的治疗（医嘱没要求但玩家启用了）
            const enabledTreatments = Object.entries(treatment)
                .filter(([type, data]) => data && data.enabled)
                .map(([type]) => type);
                
            const requiredTreatmentTypes = roomOrders.map(order => TREATMENT_TYPE_MAP[order.type]);
            
            for (const enabledType of enabledTreatments) {
                if (!requiredTreatmentTypes.includes(enabledType)) {
                    allCorrect = false;
                    const typeLabel = this.getTreatmentLabel(enabledType);
                    errorMessages.push(`${room}病房：${typeLabel}治疗不应该启用`);
                }
            }
        }
        
        if (!allCorrect) {
            console.log('治疗未按医嘱，错误信息:', errorMessages);
            // 不清空治疗，让玩家可以继续修改
            this.showTreatmentError(errorMessages);
        } else {
            console.log('所有治疗都严格按医嘱！');
        }
    }

    // 获取治疗类型标签
    getTreatmentLabel(type) {
        const typeMap = {
            'oral': '口服',
            'injection': '注射',
            'surgery': '手术', 
            'activity': '活动'
        };
        return typeMap[type] || type;
    }
    
    // 加载病房入住记录
    loadPatientRecords() {
        const recordsBody = document.getElementById('records-body');
        if (!recordsBody) return;
        
        const records = this.dayData.roomRecords || this.getDefaultRecords();
        
        let html = '';
        records.forEach(record => {
            html += `
                <tr>
                    <td><span class="room-link" data-room="${record.room}">${record.room}</span></td>
                    <td>${record.admission}</td>
                    <td>${record.discharge || '-'}</td>
                    <td>${record.receipt || '-'}</td>
                </tr>
            `;
        });
        
        recordsBody.innerHTML = html;
        
        document.querySelectorAll('.room-link').forEach(link => {
            link.addEventListener('click', () => {
                const room = link.getAttribute('data-room');
                this.showRoomInfo(room);
            });
        });
    }
    
    // 显示病房信息
    showRoomInfo(room) {
        const patients = this.dayData.patients || this.getDefaultPatients();
        const patient = patients[room];
        if (!patient) return;
        
        const content = `
            <div class="room-info">
                <h4>${room}病房详情</h4>
                <div class="info-row"><strong>病人：</strong> ${patient.name}</div>
                <div class="info-row"><strong>年龄：</strong> ${patient.age}岁</div>
                <div class="info-row"><strong>诊断：</strong> ${patient.diagnosis}</div>
            </div>
        `;
        this.showGameModal(`${room}病房信息`, content);
    }
    
    // 加载药品库存
    loadMedicineInventory() {
        const medicineGrid = document.getElementById('medicine-grid');
        if (!medicineGrid) return;
        
        const medicines = this.dayData.medicines || this.getDefaultMedicines();
        
        let html = '';
        medicines.forEach(medicine => {
            const isTaken = this.checkMedicineTaken(medicine.name);
            html += `
                <div class="medicine-item">
                    <div class="medicine-name">${medicine.name}</div>
                    <div class="medicine-stock">库存: ${medicine.stock}</div>
                    <button class="take-btn" data-medicine="${medicine.name}" ${isTaken ? 'disabled' : ''}>
                        ${isTaken ? '已取用' : '取用'}
                    </button>
                </div>
            `;
        });
        
        medicineGrid.innerHTML = html;
        
        // 修改取药按钮的事件处理
        document.querySelectorAll('.take-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const medicine = e.target.getAttribute('data-medicine');
                
                // 标记为已取用
                if (!this.gameState.medicineTaken) {
                    this.gameState.medicineTaken = {};
                }
                this.gameState.medicineTaken[medicine] = true;
                this.saveGameState();
                
                // 更新按钮状态
                e.target.textContent = '已取用';
                e.target.classList.add('taken');
                e.target.disabled = true;
                
                // 检查是否在病房页面，如果是则刷新所有病房显示
                if (document.querySelector('#page-ward')?.classList.contains('active')) {
                    // 刷新所有病房，因为一个药品可能被多个病房需要
                    const wardSidebarButtons = document.querySelectorAll('#page-ward .sidebar-btn');
                    wardSidebarButtons.forEach(button => {
                        const room = button.getAttribute('data-room');
                        // 延迟刷新，确保状态已保存
                        setTimeout(() => {
                            this.loadWardContent(room);
                        }, 100);
                    });
                }
                
                // 如果在前台页面，也刷新医嘱显示
                if (document.querySelector('#tab-reception')?.classList.contains('active')) {
                    setTimeout(() => {
                        this.loadDailyOrders();
                    }, 100);
                }
            });
        });
    }

    // 检查所有医嘱药品是否已取用
    checkAllMedicinesTaken(room) {
        const orders = this.dayData.dailyOrders || {};
        const roomOrders = Array.isArray(orders[room]) ? orders[room] : [orders[room]].filter(Boolean);
        
        // 收集所有需要的药品
        const requiredMedicines = [];
        roomOrders.forEach(order => {
            if (order && order.medicine) {
                if (Array.isArray(order.medicine)) {
                    requiredMedicines.push(...order.medicine);
                } else {
                    requiredMedicines.push(order.medicine);
                }
            }
        });
        
        // 去重
        const uniqueMedicines = [...new Set(requiredMedicines)];
        
        // 检查是否所有药品都已取用
        const allTaken = uniqueMedicines.every(medicine => 
            this.checkMedicineTaken(medicine)
        );
        
        // 找出缺失的药品
        const missing = uniqueMedicines.filter(medicine => 
            !this.checkMedicineTaken(medicine)
        );
        
        return {
            allTaken: allTaken,
            missing: missing,
            required: uniqueMedicines
        };
    }
    
    // 加载每日医嘱
    loadDailyOrders() {
        const ordersContainer = document.getElementById('orders-container');
        if (!ordersContainer) return;
        
        const rooms = ['101', '102', '201', '202'];
        const allExamined = rooms.every(room => 
            this.gameState.examinedPatients && this.gameState.examinedPatients[room]
        );
        
        if (!allExamined) {
            ordersContainer.innerHTML = `<div class="no-exam-message">请先对所有病人进行检查</div>`;
            return;
        }
        
        const orders = this.dayData.dailyOrders || {};
        
        let html = '<div class="orders-grid">';
        rooms.forEach(room => {
            const roomOrders = Array.isArray(orders[room]) ? orders[room] : [orders[room]].filter(Boolean);
            
            if (roomOrders.length === 0) {
                html += `<div class="order-item"><h4>${room}病房</h4><p class="order-detail">无医嘱</p></div>`;
                return;
            }
            
            // 处理多种治疗方式的显示
            const orderDetails = roomOrders.map(order => {
                if (!order) return '';
                
                // 安全处理medicine字段
                let medicineText;
                if (Array.isArray(order.medicine)) {
                    medicineText = order.medicine.join('+');
                } else if (order.medicine) {
                    medicineText = order.medicine;
                } else {
                    medicineText = '无';
                }
                
                return `${order.type}【${medicineText}】`;
            }).filter(Boolean).join('<br>');
            
            html += `
                <div class="order-item">
                    <h4>${room}病房</h4>
                    <p class="order-detail">${orderDetails}</p>
                </div>
            `;
        });
        html += '</div>';
        
        ordersContainer.innerHTML = html;
    }
// 弹窗系统初始化
    initGameModals() {
        const modalOverlay = document.getElementById('game-modal-overlay');
        const modal = document.getElementById('game-modal');
        const modalClose = document.getElementById('game-modal-close');
        const confirmOverlay = document.getElementById('game-confirm-overlay');
        const confirmModal = document.getElementById('game-confirm-modal');
        
        if (modalClose) modalClose.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
            modal.style.display = 'none';
        });
        
        if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
                modal.style.display = 'none';
            }
        });
        
        if (confirmOverlay) confirmOverlay.addEventListener('click', (e) => {
            if (e.target === confirmOverlay) {
                confirmOverlay.style.display = 'none';
                confirmModal.style.display = 'none';
            }
        });
        
        const confirmYes = document.getElementById('game-confirm-yes');
        const confirmNo = document.getElementById('game-confirm-no');
        
        if (confirmYes) confirmYes.addEventListener('click', () => {
            if (window.currentConfirmCallback) window.currentConfirmCallback(true);
            confirmOverlay.style.display = 'none';
            confirmModal.style.display = 'none';
        });
        
        if (confirmNo) confirmNo.addEventListener('click', () => {
            if (window.currentConfirmCallback) window.currentConfirmCallback(false);
            confirmOverlay.style.display = 'none';
            confirmModal.style.display = 'none';
        });
    }
    
    // 显示弹窗
    showGameModal(title, content) {
        const modalOverlay = document.getElementById('game-modal-overlay');
        const modal = document.getElementById('game-modal');
        const modalTitle = document.getElementById('game-modal-title');
        const modalBody = document.getElementById('game-modal-body');
        
        if (!modalOverlay || !modal || !modalTitle || !modalBody) return;
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modalOverlay.style.display = 'flex';
        modal.style.display = 'block';
    }
    
    // 显示确认弹窗
    showGameConfirm(message, callback) {
        const confirmOverlay = document.getElementById('game-confirm-overlay');
        const confirmModal = document.getElementById('game-confirm-modal');
        const confirmMessage = document.getElementById('game-confirm-message');
        
        if (!confirmOverlay || !confirmModal || !confirmMessage) return;
        confirmMessage.textContent = message;
        confirmOverlay.style.display = 'flex';
        confirmModal.style.display = 'block';
        window.currentConfirmCallback = callback;
    }
    
    // 药品系统
    initPharmacy() {
        if (!this.gameState.medicineTaken) {
            this.gameState.medicineTaken = {};
        }
    }
    
    // 员工休息室
    initStaffRoom() {
        const staffRoomBg = document.getElementById('staff-room-bg');
        if (!staffRoomBg) return;
        
        staffRoomBg.addEventListener('click', (e) => {
            const rect = staffRoomBg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const width = rect.width;
            const height = rect.height;
            const xPercent = (x / width) * 100;
            const yPercent = (y / height) * 100;
            
            if (xPercent < 40 && yPercent > 20 && yPercent < 80) {
                this.showCabinetModal();
            } else if (xPercent > 60 && yPercent < 40) {
                this.showPosterModal();
            } else if (xPercent > 60 && yPercent > 60) {
                this.showBedModal();
            }
        });
    }
    
    // 显示柜子弹窗
    showCabinetModal() {
        this.showGameModal('柜子', `<div class="cabinet-info"><p><strong>柜子</strong></p><p>很宽敞的柜子，可以装下很多东西。</p></div>`);
    }
    
    // 显示海报弹窗
    showPosterModal() {
        this.showGameModal('员工守则', `
            <div class="rules-content">
                <h4>工作守则</h4>
                <ol>
                    <li>疗养院尊重每一位病人，每位医护人员都不会因为病人的外貌和疾病而区别对待。</li>
                    <li>疗养院严肃对待每位病人的人身安全，所有公共环境不允许出现任何危险物品，包括xx、xx、镜子、xx...</li>
                    <li>疗养院为病人和医护工作者都提供统一的营养餐，保证身体每日必需营养摄入。</li>
                    <li>疗养院同样注重病人的心理健康，在入院期间，会为病人提供多样的休闲娱乐活动。</li>
                    <li>疗养院采用医患分离，系统管理的治疗方案，保证每位病人推进治疗进度。</li>
                    <li>由于治疗方案的先进性和特殊性，患者发现短暂的症状改变乃至样貌的改变皆为正常，工作人员不必特别对待</li>
                    <li>疗养院为确保设备运行稳定，会在方便的时刻定时断电进行检修，各位医护人员无需惊慌，正常工作即可。</li>
                    <li>疗养院为每位医护工作者都提供了单独的休息室,以保证每位工作者的休息质量。</li>
                </ol>
            </div>
        `);
    }
    
    // 床弹窗
    showBedModal() {
        const endDayData = this.dayData.endDayData || {};
        const confirmMessage = endDayData.confirmMessage || '是否结束今天的工作？';
        
        this.showGameConfirm(confirmMessage, (confirmed) => {
            if (confirmed) {
                this.endDay();
            }
        });
    }
// 结束一天工作
    endDay() {
        const currentDay = this.gameState.currentDay;
        const rooms = ['101', '102', '201', '202'];
        
        const orders = this.dayData.dailyOrders || {};
        console.log('=== 最终检查治疗 ===');
        
        // 1. 检查是否所有病人都已治疗
        let untreatedRooms = [];
        let allTreated = true;
        
        for (const room of rooms) {
            const treatment = this.gameState.patientTreatments && this.gameState.patientTreatments[room];
            if (!treatment) {
                untreatedRooms.push(room);
                allTreated = false;
            } else {
                const hasEnabledTreatment = Object.values(treatment).some(
                    t => t && t.enabled === true
                );
                if (!hasEnabledTreatment) {
                    untreatedRooms.push(room);
                    allTreated = false;
                }
            }
        }
        
        if (!allTreated) {
            // 清除所有治疗记录
            this.gameState.patientTreatments = {};
            this.saveGameState();
            // 重新加载所有病房页面，重置按钮状态
            const rooms = ['101', '102', '201', '202'];
            rooms.forEach(room => {
                const submitBtn = document.getElementById(`submit-treatment-${room}`);
                if (submitBtn) {
                    submitBtn.textContent = '确认治疗';
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }
            });
            const endDayData = this.dayData.endDayData || {};
            const untreatMessage = endDayData.untreatMessage || `请先完成所有病人的治疗。<br>未完成病房：${untreatedRooms.join('、')}`;
            this.showGameModal('提示', untreatMessage,{
                onClose: () => {
                    // 关闭弹窗后刷新当前病房显示
                    const activeRoomBtn = document.querySelector('#page-ward .sidebar-btn.active');
                    if (activeRoomBtn) {
                        const room = activeRoomBtn.getAttribute('data-room');
                        this.loadWardContent(room);
                    }
                }
            });
            return;
        }
        
        // 2. 最终严格检查治疗是否匹配医嘱
        let treatmentErrors = [];
        
        for (const room of rooms) {
            const roomOrders = Array.isArray(orders[room]) ? orders[room] : [orders[room]].filter(Boolean);
            
            if (roomOrders.length === 0) {
                treatmentErrors.push(`${room}病房：无医嘱数据`);
                continue;
            }
            
            const treatment = this.gameState.patientTreatments && this.gameState.patientTreatments[room];
            if (!treatment) {
                treatmentErrors.push(`${room}病房：无治疗记录`);
                continue;
            }
            
            // 检查每个医嘱是否被正确执行
            for (const order of roomOrders) {
                if (!order) continue;
                
                const treatmentType = TREATMENT_TYPE_MAP[order.type];
                if (!treatmentType) {
                    treatmentErrors.push(`${room}病房：未知治疗类型【${order.type}】`);
                    continue;
                }
                
                const treatmentData = treatment[treatmentType];
                if (!treatmentData || !treatmentData.enabled) {
                    treatmentErrors.push(`${room}病房：${order.type}治疗未启用`);
                    continue;
                }
                
                const selectedMedicines = treatmentData.medicines || [];
                const requiredMedicines = Array.isArray(order.medicine) ? order.medicine : [order.medicine];
                
                // 严格检查
                const hasAllRequired = requiredMedicines.every(med => selectedMedicines.includes(med));
                const hasNoExtra = selectedMedicines.length === requiredMedicines.length;
                
                if (!hasAllRequired || !hasNoExtra) {
                    // 修改这里：安全处理 requiredMedicines
                    const requiredText = Array.isArray(requiredMedicines) ? requiredMedicines.join('+') : requiredMedicines;
                    const selectedText = selectedMedicines.join('+') || '未选择';
                    treatmentErrors.push(`${room}病房：${order.type}治疗应该选择【${requiredText}】，但选择了【${selectedText}】`);
                }
            }
            
            // 检查是否有额外的治疗
            const enabledTreatments = Object.entries(treatment)
                .filter(([type, data]) => data && data.enabled)
                .map(([type]) => type);
                
            const requiredTreatmentTypes = roomOrders.map(order => TREATMENT_TYPE_MAP[order.type]);
            
            for (const enabledType of enabledTreatments) {
                if (!requiredTreatmentTypes.includes(enabledType)) {
                    const typeLabel = this.getTreatmentLabel(enabledType);
                    treatmentErrors.push(`${room}病房：${typeLabel}治疗不应该启用`);
                }
            }
        }
        
        if (treatmentErrors.length === 0) {
            console.log('所有治疗检查通过！');
            this.showSettlementScreen(currentDay);
        } else {
            console.log('治疗检查失败，错误：', treatmentErrors);
            this.showTreatmentError(treatmentErrors);
        }
    }
    // 显示治疗错误并重置
    showTreatmentError(errorMessages) {
        // 清空所有治疗记录
        this.gameState.patientTreatments = {};
        this.saveGameState();
        
        // 重新加载所有病房页面
        const rooms = ['101', '102', '201', '202'];
        rooms.forEach(room => {
            const submitBtn = document.getElementById(`submit-treatment-${room}`);
            if (submitBtn) {
                submitBtn.textContent = '确认治疗';
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }
            // 重新启用所有治疗选项
            ['oral', 'injection', 'surgery', 'activity'].forEach(type => {
                const yesCheckbox = document.getElementById(`${type}-yes-${room}`);
                const noCheckbox = document.getElementById(`${type}-no-${room}`);
                const displayDiv = document.getElementById(`${type}-display-${room}`);
                
                if (yesCheckbox) yesCheckbox.disabled = false;
                if (noCheckbox) noCheckbox.disabled = false;
                if (displayDiv) {
                    displayDiv.style.opacity = '1';
                    displayDiv.style.pointerEvents = 'all';
                }
            });
        });
        
        // 显示错误信息
        const errorText = errorMessages.join('<br>');
        this.showGameModal('治疗未按医嘱', `请按照医嘱重新选择治疗`);
    }
    // 确保getTreatmentLabel方法存在
    getTreatmentLabel(type) {
        const typeMap = {
            'oral': '口服',
            'injection': '注射',
            'surgery': '手术', 
            'activity': '活动'
        };
        return typeMap[type] || type;
    }

    // 清除所有治疗选择
    clearAllTreatments() {
        const treatmentErrorOverlay = document.getElementById('treatment-error-overlay');
        if (treatmentErrorOverlay) {
            treatmentErrorOverlay.parentNode.removeChild(treatmentErrorOverlay);
        }
        
        // 重置治疗状态
        this.gameState.patientTreatments = {};
        this.saveGameState();
        
        // 重新加载当前病房
        const activeRoomBtn = document.querySelector('#page-ward .sidebar-btn.active');
        if (activeRoomBtn) {
            const room = activeRoomBtn.getAttribute('data-room');
            this.loadWardContent(room);
        }
    }

    // 默认数据
    getDefaultPatients() {
        return {
            '101': { name: '023', age: 78, diagnosis: '阿尔兹海默症', vitals: { temperature: '36.5°C', bloodPressure: '120/80 mmHg', pulse: '72 bpm', symptoms: '记忆力减退' } },
            '102': { name: '016', age: 32, diagnosis: '长期失眠', vitals: { temperature: '36.7°C', bloodPressure: '130/85 mmHg', pulse: '68 bpm', symptoms: '黑眼圈严重' } },
            '201': { name: '003', age: 25, diagnosis: '精神分裂症', vitals: { temperature: '36.6°C', bloodPressure: '125/82 mmHg', pulse: '76 bpm', symptoms: '幻听' } },
            '202': { name: '192', age: 45, diagnosis: '持续性植物状态', vitals: { temperature: '36.8°C', bloodPressure: '110/70 mmHg', pulse: '60 bpm', symptoms: '无意识' } }
        };
    }
    
    getDefaultRecords() {
        return [
            { room: '101', admission: '2025.11.1 023因阿尔兹海默症入院治疗', discharge: '', receipt: '' },
            { room: '102', admission: '2025.10.9 016因长期失眠入院治疗', discharge: '', receipt: '' },
            { room: '201', admission: '2025.12.20 003因精神分裂症入院治疗', discharge: '', receipt: '' },
            { room: '202', admission: '2025.7.2 192因持续性植物状态入院治疗', discharge: '', receipt: '' }
        ];
    }
    
    getDefaultMedicines() {
        return [
            { name: 'A药', stock: 20 }, { name: 'B药', stock: 15 }, { name: 'C药', stock: 10 },
            { name: 'D药', stock: 8 }, { name: 'E药', stock: 12 }, { name: 'F药', stock: 6 },
            { name: '■药', stock: 3 }, { name: '手术准备', stock: 5 }, { name: '康复训练', stock: 999 },
            { name: '镇静剂', stock: 4 }
        ];
    }
    
    getDefaultImagePath(room) {
        return `images/${room}st.png`;
    }

    // 进入下一天 - 移到类内部
    goToNextDay(currentDay) {
        console.log('执行自定义goToNextDay方法，当前天:', currentDay);
        const nextDay = currentDay + 1;
        
        // 保存当前治疗记录到历史
        if (!this.gameState.treatmentHistory) {
            this.gameState.treatmentHistory = {};
        }
        this.gameState.treatmentHistory[`day${currentDay}`] = {
            orders: this.dayData.dailyOrders,
            treatments: this.gameState.patientTreatments
        };
        
        // 重置状态为新的一天
        this.gameState.currentDay = nextDay;
        this.gameState.examinedPatients = {};
        this.gameState.patientTreatments = {};
        this.gameState.medicineTaken = {};
        this.gameState.allExamined = false;
        this.gameState.currentTreatmentIndex = 0;
        
        this.saveGameState();
        
        // 移除结算画面
        const settlementOverlay = document.getElementById('settlement-overlay');
        if (settlementOverlay) {
            settlementOverlay.style.opacity = '0';
            setTimeout(() => {
                if (settlementOverlay.parentNode) {
                    settlementOverlay.parentNode.removeChild(settlementOverlay);
                }
            }, 500);
        }
        
        // 获取自定义跳转配置
        const navigation = this.dayData.navigation || {};
        console.log('navigation配置:', navigation);
        
        // 如果还有天数，跳转到下一天
        if (nextDay <= 19) {
            // 使用自定义跳转逻辑
            if (navigation.goToNextDay && typeof navigation.goToNextDay === 'function') {
                console.log('使用自定义跳转函数');
                navigation.goToNextDay(currentDay, nextDay, this);
            } else {
                // 默认跳转逻辑
                console.log('使用默认跳转逻辑');
                this.defaultGoToNextDay(currentDay, nextDay);
            }
        } else {
            // 游戏通关
            if (navigation.onGameComplete) {
                navigation.onGameComplete(this);
            } else {
                this.showGameModal('通关', '恭喜完成所有19天的工作！');
            }
        }
    }
    
    // 默认跳转到下一天
    defaultGoToNextDay(currentDay, nextDay) {
        console.log('执行默认跳转，目标:', `day${nextDay}.html`);
        window.location.href = `day${nextDay}.html`;
    }
    
    // 显示结算画面 - 移到类内部
    showSettlementScreen(day) {
        const settlementData = this.dayData.settlementData || {};

        const firstLine = settlementData.firstLine || `第${day}天的工作结束`;
        const secondLine = settlementData.secondLine || '';
        const dots = Array.isArray(settlementData.dots)
            ? settlementData.dots
            : ['white', 'white', 'white', 'white', 'white'];

        const dotDelay = settlementData.dotDelay ?? 500;
        const endDelay = settlementData.endDelay ?? 2000;

        // 遮罩
        const overlay = document.createElement('div');
        overlay.id = 'settlement-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: #000;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: 'WenQuanYiPixel', 'Courier New', monospace;
        `;

        const container = document.createElement('div');
        container.style.textAlign = 'center';
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        /* ---------- 第一行 ---------- */
        const firstLineEl = document.createElement('div');
        firstLineEl.style.fontSize = '2.5rem';
        firstLineEl.style.lineHeight = '1.5';
        container.appendChild(firstLineEl);

        let firstIndex = 0;
        const typeFirstLine = () => {
            if (firstIndex < firstLine.length) {
                firstLineEl.textContent = firstLine.slice(0, firstIndex + 1);
                firstIndex++;
                setTimeout(typeFirstLine, 100);
            } else {
                setTimeout(typeSecondLine, 100);
            }
        };

        /* ---------- 第二行：支持数组，每条逐字 ---------- */
        const typeSecondLine = () => {
            if (!secondLine) {
                showDots();
                return;
            }

            // 统一转成数组
            const lines = Array.isArray(secondLine) ? secondLine : [secondLine];
            let lineIndex = 0;

            const typeOneLine = () => {
                if (lineIndex >= lines.length) {
                    setTimeout(showDots, 500);
                    return;
                }

                const lineText = lines[lineIndex];
                const lineEl = document.createElement('div');
                lineEl.style.cssText = `
                    font-size: 2rem;
                    margin-top: 20px;
                    color: #cccccc;
                    white-space: pre;
                `;
                container.appendChild(lineEl);

                let charIndex = 0;

                const typeChar = () => {
                    if (charIndex >= lineText.length) {
                        lineIndex++;
                        setTimeout(typeOneLine, 400);
                        return;
                    }

                    const span = document.createElement('span');
                    span.textContent = lineText[charIndex];
                    lineEl.appendChild(span);

                    charIndex++;
                    setTimeout(typeChar, 80);
                };

                typeChar();
            };

            typeOneLine();
        };



        /* ---------- 圆点 ---------- */
        const showDots = () => {
            const dotsContainer = document.createElement('div');
            dotsContainer.style.cssText = `
                font-size: 3rem;
                letter-spacing: 20px;
                margin-top: 30px;
            `;
            container.appendChild(dotsContainer);

            let i = 0;
            const nextDot = () => {
                if (i >= dots.length) {
                    setTimeout(() => this.goToNextDay(day), endDelay);
                    return;
                }

                const span = document.createElement('span');
                span.textContent = '●';
                span.style.animation = 'none';

                if (dots[i] === 'red') {
                    span.style.color = '#ff0000';
                    span.style.textShadow = '0 0 8px #ff0000';
                }

                dotsContainer.appendChild(span);
                i++;
                setTimeout(nextDot, dotDelay);
            };

            nextDot();
        };

        setTimeout(typeFirstLine, 500);
    }



}

