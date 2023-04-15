(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WuJianAR = factory());
})(this, (function () { 'use strict';

    /**
     * WuJianAR 无间WebAR
     *
     * 官网： https://www.wujianar.com
     * 技术支持QQ群：722979533
     */
    class WuJianAR {
        /**
         * 初始化WebAR
         */
        constructor(options) {
            this.isSearching = false;
            this.options = Object.assign({
                endpointUrl: 'https://iss-api.wujianar.cn',
                token: '',
                interval: 1000,
                container: document.body
            }, options);
            // /创建视频播放元素
            this.videoElement = document.createElement('video');
            ['autoplay', 'muted', 'playsinline'].forEach(i => this.videoElement.setAttribute(i, ''));
            this.videoElement.setAttribute('style', 'position:absolute;display:block;width:100% !important;height:100% !important;object-fit:cover;z-index:0');
            this.options.container.append(this.videoElement);
            // 创建canvas，截取摄像头图片时使用
            this.canvasElement = document.createElement('canvas');
            this.canvasElement.setAttribute('width', '480px');
            this.canvasElement.setAttribute('height', '640px');
        }
        /**
         * 打开摄像头
         * 摄像头设置参数请查看： https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
         * @param constraints
         * @returns {Promise<T>}
         */
        openCamera(constraints) {
            if (!constraints) {
                constraints = { audio: false, video: { facingMode: 'environment' } };
            }
            return new Promise((resolve, reject) => {
                navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                    this.videoElement.srcObject = stream;
                    this.videoElement.play().then(() => {
                    }).catch(err => {
                        console.error('播放视频流错误：', err);
                        reject(err);
                        return;
                    });
                    this.videoElement.onloadedmetadata = () => {
                        resolve(true);
                    };
                }).catch(err => {
                    console.error('打开摄像头错误：', err);
                    reject(err);
                });
            });
        }
        /**
         * 截取摄像头图片
         * @returns
         */
        capture() {
            return new Promise(((resolve, reject) => {
                this.canvasElement.getContext('2d').drawImage(this.videoElement, 0, 0);
                this.canvasElement.toBlob(blob => {
                    resolve(blob);
                }, 'image/jpeg', 0.7);
            }));
        }
        /**
         * 识别
         * @param callback 回调
         * @param autoStop 识别到目标后是过滤器暂停识别
         */
        startSearch(callback, autoStop = true) {
            this.timer = window.setInterval(() => {
                if (this.isSearching) {
                    return;
                }
                this.isSearching = true;
                this.capture().then(blob => {
                    const data = new FormData();
                    data.append('file', blob);
                    this.httpPost(data).then(rs => {
                        this.isSearching = false;
                        if (rs.code === 200) {
                            if (autoStop) {
                                this.stopSearch();
                            }
                            callback(rs.data);
                        }
                    }).catch(err => {
                        this.isSearching = false;
                        console.warn(err);
                    });
                }).catch(err => {
                    this.isSearching = false;
                    console.warn(err);
                });
            }, this.options.interval);
        }
        /**
         * 停止识别
         */
        stopSearch() {
            if (this.timer) {
                window.clearInterval(this.timer);
                this.timer = null;
                this.isSearching = false;
            }
        }
        /**
         * 发送HTTP请求
         * @param data
         */
        httpPost(data) {
            return window.fetch(this.options.endpointUrl + '/search', {
                method: 'POST',
                headers: {
                    'Authorization': this.options.token
                },
                body: data
            }).then(r => r.json());
        }
    }

    return WuJianAR;

}));
