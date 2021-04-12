// js-index
import './index.scss';

const txt = document.createElement('p');
txt.className = 'title';
txt.innerHTML = 'webpack demo';
const demoPage = document.querySelector('.demo-wrap');
demoPage?.append(txt);

const go = document.querySelector('.go') as HTMLElement;
const qrcode = document.querySelector('.qrcode') as HTMLElement;
qrcode.onclick = () => {
    close();
}
const toY = go.offsetTop;
const toX = go.offsetLeft;
function close() {
    qrcode.animate([
        { top: '50%', left: '10px' },
        { top: toY + 40 + 'px', left: toX + 'px' },
        { top: toY + 'px', left: toX + 'px' }
    ], {
        duration: 1000,
        fill: 'forwards'
    });
}