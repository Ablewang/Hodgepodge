let lst = document.getElementById('uList');
let orgContiner = lst.parentNode;
let lines = {};
let stepLi = {};
let selfRelaDic = {}; //自己关联出去的数据字典
let relaDic = {}; //关联到自己的数据字典
docinitialize();

function docinitialize() {
	initDrag();
	initLine();
}

//初始化拖拽事件
function initDrag() {
	let iList = document.getElementsByClassName('icon');
	for (let i = iList.length - 1; i >= 0; i--) {
		drag(iList[i]);
	}
}

//初始化线条
function initLine() {
	stepLi = {};
	selfRelaDic = {};
	relaDic = {};
	let liLst = lst.children;
	for (let i = 0; i < liLst.length; i++) {
		let idx = liLst[i].getAttribute('data-index') || -999;
		stepLi[idx] = liLst[i];

		let rela = liLst[i].getAttribute('Relation');
		if (rela) {
			rela = rela.split(',');
			rela.map(function(itm) {
				!selfRelaDic[idx] ? (selfRelaDic[idx] = [itm]) : selfRelaDic[idx].push(itm);
				!relaDic[itm] ? (relaDic[itm] = [idx]) : relaDic[itm].push(idx);
			})
		}
	}
	for (let i = 0; i < liLst.length; i++) {
		initLineBasedRelation(liLst[i]);
		initDelete(liLst[i]);
	}
}

//根据元素的依赖关系初始化连接线
function initLineBasedRelation(obj, isMove) {
	let idx = obj.getAttribute('data-index');
	let selfRela = selfRelaDic[idx];
	if (selfRela) {
		selfRela.map(function(itm) {
			let rela = stepLi[itm];
			if (rela) {
				drawLine(obj, rela);
			}
		})
	}
	if (isMove) {
		let rela = relaDic[idx];
		if (rela) {
			rela.map(function(itm) {
				let start = stepLi[itm];
				if (rela) {
					drawLine(start, obj);
				}
			})
		}
	}
}

//根据依赖关系删除连接连
function deleteLineBasedRelation(obj) {
	let idx = obj.getAttribute('data-index');
	let selfRela = selfRelaDic[idx];
	if (selfRela) {
		selfRela.map(function(itm) {
			deletLine(idx, itm);
		})
	}
	let rela = relaDic[idx];
	if (rela) {
		rela.map(function(itm) {
			deletLine(itm, idx);
		})
	}
}

//删除连接线
function deletLine(startIndex, endIndex) {
	let oldLines = lines[startIndex + '_' + endIndex];
	if (oldLines) {
		for (let i = 0; i < oldLines.length; i++) {
			orgContiner.removeChild(oldLines[i]);
		}
		lines[startIndex + '_' + endIndex] = [];
	}
}

//根据开始和结束节点画线
function drawLine(start, end) {
	let type = start.getAttribute('data-type') || 'line';
	let startIndex = start.getAttribute('data-index');
	let endIndex = end.getAttribute('data-index');
	deletLine(startIndex, endIndex);

	let wContiner = orgContiner.offsetWidth,
		hContiner = orgContiner.offsetHeight;
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
			createLine(startIndex + '_' + endIndex, space, yA + hA / 2, (xA < xB ? (xA + wA + 5) : (xB + wB + 5)), type, true, true, xA < xB);
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
		createLine(startIndex + '_' + endIndex, topH, beginTop, xA + wA / 2, type, false, false);
		//中间过渡线
		createLine(startIndex + '_' + endIndex, space, horTop, xA < xB ? (xA + wA / 2) : (xB + wB / 2), type, true, false);
		//带箭头的线
		createLine(startIndex + '_' + endIndex, verSize, verTop, xB + wB / 2, type, false, true, arrow);
	}
}

//生成线条，线条为绝对定位
//size 尺寸
//top 顶部距离
//left 左侧距离
//lineType 线条类型 实线 line   虚线 dashed
//lineDirection 线条是否水平 水平:true   垂直:false
//hasArrow 是否有箭头
//arrowForward 箭头是否指向正方向:右、上为正,左下为负    ture为正  false为负
function createLine(id, size, top, left, lineType, lineHorizontal, hasArrow, arrowForward) {
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
	!lines[id] ? (lines[id] = [line]) : lines[id].push(line);
	orgContiner.appendChild(line);
}

//移动处理
//限定移动区域
let curObj = null;
let continerOffX = 0,
	continerOffY = 0;
document.onmousemove = function(e) {
	e = e ? e : event;
	if (curObj) {
		initLineBasedRelation(curObj, true);
		let x = e.clientX - continerOffX;
		let y = e.clientY - continerOffY;
		x = x < 0 ? 0 : x > (orgContiner.offsetWidth - curObj.offsetWidth) ? (orgContiner.offsetWidth - curObj.offsetWidth) : x;
		y = y < 0 ? 0 : y > (orgContiner.offsetHeight - curObj.offsetHeight) ? (orgContiner.offsetHeight - curObj.offsetHeight) : y;
		curObj.style.left = x + 'px';
		curObj.style.top = y + 'px';
	}
}
document.onmouseup = function() {
	curObj = null;
	curX = curY = 0;
}

function drag(obj) {
	obj.onmousedown = function(e) {
		let par = obj.parentNode;
		e = e ? e : event;
		curObj = par;
		continerOffX = e.clientX - par.offsetLeft;
		continerOffY = e.clientY - par.offsetTop;
	}
}

function initDelete(obj) {
	obj.onmouseover = function() {
		this.children[2].style.display = 'block';
	}
	obj.onmouseout = function() {
		this.children[2].style.display = 'none';
	};
	obj.children[2].onclick = function() {
		deleteLineBasedRelation(this.parentNode);
		lst.removeChild(this.parentNode);
		docinitialize();
	}
}

let addBtn = document.getElementById('addArea').children;
for (var i = 0; i < addBtn.length; i++) {
	add(addBtn[i]);
}

function add(obj) {
	obj.onclick = function() {
		let liIndexs = [];
		Object.keys(stepLi).map(function(item) {
			liIndexs.push(item)
		});
		let nLi = document.createElement('li');
		nLi.setAttribute('class', 'block-cl');
		nLi.setAttribute('data-index', new Date().getTime());
		let random = Math.random();
		if (random > 0.5 && random < 1) {
			nLi.setAttribute('Relation', liIndexs[Math.floor(random * liIndexs.length)]);
		}
		nLi.setAttribute('data-type', Math.random() > 0.5 ? 'line' : 'dashed');
		nLi.style.top = Math.random() * (orgContiner.offsetHeight - 60)
		nLi.style.left = Math.random() * (orgContiner.offsetWidth - 160)
		nLi.innerHTML = '<i class="icon"></i><h3 class="block-title Modify">新增</h3><span class="span-shut">×</span>';
		document.getElementById('uList').appendChild(nLi);
		docinitialize();
	}
}