const hasOwnProperty = Object.prototype.hasOwnProperty;

interface EachObject {
    [ key: string ]: any,
    readonly length?: number,
}

function forEach(
    obj: EachObject,
    iterator: (value?: any, key?: number | string, obj?: EachObject) => boolean | void,
    context?: Object
) {
    if (!obj) {
        return;
    }
    if (obj.length && obj.length === +obj.length) {
        for (let i = 0; i < obj.length; i++) {
            if (iterator.call(context, obj[i], i, obj) === true) return;
        }
    } else {
        for (const k in obj) {
            if (hasOwnProperty.call(obj, k)) {
                if (iterator.call(context, obj[k], k, obj) === true) return;
            }
        }
    }
}


const Types: {
    [key: string]: (obj: Object) => boolean;
} = {};
const _toString: () => string = Object.prototype.toString;
forEach([
    'Array',
    'Boolean',
    'Function',
    'Object',
    'String',
    'Number',
], (name: number) => {
    Types[`is${name}`] = function (obj: Object) {
       return  _toString.call(obj) === `[object ${name}]`;
    }
});

// Object to queryString
function serialize(obj: EachObject): string {
    const q: string[] = [];
    forEach(obj, (val, key) => {
        if (Types.isArray(val)) {
            forEach(val, (v, i) => {
                q.push(`${key}=${encodeURIComponent(v)}`);
            });
        } else {
            q.push(`${key}=${encodeURIComponent(val)}`);
        }
    });
    return q.join('&');
}

function parseJSON(str: string): Object {
    try {
        return JSON.parse(str);
    } catch (e) {
        try {
            return (new Function(`return ${str}`))();
        } catch (e) {}
    }
    return null;
}

const createXHR = 'XMLHttpRequest' in window ?
    () => new XMLHttpRequest() :
    () => new (<any>window).ActiveXObject('Microsoft.XMLHTTP');

interface AjaxOptions {
    url: string,
    method?: string,
    type?: ResType,
    encode?: string,
    timeout?: number,
    credential?: boolean,
    data?: EachObject,
    file?:boolean
}

export enum ResType {
    TEXT = 'text',
    JSON = 'json',
    XML = 'xml',
}

function ajax(url: string): Promise<any>;
function ajax(options: AjaxOptions): Promise<any>;
function ajax(options): Promise<any>{
    return new Promise((
        resolve: (data: any, status: number, xhr: XMLHttpRequest) => void,
        reject: (error: Error) => void
    ) => {
        if (Types.isString(options)) {
            options = { url: options };
        }
        let {
            url,
            method = 'GET',
            data,
            type = ResType.JSON,
            timeout = 1000 * 30,
            credential,
            encode = 'UTF-8',
            file
        } = <AjaxOptions>options;
        // 大小写都行，但大写是匹配HTTP协议习惯
        method  = method.toUpperCase();
        // 对象转换成字符串键值对
        let _data;
        if (Types.isObject(data)) {
            _data = serialize(data);
        }
        if (method === 'GET' && _data) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + _data
        }

        const xhr = createXHR();
        if (!xhr) {
            return null;
        }

        let isTimeout = false;
        let timer;
        if (timeout > 0) {
            timer = setTimeout(() => {
                // 先给isTimeout赋值，不能先调用abort
                isTimeout = true;
                xhr.abort();
            }, timeout);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (isTimeout) {
                    reject(new Error('request timeout'));
                } else {
                    onStateChange(xhr, type);
                    clearTimeout(timer);
                }
            }
        };
        xhr.open(method, url, true);
        if (credential) {
            xhr.withCredentials = true;
        }
       

        

        if (file) {
            xhr.send(data);
        }else{
            if (method === 'POST') {
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode);
            }
            xhr.send(_data);
        }
        

        function onStateChange(
            xhr: XMLHttpRequest,
            type: ResType,
        ): void {
            const { status } = xhr;
            if (status >= 200 && status < 300) {
                let result;
                switch (type) {
                    case ResType.TEXT:
                        result = xhr.responseText;                
                        break;
                    case ResType.JSON:
                        result = parseJSON(xhr.responseText);
                        break;
                    case ResType.XML:
                        result = xhr.responseXML;
                        break;
                }
                if (result !== undefined) {
                    resolve(result, status, xhr);
                }
            } else {
                reject(new Error(xhr.status + ''));
            }
            xhr = null;
        }
    });
}

// exports to Shorthand
const api = {
    method: ['get', 'post'],
    type: ['text','json','xml']
};

// Shorthand Methods: IO.get, IO.post, IO.text, IO.json, IO.xml
const Shorthand = {};
forEach(api, (val, key) => {
    forEach(val, item => {
        Shorthand[item] = function (key, item) {
            return function (opt) {
                if (Types.isString(opt)) {
                    opt = { url: opt };
                }
                opt[key] = item;
                return ajax(opt);
            };
        }(key, item);
    });
});


function get(url: string): Promise<any>;
function get(opt: AjaxOptions): Promise<any>;
function get(opt): Promise<any> {
    return Shorthand['get'](opt);
}

function post(url: string): Promise<any>;
function post(opt: AjaxOptions): Promise<any>;
function post(opt): Promise<any> {
    return Shorthand['post'](opt);
}

function text(url: string): Promise<any>;
function text(opt: AjaxOptions): Promise<any>;
function text(opt): Promise<any> {
    return Shorthand['text'](opt);
}

function json(url: string): Promise<any>;
function json(opt: AjaxOptions): Promise<any>;
function json(opt): Promise<any> {
    return Shorthand['json'](opt);
}

function xml(url: string): Promise<any>;
function xml(opt: AjaxOptions): Promise<any>;
function xml(opt): Promise<any> {
    return Shorthand['xml'](opt);
}

export { ajax, get, post, text, json, xml };

function generateRandomName(): string {
    let uuid = ''
    const s = []
    const hexDigits = '0123456789ABCDEF'
    for (let i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[12] = '4'
    // bits 6-7 of the clock_seq_hi_and_reserved to 01  
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1)
    uuid = 'jsonp_' + s.join('')
    return uuid
}

interface JSONPOptions {
    url: string,
    data?: EachObject,
    timestamp?: boolean,
    timeout?: number,
    jsonName?: string,
    jsonpCallback?: string,
    charset?: string,
}

const ie678 = eval('!-[1,]');
const head = document.head || document.getElementsByTagName('head')[0];
function jsonpCore(options): Promise<any> {
    return new Promise((resolve, reject) => {
        let {
            url,
            data = {},
            timestamp = false,
            timeout = 1000 * 30,
            jsonName = 'callback',
            jsonpCallback = generateRandomName(),
            charset,
        } = <JSONPOptions>options;
        let script = document.createElement('script');
        let done = false;
        function callback(isSucc = false) {
            if (isSucc) {
                done = true;
            } else {
                reject(new Error('network error.'));
            }
            // Handle memory leak in IE
            script.onload = script.onerror = (<any>script).onreadystatechange = null;
            if (head && script.parentNode) {
                head.removeChild(script);
                script = null;
                window[jsonpCallback] = undefined;
            }
        }
        function fixOnerror() {
            setTimeout(() => {
                if (!done) {
                    callback();
                }
            }, timeout);
        }
        if (ie678) {
            (<any>script).onreadystatechange = function() {
                const readyState = this.readyState;
                if (!done && (readyState == 'loaded' || readyState == 'complete')) {
                    callback(true)
                }
            }
        } else {
            script.onload = function() {
                callback(true)
            }
            script.onerror = function() {
                callback()
            }
            if ((<any>window).opera) {
                fixOnerror()
            }
        }
        if (charset) {
            script.charset = charset;
        }
        const search = serialize({
            ...data,
            [jsonName]: jsonpCallback,
        });
        url += (url.indexOf('?') === -1 ? '?' : '&') + search
        if (timestamp) {
            url += `&ts=${new Date().getTime()}`;
        }
        window[jsonpCallback] = function (json) {
            resolve(json);
        }
        script.src = url;
        head.insertBefore(script, head.firstChild);
    });
}

// 调用此jsonp方法，只传入url即可
function jsonp(url: string): Promise<any>;

// 调用此jsonp方法，传入的参数为对象，对象内的属性有url,data,调用成功后返回then(data->接口中返回的值)函数
function jsonp(opt: JSONPOptions): Promise<any>;


function jsonp(opt): Promise<any> {
    if (Types.isString(opt)) {
        opt = { url: opt };
    }
    return jsonpCore(opt);
}

export { jsonp };

export function loadScript(url:string, callback?:()=>void){
    const doc = document;
    const head = doc.head || doc.getElementsByTagName('head')[0];
    const script = doc.createElement('script');
    script.src = url;
    //借鉴了jQuery的script跨域方法
    script.onload = script['onreadystatechange'] = function(){
        if((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")){
            callback && callback();
            // Handle memory leak in IE
            script.onload = script['onreadystatechange'] = null;
            if ( head && script.parentNode ) {
                head.removeChild( script );
            }
        }
    };
    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
    head.insertBefore( script, head.firstChild );
}