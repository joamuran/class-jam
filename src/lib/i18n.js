var fs = require('fs');
var path = require('path');

function I18n(language){
	if (language=="ca_ES.UTF-8@valencia") language="ca_ES.UTF-8";
	// També cal comprovar si és a la llista d'idiomes suportats i si no, posar per defecte valencià
	this.language = language;
	this.fullpath = path.join('./locale/'+this.language+'.json');
    console.log(this.fullpath);
	this.content = {};
	
}

I18n.prototype.loadfile = function(){
	var self=this;
	try{
		if(fs.existsSync(self.fullpath)){
			var output = fs.readFileSync(this.fullpath);
			self.content = JSON.parse(output);
		} else console.log(self.fullpath+" not exists");
	}catch(exc){
		console.log("Exception loading "+self.fullpath);
		console.log(exc);
	}
}

I18n.prototype.gettext = function(key,substitution){
	substitution = typeof substitution !== 'undefined' ? substitution : null;
	if (! (key in this.content)){
		return "<span style='text-decoration:line-through;color:red; font-weight:bolder;'>"+key+"</span>";
	}
	if (substitution === null){
		//return this.content[key]['message'];
		return this.content[key];
	}
	if( Object.prototype.toString.call( substitution ) === '[object Array]' ) {
		//return this.content[key]['message'].replace(/(\$[a-zA-Z]+\$)/g, function(v){
		return this.content[key].replace(/(\$[a-zA-Z]+\$)/g, function(v){
			var result = substitution.shift();
			return typeof result !== 'undefined' ? result : "<span style='text-decoration:line-through;color:pink; font-weight:bolder;'>"+v+"</span>"; ;
		});
	}
	//return this.content[key]['message'].replace(/(\$[a-zA-Z]+\$)/g,function(v){
	return this.content[key].replace(/(\$[a-zA-Z]+\$)/g,function(v){
		var result = substitution[v.substr(1,v.length -2)];
		return typeof result !== 'undefined' ? result : "<span style='text-decoration:line-through;color:pink; font-weight:bolder;'>"+v+"</span>"; ;
	});
}

I18n.prototype.translateHtmlElement=function translateHtmlElement(element){
  var self=this;
  element.innerHTML=self.gettext(element.innerHTML);
};

I18n.prototype.translateHtml=function translateHtml(element){
	var self=this;
      [].forEach.call( document.querySelectorAll("*[i18n]"), function(element) {
          self.translateHtmlElement(element);
		});
}

var language = process.env.LANG;
var i18n = new I18n(language);

try{
	i18n.loadfile();
}
catch(err){
	var i18n = new I18n('en');
	i18n.loadfile();
}




