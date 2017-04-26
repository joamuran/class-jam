
function weatherComponentClass(){
    this.weatherOptions=["sunny", "partial_sunny", "partial_cloudy", "cloudy", "rainy","snow"];
    this.name="Weather Selector";
    this.icon="components/componentIcons/weather.png";
    
}

weatherComponentClass.prototype=new Component();
weatherComponentClass.prototype.constructor = weatherComponentClass;

weatherComponentClass.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    
    self.info={"weather":"sunny"};
    self.config={"sunny":true,"partial_sunny":true,"partial_cloudy":true,
                "cloudy":true,"rainy":true,"snow":false};
};

weatherComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    /*data={weather:self.weather};*/
    var li=$(document.createElement("li")).attr("id","weatherComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).addClass("component");
    
    if (self.info.weather==="") $(div).html("weather is undefined");
    else {
        var weathertext=$(document.createElement("div")).addClass("iconWeatherText textfluid").html(i18n.gettext("weather.component.today.is"));
        var weathericon=$(document.createElement("div")).addClass("iconWeather").addClass(self.info.weather);
        //var weathericon=$(document.createElement("img")).addClass("iconWeather").attr("src", "css/images/components/weather/sunny.png");
        var weatherstatus=$(document.createElement("div")).addClass("iconWeatherText textfluid").html(i18n.gettext(self.info.weather));
        $(li).append(weathertext).append(weathericon).append(weatherstatus);
    }
    
    return li;
};

weatherComponentClass.prototype.reDrawComponent=function reDrawComponent(){
    var self=this;
    
    var item=$("#weatherComponent");
    
    $(item).attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config));
    //$(item).find("div").remove();
    $(item).empty();
    //var weathericon=$(document.createElement("div")).addClass("iconWeather").addClass(self.info.weather);
    var weathericon=self.drawComponent();
    
    // we have to add resizer because we have removed it
    var spanResizer=$(document.createElement("span")).addClass("gs-resize-handle").addClass("gs-resize-handle-both");
    $(item).append($(weathericon).html()).append(spanResizer);
    
}


weatherComponentClass.prototype.getASDialog=function getASDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("weather.component.title")};
    
    var input=$(document.createElement("div")).attr("id", "weatherSelector");
    //for (i in self.weatherOptions){
    
    // First, let's count hom many elements are actived
    var active_items=0;
    for (var weather in self.config)
        if (self.config[weather]) active_items++;
    var col_md=Math.floor(12/(active_items));
    
    // And draw elements
    for (var weather in self.config){
        //var weather=self.weatherOptions[i];
        if (!self.config[weather]) continue; // if item in config is false, continue to next
        var weatherText=i18n.gettext(weather);
        var option=$(document.createElement("div")).addClass(weather).addClass("weatherSelectIcon").attr("weather",weather).addClass("col-md-"+col_md);
        var text=$(document.createElement("div")).html(weatherText).addClass("weatherSelectInfo");
        $(option).append(text);
        $(input).append(option);
    }
    
    ret.input=$(input).prop("outerHTML");
    
    //console.log(ret.input);
    
    ret.bindEvents=function(){
        $(".weatherSelectIcon").on("click", function(){
            //alert("clicked on "+$(this).attr("weather"));
            $(".weatherSelectIcon").removeClass("weatherSelected");
            $(this).addClass("weatherSelected");
            });  
    };
    
    ret.processDialog=function(){
        var selected=$($(".weatherSelected")[0]).attr("weather");
        //alert(selected);
        self.info.weather=selected;
        self.reDrawComponent();
    };
        
    return ret;
        
    
}



weatherComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("weather.component.options")};
    
    
    var input=$(document.createElement("div")).attr("id", "weatherConfig");
    //for (i in self.weatherOptions){
    for (var weather in self.config){
        var configRow=$(document.createElement("div")).addClass("weatherConfigRow").addClass("col-md-4 col-md-offset-4").attr("weather_data", weather);
        if (self.config[weather]) $(configRow).addClass("weatherStatusActive");
        //var weather=self.weatherOptions[i];
        var weatherText=i18n.gettext(weather);
        
        var icon=$(document.createElement("div")).addClass(weather).addClass("weatherConfigIcon");
        var text=$(document.createElement("div")).html(weatherText).addClass("weatherConfigText");
        /*var selected=$(document.createElement("input")).attr("type","checkbox");*/
        
        // WIP HERE::::: a vore com posem el checkbox, i preparar els callbacks per a la configuració i tal...
        
        $(configRow).append(icon);
        $(configRow).append(text);
        /*$(configRow).append(selected);*/
        $(input).append(configRow);
        
    }
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        $(".weatherConfigRow").on("click", function(){
            //alert("clicked on "+$(this).attr("weather"));
            if($(this).hasClass("weatherStatusActive")) $(this).removeClass("weatherStatusActive");
            else $(this).addClass("weatherStatusActive");
            });  
    };
    
    ret.processDialog=function(){
        for (var weather in self.config){
            var item="."+weather+".weatherStatusActive";
            var found=$("#weatherConfig").find("[weather_data="+weather+"].weatherStatusActive");
            if (found.length>0) self.config[weather]=true; else self.config[weather]=false;
        }
        
        // Apply changes to data in widget
        $("#weatherComponent").attr("config", JSON.stringify(self.config));
        
        
    };
    
        
    return ret;
};