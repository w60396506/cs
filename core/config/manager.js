const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class ConfigManager {
    constructor() {
        // 配置文件路径设置为软件安装目录下
        this.configPath = path.join(process.cwd(), 'config.json');
        
        console.log('Config path:', this.configPath);  // 添加日志查看路径
        
        // 默认配置
        this.defaultConfig = {
            volume: 100,
            shortcuts: false,
            repeat: false,
            audioDevice: 'default'
        };
        
        // 检查配置文件是否存在
        if (!fs.existsSync(this.configPath)) {
            // 如果不存在，创建默认配置文件
            console.log('配置文件不存在，创建默认配置');
            this.config = { ...this.defaultConfig };
            this.saveConfig();
        } else {
            // 如果存在，加载配置
            this.loadConfig();
        }
    }

    loadConfig() {
        try {
            const data = fs.readFileSync(this.configPath, 'utf8');
            const loadedConfig = JSON.parse(data);
            // 合并默认配置和加载的配置，确保所有必要的字段都存在
            this.config = { ...this.defaultConfig, ...loadedConfig };
            console.log('已加载配置:', this.config);
        } catch (err) {
            console.error('加载配置失败:', err);
            // 如果加载失败，使用默认配置并保存
            this.config = { ...this.defaultConfig };
            this.saveConfig();
        }
    }

    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            console.log('配置已保存:', this.config);
        } catch (err) {
            console.error('保存配置失败:', err);
        }
    }

    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
        this.saveConfig();
    }
}

// 导出单例
module.exports = new ConfigManager(); 