
function Component(){
    this.info={};
    this.config={};
    this.visible="true";
    this.configDir="";
}

Component.prototype.init=function init(data, config, configDir, visibility){
    var self=this;
    self.info=data;
    self.config=config;
    self.configDir=configDir;
    self.visible=visibility;
};

Component.prototype.getBaseConfig=function getBaseConfig(){
    return {
        info:{},
        config:{},
        visibility:"true",
        configdir:""
        };
};

Component.prototype.getASDialog=function getASDialog(){
    return {"message":"error in dialog",
            "input":"Function not implemented yet"};
}

Component.prototype.getConfigDialog=function getConfigDialog(){
    return {"message":"error in Config Dialog",
            "input":"Function not implemented yet"};
}
