
function monthComponentClass(){
    this.monthOptions=["january", "february", "march", "april", "may", "june", "july", "august", "september", "october","november","december"];
    
    this.name="Month Selector";
    this.icon="components/componentIcons/month.png";
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
    self.config=baseConfig;
};

monthComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    var li=$(document.createElement("li")).attr("id","monthComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).addClass("component");
    
    if (self.info.month==="") $(div).html("month is undefined");
    else {
        //var monthtext=$(document.createElement("div")).addClass("iconMonthText textfluid").html(i18n.gettext("month.it.is"));
        var monthtext=$(document.createElement("div")).addClass("iconMonthText textfluid");
        var monthicon=$(document.createElement("div")).addClass("iconMonth").addClass(self.info.month);
        
        var monthstatus=$(document.createElement("div")).addClass("iconMonthText textfluid").html(i18n.gettext(self.info.month));
        $(li).append(monthtext).append(monthicon).append(monthstatus);
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
            });  
    };
    
    ret.processDialog=function(){
        var selected=$($(".monthSelected")[0]).attr("month");
        //alert(selected);
        self.info.month=selected;
        self.reDrawComponent();
    };
        
    return ret;
        
    
}



monthComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("month.component.options")};
    
    
    var input=$(document.createElement("div")).attr("id", "monthConfig");
    //for (i in self.monthOptions){
    for (var month in self.config){
        var configRow=$(document.createElement("div")).addClass("monthConfigRow").addClass("col-md-4 col-md-offset-4").attr("month_data", month);
        if (self.config[month]) $(configRow).addClass("monthStatusActive");
        
        var monthText=i18n.gettext(month);
        
        var icon=$(document.createElement("div")).addClass(month).addClass("monthConfigIcon");
        var text=$(document.createElement("div")).html(monthText).addClass("monthConfigText");
        /*var selected=$(document.createElement("input")).attr("type","checkbox");*/
        
        
        $(configRow).append(icon);
        $(configRow).append(text);
        /*$(configRow).append(selected);*/
        $(input).append(configRow);
        
    }
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        $(".monthConfigRow").on("click", function(){
            
            if($(this).hasClass("monthStatusActive")) $(this).removeClass("monthStatusActive");
            else $(this).addClass("monthStatusActive");
            });  
    };
    
    ret.processDialog=function(){
        for (var month in self.config){
            var item="."+month+".monthStatusActive";
            var found=$("#monthConfig").find("[month_data="+month+"].monthStatusActive");
            if (found.length>0) self.config[month]=true; else self.config[month]=false;
        }
        
        // Apply changes to data in widget
        $("#monthComponent").attr("config", JSON.stringify(self.config));
        
        
    };
    
        
    return ret;
};