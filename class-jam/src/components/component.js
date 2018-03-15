
function Component(){
    this.info={};
    this.config={};
    this.actions={};
    this.visible="true";
    this.configDir="";
    this.name="Generic Component";
    this.icon="css/images/asmode.png";
    this.layout="";
}

Component.prototype.init=function init(data, config, configDir, visibility, actions, layout){
    var self=this;
    self.info=data;
    self.config=config;
    self.configDir=configDir;
    self.visible=visibility;
    self.actions=actions;
    if (layout!=="") self.layout=layout; // else, gets default values
};

Component.prototype.resetComponent=function resetComponent(){
    var self=this;
    self.info={};
};

Component.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    self.info={};
    self.config={};
    self.visible=false;
};

Component.prototype.getComponentControlIcon=function getComponentControlIcon(id){
    var self=this;
    //return {"name":this.name, "icon":this.icon, "visible":this.visible, "id":id+"Configurator"};
        
    var retdiv=$(document.createElement("div")).attr("id", id+"ConfContainer").addClass("componentVisibilitySelector").attr("target", id);
    var iconDiv=$(document.createElement("div")).attr("id", id+"Icon").addClass("componentVisibilitySelectorIcon");
    var textDiv=$(document.createElement("div")).html(i18n.gettext(self.name)).addClass("componentVisibilitySelectorText");
    
    if (self.visible===false) $(retdiv).css("opacity", "0.3");
    $(iconDiv).css("background-image", "url("+self.icon+")");
    $(retdiv).append(iconDiv, textDiv);
    
    return $(retdiv);
    
};


Component.prototype.getASDialog=function getASDialog(){
    return {"message":"error in dialog",
            "input":"Function not implemented yet"};
};


Component.prototype.showConfirmItem=function showConfirmItem(oldSelected){
    var self=this;
    
    var currentValue=self.playableData.getCurrentInfo();
    
    var playWindow=$(document.createElement("div")).addClass("playWindow").attr("id","confirmDayDialog");
    var item=$(document.createElement("div")).addClass("PlayableContentLite");    
    var toptext=$(document.createElement("div")).html(i18n.gettext(self.playableData.top_text)).css("text-align","center").css("top", "0px").attr("fontzoom", "1").addClass("textfluid").css("z-index","1001").css("position", "absolute");
    var icon=$(document.createElement("div")).addClass(currentValue+" playBigIconLite");
    var bottomtext=$(document.createElement("div")).html(i18n.gettext(currentValue)).css("text-align","center").css("bottom", "0px").attr("fontzoom", "1.2").addClass("textfluid").css("position", "absolute").css("z-index","1001");
    
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
        
        self.playableData.setCurrentInfo(oldSelected);
        
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




Component.prototype.getConfigDialog=function getConfigDialog(){
    return {"message":"error in Config Dialog",
            "input":"Function not implemented yet"};
};

Component.prototype.cleanImage=function cleanImage(itemclicked, componentname){
    var self=this;
    
    try{
        var fs=require("fs");
        var css=require("css");
        var selector="."+itemclicked;
        
        
        // Getting path for custom library
        //console.log("self.configDir:"+self.configDir);
        
        var customConfigDir=self.configDir+"/.customCSS";
        var mycssfile=customConfigDir+"/"+componentname+".css";
        
        // Check if there is custom CSS file
        var content="";
        if (fs.existsSync(mycssfile)){ // Read css file
            content=(fs.readFileSync(mycssfile)).toString();
        }
        var ast = css.parse(content);
            
        // Creating a new array to delete this selector
        var newArray=[];
        var selectorhover="."+componentname+"SelectIcon"+selector+":hover";
        
        for (index in ast.stylesheet.rules){
            var sel=ast.stylesheet.rules[index].selectors[0];
            if (sel!=selector && sel!=selectorhover ) newArray.push(ast.stylesheet.rules[index]);
        }
        ast.stylesheet.rules=newArray;
           
        // css object to string
        var res=css.stringify(ast);
        
        // Store new array to file               
        fs.writeFileSync(mycssfile, res);
        
        // Apply new styles with a reload of them
        appGlobal.setCustomCSS();
                
    } catch (err){
            console.log(err);
    }
    
}


Component.prototype.changeImage=function changeImage(itemclicked, componentname){
    var self=this;
        
        
    var fileselector=$(document.createElement("input")).attr("id", "fileSelector").attr("type", "file").css("display", "none");
    $("body").append(fileselector);
    
    $(fileselector).on("change", function(){
            var newImage=this.value;
            try{
                    var fs=require("fs");
                    var css=require("css");
                    var selector="."+itemclicked;
                    
                    // get file Name extension
                    var patharray=newImage.split("/");
                    var filename=patharray[patharray.length-1];
                    var filearray=newImage.split(".");
                    var extension=filearray[filearray.length-1];
                    filename=itemclicked+"."+extension;
                    
                    // Getting path for custom library
                    //console.log("self.configDir:"+self.configDir);
                    //var customConfigDir=self.configDir+"/.customCSS/img/"+filename;
                    
                    var customConfigDir=self.configDir+"/.customCSS";
                    
                    // Create .customCSS dir if does not exists
                    if (!fs.existsSync(customConfigDir)){
                        fs.mkdirSync(customConfigDir);
                        fs.mkdirSync(customConfigDir+"/img");
                    }
                    
                    //console.log("customConfigDir:"+customConfigDir);

                    // Copy file to custom library
                    fs.createReadStream(newImage).pipe(fs.createWriteStream(customConfigDir+"/img/"+filename));                    
                    
                    var mycssfile=customConfigDir+"/"+componentname+".css";
                    
                    // Check if there is custom CSS file
                    var content="";
                    if (fs.existsSync(mycssfile)){ // Read css file
                        content=(fs.readFileSync(mycssfile)).toString();
                    }
                    var ast = css.parse(content);
                        
                    // Creating a new array to delete duplicates for this selector
                    var newArray=[];
                    var selectorhover="."+componentname+"SelectIcon"+selector+":hover";
                    
                    for (index in ast.stylesheet.rules){
                        var sel=ast.stylesheet.rules[index].selectors[0];
                        if (sel!=selector && sel!=selectorhover ) newArray.push(ast.stylesheet.rules[index]);
                    }
                    ast.stylesheet.rules=newArray;
                    
                         
                    // Creating new objects
                    
                    // 1) for selector
                    var item=new Object();
                    item.type="rule";
                    item.selectors=[selector];
                    item.declarations=[{type:"declaration", property:"background-image", value:"url(img/"+filename+"?v="+(new Date).getTime()+")"}];
                    ast.stylesheet.rules.push(item);
                    
                    // 2) for selector with hover
                    var item=new Object();
                    item.type="rule";
                    item.selectors=[selectorhover];
                    item.declarations=[{type:"declaration", property:"background-image", value:"url(img/"+filename+"?v="+(new Date).getTime()+"), linear-gradient( 0deg, white, white 20%, rgba(255,255,255,0.5));"}];
                    ast.stylesheet.rules.push(item);
                    
                    //3) css object to string
                    var res=css.stringify(ast);
                    
                    // Store new array to file               
                    fs.writeFileSync(mycssfile, res);
                    
                    //$(selector).hide();
                    
                    // Apply new styles with a reload of them
                    appGlobal.setCustomCSS();
                    
                    /* // 1) Remove previous link
                    var link=$("link[title='"+componentname+"']");
                    $(link).remove();
                    // 2) Create new link
                    var style=$(document.createElement("link")).attr("rel", "stylesheet").attr("type",  "text/css").attr("title", componentname);
                    $(style).attr("href", "file://"+mycssfile);
                    $('head').append(style);*/
                    
            } catch (err){
                    console.log(err);
            }
    });
    $(fileselector).click();

}


Component.prototype.bindClickForChangeImg=function bindClickForChangeImg(configIconClass){
    var self=this;
    $("."+configIconClass).on("click", function(event){
            event.stopPropagation();
            
            // Get item clicked
            var item=$($(event)[0].target).attr("class").replace("modifyable","").replace(configIconClass,"").split(" ").join("");
            
            var menu = new nw.Menu();
            menu.append(new nw.MenuItem({
                label: i18n.gettext('add.new.image'),
                click: function(){
                    self.changeImage(item, self.componentname);
                }
            }));
            
            menu.append(new nw.MenuItem({
                label: i18n.gettext('back.to.default.image'),
                click: function(){
                    self.cleanImage(item, self.componentname);
                }
                }));
            menu.popup(event.clientX, event.clientY);

    });

}

Component.prototype.getPlayComponentButton=function getPlayComponentButton(){
    var item=$(document.createElement("span")).addClass("PlayComponentButton");
    return item;   
}

Component.prototype.getPlayableContent=function getPlayableContent(){
    var self=this;
    
    var item=$(document.createElement("div")).addClass("PlayableContent");
    
    var currentValue=self.playableData.getCurrentInfo();
    
    var toptext=$(document.createElement("div")).html(i18n.gettext(self.playableData.top_text)).css("text-align","center").css("top", "0px").attr("fontzoom", "1.2").addClass("textfluid").css("z-index","1001").css("position", "absolute");
    var icon=$(document.createElement("div")).addClass(currentValue+" playBigIcon");
    var bottomtext=$(document.createElement("div")).html(i18n.gettext(currentValue)).css("text-align","center").css("bottom", "0px").attr("fontzoom", "1.5").addClass("textfluid").css("position", "absolute").css("z-index","1001");
    
    try{
    
    var defaultonshow="";
    var defaultonshowcontent="";
    var defaultonplay="";
    var defaultonplaycontent="";
    var defaultonplaytype="";
    
    if(self.hasOwnProperty("actions")){
        //console.log("Actions");
        //console.log(self.actions);
        // actions is defined
        
        
        // Setting default on show behaviour
        if (self.actions.hasOwnProperty("default") && typeof(self.actions.default!="undefined"))
            {
                defaultonshow=self.actions.default.onshow.action;
                
                if(self.actions.default.onshow.action=="speech") {
                //console.log("DEFAULT ACTION IS SPEECH...");
                // Is content defined?
                if (self.actions.default.onshow.content!==undefined &&
                    self.actions.default.onshow.content!=="")
                        {
                            defaultonshowcontent=self.actions.default.onshow.content; }
                    else {
                        defaultonshowcontent=i18n.gettext(self.playableData.top_text)+" "+i18n.gettext(currentValue);}
                } else { // action is not speech
                    defaultonshowcontent=self.actions.default.onshow.content;
                }
                
                // Setting default on play
                defaultonplay=self.actions.default.onplay.action;
                console.log(self.actions.default.onplay.action);
                if(self.actions.default.onplay.action=="sound" ||
                 self.actions.default.onplay.action=="video") {
                    if (self.actions.default.onplay.source!==undefined &&
                        self.actions.default.onplay.source!=="")
                            {
                            defaultonplay=self.actions.default.onplay.action;
                            defaultonplaycontent=self.actions.default.onplay.source;
                            defaultonplaytype=self.actions.default.onplay.type;
                            }
                } 
        }
       
       
       
        /* Setting behaviour for component */
        
        // On Show
        
        if (self.actions.hasOwnProperty(currentValue)){
            
            console.log(self.actions);
            
            if(typeof(self.actions[currentValue].onshow.action)!=="undefined" &&
            (self.actions[currentValue].onshow.action!=="default")) {
            // Si hi ha acció definida per al dia de la setmana
            
            if(self.actions[currentValue].onshow.action=="speech") {
                // Is content defined?
                if (self.actions[currentValue].onshow.content!==undefined &&
                    self.actions[currentValue].onshow.content!=="")
                        {$(item).attr("tts", self.actions[currentValue].onshow.content);}
                    else {$(item).attr("tts", i18n.gettext("today is")+" "+i18n.gettext(currentValue));}
                } else { // action is not speech
                $(item).attr("audiofile",self.actions[currentValue].onshow.content );
                }
            }} else{
                // No hi ha acció definida per al dia de la setmana, agafem els valor per defecte
                console.log("Setting up default actions for show...");
                if (defaultonshow=="speech")  {$(item).attr("tts", defaultonshowcontent);}
                else {$(item).attr("audiofile", defaultonshowcontent);}
            }
                    
     
        // On Play
             if (self.actions.hasOwnProperty(currentValue)){
        if(self.actions[currentValue].onplay.action=="sound" || self.actions[currentValue].onplay.action=="video") {
            // Is content defined?
            if (self.actions[currentValue].onplay.source!==undefined &&
                self.actions[currentValue].onplay.source!=="")
                    {$(item).attr("playmediasource", self.actions[currentValue].onplay.source);
                    $(item).attr("playmediaaction", self.actions[currentValue].onplay.action);
                    $(item).attr("playmediatype", self.actions[currentValue].onplay.type);
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
        console.log("Exception reading actions for "+currentValue);
        console.log(err);
        } // Nothing to do

    $(item).append(toptext, icon, bottomtext);
    //if (self.actionsonshow)
    
    return item;
    

};


Component.prototype.getPlayableContentOriginal=function getPlayableContentOriginal(){
    /*
    A restaurar si no funciona el getPlayableContent en genèric.
    Si funciona tot bé, esta funció s'ha d'eliminar
    */
    var item=$(document.createElement("div")).addClass("PlayableContent").html("Component has no playable info");
    return item;
};


Component.prototype.showConfigActions=function showConfigActions(ConfigItem, cb){
        var self=this;
        
        var formOnShow, formOnPlay;
        var input="";
        var speechcontent="";
        var onplaycontent="";
        var playfileaudio="";
        var playfilevideo="";
        var playurlvideo="";
        var r6status, r7status;
        var r1status,r2status,r3status,r4status,r5status;
        r1status=r2status=r3status=r4status=r5status=false;
        r6status=r7status=true;   
        
        try {
            if (self.hasOwnProperty("actions")) {
                if (self.actions[ConfigItem].onshow.action=="speech") {
                    speechcontent=self.actions[ConfigItem].onshow.content;
                    r1status=true; r7status=false;
                }
                if (self.actions[ConfigItem].onshow.action=="sound") {
                    onplaycontent=self.actions[ConfigItem].onshow.content;
                    r2status=true; r7status=false;
                    }
                
                if (self.actions[ConfigItem].onplay.action=="sound") {
                    playfileaudio=self.actions[ConfigItem].onplay.source;
                    r3status=true; r6status=false;
                }
                
                
                if (self.actions[ConfigItem].onplay.action=="video" &&
                    self.actions[ConfigItem].onplay.type=="file") {
                    playfilevideo=self.actions[ConfigItem].onplay.source;
                    r4status=true; r6status=false;
                }
                
                if (self.actions[ConfigItem].onplay.action=="video" &&
                    self.actions[ConfigItem].onplay.type=="youtube") {
                    playurlvideo=self.actions[ConfigItem].onplay.source;
                    r5status=true;  r6status=false;
                }
            }
            } catch(e){console.log("Exception "+e+". continue executing");}

        
        formOnShow=self.createFormRadios({
            "name": i18n.gettext("Action.on.show"),
            "id":"Action.on.show",
            "radios":{
                "r7":{
                    "id": "NoneOnShow",
                    "status":r7status,
                    "label": i18n.gettext("NoAction")
                    },
                "r1":{
                    "id": "speakOnShow",
                    "status":r1status,
                    "type": "text",
                    "label": i18n.gettext("Speech a phrase"),
                    "helperlabel":speechcontent
                    },
                "r2":{
                    "id": "playOnShow",
                    "status":r2status,
                    "type": "file",
                    "label": i18n.gettext("Play an audio file"),
                    "helperlabel":onplaycontent // o el fitxer que siga...
                    }
                }
            });
        
         formOnPlay=self.createFormRadios({
            "name": i18n.gettext("Action.on.play"),
            "id":"Action.on.play",
            "radios":{
                "r4":{
                    "id": "NoneOnPlay",
                    "status":r6status,
                    "label": i18n.gettext("NoAction")
                    },
                "r1":{
                    "id": "AudioOnPlay",
                    "status":r3status,
                    "type": "file",
                    "label": i18n.gettext("Play an audio file"),
                    "helperlabel":playfileaudio
                    },
                "r2":{
                    "id": "VideoOnPlay",
                    "status":r4status,
                    "type": "file",
                    "label": i18n.gettext("Play a video file"),
                    "helperlabel":playfilevideo // o el fitxer que siga...
                    },
                "r3":{
                    "id": "VideoOnlineOnPlay",
                    "status":r5status,
                    "type": "url",
                    "label": i18n.gettext("Play video from Youtube"),
                    "helperlabel":playurlvideo // o el fitxer que siga...
                    }
                }
            });
        
              
        input=input+formOnShow.prop("outerHTML")+formOnPlay.prop("outerHTML");
        
        vex.dialog.open({
            message: i18n.gettext(ConfigItem),
            input: input,
            showCloseButton: true,
            escapeButtonCloses: true,
            
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, {
                    click: function () {
                    this.validate_form=true;
                    return false;
                    }
                    }),     // For Yes
                $.extend({}, vex.dialog.buttons.NO, {
                    click: function () {
                    this.validate_form=false;
                    vex.closeTop();
                    }
                    })
                ],    // For NO
            
            afterOpen:function(){
                this.validate_form=false;
                },
            beforeClose: function(data){
                // Cleaning previous errors
                $(".text_error").removeClass("text_error");
                
                console.log("validate form is..."+this.validate_form);
                if (!this.validate_form) return true;
                
                var errors_on_form=false;
                
                // Checking On Show Event
                if ($("#speakOnShow")[0].checked){
                    // If speak on show, check text to speech is not null
                    if ($("[name='speakOnShow_defaultText']").val()==="") {
                        $("[name='speakOnShow_defaultText']").addClass("text_error");
                        errors_on_form=true;
                    }
                } else if ($("#playOnShow")[0].checked){
                    // If play on show, check file is selected
                    if ($("#playOnShow_helperlabel_hidden").val()==="") {
                        $("#playOnShow_file").addClass("text_error");
                        errors_on_form=true;
                    }
                }  // Otherwise, NoneOnShow is not selected
                
                // Checking On Play Event
                if ($("#AudioOnPlay")[0].checked){
                    // If play on show, check file is selected
                    if ($("#AudioOnPlay_helperlabel_hidden").val()==="") {
                        $("#AudioOnPlay_file").addClass("text_error");
                        errors_on_form=true;
                    }
                } else if ($("#VideoOnPlay")[0].checked){
                    // If play on show, check file is selected
                    if ($("#VideoOnPlay_helperlabel_hidden").val()==="") {
                        $("#VideoOnPlay_file").addClass("text_error");
                        errors_on_form=true;
                    }
                } else if ($("#VideoOnlineOnPlay")[0].checked){
                    // If play on show, check file is selected
                    if ($("#VideoOnlineOnPlay_YoutubeURL").val()==="") {
                        $("#VideoOnlineOnPlay_YoutubeURL").addClass("text_error");
                        errors_on_form=true;
                    }
                }
                
                // Otherwise, NoneOnShow is not selected
                
                // Submit dialog if form is valid
                
                if (!errors_on_form) return true;
                else return false;
                //if (!errors_on_form) this.close("pajarito");     
                     
            },
            overlayClosesOnClick: false,
            callback: function(data){
                console.log("Submiting form; DATA:");
                console.log(this);
                console.log(data);
                cb(data); // Call to callback function to save data
            }
        });
        
        /* Binding Events */
        
        /**************************/
        // Fix VEX dialog Settings for set less margin top (a little hack)
        
        // Buscar aci que amb el overlayClassName i el classname, etc. potser
        // es puga assignar una classe.... i fer les modificacions sobre esta.
        // http://github.hubspot.com/vex/api/advanced/
        
        var vexDialogs=$(".vex-content");
        $(vexDialogs[1]).css("margin-top", "-70px");
        /*************************/
        
        
        // Clic on previeu audio button
        $(".previewPlayButton").on("click", function(ev){
            var audiodata=$(ev.target).attr("audiodata");
            if ($(ev.target).prev().val()!=="") audiodata=($(ev.target).prev().val());
            
            if (appGlobal.player===null) 
            {
                if (audiodata!=="") appGlobal.playAudio(audiodata);
            } else{ // appGlobal.player!==null
                appGlobal.player.kill();
                appGlobal.player=null;
                $("#audioStartStop").removeClass("pulsatingaudio");
            }
            
        });
                
        $(".recordButton").on("click", function(ev){
            // Getting first filename available
            var filepathname=appGlobal.getAudioFilename();
            var filename=filepathname.split("/")[filepathname.split("/").length-1];

            var id=($(ev.target).attr("id"));
            
            Utils.recordAudio(filepathname, function(data){
                console.log(data);
                if (data) {
                
                    if (id==="playOnShowrecordButton") {                    
                        $("[name=playOnShow_helperlabel]").html(filename).css("display", "block");
                        $("#playOnShow_helperlabel_hidden").val(filename);
                        ($(ev.target).prev().attr("audiodata", filename));
                        $("#playOnShow").click();
                        
                    } else if (id==="AudioOnPlayrecordButton")
                    {
                        $("[name=AudioOnPlay_helperlabel]").html(filename).css("display", "block");
                        $("#AudioOnPlay_helperlabel_hidden").val(filename);
                        ($(ev.target).prev().attr("audiodata", filename));
                        $("#AudioOnPlay").click();
                    }
                }// End if data
            });
            
            
            
            
            
            
            
        });
    
            
    
    
    
    // Changes on file uploads
    $(".AudioFileInput").on("change", function(ev){
            var newFile=this.value;
            
            //console.log(ev.target);
            var hidden_target=$(ev.target).attr("target");
            var radio_target=$(ev.target).attr("radioTarget");
            $("#"+hidden_target).val(newFile);
            $("#"+radio_target).attr("checked", "true");
            //alert(newFile + hidden_target);
            
    });
    
    $(".inputTextToSpeech").on("click",function(ev){
        $("#speakOnShow").click();
        //console.log($(ev.target));
        //console.log($(ev.target).attr("name"));
        //alert("clicked");
    });
    
    // Changes on paste youtube url
    $(".YoutubeURL").on("paste", function(ev){
        setTimeout(function () {
            try{
                var url=$(ev.target).val();
                var videoId=url.replace("https://www.youtube.com/watch?v=", "");
                if (videoId===url) alert("Error");
                else{
                    // All ok
                    infoVideo=Utils.getYoutubeInfo(videoId);
                    if (infoVideo) {
                        
                        // Send click to radiobutton to select youtube video
                        $("#VideoOnlineOnPlay").click();
                        
                        $(ev.target).prev().html(infoVideo.title);
                        $(ev.target).parent().next().css("background-image", "url("+infoVideo.thumbnails.default.url+")").attr("href", url).attr("target","_blank");
                } else alert("unknown video");
                }
            } catch(err){
                console.log("Unexpected Error "+err);
                }
            
        }, 0);
        
        
        
        });
    
};



Component.prototype.createFormRadios=function createFormRadios(data){
    var self=this;
    
    var ret=$(document.createElement("div")).addClass("custom-controls-stacked");
    var legend=$(document.createElement("legend")).html(data.name).css("padding-top","24px");
    
    $(ret.append(legend));
    
    for (radio in data.radios){
        //console.log(data.radios[radio].id);
        
        var div=$(document.createElement("div")).addClass("form-check col-md-12");
        var input=$(document.createElement("input")).attr("id", data.radios[radio].id).attr("type","radio").attr("name", data.id).addClass("form-check-input").val(data.radios[radio].id);
        if (data.radios[radio].status) $(input).attr("checked", "true");
        var label=$(document.createElement("label")).addClass("form-check-label col-md-12").css("margin-bottom", "16px");
        var spanlabel=$(document.createElement("span")).html(data.radios[radio].label).css("margin-left", "20px").attr("name", data.radios[radio].id+"_label");
        
        var divtext=$(document.createElement("div")).addClass("col-md-8 col-md-offset-1");
        
        if (data.radios[radio].type=="file"){
            
            var labeltext="";
            //if (data.radios[radio].helperlabel!=="") labeltext=$(document.createElement("span")).addClass("col-md-4").html("("+data.radios[radio].helperlabel+")").attr("name", data.radios[radio].id+"_helperlabel");
            labeltext=$(document.createElement("span")).addClass("col-md-4").html("("+data.radios[radio].helperlabel+")").attr("name", data.radios[radio].id+"_helperlabel");
            if (data.radios[radio].helperlabel==="")  $(labeltext).css("display", "none");
            
            var hidden=$(document.createElement("input")).attr("type", "hidden").attr("name", data.radios[radio].id+"_helperlabel_hidden").val(data.radios[radio].helperlabel).attr("id", data.radios[radio].id+"_helperlabel_hidden");
            $(ret).append(hidden);
            
            //var mimetypes=".mp4, .mpeg, .mpg, .avi, .ogv";
            var mimetypes=".ogv, .matroska";
            if (data.radios[radio].id==="playOnShow" || data.radios[radio].id==="AudioOnPlay") mimetypes=".mp3, .wav, .ogg";
            var text=$(document.createElement("input")).attr("type", "file").addClass("col-md-9 AudioFileInput").attr("accept", mimetypes).attr("name",data.radios[radio].id+"_file").attr("radioTarget", data.radios[radio].id).attr("target", data.radios[radio].id+"_helperlabel_hidden").attr("id", data.radios[radio].id+"_file"); // Target -> hidden element to modify when changes
                        
            var playbt=$(document.createElement("button")).attr("type", "button").addClass("col-md-1 btn btn-default btn-circle previewPlayButtonplayOnShowrecordButton").attr("id", data.radios[radio].id+"previewPlayButton").addClass("previewPlayButton").attr("audioData", data.radios[radio].helperlabel).attr("name", data.radios[radio].id+"_previewPlayButton");
            
            
            if (data.radios[radio].id!=="VideoOnPlay"){
                var recbt=$(document.createElement("button")).attr("type", "button").addClass("col-md-1 btn btn-default btn-circle recordButton").attr("id", data.radios[radio].id+"recordButton").attr("name", data.radios[radio].id+"_recordButton");
                $(divtext).append(labeltext, text, playbt, recbt);
                //$(divtext).append(text, playbt, recbt);
            } else{
                $(divtext).append(labeltext, text, playbt);
                //$(divtext).append(text, playbt);
            }
            /*$(divtext).append(labeltext, text, playbt);
            $(divtext).append(text, playbt);*/
        }
        else if (data.radios[radio].type=="url"){
            var videoId;
            var infoVideo=null;
            
            if (data.radios[radio].helperlabel)
                {
                    videoId=data.radios[radio].helperlabel;
                    infoVideo=Utils.getYoutubeInfo(videoId);
                }
            
            //console.log(infoVideo);
            
            var labeltext="";
            var text="";
            var snippet=null;
            
            labeltext=$(document.createElement("span")).addClass("col-md-12");
            text=$(document.createElement("input")).attr("type", "text").addClass("col-md-6 YoutubeURL").attr("name", data.radios[radio].id+"_YoutubeURL").attr("id", data.radios[radio].id+"_YoutubeURL");
            
            snippet=$(document.createElement("a")).addClass("col-md-2 snippet");
            if (infoVideo) {
                $(snippet).css("background-image", "url("+infoVideo.thumbnails.default.url+")").attr("href", "https://www.youtube.com/watch?v="+data.radios[radio].helperlabel).attr("target","_blank");
                $(labeltext).html("("+infoVideo.title+")");
                $(text).attr("value", "https://www.youtube.com/watch?v="+data.radios[radio].helperlabel);
                
            }
            
            /*if (infoVideo) {
                labeltext=$(document.createElement("span")).addClass("col-md-12").html("("+infoVideo.title+")");
                text=$(document.createElement("input")).attr("type", "text").addClass("col-md-6 YoutubeURL").attr("value", "https://www.youtube.com/watch?v="+data.radios[radio].helperlabel);
                snippet=$(document.createElement("a")).addClass("col-md-2 snippet").css("background-image", "url("+infoVideo.thumbnails.default.url+")").attr("href", "https://www.youtube.com/watch?v="+data.radios[radio].helperlabel).attr("target","_blank");
                $(divtext).removeClass("col-md-10").addClass("col-md-8");
            } else text=$(document.createElement("input")).attr("type", "text").addClass("col-md-6 YoutubeURL");*/
            
            $(divtext).append(labeltext, text);
        }
        else if (data.radios[radio].type=="text"){ // Default: type="text"
            var text=$(document.createElement("input")).attr("type", "text").addClass("col-md-6 inputTextToSpeech").attr("value", data.radios[radio].helperlabel).attr("name", data.radios[radio].id+"_defaultText");
            $(divtext).append(text);

        } 
        /*else { // Default:  None
            $(divtext).css("display", "none");
        }*/
        
        $(label).append(input, spanlabel, divtext);
        if(snippet) $(label).append(snippet);
        $(div).append(label);
        $(ret).append(div);
    }

    return ret;
    
}


Component.prototype.saveActions=function saveActions(saveItem, data){
    var self=this;
    
    //if (!self.hasOwnProperty("actions") && dataToSave.length>0) self.actions=null;
    if (!self.hasOwnProperty("actions")) self.actions=null;
    
    var action_on_show, content_on_show, action_on_play, type_on_play, source_on_play;
    

    content_on_show=data.speakOnShow_defaultText;
    
    if (data["Action.on.show"]==="speakOnShow") {
        action_on_show="speech";
        content_on_show=data.speakOnShow_defaultText;
    }
    else if (data["Action.on.show"]==="playOnShow") {
        action_on_show="sound";
        content_on_show=data.playOnShow_helperlabel_hidden;
        }
    else action_on_show='none';
    
    if (data["Action.on.play"]==="VideoOnPlay")
    {
        action_on_play="video";
        type_on_play="file";
    } else if (data["Action.on.play"]==="AudioOnPlay"){
        action_on_play="sound";
        type_on_play="file";
    } else if (data["Action.on.play"]==="VideoOnlineOnPlay"){
        action_on_play="video";
        type_on_play="youtube";
    } else {action_on_play=null; type_on_play=null;}
    
    
    if (typeof(data.VideoOnPlay_helperlabel_hidden)!=="undefined" &&
        data.VideoOnPlay_helperlabel_hidden!=="" && data["Action.on.play"]==="VideoOnPlay")
        source_on_play=data.VideoOnPlay_helperlabel_hidden;
        
    if ( typeof(data.AudioOnPlay_helperlabel_hidden)!=="undefined" &&
        data.AudioOnPlay_helperlabel_hidden!=="" && data["Action.on.play"]==="AudioOnPlay")
        source_on_play=data.AudioOnPlay_helperlabel_hidden;
        
    if ( typeof(data.VideoOnlineOnPlay_YoutubeURL)!=="undefined" &&
        data.VideoOnlineOnPlay_YoutubeURL!=="" && data["Action.on.play"]==="VideoOnlineOnPlay")
        source_on_play=data.VideoOnlineOnPlay_YoutubeURL.replace("https://www.youtube.com/watch?v=", "") || "";
    
    // Copy data to media folder                
    /*alert(action_on_show);
    alert(content_on_show);
    alert(action_on_play);
    alert(source_on_play);*/
    // WIP
    
    

/*var fs = require('fs');
var dir = './tmp';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

*/
    
    var contentOnShow="", contentOnPlay="";
    
    if (action_on_show==="sound"){
       effective_path=Utils.copyFileToMedia(self.configDir, content_on_show);
       var patharray=effective_path.split("/");
       contentOnShow=patharray[patharray.length-1]; 
    } else contentOnShow=content_on_show;
    
    
    if (type_on_play==="file"){
        effective_path=Utils.copyFileToMedia(self.configDir, source_on_play);
        var patharray=effective_path.split("/");
        contentOnPlay=patharray[patharray.length-1];
    }
    
    
    if (type_on_play==="youtube"){
        contentOnPlay=source_on_play;
    }
    
    //if (contentOnShow) alert(contentOnShow);
    //if (fileOnPlay) alert(fileOnPlay);
    
    var acts={"onshow":
                {
                  "action":action_on_show,
                  "content":contentOnShow
                },
             "onplay":
               {
                  "action":action_on_play,
                  "type":type_on_play,
                  "source":contentOnPlay
               }
            };
    
    self.actions[saveItem]=acts;
    console.log(self.actions);
            
}


