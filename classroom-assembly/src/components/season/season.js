
function seasonComponentClass(){
    var self=this;
    this.seasonOptions=["autumn", "summer", "winter", "spring"];
    this.name="Season Selector";
    this.icon="components/componentIcons/season.png";
    this.componentname="season";
    
    this.playableData={"top_text":"season.it.is",
        getCurrentInfo: function getCurrentInfo(){
        return self.info.season;
        },
        setCurrentInfo: function setCurrentInfo(data){
        self.info.season=data;
    }};
}

seasonComponentClass.prototype=new Component();
seasonComponentClass.prototype.constructor = seasonComponentClass;

seasonComponentClass.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    self.info={"season":"autumn"};
    self.actions={"actions":""};
    self.config={"spring":true,"summer":true,"autumn":true,"winter":true};
};

seasonComponentClass.prototype.resetComponent=function resetComponent(){
    var self=this;
    self.info={"season":""};
};

seasonComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    var li=$(document.createElement("li")).attr("id","seasonComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).attr("actions", JSON.stringify(self.actions)).addClass("component");
    
    if (self.info.season==="") {
        //$(div).html("season is undefined");
        seasontext=$(document.createElement("div")).addClass("iconMonthText textfluid").html(i18n.gettext("season.component.title"));
        $(li).append(seasontext);
    }
    else {
        var seasontext=$(document.createElement("div")).addClass("iconSeasonText textfluid").html(i18n.gettext("season.it.is"));
        var seasonicon=$(document.createElement("div")).addClass("iconSeason").addClass(self.info.season);
        
        var seasonstatus=$(document.createElement("div")).addClass("iconSeasonText textfluid").html(i18n.gettext(self.info.season));
        $(li).append(seasontext).append(seasonicon).append(seasonstatus);
        
        var PlayComponentButton=self.getPlayComponentButton();
        $(li).append(PlayComponentButton);
        
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

            // Click to select season
            $(".seasonSelectIcon").removeClass("seasonSelected");
            $(this).addClass("seasonSelected");
        
            // Perform a processDialog before show confirm
            var selected=$($(".seasonSelected")[0]).attr("season");
            var oldselected=self.info.season;
            if (selected) self.info.season=selected;
            self.reDrawComponent();
            appGlobal.bindCompomentsEvents();
    
            self.showConfirmItem(oldselected); // Sending selected to restore if cancel
            
            
            });
    };
    
    ret.processDialog=function(){
        var selected=$($(".seasonSelected")[0]).attr("season");
        //alert(selected);
        if (selected) self.info.season=selected;
        self.reDrawComponent();
        appGlobal.bindCompomentsEvents(); // Rebind component events to allow click on Play after redrawing it
    };
        
    return ret;
        
    
}



seasonComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("season.component.options")};
    
    
    var input=$(document.createElement("div")).attr("id", "seasonConfig");
    
    var defaultConfigBt=$(document.createElement("div")).addClass("configureComponentButtonDefault col-md-1").attr("title", i18n.gettext("click.set.actions.default")).attr("season", "default").attr("actions","");
    
    $(input).append(defaultConfigBt);
    
    for (var season in self.config){
        var configRow=$(document.createElement("div")).addClass("seasonConfigRow").addClass("col-md-6 col-md-offset-3").attr("season_data", season);
        
        var configRowSeason=$(document.createElement("div")).addClass("col-md-10").attr("season_data", season);
        
        if (self.config[season]) $(configRow).addClass("seasonStatusActive");
        
        var seasonText=i18n.gettext(season);
        
        var icon=$(document.createElement("div")).addClass(season).addClass("seasonConfigIcon  modifyable").attr("title", i18n.gettext("click.change.img"));
        var text=$(document.createElement("div")).html(seasonText).addClass("seasonConfigText");
        
        var iconConfigBt=$(document.createElement("div")).addClass("configureComponentButton col-md-1").attr("title", i18n.gettext("click.set.actions")).attr("season", season).attr("actions","");
        
        $(configRowSeason).append(icon);
        $(configRowSeason).append(text);
        $(configRow).append(configRowSeason);
        $(configRow).append(iconConfigBt);
        $(input).append(configRow);
        
        
    }
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        $(".seasonConfigRow").on("click", function(){
            
            if($(this).hasClass("seasonStatusActive")) $(this).removeClass("seasonStatusActive");
            else $(this).addClass("seasonStatusActive");
            });
        
        
        $(".configureComponentButton, .configureComponentButtonDefault").on("click", function (event) {
            event.stopPropagation();
            event.preventDefault();
            var season=$(event.target).attr("season");
            
            if (self.hasOwnProperty("actions"))
                self.showConfigActions(season, function(data){
                    if(data){
                        self.saveActions(season, data);
                    }
                });
                
        });
        
        
        // Calling to parent class method to bind click event on icon for change its image
        self.bindClickForChangeImg("seasonConfigIcon");
               
        
        /*$(".seasonConfigIcon").on("click", function(event){
            event.stopPropagaactionstion();
            var item=$($(event)[0].target).attr("class").replace("seasonConfigIcon","").replace(" ", "");
            self.changeImage(item, self.componentname);
        });*/
        
    };
    
    ret.processDialog=function(){
        for (var season in self.config){
            var item="."+season+".seasonStatusActive";
            var found=$("#seasonConfig").find("[season_data="+season+"].seasonStatusActive");
            if (found.length>0) self.config[season]=true; else self.config[season]=false;
        }
        
        // Apply changes to data in widget
        $("#seasonComponent").attr("config", JSON.stringify(self.config));
        
        // Serialize actions to component
        if (self.hasOwnProperty("actions")) $("#seasonComponent").attr("actions", JSON.stringify(self.actions));
        
        
        
        
    };
    
        
    return ret;
};