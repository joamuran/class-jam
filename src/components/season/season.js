
function seasonComponentClass(){
    this.seasonOptions=["autumn", "summer", "winter", "spring"];
}

seasonComponentClass.prototype=new Component();
seasonComponentClass.prototype.constructor = seasonComponentClass;

seasonComponentClass.prototype.getBaseConfig=function getBaseConfig(){
    return {
        info:{"season":"autumn"},
        config:{"spring":true,"summer":true,"autumn":true,"winter":true},
        configdir:"season"
        };
};

seasonComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    var li=$(document.createElement("li")).attr("id","seasonComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).addClass("component");
    
    if (self.info.season==="") $(div).html("season is undefined");
    else {
        var seasontext=$(document.createElement("div")).addClass("iconSeasonText textfluid").html(i18n.gettext("season.it.is"));
        var seasonicon=$(document.createElement("div")).addClass("iconSeason").addClass(self.info.season);
        
        var seasonstatus=$(document.createElement("div")).addClass("iconSeasonText textfluid").html(i18n.gettext(self.info.season));
        $(li).append(seasontext).append(seasonicon).append(seasonstatus);
    }
    
    return li;
};

seasonComponentClass.prototype.reDrawComponent=function reDrawComponent(){
    var self=this;
    
    var item=$("#seasonComponent");
    
    $(item).attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config));
    $(item).empty();
    var seasonicon=self.drawComponent();
    
    // we have to add resizer because we have removed it
    var spanResizer=$(document.createElement("span")).addClass("gs-resize-handle").addClass("gs-resize-handle-both");
    $(item).append($(seasonicon).html()).append(spanResizer);
    
}


seasonComponentClass.prototype.getASDialog=function getASDialog(){
    var self=this;
    var ret={"message": i18n.gettext("season.component.title")};
    
    var input=$(document.createElement("div")).attr("id", "seasonSelector");
    //for (i in self.seasonOptions){
    // First, let's count hom many elements are actived
    var active_items=0;
    for (var season in self.config)
        if (self.config[season]) active_items++;
    var col_md=Math.floor(12/(active_items));
    
    // And draw elements
    for (var season in self.config){
        var seasonText=i18n.gettext(season);
        var option=$(document.createElement("div")).addClass(season).addClass("seasonSelectIcon").attr("season",season).addClass("col-md-"+col_md);
        var text=$(document.createElement("div")).html(seasonText).addClass("seasonSelectInfo");
        $(option).append(text);
        $(input).append(option);
    }
    
    ret.input=$(input).prop("outerHTML");
    
    //console.log(ret.input);
    
    ret.bindEvents=function(){
        $(".seasonSelectIcon").on("click", function(){

            $(".seasonSelectIcon").removeClass("seasonSelected");
            $(this).addClass("seasonSelected");
            });  
    };
    
    ret.processDialog=function(){
        var selected=$($(".seasonSelected")[0]).attr("season");
        //alert(selected);
        self.info.season=selected;
        self.reDrawComponent();
    };
        
    return ret;
        
    
}



seasonComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("season.component.options")};
    
    
    var input=$(document.createElement("div")).attr("id", "seasonConfig");
    //for (i in self.seasonOptions){
    for (var season in self.config){
        var configRow=$(document.createElement("div")).addClass("seasonConfigRow").addClass("col-md-4 col-md-offset-4").attr("season_data", season);
        if (self.config[season]) $(configRow).addClass("seasonStatusActive");
        
        var seasonText=i18n.gettext(season);
        
        var icon=$(document.createElement("div")).addClass(season).addClass("seasonConfigIcon");
        var text=$(document.createElement("div")).html(seasonText).addClass("seasonConfigText");
        /*var selected=$(document.createElement("input")).attr("type","checkbox");*/
        
        // WIP HERE::::: a vore com posem el checkbox, i preparar els callbacks per a la configuració i tal...
        
        $(configRow).append(icon);
        $(configRow).append(text);
        /*$(configRow).append(selected);*/
        $(input).append(configRow);
        
    }
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        $(".seasonConfigRow").on("click", function(){
            
            if($(this).hasClass("seasonStatusActive")) $(this).removeClass("seasonStatusActive");
            else $(this).addClass("seasonStatusActive");
            });  
    };
    
    ret.processDialog=function(){
        for (var season in self.config){
            var item="."+season+".seasonStatusActive";
            var found=$("#seasonConfig").find("[season_data="+season+"].seasonStatusActive");
            if (found.length>0) self.config[season]=true; else self.config[season]=false;
        }
        
        // Apply changes to data in widget
        $("#seasonComponent").attr("config", JSON.stringify(self.config));
        
        
    };
    
        
    return ret;
};