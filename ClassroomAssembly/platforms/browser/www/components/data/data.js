function dataComponentClass(){
}

dataComponentClass.prototype=new Component();
dataComponentClass.prototype.constructor = dataComponentClass;

Component.prototype.setBaseConfig=function setBaseConfig(){
    // Class not used, no need to do it. If in future we will use an advanced data component, make here initial config.
    var self=this;
    self.info={};
    self.config={};
};

dataComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    
    var li=$(document.createElement("li")).attr("id","dataComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).addClass("component");
    
    // Minimal values for widget size
    $(li).attr("data-min-sizex","2").attr("data-min-sizey","1").attr("data-max-sizex","4").attr("data-max-sizey","3");
    
    if (self.info.weekDay==="" || typeof(self.info.weekDay)==="undefined"){
        $(li).html("data is undefined");
    } else {
        //$(li).html("Today is "+self.info.weekDay+" "+self.info.monthDay+" "+self.info.month+" "+self.info.year+" "+self.info.station);
        
        var calendarContainer=$(document.createElement("div")).addClass("calendarContainer col-md-12").attr("id", "calendarContainer");
        var dateContainer=$(document.createElement("div")).addClass("dateContainer col-md-6").attr("id", "dateContainer");
        var dateWeekDay=$(document.createElement("span")).addClass("dateWeekDay col-md-12 textfluid").attr("id", "dateWeekDay").html(i18n.gettext(self.info.weekDay)).attr("fontzoom", "2");
        var dateDayMonth=$(document.createElement("div")).addClass("dateDayMonth col-md-12 textfluid").attr("fontzoom", "4").attr("id", "dateDayMonth").html(self.info.monthDay);
        var dateMonth=$(document.createElement("div")).addClass("dateMonth col-md-12 textfluid").attr("id", "dateMonth").html(i18n.gettext(self.info.month)).attr("fontzoom", "2");
        var dateYear=$(document.createElement("div")).addClass("dateYear col-md-12 textfluid").attr("id", "dateYear").html(self.info.year).attr("fontzoom", "1.5");
        
        $(dateContainer).append(dateWeekDay, dateDayMonth, dateMonth, dateYear);
        
        // Setting up season
        var dateSeason=$(document.createElement("div")).addClass("dateSeason col-md-6").attr("id", "dateSeason");
        var seasonIcon=$(document.createElement("div")).addClass("iconSeason").addClass(self.info.season);
        var seasonText=$(document.createElement("div")).addClass("iconSeasonText textfluid").html(i18n.gettext(self.info.season));
        $(dateSeason).append(seasonIcon, seasonText);
        
        $(calendarContainer).append(dateContainer, dateSeason);
        $(li).append(calendarContainer);
        
    }
    
    return li;
};


dataComponentClass.prototype.getASDialog=function getASDialog(){
    var self=this;
    
    var daysweek_array=["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    var months_array=["january", "february", "march", "april", "may", "june", "july", "august", "september", "october","november","december"];
    var seasons_array=["spring", "summer", "autumn","winter"];
    var days_array=["1","1", "2", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
                        
    var ret={"message": i18n.gettext("data.component.title")};
 
    var input=$(document.createElement("div")).html("hola");
    //$(input).append(leftCol, centerCol, rightCol);

    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        
    };
    
    ret.processDialog=function(){
    
    };
        
    return ret;
        
    
}


