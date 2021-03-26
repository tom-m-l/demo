const query = {

    //  添加事件
    add: function () {

        var isEvent = 'addEventListener' in document;

        return isEvent ? function (ele, type:string, handler:(event:any) => void) {

            ele.addEventListener(type, handler, false);

        } : function (ele:any, type:string, handler:(event:any) => void) {

            ele.attachEvent('on' + type, handler);

        };

    }(),

    // 移除事件
    remove: function (ele, type, handler) {

        var isEvent = 'addEventListener' in document;

        return isEvent ? function (ele, type, handler) {

            ele.removeEventListener(type, handler, false);

        } : function (ele, type, handler) {

            ele.detachEvent('on' + type, handler);

        };
    }(),

    getEvent: function (event) {

        return event || window.event;

    },

    getTarget: function (event) {

        var e = query.getEvent(event);

        return e.target || e.srcElement;

    },

    preventDefault: function (event) {

        var e = query.getEvent(event);

        if (e.preventDefault) {

            e.preventDefault();

        } else {

            e.returnValue = false;

        }
    },

    stopPropagation: function (event) {

        var e = query.getEvent(event);

        if (e.stopPropagation) {

            e.stopPropagation();

        } else {

            e.cancelBubble = true;

        }

    },

    addClass: function (node, classname) {

        if (node.classList) {

            node.classList.add(classname);

        } else {

            if (node.className.indexOf(classname) == -1) node.className += ' ' + classname;

        }
    },

    removeClass: function (node, classname) {

        if (node.classList) {

            node.classList.remove(classname);

        } else {

            var reg = eval("/\\s*" + classname + "/ig");

            node.className = node.className.replace(reg, '');

        }
    },
    hasClass : function(ele,className){
        if(ele.classList){
            return ele.classList.contains(className);
        }
        return new RegExp('\\b'+className+'\\b','i').test( ele.className );
    },
    getByClass: function (Classname, ele?) {

        var ele = ele || document;

        return ele.querySelectorAll ? ele.querySelectorAll('.' + Classname) : (function (ele) {

            var ele = ele.getElementsByTagName('*'),

                Result = [],

                re = new RegExp('\\b' + Classname + '\\b', 'i'),

                i = 0;

            for (; i < ele.length; i++) {

                if (re.test(ele[i].className)) {

                    Result.push(ele[i]);

                }
            }

            return Result;

        }(ele));

    },
    getNextNode(ele){

        if(ele.nextElementSibling) return ele.nextElementSibling;

        var e = ele.nextSibling;
        while(e && 1 !== e.nodeType)
            e = e.nextSibling;
        return e;
    },
    toArray: function (arr) {


        var reduced = [];

        try {

            reduced = Array.prototype.slice.call(arr, 0);

        } catch (ex) {

            for (var i = 0, len = arr.length; i < len; i++) {

                reduced[i] = arr[i];

            }
        }

        return reduced;
    },
    forEach: function () {
        return function (ary, callback) {
            if (typeof ary.forEach == "function") {

                ary.forEach(function (value, index, a) {

                    callback.call(ary, value, index, a);

                });

            } else {// 对于古董浏览器，如IE6-IE8
                for (var k = 0, length = ary.length; k < length; k++) {

                    callback.call(ary, ary[k], k, ary);

                }
            }

        };
    }()
};


export default query;