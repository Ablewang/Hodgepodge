$(function() {


	//可拖拽流程线参数插件
	//listArea, stepData, callbackObj
	//listArea：流程步骤的容器，需要指定css定位属性
	//stepData：流程步骤信息，信息结构参考获取步骤信息方法内部说明
	//callbackObj：回调事件对象，包含了一系列动作回调，属性不可变
	//			   moveEnd：流程步骤拖拽结束事件回调，返回当前拖拽的流程步骤，属性可参考控制台打印的对象属性
	//			   stepDoubleClick：流程步骤双击事件，指定了流程双击事件，返回双击的目步骤
	//			   deleteCallback：流程步骤删除回调，指定流程删除事件，返回删除的步骤
	//			   PS：可扩展其他回调属性，只需同步更改插件内部逻辑即可
	let dragLine = new DraggableLigature(document.getElementById('uList'), getStepInfo(), {
		moveEnd: moveEndCallback,
		stepDoubleClick: stepDoubleClick,
		deleteCallback: deleteCallback
	});

	//初始化
	dragLine.docinitialize();

	initAddButtonClick();

	//新增按钮点击事件
	//插件提供新增函数addStep
	//参数：itm：带待新增的步骤信息，信息参考getStepInfo方法内部说明
	function initAddButtonClick() {
		let addBtn = document.getElementById('addArea').children;
		for (var i = 0; i < addBtn.length; i++) {
			addBtn[i].onclick = function() {
				dragLine.addStep({
					index: 5,
					relation: [2],
					text: '处理',
					isLine: false,
					type: 'cl',
					offset: ['0', '0']
				})
			}
		}
	}

	//元素删除回调
	function deleteCallback(obj) {
		alert('你删除了' + obj.getAttribute('data-index') + '号元素')
	}

	//元素点击回调
	function stepDoubleClick(obj) {
		alert('你点击了' + obj.getAttribute('data-index') + '号元素')
	}

	//步骤移动回调
	function moveEndCallback(obj) {
		if (obj) {
			console.log({
				index: obj.getAttribute('data-index'),
				top: obj.offsetTop,
				left: obj.offsetLeft
			});
		}
	}

	//获取数据
	function getStepInfo() {
		// $.ajax()

		//模拟数据
		//index:序号 relation:相关节点序号 text:节点文本 
		//isLine:是否直线（true: line ,false : dashed） type:节点样式
		//offset:元素绝对定位位置 [left,top]
		let data = [{
			index: 1,
			relation: [2, 3],
			text: '开始',
			isLine: true,
			type: 'ks',
			offset: ['81px', '80px']
		}, {
			index: 2,
			relation: [3, 4],
			text: '处理',
			isLine: true,
			type: 'cl',
			offset: ['161px', '433px']
		}, {
			index: 3,
			relation: [],
			text: '通知',
			isLine: true,
			type: 'tz',
			offset: ['913px', '35px']
		}, {
			index: 4,
			relation: [1],
			text: '结束',
			isLine: false,
			type: 'js',
			offset: ['753px', '183px']
		}];
		return data；
	}
})