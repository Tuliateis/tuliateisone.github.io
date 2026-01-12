class PatientEyeFollow202 {
    constructor(container, imageDir) {
        this.container = container;
        this.imageDir = imageDir;

        // 瞳孔中心（你给的数据）
        this.eyeCenter = { x: 281, y: 128 };

        this.currentDir = 'center';

        this.bind();
    }

    bind() {
        this.onMouseMove = this.handleMouseMove.bind(this);
        document.addEventListener('mousemove', this.onMouseMove);
    }

    destroy() {
        document.removeEventListener('mousemove', this.onMouseMove);
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();

        const dx = e.clientX - (rect.left + this.eyeCenter.x);
        const dy = e.clientY - (rect.top + this.eyeCenter.y);

        const dist = Math.hypot(dx, dy);

        // 死区（非常重要）
        if (dist < 30) {
            this.updateImage('center');
            return;
        }

        const angle = Math.atan2(dy, dx);
        const dir = this.angleToDirection(angle);

        this.updateImage(dir);
    }

    angleToDirection(angle) {
        const PI = Math.PI;

        if (angle >= -PI / 8 && angle < PI / 8) return '202nd-r';
        if (angle >= PI / 8 && angle < 3 * PI / 8) return '202nd-r-d';
        if (angle >= 3 * PI / 8 && angle < 5 * PI / 8) return '202nd-d';
        if (angle >= 5 * PI / 8 && angle < 7 * PI / 8) return '202nd-l-d';
        if (angle >= 7 * PI / 8 || angle < -7 * PI / 8) return '202nd-l';
        if (angle >= -7 * PI / 8 && angle < -5 * PI / 8) return '202nd-l-u';
        if (angle >= -5 * PI / 8 && angle < -3 * PI / 8) return '202nd-u';
        if (angle >= -3 * PI / 8 && angle < -PI / 8) return '202nd-r-u';

        return 'center';
    }

    updateImage(dir) {
        if (dir === this.currentDir) return;

        this.currentDir = dir;
        this.container.style.backgroundImage =
            `url(${this.imageDir}/${dir}.jpg)`;
    }
}
