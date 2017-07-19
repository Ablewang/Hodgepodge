var klass = (function() {
    var F = function() {};

    return function(Parent) {
        var Child;

        Child = function() {
            Child.superproto.constructor.apply(this, arguments);
        };

        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.superproto = Parent.prototype;

        return Child;
    };
})();


var Character = function(role) {
		this.role = role;
		this.levelExp = 100;
		this.curExp = 0;
		this.level = 1;
	},
	Warrior = klass(Character), //战士
	Wizard = klass(Character), //巫师
	Pastor = klass(Character), //牧师
	Bowman = klass(Character), //弓箭手
	Player = function() {};

	Character.prototype.msg= function(content) {
		let span = document.createElement('span');
		span.innerHTML= content;
		let div = document.getElementById('play_msg');
		div.appendChild(span);
		div.scrollTop = div.scrollHeight;
	}

	Character.prototype.updatelevel=function(exp) {
		this.curExp += exp;
		if (this.curExp >= this.levelExp) {
			this.curExp -= this.levelExp;
			this.level++;
			this.levelExp = this.level * 100;
			this.msg(this.role + "升级了！当前等级：" + this.level);
		}
	},
	Character.prototype.fight= function() {
		let exp = parseInt(Math.random() * this.levelExp / this.level);
		this.msg(this.role +"操练了一番，获得了" + exp + '经验');
		this.updatelevel(exp);
	}
CharacterFactory = (function() {
	characterList = {
		Warrior: Warrior,
		Wizard: Wizard,
		Pastor: Pastor,
		Bowman: Bowman
	};
	return {
		createCharacter: function(name) {
			var Character = characterList[name];
			return Character ? new Character(name) : new Warrior('Warrior');
		},
		registerCharacter: function(role, Character) {
			let proto = Character.prototype;
			if (proto.level && proto.fight) {
				characterList[role] = Character;
			}
		}
	}
})();
Player.prototype.play = function(role) {
	return CharacterFactory.createCharacter(role);
}