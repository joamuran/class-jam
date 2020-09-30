
function monthComponentClass(){
    var self=this;
    this.monthOptions=["january", "february", "march", "april", "may", "june", "july", "august", "september", "october","november","december"];
    
    this.name="Month Selector";
    this.icon="components/componentIcons/month.png";
    this.componentname="month";
    
    this.playableData={"top_text":"month.it.is",
                       getCurrentInfo: function getCurrentInfo(){
                        return self.info.month;
                        },
                        setCurrentInfo: function setCurrentInfo(data){
                        self.info.month=data;
                        }};
}

monthComponentClass.prototype=new Component();
monthComponentClass.prototype.constructor = monthComponentClass;


monthComponentClass.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    
   var baseConfig={ "january":true,"february":true,"march":true,
                    "april":true,"may":true, "june":true,
                    "july":true,"august":true,"september":true,
                    "october":true,"november":true,"december":true};
                    
    // Get Current Month
    var currentMonth=new Date().getMonth();
    var monthCount=0;
    var currentMonthName="";
    
    
    
    for (i in baseConfig){
        if (monthCount===currentMonth) {
            currentMonthName=i;
            break;
        }
        monthCount++;
    }
   
    // Setting data
    
    self.info={"month":currentMonthName};
    self.actions={"actions":""};
    self.config=baseConfig;
};

monthComponentClass.prototype.resetComponent=function resetComponent(){
    var self=this;
    self.info={"month":""};
};

monthComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    var li=$(document.createElement("li")).attr("id","monthComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).attr("actions", JSON.stringify(self.actions)).addClass("component");
    
    if (self.info.month==="") {
        monthtext=$(document.createElement("div")).addClass("iconMonthText textfluid").html(i18n.gettext("month.component.title"));
        $(li).append(monthtext);
    }
    else {
        //var monthtext=$(document.createElement("div")).addClass("iconMonthText textfluid").html(i18n.gettext("month.it.is"));
        var monthtext=$(document.createElement("div")).addClass("iconMonthText textfluid");
        var monthicon=$(document.createElement("div")).addClass("iconMonth").addClass(self.info.month);
        
        var monthstatus=$(document.createElement("div")).addClass("iconMonthText textfluid").html(i18n.gettext(self.info.month));
        $(li).append(monthtext).append(monthicon).append(monthstatus);
        
        var PlayComponentButton=self.getPlayComponentButton();
        $(li).append(PlayComponentButton);
        
    }
    
    return li;
};

monthComponentClass.prototype.reDrawComponent=function reDrawComponent(){
    var self=this;
    
    var item=$("#monthComponent");
    
    $(item).attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config));
    $(item).empty();
    var monthicon=self.drawComponent();
    
    // we have to add resizer because we have removed it
    var spanResizer=$(document.createElement("span")).addClass("gs-resize-handle").addClass("gs-resize-handle-both");
    $(item).append($(monthicon).html()).append(spanResizer);
    
}


monthComponentClass.prototype.getASDialog=function getASDialog(){
    var self=this;
    var ret={"message": i18n.gettext("month.component.title")};
    
    var input=$(document.createElement("div")).attr("id", "monthSelector");
    
    // First, let's count hom many elements are actived
    var active_items=0;
    for (var month in self.config)
        if (self.config[month]) active_items++;
    //var col_md=Math.floor(12/(active_items));
    var col_md=3;
    
    // And draw elements
    for (var month in self.config){
        var monthText=i18n.gettext(month);
        var option=$(document.createElement("div")).addClass(month).addClass("monthSelectIcon").attr("month",month).addClass("col-md-"+col_md);
        var text=$(document.createElement("div")).html(monthText).addClass("monthSelectInfo");
        $(option).append(text);
        $(input).append(option);
    }
    
    ret.input=$(input).prop("outerHTML");
    
    //console.log(ret.input);
    
    ret.bindEvents=function(){
        $(".monthSelectIcon").on("click", function(){

            $(".monthSelectIcon").removeClass("monthSelected");
            $(this).addClass("monthSelected");
            
            // Perform a processDialog before show confirm
            var selected=$($(".monthSelected")[0]).attr("month");
            var oldselected=self.info.month;
            if (selected) self.info.month=selected;
            self.reDrawComponent();
            appGlobal.bindCompomentsEvents();
    
            self.showConfirmItem(oldselected); // Sending selected to restore if cancel
            
            
            
            });  
    };
    
    ret.processDialog=function(){
        var selected=$($(".monthSelected")[0]).attr("month");
        //alert(selected);
        if (selected) self.info.month=selected;
        self.reDrawComponent();
        appGlobal.bindCompomentsEvents(); // Rebind component events to allow click on Play after redrawing it
    };
        
    return ret;
        
    
}



monthComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("month.component.options")};
    
    
    var input=$(document.createElement("div")).attr("id", "monthConfig");
    
    var defaultConfigBt=$(document.createElement("div")).addClass("configureComponentButtonDefault col-md-1").attr("title", i18n.gettext("click.set.actions.default")).attr("month", "default").attr("actions","");
    
    $(input).append(defaultConfigBt);
    
    //for (i in self.monthOptions){
    for (var month in self.config){
        var configRow=$(document.createElement("div")).addClass("monthConfigRow").addClass("col-md-4 col-md-offset-4").attr("month_data", month);
        
        var configRowMonth=$(document.createElement("div")).addClass("col-md-10").attr("month_data", month);
        
        if (self.config[month]) $(configRow).addClass("monthStatusActive");
        
        var monthText=i18n.gettext(month);
        
        var icon=$(document.createElement("div")).addClass(month).addClass("monthConfigIcon modifyable").attr("title", i18n.gettext("click.change.img"));
        var text=$(document.createElement("div")).html(monthText).addClass("monthConfigText");
        
        var iconConfigBt=$(document.createElement("div")).addClass("configureComponentButton col-md-1").attr("title", i18n.gettext("click.set.actions")).attr("month", month).attr("actions","");
        
        $(configRowMonth).append(icon);
        $(configRowMonth).append(text);
        $(configRow).append(configRowMonth);
        $(configRow).append(iconConfigBt);
        
        $(input).append(configRow);
        
        /*
        
        WIP
        
        Queda associar el clic al botó de configuració
        
        i modificar els css...
        
        
        */
        
        
        
        
    }
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        $(".monthConfigRow").on("click", function(){
            
            if($(this).hasClass("monthStatusActive")) $(this).removeClass("monthStatusActive");
            else $(this).addClass("monthStatusActive");
            });
        

    $(".configureComponentButton, .configureComponentButtonDefault").on("click", function (event) {
            event.stopPropagation();
            event.preventDefault();
            
            var month=$(event.target).attr("month");
                        
            //console.log(self.actions[month]);
            //console.log(self.config[weekday]);
            if (self.hasOwnProperty("actions"))
                self.showConfigActions(month, function(data){
                    if(data){
                        console.log(data);
                        //dataToSave[weekday]=data;
                        self.saveActions(month, data);
                    }
                });
                
        });
        
        // Click to change image
        // Calling to parent class method to bind click event on icon for change its image
        self.bindClickForChangeImg("monthConfigIcon");
        
    };
    
    ret.processDialog=function(){
        for (var month in self.config){
            var item="."+month+".monthStatusActive";
            var found=$("#monthConfig").find("[month_data="+month+"].monthStatusActive");
            if (found.length>0) self.config[month]=true; else self.config[month]=false;
        }
        
        // Apply changes to data in widget
        $("#monthComponent").attr("config", JSON.stringify(self.config));
        
        // Serialize actions to component
        if (self.hasOwnProperty("actions")) $("#monthComponent").attr("actions", JSON.stringify(self.actions));
        
        
    };
    
        
    return ret;
};