
function weekdayComponentClass(){
    var self=this;
    this.weekdayOptions=["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    this.name="WeekDay Selector";
    this.icon="components/componentIcons/weekday.png";
    this.componentname="weekday";
    this.playableData={"top_text":"today is",
                       getCurrentInfo: function getCurrentInfo(){
                        return self.info.weekday;
                        },
                        setCurrentInfo: function setCurrentInfo(data){
                        self.info.weekday=data;
                        }};
}



weekdayComponentClass.prototype=new Component();
weekdayComponentClass.prototype.constructor = weekdayComponentClass;

weekdayComponentClass.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    
    self.info={"weekday":""};
    self.actions={"actions":""};
    self.config={"monday":true,"tuesday":true,"wednesday":true,"thursday":true,
                 "friday":true,"saturday":true,"sunday":true};
};

weekdayComponentClass.prototype.resetComponent=function resetComponent(){
    var self=this;
    self.info={"weekday":""};
}

weekdayComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    
    var li=$(document.createElement("li")).attr("id","weekdayComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).attr("actions", JSON.stringify(self.actions)).addClass("component");
    var weekdaystatus="";
    
    if (self.info.weekday==="") {
        weekdaystatus=$(document.createElement("div")).addClass("UndefinedDayText textfluid").html(i18n.gettext("undefined day"));
        $(li).append(weekdaystatus);
    } else {
        var weekdayicon=$(document.createElement("div")).addClass("iconWeekday").addClass(self.info.weekday);
        var weekdaystatuscontainer=$(document.createElement("div")).addClass("weekdaystatuscontainer");
        weekdaystatus=$(document.createElement("div")).addClass("iconWeekdayText textfluid").html(i18n.gettext(self.info.weekday)).attr("fontzoom", "1.7");
        $(weekdaystatuscontainer).append(weekdaystatus);
        $(li).append(weekdayicon).append(weekdaystatuscontainer);
        var PlayComponentButton=self.getPlayComponentButton();
        $(li).append(PlayComponentButton);
        
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
        
    var col_md=3;
    // And draw elements
    for (var weekday in self.config){
        if(self.config[weekday]){
            var weekdayText=i18n.gettext(weekday);
            var option=$(document.createElement("div")).addClass(weekday).addClass("weekdaySelectIcon").attr("weekday",weekday).addClass("col-md-"+col_md);
            var text=$(document.createElement("div")).html(weekdayText).addClass("weekdaySelectInfo");
            $(option).append(text);
            $(input).append(option);
        }
    }
    
    ret.input=$(input).prop("outerHTML");
        
    ret.bindEvents=function(parentDialog){
        $(".weekdaySelectIcon").on("click", function(){

            $(".weekdaySelectIcon").removeClass("weekdaySelected");
            $(this).addClass("weekdaySelected");
         
            // Perform a processDialog before show confirm
            var selected=$($(".weekdaySelected")[0]).attr("weekday");
            var oldselected=self.info.weekday;
            if (selected) self.info.weekday=selected;
            self.reDrawComponent();
            appGlobal.bindCompomentsEvents();
    
            // OLD self.showConfirmDay(oldselected); // Sending selected to restore if cancel
            self.showConfirmItem(oldselected); // Sending selected to restore if cancel
            
            });  
    };
    
    ret.processDialog=function(){
        var selected=$($(".weekdaySelected")[0]).attr("weekday");
        //alert(selected);
        if (selected) self.info.weekday=selected;
        self.reDrawComponent();
        appGlobal.bindCompomentsEvents(); // Rebind component events to allow click on Play after redrawing it
    };
        
    return ret;
        
    
}
/*
weekdayComponentClass.prototype.showConfirmDay=function showConfirmDay(oldSelected){
    var self=this;
    
    var playWindow=$(document.createElement("div")).addClass("playWindow").attr("id","confirmDayDialog");
    var item=$(document.createElement("div")).addClass("PlayableContentLite");    
    var toptext=$(document.createElement("div")).html(i18n.gettext(self.playableData.top_text)).css("text-align","center").css("top", "0px").attr("fontzoom", "1").addClass("textfluid").css("z-index","1001").css("position", "absolute");
    var icon=$(document.createElement("div")).addClass(self.info.weekday+" playBigIconLite");
    var bottomtext=$(document.createElement("div")).html(i18n.gettext(self.info.weekday)).css("text-align","center").css("bottom", "0px").attr("fontzoom", "1.2").addClass("textfluid").css("position", "absolute").css("z-index","1001");
    
    $(item).append(toptext, icon, bottomtext);
    
    $(playWindow).append(item);   
    
    var confirmSection=$(document.createElement("div")).addClass("ConfirSectionFingers");
    var thumbsup=$(document.createElement("div")).addClass("thumbs thumbsup  col-md-3 col-md-offset-2");
    var thumbsdown=$(document.createElement("div")).addClass("thumbs thumbsdown col-md-3 col-md-offset-2");
    $(confirmSection).append(thumbsup).append(thumbsdown);

    $(playWindow).append(confirmSection);
    
    
    $(thumbsup).on("click", function (){
        $("#confirmDayDialog").fadeOut(function(){
            $("#confirmDayDialog").remove();
        });
    });
    
    $(thumbsdown).on("click", function (){
        
        self.info.weekday=oldSelected;
        self.reDrawComponent();
        appGlobal.bindCompomentsEvents();
        $("#confirmDayDialog").fadeOut(function(){
            $("#confirmDayDialog").remove();
        });
    });
    
    
    
    $("body").append(playWindow);
    vex.closeAll();
    
    Utils.resizeFonts();
     $(playWindow).animate({
    opacity: 1});

};
*/

weekdayComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("weekday.component.options")};
    
    //var dataToSave=[];
    
    var input=$(document.createElement("div")).attr("id", "weekdayConfig");
    
    var defaultConfigBt=$(document.createElement("div")).addClass("configureComponentButtonDefault col-md-1").attr("title", i18n.gettext("click.set.actions.default")).attr("weekday", "default").attr("actions","");
    
    $(input).append(defaultConfigBt);
    
    for (var weekday in self.config){
        var configRow=$(document.createElement("div")).addClass("weekdayConfigRow").addClass("col-md-6 col-md-offset-3").attr("weekday_data", weekday);
        
        var configRowDay=$(document.createElement("div")).addClass("col-md-10").attr("weekday_data", weekday);
        
        if (self.config[weekday]) $(configRow).addClass("weekdayStatusActive");
        
        var weekdayText=i18n.gettext(weekday);
        
        var icon=$(document.createElement("div")).addClass(weekday).addClass("weekdayConfigIcon modifyable").attr("title", i18n.gettext("click.change.img"));
        
        var text=$(document.createElement("div")).html(weekdayText).addClass("weekdayConfigText");
                
        var iconConfigBt=$(document.createElement("div")).addClass("configureComponentButton col-md-1").attr("title", i18n.gettext("click.set.actions")).attr("weekday", weekday).attr("actions","");
        
        $(configRowDay).append(icon);
        $(configRowDay).append(text);
        $(configRow).append(configRowDay);
        $(configRow).append(iconConfigBt);
        
        $(input).append(configRow);
        
    }
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        $(".weekdayConfigRow").on("click", function(){
            
            if($(this).hasClass("weekdayStatusActive")) $(this).removeClass("weekdayStatusActive");
            else $(this).addClass("weekdayStatusActive");
        });
        
        $(".configureComponentButton, .configureComponentButtonDefault").on("click", function (event) {
            event.stopPropagation();
            event.preventDefault();
            //console.log($(event.target).parent().attr("weekday_data"));
            var weekday=$(event.target).attr("weekday");
                        
            console.log(self.actions[weekday]);
            //console.log(self.config[weekday]);
            if (self.hasOwnProperty("actions"))
                self.showConfigActions(weekday, function(data){
                    if(data){
                        console.log(data);
                        //dataToSave[weekday]=data;
                        self.saveActions(weekday, data);
                    }
                });
                
        });
        
        // Calling to parent class method to bind click event on icon for change its image
        self.bindClickForChangeImg("weekdayConfigIcon");
        
        
    };
    
    ret.processDialog=function(){
        
        // If object has no "actions" components and there are actions to save, let's create it
        
        //if (!self.hasOwnProperty("actions") && dataToSave.length>0) self.actions=null;
        //if (!self.hasOwnProperty("actions") && dataToSave.length>0) self.actions=null;
        
        for (var weekday in self.config){
            var item="."+weekday+".weekdayStatusActive";
            var found=$("#weekdayConfig").find("[weekday_data="+weekday+"].weekdayStatusActive");
            if (found.length>0) self.config[weekday]=true; else self.config[weekday]=false;
            
            
            /* Saving dataToSave to actions * /
            if (dataToSave.hasOwnProperty(weekday))
                {
                    var action_on_show, content_on_show, action_on_play, type_on_play, source_on_play;
                    
                    if (dataToSave[weekday]["Action.on.show"]==="speakOnShow") action_on_show="speech";
                    else if (dataToSave[weekday]["Action.on.show"]==="playOnShow") action_on_show="sound";
                    else action_on_show='none';
                    
                    content_on_show=dataToSave[weekday].speakOnShow_defaultText;
                    if (dataToSave[weekday]["Action.on.play"]==="VideoOnPlay")
                    {
                        action_on_play="video";
                        type_on_play="file";
                    } else if (dataToSave[weekday]["Action.on.play"]==="AudioOnPlay"){
                        action_on_play="video";
                        type_on_play="file";
                    } else if (dataToSave[weekday]["Action.on.play"]==="VideoOnlineOnPlay"){
                        action_on_play="video";
                        type_on_play="youtube";
                    } else {action_on_play=null; type_on_play=null;}
                    
                    if (typeof(dataToSave[weekday].VideoOnPlay_helperlabel_hidden)!=="undefined" &&
                        dataToSave[weekday].VideoOnPlay_helperlabel_hidden!=="")
                        source_on_play=dataToSave[weekday].VideoOnPlay_helperlabel_hidden;
                        
                    if ( typeof(dataToSave[weekday].AudioOnPlay_helperlabel_hidden)!=="undefined" &&
                        dataToSave[weekday].AudioOnPlay_helperlabel_hidden!=="")
                        source_on_play=dataToSave[weekday].AudioOnPlay_helperlabel_hidden;
                        
                    if ( typeof(dataToSave[weekday].VideoOnlineOnPlay_YoutubeURL)!=="undefined" &&
                        dataToSave[weekday].VideoOnlineOnPlay_YoutubeURL!=="")
                        source_on_play=dataToSave[weekday].VideoOnlineOnPlay_YoutubeURL.replace("https://www.youtube.com/watch?v=", "") || "";
                    
                                        
                    var acts={"onshow":
                                {
                                  "action":action_on_show,
                                  "content":content_on_show
                                },
                             "onplay":
                               {
                                  "action":action_on_play,
                                  "type":type_on_play,
                                  "source":source_on_play
                               }
                            };
                    
                
                //self.actions={"actions":""};
                //self.actions[weekday]=acts;
                console.log("************");
                self.actions[weekday]=acts;
                console.log(self.actions);
                //console.log(acts);
                }*/
            
            
            //console.log(dataToSave);
            
            
        }
        
        
        // Apply changes to data in widget
        $("#weekdayComponent").attr("config", JSON.stringify(self.config));
        if (self.hasOwnProperty("actions")) $("#weekdayComponent").attr("actions", JSON.stringify(self.actions));
        
    };
    
    return ret;
};

/*weekdayComponentClass.prototype.getPlayableContent=function getPlayableContent(){
    var self=this;
    
    
    return item;
};*/



weekdayComponentClass.prototype.getPlayableContentBackup=function getPlayableContentBackup(){
    
    /*
    es el getplayablecontent original de weekdayComponentClass,
    per si no funciona posar-ho en el component genèric...
    */
    
    var self=this;
    
    var item=$(document.createElement("div")).addClass("PlayableContent");
    
    var toptext=$(document.createElement("div")).html(i18n.gettext("today is")).css("text-align","center").css("top", "0px").attr("fontzoom", "1.2").addClass("textfluid").css("z-index","1001").css("position", "absolute");
    var icon=$(document.createElement("div")).addClass(self.info.weekday+" playBigIcon");
    var bottomtext=$(document.createElement("div")).html(i18n.gettext(self.info.weekday)).css("text-align","center").css("bottom", "0px").attr("fontzoom", "1.5").addClass("textfluid").css("position", "absolute").css("z-index","1001");
    
    try{
    
    var defaultonshow="";
    var defaultonshowcontent="";
    var defaultonplay="";
    var defaultonplaycontent="";
    var defaultonplaytype="";
    
    if(self.hasOwnProperty("actions")){
        console.log("Actions");
        console.log(self.actions);
        // actions is defined
        
        
        // Setting default on show behaviour
        if (self.actions.hasOwnProperty("default") && typeof(self.actions.default!="undefined"))
            {
                defaultonshow=self.actions.default.onshow.action;
                
                if(self.actions.default.onshow.action=="speech") {
                console.log("DEFAULT ACTION IS SPEECH...");
                // Is content defined?
                console.log("1111111111");
                if (self.actions.default.onshow.content!==undefined &&
                    self.actions.default.onshow.content!=="")
                        {console.log("22222222222222");
                            defaultonshowcontent=self.actions.default.onshow.content; }
                    else {
                        console.log("3333333333333333333");
                        defaultonshowcontent=i18n.gettext("today is")+" "+i18n.gettext(self.info.weekday);}
                } else { // action is not speech
                    console.log("44444444444");
                    defaultonshowcontent=self.actions.default.onshow.content;
                }
                
                // Setting default on play
                console.log("5555555555555");
                defaultonplay=self.actions.default.onplay.action;
                console.log(self.actions.default.onplay.action);
                console.log("555555555555--------");
                if(self.actions.default.onplay.action=="sound" ||
                 self.actions.default.onplay.action=="video") {
                    console.log("6666666666666666");
                    if (self.actions.default.onplay.source!==undefined &&
                        self.actions.default.onplay.source!=="")
                            {
                                console.log("777777777777");
                            defaultonplay=self.actions.default.onplay.action;
                            defaultonplaycontent=self.actions.default.onplay.source;
                            defaultonplaytype=self.actions.default.onplay.type;
                            }
                } 
        }
       
       
       
        /* Setting behaviour for component */
        
        // On Show
        
        console.log("kkkkkkkkkk");
        if (self.actions.hasOwnProperty(self.info.weekday)){
            
            console.log("$$$$$$$$$$$$$$$$$$$$$$");
            console.log(self.actions);
            
            if(typeof(self.actions[self.info.weekday].onshow.action)!=="undefined" &&
            (self.actions[self.info.weekday].onshow.action!=="default")) {
            // Si hi ha acció definida per al dia de la setmana
            
            if(self.actions[self.info.weekday].onshow.action=="speech") {
                // Is content defined?
                if (self.actions[self.info.weekday].onshow.content!==undefined &&
                    self.actions[self.info.weekday].onshow.content!=="")
                        {$(item).attr("tts", self.actions[self.info.weekday].onshow.content);}
                    else {$(item).attr("tts", i18n.gettext("today is")+" "+i18n.gettext(self.info.weekday));}
                } else { // action is not speech
                $(item).attr("audiofile",self.actions[self.info.weekday].onshow.content );
                }
            }} else{
                // No hi ha acció definida per al dia de la setmana, agafem els valor per defecte
                console.log("Setting up default actions for show...");
                if (defaultonshow=="speech")  {$(item).attr("tts", defaultonshowcontent);}
                else {$(item).attr("audiofile", defaultonshowcontent);}
            }
                    
     
        // On Play
             if (self.actions.hasOwnProperty(self.info.weekday)){
        if(self.actions[self.info.weekday].onplay.action=="sound" || self.actions[self.info.weekday].onplay.action=="video") {
            // Is content defined?
            if (self.actions[self.info.weekday].onplay.source!==undefined &&
                self.actions[self.info.weekday].onplay.source!=="")
                    {$(item).attr("playmediasource", self.actions[self.info.weekday].onplay.source);
                    $(item).attr("playmediaaction", self.actions[self.info.weekday].onplay.action);
                    $(item).attr("playmediatype", self.actions[self.info.weekday].onplay.type);
                    }
        }} else{
                // Action is default or is undefined
                console.log(defaultonplay);
                console.log(defaultonplaycontent);
                console.log(defaultonplaytype);
                if (defaultonplay!==""){
                    $(item).attr("playmediasource", defaultonplaycontent);
                    $(item).attr("playmediaaction", defaultonplay);
                    $(item).attr("playmediatype", defaultonplaytype); }
            }
     
     
    }
    
        
    } catch (err) {
        console.log("Exception reading actions for "+self.info.weekday);
        console.log(err);
        } // Nothing to do

    $(item).append(toptext, icon, bottomtext);
    //if (self.actionsonshow)
    
    return item;
};
