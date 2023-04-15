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
    }

    run() {
        window.onload = () => {
            if (this.isWeiXin() && this.isIos()) {
                this.showPage('#page3');
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
                console.info('打开摄像头失败');
                console.error(err);
                alert('打开摄像头失败');
            });

            this.createVideo();
        });

        // 关闭按钮
        document.querySelector('#btnCloseShow').addEventListener('click', () => {
            this.removeVideo();
            this.hideTarget(['#btnCloseShow', '#webar-video']);
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

            // 识别成功,播放视频
            // 建议将视频地址保存在云识别的brief字段中,可以在服务端动态更换视频地址
            this.showVideo(JSON.parse(msg.brief));
            // this.showVideo({'videoUrl': 'asset/videos/demo.mp4'});
        }, true);
    }

    /**
     * 移动设备中不能自动播放视频
     * 在用户的点击中创建一个视频，后续设置视频的地址。
     */
    createVideo() {
        this.video = document.createElement('video');
        this.video.setAttribute('id', 'webar-video');
        this.video.setAttribute('playsinline', 'playsinline');
        this.video.setAttribute('style', 'position:absolute;z-index:10;top:30%;width:100%');
        this.video.setAttribute('class', 'hide');
        this.video.setAttribute('loop', 'loop');
        this.video.play().then(() => {
        }).catch(err => {
            console.error('play error');
        });
        document.querySelector('#page2').appendChild(this.video);
    }

    showVideo(setting) {
        this.playVideo(setting.videoUrl, true);
    }

    removeVideo() {
        this.video.pause();
        this.video.removeAttribute('src');
    }

    playVideo(videoUrl, autoPlay = true) {
        this.video.classList.remove('hide');
        this.video.setAttribute('src', videoUrl);
        this.video.play().then(() => {
        }).catch((err) => {
            this.toast('视频播放失败');
            console.info(err);
        });
        if (!autoPlay) {
            window.setTimeout(() => {
                this.video.pause();
            }, 50);
        }
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
