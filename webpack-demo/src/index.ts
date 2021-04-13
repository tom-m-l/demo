import './index.scss';

const txt = document.createElement('p');
txt.className = 'title';
txt.innerHTML = 'webpack demo';
const demoPage = document.querySelector('.demo-wrap');
demoPage?.append(txt);

const go = document.querySelector('.go') as HTMLElement;
const qrcode = document.querySelector('.qrcode') as HTMLElement;
const toY = go.offsetTop;
const toX = go.offsetLeft;
console.log(toX, toY);

qrcode.onclick = (e) => {
    console.log('qrcode');
};

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

// (e.target as Element).classList.add('hiddenQRcode');
// qrcode.animate([
//     { top: '50%', left: '10px' },
//     { top: toY + 40 + 'px', left: toX + 'px' },
//     { top: toY + 'px', left: toX + 'px' }
// ], {
//     duration: 1000,
//     fill: 'forwards',
// });