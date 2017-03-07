
function Component(){
    this.info={};
    this.config={};
}

Component.prototype.init=function init(data, config){
    var self=this;
    self.info=data;
    self.config=config;
};

Component.prototype.getASDialog=function getASDialog(){
    return {"message":"error in dialog",
            "input":"Function not implemented yet"};
}

Component.prototype.getConfigDialog=function getConfigDialog(){
    return {"message":"error in Config Dialog",
            "input":"Function not implemented yet"};
}
