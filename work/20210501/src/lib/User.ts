import query from './query';
import { jsonp } from './IO';
import { ajaxUrl, UserInfoFace } from './Util';

const Emitter = require('tiny-emitter');

import Pop from './PopWrap';

const pop = new Pop();


export default class extends Emitter {

    private wrap: HTMLElement;

    private loginUrl: string;

    private clickStaus: boolean;

    private userInfo: UserInfoFace;

    constructor(ele: HTMLElement) {

        super();

        this.wrap = ele;

        this.loginUrl = '//ptlogin.2144.cn/ptlogin';

        this.userInfo = {
            id: ''
        };

        this.init();
    }



    private init() {

        this.getUserInfo();

        if (typeof window['Login'] == "undefined") {

            window['Login'] = {

                login: function () {//Login.login反射所有登录后挂载方法，登录态需自行再次查询

                    for (let key in Login) {

                        if (typeof (<any>Login)[key] == "function" && key != "login") {
                            (<any>Login)[key]();
                        }

                    }

                }

            };

        }

        window['Login'].currentLogin = () => {

            this.getUserInfo();

        };

        if (typeof window['Logout'] == "undefined") {

            window['Logout'] = {

                logout: async function () {//Logout.logout反射所有退出后挂载方法，登录态无需再次查询

                    await jsonp({
                        url: '//ptlogin.2144.cn/ptlogin/ajaxlogout/ajax/1',
                        data: { t: Math.random() }
                    });


                    for (let key in Logout) {

                        if (typeof (<any>Logout)[key] == "function" && key != "logout") {

                            (<any>Logout)[key]();

                        }
                    }

                }

            };

        }


        window['Logout'].currentLogout = () => {

            this.userLogoutFun();

        };


        //点击事件
        query.add(this.wrap, 'click', event => {

            const target = query.getTarget(event);

            //登录
            if (target.className == 'login') {

                _jsiframeShow(0);

                return;
            }

            //注册
            if (target.className == 'register') {

                _jsiframeShow(1);

                return;
            }


            //退出账号
            if (target.className == 'logout') {

                // 用户注销
                Logout.logout();

                return;
            }

            //查看我的奖品记录
            if (target.className == 'seeGet') {

                this.giftRecord();

                return;

            }

        });

    }

    //我的中奖记录
    private async giftRecord() {

        if (this.clickStaus) return;

        this.clickStaus = true;

        const { status, msg, data } = await jsonp({ url: `${ajaxUrl}actQuery/actlog?group_id=174` });

        this.clickStaus = false;

        if (status != 0) {

            pop.tipsFun(msg);

            return;
        }

        if (!data.length) {

            pop.tipsFun('暂无中奖纪录！');

            return;
        }

        pop.getItem(data);

        return;

    }



    private async userLogoutFun() {

        this.wrap.innerHTML = '您还未登录，请<span class="login">登录</span>|<span class="register">注册</span>';

        this.userInfo.id = '';

        this.emit('logOut');

    }


    private async getUserInfo() {

        const data = await jsonp(`${this.loginUrl}/getuser`);

        if (data.isGuest == 1) {

            this.userLogoutFun();

            return;
        }

        this.userInfo = data;

        this.wrap.innerHTML = `您好，${this.userInfo.username}，<span class="seeGet">【我的奖品】</span>|<span class="logout">注销</span>`;

        this.emit('loginWinner', this.userInfo);

    }



}