# 无间WebAR 快速入门

技术支持：无间AR

官网: [https://www.wujianar.com](https://www.wujianar.com)

技术支持 QQ 群：722979533

HTML5版 WebAR

3D模型渲染: [https://ardemo.wujianar.com/3d/](https://ardemo.wujianar.com/3d/)

视频播放: [https://ardemo.wujianar.com/video/](https://ardemo.wujianar.com/video/)

# sample使用说明

## 下载sameple

https://gitee.com/wujianar/ardemo

https://github.com/wujianar/ardemo

## 开启Web服务

### 1. 将sample中所有文件上传到你的服务器，使用支持HTTPS的域名访问

### 2. 使用本地Web服务

你可以使用nodejs，nginx开启Web服务，或使用本小提供的工具。
下载地址：https://gitee.com/wujianar/simple-server 。
访问地址如：http://127.0.0.1:3001


# WebAR开发说明

            
## 1 初始化WebAR SDK

在HTML页面中引入wujianar库文件
```html
<script src="../libs/wujianar.js"></script>
```

设置云识别参数，：
```javascript
const options = {
    // API访问地址
    endpointUrl: 'https://iss-api.wujianar.cn',
    // 客户端访问token，从开发中心获取 https://portal.wujianar.com/
    token: '...',
    // 识别间隔时间（毫秒）
    interval: 1000,
    // 摄像头所在的容器
    container: document.querySelector('#container'),
};
const wuJianAR = new WuJianAR(options);
```

## 2 打开摄像头

```javascript
// 如果打开失败，可使用自定参数方式
// 打开后置摄像参数，参数说明请查看 https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
const constraints = {
    audio: false,
    video: {
        facingMode: {
            exact: 'environment'
        }
    }
};

// 打开摄像头
// 如果不能打开或画面不流畅，请参考这篇文档设置参数：https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
wuJianAR.openCamera().then(() => {
    // todo 打开成功，开启识别
    this.wuJianAR.startSearch((msg) => {
        // todo 识别到目标
        // 处理你的业务逻辑，如播放视频，模型等
    });
}).catch(err => {
    // todo 打开失败
});
```

# 在线体验，android版微信扫码就可以体验。

预览demo二维码
![image text](qrcode.png)

识别图片
![image text](marker.jpg)

