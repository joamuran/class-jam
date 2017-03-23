
function weekdayComponentClass(){
    this.weekdayOptions=["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
}

weekdayComponentClass.prototype=new Component();
weekdayComponentClass.prototype.constructor = weekdayComponentClass;

weekdayComponentClass.prototype.getBaseConfig=function getBaseConfig(){
    return {
        info:{},
        config:{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,
                 "friday":true,"saturday":true,"sunday":true},
        configdir:"weekday"
        };
};

weekdayComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    var li=$(document.createElement("li")).attr("id","weekdayComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).addClass("component");
    
    if (self.info.weekday==="") $(div).html("weekday is undefined");
    else {
        //var weekdaytext=$(document.createElement("div")).addClass("iconWeekdayText textfluid").html(i18n.gettext("weekday.it.is"));
        // var weekdaytext=$(document.createElement("div")).addClass("iconWeekdayText textfluid");
        var weekdayicon=$(document.createElement("div")).addClass("iconWeekday col-md-3").addClass(self.info.weekday);
        var weekdaystatuscontainer=$(document.createElement("div")).addClass("col-md-9 weekdaystatuscontainer");
        var weekdaystatus=$(document.createElement("div")).addClass("iconWeekdayText textfluid").html(i18n.gettext(self.info.weekday)).attr("fontzoom", "1.7");
        $(weekdaystatuscontainer).append(weekdaystatus);
        //$(li).append(weekdaytext).append(weekdayicon).append(weekdaystatus);
        $(li).append(weekdayicon).append(weekdaystatuscontainer);
    }
    
    return li;
};

weekdayComponentClass.prototype.reDrawComponent=function reDrawComponent(){
    var self=this;
    
    var item=$("#weekdayComponent");
    
    $(item).attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config));
    $(item).empty();
    var weekdayicon=self.drawComponent();
    
    // we have to add resizer because we have removed it
    var spanResizer=$(document.createElement("span")).addClass("gs-resize-handle").addClass("gs-resize-handle-both");
    $(item).append($(weekdayicon).html()).append(spanResizer);
    
}


weekdayComponentClass.prototype.getASDialog=function getASDialog(){
    var self=this;
    var ret={"message": i18n.gettext("weekday.component.title")};
    
    var input=$(document.createElement("div")).attr("id", "weekdaySelector");
    
    // First, let's count hom many elements are actived
    var active_items=0;
    for (var weekday in self.config)
        if (self.config[weekday]) active_items++;
    //var col_md=Math.floor(12/(active_items));
    var col_md=3;
    
    // And draw elements
    for (var weekday in self.config){
        var weekdayText=i18n.gettext(weekday);
        var option=$(document.createElement("div")).addClass(weekday).addClass("weekdaySelectIcon").attr("weekday",weekday).addClass("col-md-"+col_md);
        var text=$(document.createElement("div")).html(weekdayText).addClass("weekdaySelectInfo");
        $(option).append(text);
        $(input).append(option);
    }
    
    ret.input=$(input).prop("outerHTML");
    
    //console.log(ret.input);
    
    ret.bindEvents=function(){
        $(".weekdaySelectIcon").on("click", function(){

            $(".weekdaySelectIcon").removeClass("weekdaySelected");
            $(this).addClass("weekdaySelected");
            });  
    };
    
    ret.processDialog=function(){
        var selected=$($(".weekdaySelected")[0]).attr("weekday");
        //alert(selected);
        self.info.weekday=selected;
        self.reDrawComponent();
    };
        
    return ret;
        
    
}



weekdayComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("weekday.component.options")};
    
    
    var input=$(document.createElement("div")).attr("id", "weekdayConfig");
    //for (i in self.weekdayOptions){
    for (var weekday in self.config){
        var configRow=$(document.createElement("div")).addClass("weekdayConfigRow").addClass("col-md-4 col-md-offset-4").attr("weekday_data", weekday);
        if (self.config[weekday]) $(configRow).addClass("weekdayStatusActive");
        
        var weekdayText=i18n.gettext(weekday);
        
        var icon=$(document.createElement("div")).addClass(weekday).addClass("weekdayConfigIcon");
        var text=$(document.createElement("div")).html(weekdayText).addClass("weekdayConfigText");
        /*var selected=$(document.createElement("input")).attr("type","checkbox");*/
        
        // WIP HERE::::: a vore com posem el checkbox, i preparar els callbacks per a la configuració i tal...
        
        $(configRow).append(icon);
        $(configRow).append(text);
        /*$(configRow).append(selected);*/
        $(input).append(configRow);
        
    }
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        $(".weekdayConfigRow").on("click", function(){
            
            if($(this).hasClass("weekdayStatusActive")) $(this).removeClass("weekdayStatusActive");
            else $(this).addClass("weekdayStatusActive");
            });  
    };
    
    ret.processDialog=function(){
        for (var weekday in self.config){
            var item="."+weekday+".weekdayStatusActive";
            var found=$("#weekdayConfig").find("[weekday_data="+weekday+"].weekdayStatusActive");
            if (found.length>0) self.config[weekday]=true; else self.config[weekday]=false;
        }
        
        // Apply changes to data in widget
        $("#weekdayComponent").attr("config", JSON.stringify(self.config));
        
        
    };
    
        
    return ret;
};