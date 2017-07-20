var DraggableLigature = function(listArea, stepData, callbackObj) {
	this.lst = listArea;
	this.orgContiner = this.lst.parentNode;
	this.lines = {};
	this.stepLi = {};
	this.selfRelaDic = {}; //自己关联出去的数据字典
	this.relaDic = {}; //关联到自己的数据字典
	//移动处理
	//限定移动区域
	this.curObj = null;
	this.continerOffX = 0;
	this.continerOffY = 0;
	this.hasInitStepLi = false;
	this.data = stepData;
	this.callback = callbackObj; //回掉函数对象 将回调函数封装在同一个对象里面
}
DraggableLigature.prototype = {
	//根据元素的依赖关系初始化连接线
	initLineBasedRelation: function(obj, isMove) {
		let idx = obj.getAttribute('data-index');
		let selfRela = this.selfRelaDic[idx];
		if (selfRela) {
			selfRela.map((itm) => {
				let rela = this.stepLi[itm];
				if (rela) {
					this.drawLine(obj, rela);
				}
			})
		}
		if (isMove) {
			let rela = this.relaDic[idx];
			if (rela) {
				rela.map((itm) => {
					let start = this.stepLi[itm];
					if (rela) {
						this.drawLine(start, obj);
					}
				})
			}
		}
	},
	//根据依赖关系删除连接连
	deleteLineBasedRelation: function(obj) {
		let idx = obj.getAttribute('data-index');
		let selfRela = this.selfRelaDic[idx];
		if (selfRela) {
			selfRela.map((itm) => {
				this.deletLine(idx, itm);
			})
		}
		let rela = this.relaDic[idx];
		if (rela) {
			rela.map((itm) => {
				this.deletLine(itm, idx);
			})
		}
	},
	//删除连接线
	deletLine: function(startIndex, endIndex) {
		let oldLines = this.lines[startIndex + '_' + endIndex];
		if (oldLines) {
			for (let i = 0; i < oldLines.length; i++) {
				this.orgContiner.removeChild(oldLines[i]);
			}
			this.lines[startIndex + '_' + endIndex] = [];
		}
	},
	//根据开始和结束节点画线
	drawLine: function(start, end) {
		let type = start.getAttribute('data-type') || 'line';
		let startIndex = start.getAttribute('data-index');
		let endIndex = end.getAttribute('data-index');
		this.deletLine(startIndex, endIndex);

		let wContiner = this.orgContiner.offsetWidth,
			hContiner = this.orgContiner.offsetHeight;
		let wA = start.offsetWidth,
			hA = start.offsetHeight;
		let wB = end.offsetWidth,
			hB = end.offsetHeight;
		let xA = start.offsetLeft,
			yA = start.offsetTop,
			xB = end.offsetLeft,
			yB = end.offsetTop;

		let space = 0;
		if (yA == yB) {
			space = Math.abs(xA - xB) - 10 - wA;
			if (space > 0) {
				this.createLine(startIndex + '_' + endIndex, space, yA + hA / 2, (xA < xB ? (xA + wA + 5) : (xB + wB + 5)), type, true, true, xA < xB);
			}
		} else {
			let beginTop = 0,
				lineLeft = 0,
				verTop = 0,
				horTop = 0,
				topH = 10,
				verSize = 0,
				arrow = false;
			space = Math.abs(xA - xB);
			if (yA < yB) {
				beginTop = yA + hA + 5;
				horTop = beginTop + topH;
				verTop = beginTop + topH;
				verSize = yB - verTop - 5;
				//判断两个元素是否满足从中间划线  最小高度为30 其中各自margin 5  竖线总长20
				if (yB - yA - hA < 30) {
					beginTop = yA - 15;
					verTop = horTop = beginTop;
					verSize = verTop - (yB + hB + 5);
					if (yB < (hContiner - hB - 15)) {
						beginTop = yA + hA + 5;
						topH = yB - beginTop + hB + 15;
						verTop = yB + hB + 5;
						verSize = 10;
						arrow = true;
						horTop = beginTop + topH;
					}
				}
			} else {
				beginTop = yA - 15;
				horTop = beginTop;
				verTop = yB + hB + 5;
				verSize = horTop - verTop;
				arrow = true;
				if (yA - yB - hB < 30) {
					beginTop = yB - 15;
					horTop = verTop = beginTop;
					topH = yA - beginTop - 5;
					verSize = 10;
					arrow = false;
				}
			}

			//开始的线
			this.createLine(startIndex + '_' + endIndex, topH, beginTop, xA + wA / 2, type, false, false);
			//中间过渡线
			this.createLine(startIndex + '_' + endIndex, space, horTop, xA < xB ? (xA + wA / 2) : (xB + wB / 2), type, true, false);
			//带箭头的线
			this.createLine(startIndex + '_' + endIndex, verSize, verTop, xB + wB / 2, type, false, true, arrow);
		}
	},

	//生成线条，线条为绝对定位
	//size 尺寸
	//top 顶部距离
	//left 左侧距离
	//lineType 线条类型 实线 line   虚线 dashed
	//lineDirection 线条是否水平 水平:true   垂直:false
	//hasArrow 是否有箭头
	//arrowForward 箭头是否指向正方向:右、上为正,左下为负    ture为正  false为负
	createLine: function(id, size, top, left, lineType, lineHorizontal, hasArrow, arrowForward) {
		let cls = lineType + ' ' + (lineHorizontal ? 'col' : 'row');
		if (hasArrow) {
			cls += ' arrow-' + lineType;
			cls += ' arrow-' + (arrowForward ? (lineHorizontal ? 'right' : 'top') : (lineHorizontal ? 'left' : 'bottom'));
		}
		let line = document.createElement('div');
		line.setAttribute('class', cls);
		line.style[lineHorizontal ? 'width' : 'height'] = size;
		line.style.top = top;
		line.style.left = left;
		!this.lines[id] ? (this.lines[id] = [line]) : this.lines[id].push(line);
		this.orgContiner.appendChild(line);
	},
	//初始化拖拽事件
	initDrag: function() {
		document.onmousemove = (e) => {
			e = e ? e : event;
			if (this.curObj) {
				this.initLineBasedRelation(this.curObj, true);
				let x = e.clientX - this.continerOffX;
				let y = e.clientY - this.continerOffY;
				x = x < 0 ? 0 : x > (this.orgContiner.offsetWidth - this.curObj.offsetWidth) ? (this.orgContiner.offsetWidth - this.curObj.offsetWidth) : x;
				y = y < 0 ? 0 : y > (this.orgContiner.offsetHeight - this.curObj.offsetHeight) ? (this.orgContiner.offsetHeight - this.curObj.offsetHeight) : y;
				this.curObj.style.left = x + 'px';
				this.curObj.style.top = y + 'px';
			}
		}
		document.onmouseup = () => {
			if (this.callback && this.callback['moveEnd']) {
				this.callback['moveEnd'](this.curObj);
			}
			this.curObj = null;
			this.curX = this.curY = 0;
		}
		let iList = document.getElementsByClassName('icon');
		for (let i = iList.length - 1; i >= 0; i--) {
			this.drag(iList[i]);
		}
	},
	//绑定拖拽事件
	drag: function(obj) {
		obj.onclick = (e) => {
			e = e ? e : event;
			e.stopPropagation();
		}
		obj.onmousedown = (e) => {
			let par = obj.parentNode;
			e = e ? e : event;
			this.curObj = par;
			this.continerOffX = e.clientX - par.offsetLeft;
			this.continerOffY = e.clientY - par.offsetTop;
		}
	},
	//初始化线条
	initLine: function() {
		this.stepLi = {};
		this.selfRelaDic = {};
		this.relaDic = {};
		let liLst = this.lst.children;
		for (let i = 0; i < liLst.length; i++) {
			let idx = liLst[i].getAttribute('data-index') || -999;
			this.stepLi[idx] = liLst[i];

			let rela = liLst[i].getAttribute('Relation');
			if (rela) {
				rela = rela.split(',');
				rela.map((itm) => {
					!this.selfRelaDic[idx] ? (this.selfRelaDic[idx] = [itm]) : this.selfRelaDic[idx].push(itm);
					!this.relaDic[itm] ? (this.relaDic[itm] = [idx]) : this.relaDic[itm].push(idx);
				})
			}
		}
		for (let i = 0; i < liLst.length; i++) {
			this.initLineBasedRelation(liLst[i]);
		}
	},
	//初始化节点
	initStepLi: function() {
		if (this.data && this.data.length) {
			this.hasInitStepLi = true;
			this.data.map((itm) => {
				this.lst.appendChild(this.createLiStep(itm));
			})
		}
	},
	createLiStep: function(itm) {
		let li = document.createElement('li');
		li.setAttribute('class', 'tag block-' + itm.type);
		li.setAttribute('data-index', itm.index);
		li.setAttribute('data-type', itm.isLine ? 'line' : 'dashed');
		li.setAttribute('Relation', itm.relation.join(','));
		li.style.left = itm.offset[0];
		li.style.top = itm.offset[1];
		li.innerHTML = '<i class="icon"></i><h3 class="block-title Modify">' + itm.text + '</h3>';
		let del = document.createElement('span');
		del.setAttribute('class', 'span-shut');
		del.innerHTML = '×';
		li.appendChild(del);

		this.initDeleteButton(del);
		li.ondblclick = () => {
			!this.callback || !this.callback['stepDoubleClick'] ? '' : this.callback['stepDoubleClick'](li);
		};
		return li;
	},

	addStep: function(itm) {
		this.lst.appendChild(this.createLiStep(itm));
		this.docinitialize();
	},

	//删除按钮方法
	initDeleteButton: function(itm) {
		let par = itm.parentNode;
		par.onmouseover = function() {
			itm.style.display = 'block';
		}
		par.onmouseout = function() {
			itm.style.display = 'none';
		};
		itm.onclick = (e) => {
			!this.callback || !this.callback['deleteCallback'] ? '' : this.callback['deleteCallback'](par);
			this.deleteLineBasedRelation(par);
			this.lst.removeChild(par);
			this.initLine();
		}
	},
	docinitialize: function() {
		if (!this.hasInitStepLi) {
			this.initStepLi();
		}
		this.initDrag();
		this.initLine();
	}
}