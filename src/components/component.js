
function Component(){
    this.info={};
    this.config={};
    this.visible="true";
    this.configDir="";
    this.name="Generic Component";
    this.icon="css/images/asmode.png";
}

Component.prototype.init=function init(data, config, configDir, visibility){
    var self=this;
    self.info=data;
    self.config=config;
    self.configDir=configDir;
    self.visible=visibility;
};

Component.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    self.info={};
    self.config={};
    self.visible=false;
};

Component.prototype.getComponentControlIcon=function getComponentControlIcon(id){
    var self=this;
    //return {"name":this.name, "icon":this.icon, "visible":this.visible, "id":id+"Configurator"};
        
    var retdiv=$(document.createElement("div")).attr("id", id).addClass("componentVisibilitySelector");
    var text=$(document.createElement("div")).html(self.name).addClass("componentVisibilitySelectorText");
    $(retdiv).css("background-image", "url("+self.icon+")");
    $(retdiv).append(text);
    
    return $(retdiv).prop("outerHTML");
};


Component.prototype.getASDialog=function getASDialog(){
    return {"message":"error in dialog",
            "input":"Function not implemented yet"};
};

Component.prototype.getConfigDialog=function getConfigDialog(){
    return {"message":"error in Config Dialog",
            "input":"Function not implemented yet"};
};

