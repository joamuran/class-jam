
function weatherComponentClass(){
    var self=this;
    this.weatherOptions=["sunny", "partial_sunny", "partial_cloudy", "cloudy", "rainy","snow"];
    this.name="Weather Selector";
    this.icon="components/componentIcons/weather.png";
    this.componentname="weather";
    this.playableData={"top_text":"weather.component.today.is",
                       getCurrentInfo: function getCurrentInfo(){
                        return self.info.weather;
                        },
                        setCurrentInfo: function setCurrentInfo(data){
                        self.info.weather=data;
                        }};
    
}

weatherComponentClass.prototype=new Component();
weatherComponentClass.prototype.constructor = weatherComponentClass;

weatherComponentClass.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    
    self.info={"weather":""};
    self.actions={"actions":""};
    self.config={"sunny":true,"partial_sunny":true,"partial_cloudy":true,
                "cloudy":true,"rainy":true,"snow":false};
};

weatherComponentClass.prototype.resetComponent=function resetComponent(){
    var self=this;
    self.info={"weather":""};
};

weatherComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    /*data={weather:self.weather};*/
    var weathertext="";
    var li=$(document.createElement("li")).attr("id","weatherComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).attr("actions", JSON.stringify(self.actions)).addClass("component");
    //console.log(self.info);
    //alert(self.info.weather);
    if (self.info.weather==="") {
        weathertext=$(document.createElement("div")).addClass("iconWeatherText textfluid").html(i18n.gettext("undefined.weather"));
        $(li).append(weathertext);
    }
    else {
        weathertext=$(document.createElement("div")).addClass("iconWeatherText textfluid").html(i18n.gettext("weather.component.today.is"));
        var weathericon=$(document.createElement("div")).addClass("iconWeather").addClass(self.info.weather);
        //var weathericon=$(document.createElement("img")).addClass("iconWeather").attr("src", "css/images/components/weather/sunny.png");
        var weatherstatus=$(document.createElement("div")).addClass("iconWeatherText textfluid").html(i18n.gettext(self.info.weather));
        $(li).append(weathertext).append(weathericon).append(weatherstatus);
        
        var PlayComponentButton=self.getPlayComponentButton();
        $(li).append(PlayComponentButton);
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
            
            /*//alert("clicked on "+$(this).attr("weather"));
            $(".weatherSelectIcon").removeClass("weatherSelected");
            $(this).addClass("weatherSelected");*/
            
            $(".weatherSelectIcon").removeClass("weatherSelected");
            $(this).addClass("weatherSelected");
         
            // Perform a processDialog before show confirm
            var selected=$($(".weatherSelected")[0]).attr("weather");
            var oldselected=self.info.weather;
            if (selected) self.info.weather=selected;
            self.reDrawComponent();
            appGlobal.bindCompomentsEvents();
    
            self.showConfirmItem(oldselected); // Sending selected to restore if cancel
            
            
            });  
    };
    
    ret.processDialog=function(){
        var selected=$($(".weatherSelected")[0]).attr("weather");
        //alert(selected);
        if (selected) self.info.weather=selected;
        self.reDrawComponent();
        appGlobal.bindCompomentsEvents(); // Rebind component events to allow click on Play after redrawing it
    };
        
    return ret;
        
    
}



weatherComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("weather.component.options")};
    
    
    var input=$(document.createElement("div")).attr("id", "weatherConfig");
    
    var defaultConfigBt=$(document.createElement("div")).addClass("configureComponentButtonDefault col-md-1").attr("title", i18n.gettext("click.set.actions.default")).attr("weather", "default").attr("actions","");
    
    $(input).append(defaultConfigBt);
    
    //for (i in self.weatherOptions){
    for (var weather in self.config){
        var configRow=$(document.createElement("div")).addClass("weatherConfigRow").addClass("col-md-8 col-md-offset-2").attr("weather_data", weather);        
        var configRowWeather=$(document.createElement("div")).addClass("col-md-10").attr("weather_data", weather);        
        
        if (self.config[weather]) $(configRow).addClass("weatherStatusActive");
        
        var weatherText=i18n.gettext(weather);
        
        var icon=$(document.createElement("div")).addClass(weather).addClass("weatherConfigIcon modifyable").attr("title", i18n.gettext("click.change.img"));
        var text=$(document.createElement("div")).html(weatherText).addClass("weatherConfigText");
        
        var iconConfigBt=$(document.createElement("div")).addClass("configureComponentButton col-md-1").attr("title", i18n.gettext("click.set.actions")).attr("weather", weather).attr("actions","");
        
        $(configRowWeather).append(icon);
        $(configRowWeather).append(text);
        $(configRow).append(configRowWeather);
        $(configRow).append(iconConfigBt);
        
        $(input).append(configRow);
        
    }
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        $(".weatherConfigRow").on("click", function(){
            //alert("clicked on "+$(this).attr("weather"));
            if($(this).hasClass("weatherStatusActive")) $(this).removeClass("weatherStatusActive");
            else $(this).addClass("weatherStatusActive");
            });
        
        
        $(".configureComponentButton, .configureComponentButtonDefault").on("click", function (event) {
            event.stopPropagation();
            event.preventDefault();
            
            var weather=$(event.target).attr("weather");
                        
            //console.log(self.actions[weather]);
            
            if (!self.hasOwnProperty("actions")) console.log("NO ACTIONS DEFINED");
            console.log("ACTIONS::::::::");
            console.log(self.actions);
            
            if (self.hasOwnProperty("actions"))
                self.showConfigActions(weather, function(data){
                    if(data){
                        console.log(data);
                        //dataToSave[weekday]=data;
                        self.saveActions(weather, data);
                    }
                });
                
        });
        
        
        // Click to change image
        // Calling to parent class method to bind click event on icon for change its image
        self.bindClickForChangeImg("weatherConfigIcon");
        
        
    };
    
    ret.processDialog=function(){
        for (var weather in self.config){
            var item="."+weather+".weatherStatusActive";
            var found=$("#weatherConfig").find("[weather_data="+weather+"].weatherStatusActive");
            if (found.length>0) self.config[weather]=true; else self.config[weather]=false;
        }
        
        // Apply changes to data in widget
        $("#weatherComponent").attr("config", JSON.stringify(self.config));
        
        // Serialize actions to component
        if (self.hasOwnProperty("actions")) $("#weatherComponent").attr("actions", JSON.stringify(self.actions));
        
        
    };
    
        
    return ret;
};