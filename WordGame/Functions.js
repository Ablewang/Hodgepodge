var CommonFunction = function() {};

CommonFunction.prototype.TimeSpan = function(timea, timeb) {
	this.getTime = function(t) {
		return new Date(t).getTime();
	}
	this.intNum = function(num) {
		return parseInt(num);
	}
	this.getChineseFormate = function(timespan) {
		let split = [{
			name: '年',
			base: 365 * 24 * 60 * 60 * 1000
		}, {
			name: '月',
			base: 30 * 24 * 60 * 60 * 1000
		}, {
			name: '日',
			base: 24 * 60 * 60 * 1000
		}, {
			name: '时',
			base: 60 * 60 * 1000
		}, {
			name: '分',
			base: 60 * 1000
		}, {
			name: '秒',
			base: 1000
		}, {
			name: '毫秒',
			base: 1
		}];
		let res = "";
		for (var i = 0; i < split.length; i++) {
			let tr = ta / split[i].base + 1;
			tr = parseInt(tr) - 1;
			res += !tr ? '' : (tr + split[i].name);
			ta %= split[i].base;
		}
		return res;
	}
	let ta = this.getTime(timea);
	let tb = this.getTime(timeb);
	if (!ta || !tb) {
		console.log('Time formate error.Like "2020-1-1 12:00:00"')
		return 0;
	}
	ta -= tb;
	ta *= ta < 0 ? -1 : 1;
	console.log(this.getChineseFormate(ta));
}

CommonFunction.prototype.SortObject = function(arr, sort_key) {
	if (!arr || arr.length <= 0) {
		console.log('Array is empty!');
		return;
	}
	this.getSortFun = function(key) {
		return function(o, p) {
			let a = o[key];
			let b = p[key];
			if (a === b) {
				return 0;
			}
			if (typeof a === typeof b) {
				return a < b ? -1 : 1;
			}
			return typeof a < typeof b ? -1 : 1;
		}
	}
	this.sortString = function(a, b) {
		return isasc ? (a[sort_key] - b[sort_key]) : (b[sort_key] - a[sort_key]);
	}
	if (!sort_key || sort_key.trim().length < 0) {
		sort_key = Object.keys(arr[0])[0];
	}
	arr = arr.sort(this.getSortFun(sort_key));
	console.log(arr);
}

CommonFunction.prototype.RuleRange = function() {
	this.roleList = {};
	this.rangerList = {};
	this.ruleList = {};
	this.ruleObjProp = ['name', 'function']
}

// 注入规则方法
//createRule 创建规则
//evalRule 执行规则
//initRanger 初始化玩家 根据角色赋予不同身份
CommonFunction.prototype.RuleRange.prototype = {
	createRole: function() {

	},
	createRule: function(rule, fun) {
		this.ruleList[rule] = {
			name: rule,
			function: fun
		};
		console.log(this);
	},
	evalRule: function(ruleName) {
		if (this.ruleList.hasOwnProperty(ruleName)) {
			this.ruleList[ruleName].function();
		} else {
			console.log("No such rule now!");
		}
	},
	initRanger: function(name, role) {
		if (this.rangerList.hasOwnProperty(name)) {
			console.log(name + 'has already been registered!');
			return false;
		}
		let ranger = {
			name: name,
			role: role,
			action: [this.evalRule.bind(this)]
		};
		switch (role) {
			case 'god':
				ranger.action.push(this.createRule.bind(this));
				break;
		}
		this.rangerList[ranger.name] = ranger;
	}
}