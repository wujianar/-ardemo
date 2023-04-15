class App {
    constructor() {
        const options = {
            // API访问地址
            endpointUrl: 'https://iss-api.wujianar.cn',
            // 客户端访问token
            token: 'NzM5OGZiYmFmYzc1NWQ1YzkzYzg0M2Y0YWFjN2RkNjhjNDZkZDQyYWI1NjJhNDNmYTI3MWIzNzM3Mzc3M2QyOXsiYWNjZXNzS2V5IjoiODg3ZjE2MmFlYTY4NDk0OGE3OTI1MzNkNWZlZjY0NmQiLCJleHBpcmVzIjoxNzEyNjQ5ODkyMzg2fQ==',
            // 识别间隔时间（毫秒）
            interval: 1000,
            // 摄像头所在的容器
            container: document.querySelector('#container'),
        };
        this.wuJianAR = new WuJianAR(options);
        this.model = new Model({container: options.container});
        this.progress = document.querySelector('#btnProgress');
    }

    run() {
        window.onload = () => {
            if (this.isWeiXin() && this.isIos()) {
                this.openPage('page1', 'page3');
                return;
            }
        };

        // 点击扫描
        let isOpening = false;
        document.querySelector('#btnScan').addEventListener('click', () => {
            this.toast('摄像头打开中...');
            if (isOpening) {
                return;
            }

            isOpening = true;
            this.wuJianAR.openCamera().then(() => {
                isOpening = false;
                this.showPage('#page2');
                this.toast('请扫描居民身份证有国徽的那一面来体验', 5000);

                // 开始识别
                this.search();
            }).catch(err => {
                isOpening = false;
                console.error(err);
                alert('打开摄像头失败');
            });
        });

        // 关闭按钮
        document.querySelector('#btnCloseShow').addEventListener('click', () => {
            this.model.removeModel();
            this.hideTarget(['#btnCloseShow']);
            this.search();
        });
    }

    /**
     * 识别
     */
    search() {
        this.showTarget(['#scanTip', '#scanLine']);
        this.wuJianAR.startSearch((msg) => {
            this.toast('识别成功');
            this.hideTarget(['#scanTip', '#scanLine']);
            this.showTarget(['#btnCloseShow']);

            // 识别成功,加载模型
            // 建议将模型参数保存在云识别的brief字段中,可以在服务端动态更新调整模型参数
            this.showModel(JSON.parse(msg.brief));
        }, true);
    }

    /**
     * 加载模型
     * @param setting
     */
    showModel(setting = null) {
        if (!setting) {
            // 可以奖setting保存在云识别的brief字段中
            setting = {
                "modelUrl": "asset/models/RobotExpressive.glb",
                "scale": 0.85,
                "position": [0, -2, 0],
                "clipAction": 6
            };
        }

        // 加载进度
        this.showTarget(['#btnProgress']);
        this.progress.value = 0;
        this.model.loadModel(setting, (e) => {
            const v = Math.floor(e.loaded / (e.total * 1.0) * 100);
            this.progress.value = v;
            if (v >= 100) {
                // 在低端机上会有卡顿，直接跳过100%
                window.setTimeout(() => {
                    this.hideTarget(['#btnProgress']);
                }, 1000);
            }
        });
    }

    isIos() {
        return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    }

    isWeiXin() {
        return /micromessenger/.test(navigator.userAgent.toLowerCase());
    }

    hideTarget(targets) {
        targets.forEach(i => document.querySelector(i).classList.add('hide'));
    }

    showTarget(targets) {
        targets.forEach(i => document.querySelector(i).classList.remove('hide'));
    }

    showPage(page) {
        document.querySelectorAll('.page').forEach(a => a.classList.add('hide'));
        document.querySelector(page).classList.remove('hide');
    }

    toast(text, delay = 2000) {
        const el = document.createElement('div');
        el.setAttribute('class', 'toast');
        el.innerHTML = text;
        document.body.append(el);
        setTimeout(() => {
            document.body.removeChild(el);
        }, delay);
    }
}
(new App()).run();
