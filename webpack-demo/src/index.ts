import './index.scss';

const go = document.querySelector('.go') as HTMLElement;
const qrcode = document.querySelector('.qrcode') as HTMLElement;
const toY = go.offsetHeight + qrcode.offsetHeight / 2;
const toX = go.offsetLeft;
// console.log(toX, toY);

qrcode.onclick = (e) => {
    console.log('e');
};


//获取任意css属性值
function getStyleAttr(element: any, attr: any) {
    return window.getComputedStyle ? window.getComputedStyle(element, null)[attr] : element.currentStyle[attr];
}

//封装的动画函数
function autoAnimate(element: any, json: any, fn: any) {
    let flag = true;
    //清除定时器
    clearInterval(element.tmId);
    element.tmId = setInterval(function () {
        for (var attr in json) {
            //获取操作的css属性
            let current = parseInt(getStyleAttr(element, attr));
            //步数
            const step = 10;
            //步长(每一步运动的像素)
            let speed = (json[attr] - current) / step;
            //判断左右移动
            speed = json[attr] > current ? Math.ceil(speed) : Math.floor(speed);
            //每一步运动的位置
            current += speed;
            //开始运动
            element.style[attr] = current + "px";
            if (current != json[attr]) {
                console.log(current, json[attr]);
                flag = false;
            }
            // console.log("步长"+speed,"当前位置"+current,"目标"+json[attr]);
        }
        console.log("--------------------");
        if (flag) {
            clearInterval(element.tmId);
            if (fn) fn();
        }
    }, 200);
}









// function linear(t: any, b: any, c: any, d: any) {
//     return c / d * t + b
// }

// function tween(element: any, target: any, duration: any, callback?: any) {
//     let change = {} as any;
//     let begin = {} as any;
//     for (let key in target) {
//         begin[key] = getCss(element, key);
//         change[key] = removeUnit(target[key]) - begin[key];
//     }

//     let time = 0;
//     let timing = setInterval(() => {
//         time += 20;
//         if (time >= duration) {
//             clearInterval(timing);
//             for (let key in target) {
//                 setCss(element, key, target[key]);
//             }
//             callback && callback.call(element);
//             return;
//         }
//         for (let key in target) {
//             let current = linear(time, begin[key], change[key], duration);
//             setCss(element, key, current);
//         }
//     }, 25)
// }

// function getCss(ele: any, attr: any) {
//     let value = window.getComputedStyle(ele)[attr];
//     return removeUnit(value);
// }

// function removeUnit(value: any) {
//     let reg = /^[-+]?([1-9]\d+|\d)(\.\d+)?(px|pt|em|rem)$/;
//     if (isNaN(value) && reg.test(value)) return parseFloat(value);
//     if (isNaN(value)) return Number(value);
//     return value
// }

// function setCss(ele: any, attr: any, val: any) {
//     let reg = /^(width|height|top|bottom|left|right|(margin|padding)(Top|Left|Bottom|Right)?)$/;
//     if (!isNaN(val) && reg.test(attr)) {
//         ele.style[attr] = val + "px";
//         return;
//     }
//     ele.style[attr] = val;
// }











// qrcode.animate([
//     { top: '50%', left: '10px' },
//     { top: toY + 40 + 'px', left: toX + 'px' },
//     { top: toY + 'px', left: toX + 'px' }
// ], {
//     duration: 1000,
//     fill: 'forwards',
// });





// function moves(ele: any, target: any, callback?: any) {

//     let aId = 0;

//     let idx = 0;

//     const step = () => {

//         let flag = true;

//         for (const attr in target) {

//             let icur = 0;  // 当前

//             if (attr == 'opacity') {
//                 icur = Math.round(parseFloat(getStyle(ele, attr)) * 100);
//             } else {
//                 icur = parseInt(getStyle(ele, attr));
//             }

//             let speed = (target[attr] - icur) / 10;
//             speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

//             if (icur != target[attr]) {
//                 flag = false;
//             }

//             if (attr == 'opacity') {

//                 ele.style.filter = 'alpha(opacity = ' + (icur + speed) + ')';

//                 ele.style.opacity = (icur + speed) / 100;

//             } else {

//                 ele.style[attr] = icur + speed + 'px';

//             }

//         }

//         if (flag) {
//             callback && callback();
//             return;
//         } else {
//             requestAnimationFrame(step);
//         }

//     }

//     step();

// }





// function animate1(ele: any, target: any, callback?: () => void) {
//     clearInterval(ele.timer);
//     ele.timer = setInterval(function () {
//         var step = (target - ele.offsetLeft) / 10;
//         step = step > 0 ? Math.ceil(step) : Math.floor(step);
//         ele.style.left = ele.offsetLeft + step + "px";
//         if (Math.abs(target - ele.offsetLeft) <= Math.abs(step)) {
//             ele.style.left = target + "px";
//             clearInterval(ele.timer);
//         }
//     }, 15);
// }





// function getStyle(obj: any, attr: any) {
//     if (obj.currentStyle) {   //IE浏览器
//         return obj.currentStyle[attr];
//     } else {    //chrome、firefox等浏览器
//         return getComputedStyle(obj, null)[attr];
//     }
// }

// var timer = null;  // 声明一个timer来存储定时器
// function animate2(obj: any, json: any, callback: any) {
//     clearInterval(obj.timer);
//     obj.timer = setInterval(function () {
//         /* 
//             * 当我们改变多个属性时，如果其中一个属性已经达到目标值，就会清除定时器，就会导致其他没有达到目标值的属性也会停止
//             * 为了解决这个问题，我们声明一个节流阀flag，让它为true
//             * 判断是否还有没达到目标值的属性，如果还有，就让flag为false（关闭节流阀），让定时器继续执行
//             * 当所有属性都达到了目标值时，才执行清除定时器那一步
//             */
//         var flag = true;
//         for (var attr in json) {  // for...in...遍历对象
//             var icur = 0;  // 存储获取过来的属性值
//             if (attr == 'opacity') {  // 判断获取过来的属性是否为opacity
//                 icur = Math.round(parseFloat(getStyle(obj, attr)) * 100); // float会有小误差，所以需要四舍五入一下
//             } else {
//                 icur = parseInt(getStyle(obj, attr));  // 获取过来的值可能带单位，所以需要用到parseInt()
//             }
//             var speed = (json[attr] - icur) / 10;  // 速度 逐渐变慢（也可以设为固定值实现匀速运动）
//             speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); // speed并不总是整数，会导致和目标值不相等，所以需要对speed进行取整，大于0向上取整，小于0向下取整
//             if (icur != json[attr]) {  // 判断是否还有属性没有达到目标值
//                 flag = false;
//             }
//             if (attr == 'opacity') {  // opacity是没有单位的，所以在这里需要判断一下
//                 obj.style.filter = 'alpha(opacity = ' + (icur + speed) + ')';
//                 obj.style.opacity = (icur + speed) / 100;  // opacity别忘了除以100
//             } else {
//                 obj.style[attr] = icur + speed + 'px';  // 原来的值加上速度赋值给属性
//             }
//         }
//         if (flag) { // 当所有属性都达到目标值，即flag为true时，再停止定时器
//             clearInterval(obj.timer);
//             callback && callback();  // 判断是否有回调函数，有的话就执行
//         }
//     }, 25)
// }





// let timer: NodeJS.Timeout;
// function animationSlow(ele: HTMLElement, target: number) {
//     clearInterval(timer);
//     timer = setInterval(function () {
//         let currentLeft = ele.offsetLeft;
//         let step = (target - currentLeft) / 10;
//         step = step > 0 ? Math.ceil(step) : Math.floor(step);
//         currentLeft += step;
//         ele.style.left = currentLeft + 'px';
//         if (currentLeft == target) {
//             clearInterval(timer);
//         };
//     }, 20);
// };