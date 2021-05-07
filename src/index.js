// "use strict";
import "./style.css";

const coCreateResize = {
    selector: '', //'.resize',
    resizers: [],

    init: function(handleObj) {       
        for (var handleKey in handleObj)
            if (handleObj.hasOwnProperty(handleKey) && handleKey == 'selector')
                this.selector = handleObj[handleKey];

        this.resizers = document.querySelectorAll(this.selector);      
        console.log("first init")
        this.resizers.forEach(function(resize, idx) {
            new CoCreateResize(resize, handleObj);          
        })
    }
}

class CoCreateResize {
    constructor(resizer, options) {      
        this.resizeWidget = resizer;
        this.cornerSize = 10;
        if (this.resizeWidget) {
            this.leftDrag = this.resizeWidget.querySelector(options['dragLeft']);
            this.rightDrag = this.resizeWidget.querySelector(options['dragRight']);
            this.topDrag = this.resizeWidget.querySelector(options['dragTop']);
            this.bottomDrag = this.resizeWidget.querySelector(options['dragBottom']);
            this.bindListeners();
            this.initResize();

        }
    }  

    initResize() {
        if (this.leftDrag) {
            this.addListenerMulti(this.leftDrag, 'mousemove touchmove', this.checkLeftDragTopCorner);
            this.addListenerMulti(this.leftDrag, 'mousemove touchmove', this.checkLeftDragBottomCorner);
        }
        if (this.topDrag) {
            this.addListenerMulti(this.topDrag, 'mousemove touchmove', this.checkTopDragLeftCorner);
            this.addListenerMulti(this.topDrag, 'mousemove touchmove', this.checkTopDragRightCorner);
        }
        if (this.rightDrag) {
            this.addListenerMulti(this.rightDrag, 'mousemove touchmove', this.checkRightDragTopCorner);
            this.addListenerMulti(this.rightDrag, 'mousemove touchmove', this.checkRightDragBottomCorner);
        }
        if (this.bottomDrag) {
            this.addListenerMulti(this.bottomDrag, 'mousemove touchmove', this.checkBottomDragLeftCorner);
            this.addListenerMulti(this.bottomDrag, 'mousemove touchmove', this.checkBottomDragRightCorner);
        }
    }

    initTopDrag(e) {
        this.processIframe();
        this.startTop = parseInt(document.defaultView.getComputedStyle(this.resizeWidget).top, 10);
        this.startHeight = parseInt(document.defaultView.getComputedStyle(this.resizeWidget).height, 10);

        if (e.touches)
            this.startY = e.touches[0].clientY;
        else
            this.startY = e.clientY;

        this.addListenerMulti(document.documentElement, 'mousemove touchmove', this.doTopDrag);
        this.addListenerMulti(document.documentElement, 'mouseup touchend', this.stopDrag);
    }

    doTopDrag(e) {
        let top, height;

        if (e.touches)
            e = e.touches[0];
        top = this.startTop + e.clientY - this.startY;
        height = this.startHeight - e.clientY + this.startY;

        if (top < 10 || height < 10)
            return;
        this.resizeWidget.style.top = top + 'px';
        this.resizeWidget.style.height = height + 'px';
    }

    initBottomDrag(e) {
        this.processIframe();
        this.startTop = parseInt(document.defaultView.getComputedStyle(this.resizeWidget).top, 10);
        this.startHeight = parseInt(document.defaultView.getComputedStyle(this.resizeWidget).height, 10);

        if (e.touches)
            this.startY = e.touches[0].clientY;
        else
            this.startY = e.clientY;

        this.addListenerMulti(document.documentElement, 'mousemove touchmove', this.doBottomDrag);
        this.addListenerMulti(document.documentElement, 'mouseup touchend', this.stopDrag);
    }

    doBottomDrag(e) {
        let height = 0;

        if (e.touches)
            height = this.startHeight + e.touches[0].clientY - this.startY;
        else
            height = this.startHeight + e.clientY - this.startY;

        if (height < 10)
            return;
        this.resizeWidget.style.height = height + 'px';
    }

    initLeftDrag(e) {
        this.processIframe();
        this.startLeft = parseInt(document.defaultView.getComputedStyle(this.resizeWidget).left, 10);
        this.startWidth = parseInt(document.defaultView.getComputedStyle(this.resizeWidget).width, 10);

        if (e.touches)
            this.startX = e.touches[0].clientX;
        else
            this.startX = e.clientX;

        this.addListenerMulti(document.documentElement, 'mousemove touchmove', this.doLeftDrag);
        this.addListenerMulti(document.documentElement, 'mouseup touchend', this.stopDrag);
    }

    doLeftDrag(e) {
        let left, width;
        if (e.touches)
            e = e.touches[0];
        left = this.startLeft + e.clientX - this.startX;
        width = this.startWidth - e.clientX + this.startX;

        if (width < 10)
            return;
        this.resizeWidget.style.left = left + 'px';
        this.resizeWidget.style.width = width + 'px';
    }

    initRightDrag(e) {
        this.processIframe();
        this.startWidth = parseInt(document.defaultView.getComputedStyle(this.resizeWidget).width, 10);

        if (e.touches)
            this.startX = e.touches[0].clientX;
        else
            this.startX = e.clientX;

        this.addListenerMulti(document.documentElement, 'mousemove touchmove', this.doRightDrag);
        this.addListenerMulti(document.documentElement, 'mouseup touchend', this.stopDrag);
    }

    doRightDrag(e) {
        let width = 0;
        if (e.touches)
            width = this.startWidth + e.touches[0].clientX - this.startX;
        else
            width = this.startWidth + e.clientX - this.startX;
        if (width < 10)
            return;
        this.resizeWidget.style.width = width + 'px';
    }

    stopDrag(e) {
        this.resizeWidget.querySelectorAll('iframe').forEach(function (item) {
            item.style.pointerEvents = null;
        });

        this.removeListenerMulti(document.documentElement, 'mousemove touchmove', this.doTopDrag);
        this.removeListenerMulti(document.documentElement, 'mousemove touchmove', this.doBottomDrag);
        this.removeListenerMulti(document.documentElement, 'mousemove touchmove', this.doLeftDrag);
        this.removeListenerMulti(document.documentElement, 'mousemove touchmove', this.doRightDrag);
        this.removeListenerMulti(document.documentElement, 'mouseup touchend', this.stopDrag);
    }

    checkTopDragLeftCorner(e) {
        if(!this.topDrag) return;
        let offsetX, scrollLeft = document.documentElement.scrollLeft;

        if (e.touches)
            e = e.touches[0];
        offsetX = e.clientX - this.getLeftDistance(this.topDrag) + scrollLeft;

        this.removeListenerMulti(this.topDrag, 'mousedown touchstart', this.initTopDrag);
        this.removeListenerMulti(this.topDrag, 'mousedown touchstart', this.initLeftDrag);
        this.addListenerMulti(this.topDrag, 'mousedown touchstart', this.initTopDrag);
        if (offsetX < this.cornerSize && this.leftDrag) {
            this.topDrag.style.cursor = 'se-resize';
            this.addListenerMulti(this.topDrag, 'mousedown touchstart', this.initLeftDrag);
        } else {
            this.topDrag.style.cursor = 's-resize';
        }
    }

    checkLeftDragTopCorner(e) {
        if(!this.leftDrag) return;
        let offsetY, scrollTop = document.documentElement.scrollTop;

        if (e.touches)
            e = e.touches[0];
        offsetY = e.clientY - this.getTopDistance(this.leftDrag) + scrollTop;

        this.removeListenerMulti(this.leftDrag, 'mousedown touchstart', this.initLeftDrag);
        this.removeListenerMulti(this.leftDrag, 'mousedown touchstart', this.initTopDrag);
        this.addListenerMulti(this.leftDrag, 'mousedown touchstart', this.initLeftDrag);
        if (offsetY < this.cornerSize && this.topDrag) {
            this.leftDrag.style.cursor = 'se-resize';
            this.addListenerMulti(this.leftDrag, 'mousedown touchstart', this.initTopDrag);
        } else {
            this.leftDrag.style.cursor = 'e-resize';
        }
    }

    checkTopDragRightCorner(e) {
        let offsetX, scrollLeft = document.documentElement.scrollLeft;

        this.removeListenerMulti(this.topDrag, 'mousedown touchstart', this.initTopDrag);
        this.removeListenerMulti(this.topDrag, 'mousedown touchstart', this.initRightDrag);
        this.addListenerMulti(this.topDrag, 'mousedown touchstart', this.initTopDrag);

        if (this.rightDrag) {
            if (e.touches)
                e = e.touches[0];
            offsetX = this.getLeftDistance(this.rightDrag) - e.clientX - scrollLeft;

            if (offsetX < this.cornerSize) {
                this.topDrag.style.cursor = 'ne-resize';
                this.addListenerMulti(this.topDrag, 'mousedown touchstart', this.initRightDrag);
            } else if (!this.leftDrag) {
                this.topDrag.style.cursor = 's-resize';
            }
        }
    }

    checkRightDragTopCorner(e) {
        let offsetY, scrollTop = document.documentElement.scrollTop;

        this.removeListenerMulti(this.rightDrag, 'mousedown touchstart', this.initRightDrag);
        this.removeListenerMulti(this.rightDrag, 'mousedown touchstart', this.initTopDrag);
        this.addListenerMulti(this.rightDrag, 'mousedown touchstart', this.initRightDrag);

        if (this.topDrag) {
            if (e.touches)
                e = e.touches[0];
            offsetY = e.clientY - this.getTopDistance(this.topDrag) + scrollTop;


            if (offsetY < this.cornerSize) {
                this.rightDrag.style.cursor = 'ne-resize';
                this.addListenerMulti(this.rightDrag, 'mousedown touchstart', this.initTopDrag);
            } else {
                this.rightDrag.style.cursor = 'e-resize';
            }
        }
    }

    checkBottomDragLeftCorner(e) {
        if(!this.bottomDrag) return;
        let offsetX, scrollLeft = document.documentElement.scrollLeft;

        if (e.touches)
            e = e.touches[0];
        offsetX = e.clientX - this.getLeftDistance(this.bottomDrag) + scrollLeft;

        this.removeListenerMulti(this.bottomDrag, 'mousedown touchstart', this.initBottomDrag);
        this.removeListenerMulti(this.bottomDrag, 'mousedown touchstart', this.initLeftDrag);
        this.addListenerMulti(this.bottomDrag, 'mousedown touchstart', this.initBottomDrag);
        if (offsetX < this.cornerSize && this.leftDrag) {
            this.bottomDrag.style.cursor = 'ne-resize';
            this.addListenerMulti(this.bottomDrag, 'mousedown touchstart', this.initLeftDrag);
        } else {
            this.bottomDrag.style.cursor = 's-resize';
        }
    }

    checkLeftDragBottomCorner(e) {
        let offsetY, scrollTop = document.documentElement.scrollTop;

        this.removeListenerMulti(this.leftDrag, 'mousedown touchstart', this.initLeftDrag);
        this.removeListenerMulti(this.leftDrag, 'mousedown touchstart', this.initBottomDrag);
        this.addListenerMulti(this.leftDrag, 'mousedown touchstart', this.initLeftDrag);

        if (this.bottomDrag) {
            if (e.touches)
                e = e.touches[0];
            offsetY = this.getTopDistance(this.bottomDrag) - e.clientY - scrollTop;


            if (offsetY < this.cornerSize) {
                this.leftDrag.style.cursor = 'ne-resize';
                this.addListenerMulti(this.leftDrag, 'mousedown touchstart', this.initBottomDrag);
            } else if (!this.topDrag) {
                this.leftDrag.style.cursor = 'e-resize';
            }
        }
    }

    checkBottomDragRightCorner(e) {
        let offsetX, scrollLeft = document.documentElement.scrollLeft;

        this.removeListenerMulti(this.bottomDrag, 'mousedown touchstart', this.initBottomDrag);
        this.removeListenerMulti(this.bottomDrag, 'mousedown touchstart', this.initRightDrag);
        this.addListenerMulti(this.bottomDrag, 'mousedown touchstart', this.initBottomDrag);

        if (this.rightDrag) {
            if (e.touches)
                e = e.touches[0];
            offsetX = this.getLeftDistance(this.rightDrag) - e.clientX - scrollLeft;

            if (offsetX < this.cornerSize) {
                this.bottomDrag.style.cursor = 'se-resize';
                this.addListenerMulti(this.bottomDrag, 'mousedown touchstart', this.initRightDrag);
            } else if (!this.leftDrag) {
                this.bottomDrag.style.cursor = 's-resize';
            }
        }
    }

    checkRightDragBottomCorner(e) {
        let offsetY, scrollTop = document.documentElement.scrollTop;

        this.removeListenerMulti(this.rightDrag, 'mousedown touchstart', this.initRightDrag);
        this.removeListenerMulti(this.rightDrag, 'mousedown touchstart', this.initBottomDrag);
        this.addListenerMulti(this.rightDrag, 'mousedown touchstart', this.initRightDrag);

        if (this.bottomDrag) {
            if (e.touches)
                e = e.touches[0];
            offsetY = this.getTopDistance(this.bottomDrag) - e.clientY - scrollTop;


            if (offsetY < this.cornerSize) {
                this.rightDrag.style.cursor = 'se-resize';
                this.addListenerMulti(this.rightDrag, 'mousedown touchstart', this.initBottomDrag);
            } else if (!this.topDrag) {
                this.rightDrag.style.cursor = 'e-resize';
            }
        }
    }

    bindListeners() {
        console.log("bind")
        this.initLeftDrag = this.initLeftDrag.bind(this);
        this.doLeftDrag = this.doLeftDrag.bind(this);
        this.initTopDrag = this.initTopDrag.bind(this);
        this.doTopDrag = this.doTopDrag.bind(this);
        this.initRightDrag = this.initRightDrag.bind(this);
        this.doRightDrag = this.doRightDrag.bind(this);
        this.initBottomDrag = this.initBottomDrag.bind(this);
        this.doBottomDrag = this.doBottomDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);

        this.checkTopDragLeftCorner = this.checkTopDragLeftCorner.bind(this);
        this.checkLeftDragTopCorner = this.checkLeftDragTopCorner.bind(this);
        this.checkTopDragRightCorner = this.checkTopDragRightCorner.bind(this);
        this.checkRightDragTopCorner = this.checkRightDragTopCorner.bind(this);
        this.checkBottomDragLeftCorner = this.checkBottomDragLeftCorner.bind(this);
        this.checkLeftDragBottomCorner = this.checkLeftDragBottomCorner.bind(this);
        this.checkBottomDragRightCorner = this.checkBottomDragRightCorner.bind(this);
        this.checkRightDragBottomCorner = this.checkRightDragBottomCorner.bind(this);
    }

    // Get an element's distance from the top of the page
    getTopDistance(elem) {
        if (!elem) return;
        var location = 0;
        if (elem.offsetParent) {
            do {
                location += elem.offsetTop;
                elem = elem.offsetParent;
            } while (elem);
        }
        return location >= 0 ? location : 0;
    }

    // Get an element's distance from the left of the page
    getLeftDistance(elem) {
        if (!elem) return;
        var location = 0;
        if (elem.offsetParent) {
            do {
                location += elem.offsetLeft;
                elem = elem.offsetParent;
            } while (elem);
        }
        return location >= 0 ? location : 0;
    }

    // Bind multiiple events to a listener
    addListenerMulti(element, eventNames, listener) {
        if (!element) return;
        var events = eventNames.split(' ');
        for (var i = 0, iLen = events.length; i < iLen; i++) {
            element.addEventListener(events[i], listener, false);
        }
    }

    // Remove multiiple events from a listener
    removeListenerMulti(element, eventNames, listener) {
        if (!element) return;
        var events = eventNames.split(' ');
        for (var i = 0, iLen = events.length; i < iLen; i++) {
            element.removeEventListener(events[i], listener, false);
        }
    }

    // style="pointer-events:none" for iframe when drag event starts
    processIframe() {
        this.resizeWidget.querySelectorAll('iframe').forEach(function (item) {
            item.style.pointerEvents = 'none';
        });
    }
}
export default coCreateResize
