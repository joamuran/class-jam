// Gridster: http://dsmorse.github.io/gridster.js/
// https://paulund.co.uk/create-interactive-grid-dashboard
// http://maharshi-singh.blogspot.com.es/2013/10/gridsterjs-saving-state-and-dynamic.html

/*
TO-DO:

- Afegir botó per afegir items i el corresponent diàleg

*/

// Global Reference to App
appGlobal=null;
Utils=new UtilsClass();

function UI(){
    
    this.menuHidden=true;
    this.metadata={};
    this.filedata={};
    this.components=[];
    this.dragSrcEl = null;
    this.player=null; // will store play-sound
    this.useUpperCase=true;
    
    
    
    // config paths
    this.configBaseDir=process.env.HOME+"/.classroom-assembly";
    this.configDir="";
    //this.configFile=this.configDir+"/config.json";
    this.configFile="";
    
    
    this.gridsterResizeInterval=null; // To resize internal items when resizing gridster container
    
    // Component Helper: Array with component identifier and its init function
    this.componentHelper={
        /*"dataComponent": function(ref){
            ref.components.dataComponent=new dataComponentClass();
        },*/
        
        
        /*
        "weatherComponent":function(ref){
            ref.components.weatherComponent=new weatherComponentClass();
        },
        "seasonComponent":function(ref){
            ref.components.seasonComponent=new seasonComponentClass();
        },
        "monthComponent":function(ref){
            ref.components.monthComponent=new monthComponentClass();
        },
        "weekdayComponent":function(ref){
            ref.components.weekdayComponent=new weekdayComponentClass();
        },
        "classmatesComponent":function(ref){
            ref.components.classmatesComponent=new classmatesComponentClass();
        },
        "agendaComponent":function(ref){
            ref.components.agendaComponent=new agendaComponentClass();
        }
        */
    };
    
    
    this.mode="player";
    this.gridster=$(".gridster ul").gridster({
            widget_margins: [10, 10],
            //widget_base_dimensions: ['auto', 40],
            widget_base_dimensions: [100, 100],
            min_cols:1,
            autogrow_cols: true,
            /*max_cols:10,*/
            resize: {
                    enabled: true,
                    start: function (e, ui, $widget) {
                        this.gridsterResizeInterval=setInterval(function(){
                            Utils.resizeFonts();
                            }, 100);
                    },
                        stop: function (e, ui, $widget) {
                            clearInterval(this.gridsterResizeInterval);
                    }  
                },
            serialize_params: function ($w, wgd) {
             //alert($w.attr('id')+" "+$w.attr('visible'));
              return {
                  /* add element ID, data and config to widget info for serialize */
                  component: $w.attr('id'),
                  componentdata: $w.attr('data'),
                  componentconfig: $w.attr('config'),
                  componentactions: $w.attr('actions'),
                  componentLayout: $w.attr('componentLayout'),
                  componentvisibility: $w.attr('visible') || "true",
                  /* defaults */
                  col: wgd.col,
                  row: wgd.row,
                  size_x: wgd.size_x,
                  size_y: wgd.size_y
              };
    
            }
        }).data('gridster');
}

UI.prototype.bindCompomentsEvents=function bindCompomentsEvents(){
    /* Binding click or double click on components  */
    
    var self=this;
    
    $(".gridster li").off("dblclick");
    $(".gridster li").off("click");
    
    if (self.mode=="player") eventToRespond="click";
    else eventToRespond="dblclick";
        
    $(".gridster li").on(eventToRespond, function(event){
        event.stopPropagation();
        
        // this.id contains component name
        var dialog;
        
        /*console.log("*** *** ***"+this.id);
        console.log(self.components[this.id]);
        console.log(self.components[this.id].getComponentControlIcon());*/
        
        if (self.mode==="player") dialog=self.components[this.id].getASDialog();
        else dialog=self.components[this.id].getConfigDialog();
         
         // Show dialog
         vex.dialog.open({
            message:dialog.message,
            input:dialog.input,
            showCloseButton: true,
            escapeButtonCloses: true,
            /*buttons: {},*/
            overlayClosesOnClick: false,
            callback: function(data){ if (data) dialog.processDialog();Utils.resizeFonts(); }
            });
         
         // When dialog is shown, let's bind events for dialog
         dialog.bindEvents();
         Utils.resizeFonts(); // Resizing fonts when showing dialog
         
        });

        
    $(".PlayComponentButton").off("click");
    $(".PlayComponentButton").on("click", function(event){
        event.preventDefault();  
        event.stopPropagation();
        
        if(self.mode=="player"){
            if ($(".playWindow").length>0)
            console.log("Prevent double click");
            else self.PlayComponent($(event.target).parent());
            
            }
    });

}

UI.prototype.PlayComponent=function PlayComponent(component){
    var self=this;
    var id=$(component).attr("id");
    
    //console.log("Calling playable content!");
    var compDiv=self.components[id].getPlayableContent();
    console.log(compDiv);
    
    // If component has own a PlayComponent method, let's call it. If not, use generic...
    console.log(self.components[id]);
    
    //if (self.components[id].componentname=="agenda")
    if (self.components[id].hasOwnProperty("playComponent"))
        {
            self.components[id].PlayComponent(compDiv);
        }
    else{
        
        console.log("Playwindows: "+$(".playWindow").length);
        
        var playWindow=$(document.createElement("div")).addClass("playWindow");
        console.log("Adding playWindow to body");
        $("body").append(playWindow);
        
        $(playWindow).animate({
            opacity: 1
            }, 500, function() {
                var closebutton=$(document.createElement("div")).addClass("playWindowCloseButton");
                var playButton=$(document.createElement("div")).addClass("playContentButton");
                $(playWindow).append(compDiv);
                $(playWindow).append(closebutton);
                
                // Add PlayButton if is media play defined
                if($(compDiv).attr("playmediasource")!==undefined && $(compDiv).attr("playmediasource")!=="") $(playWindow).append(playButton);
                
                Utils.resizeFonts();
                
                // Perform onShow event
                if ($(compDiv).attr("tts")!==undefined)
                    self.speakPhrase($(compDiv).attr("tts"));
                else if ($(compDiv).attr("audiofile")!==undefined)
                    self.playAudio($(compDiv).attr("audiofile"));
                
               $(closebutton).on("click", function(){
                
                    if ($("#youtubeplayer").css("display")!=="none")
                        $("#youtubeplayer").fadeOut(function(){
                            $("#youtubeplayer").remove();
                            });
                        
                     if ($("#mediaplayer").css("display")!=="none")
                        $("#mediaplayer").fadeOut(function(){
                            $("#mediaplayer").remove();
                            });
                
                    $(playWindow).animate({
                        opacity: 0
                        },500,function(){
                            $(".playWindow").remove();
                        });
                });
                           
            
                
                
                $(playButton).on("click", function(){
                    if ($(compDiv).attr("playmediasource")!==undefined)
                        if ($(compDiv).attr("playmediatype")==="file")
                            {
                                if ($(compDiv).attr("playmediaaction")==="sound")
                                    self.playAudio($(compDiv).attr("playmediasource"));
                                else if ($(compDiv).attr("playmediaaction")==="video")
                                    {
                                        var video=$(document.createElement("video")).attr("id", "mediaplayer").addClass("mediaplayer").attr("controls","true").attr("autoplay", "true");
                                        var source=$(document.createElement("source")).attr("src", "file://"+self.configDir+'/media/'+$(compDiv).attr("playmediasource"));
                                        $(video).append(source);
                                        $("body").append(video);
                                        
                                        $(video).fadeIn();
                                    }
                            }
                        else if ($(compDiv).attr("playmediatype")==="youtube")
                            {
                                /*$("#youtubeplayer").attr("src","https://www.youtube.com/embed/"+$(compDiv).attr("playmediasource"));
                                $("#youtubeplayer").css("display","block");*/
                                var iframe=$(document.createElement("iframe")).attr("width","640","height","360").addClass("mediaplayer").attr("id","youtubeplayer").attr("allowfullscreen", "allowfullscreen");
                                $(iframe).attr("src", "https://www.youtube.com/embed/"+$(compDiv).attr("playmediasource"));
                                $(iframe).attr("frameborder", "0").attr("gesture","media").attr("allow", "encrypted-media");
                                $(iframe).css("display","block");
                                $("body").append(iframe);
                                
                            
                                
                            }
                        
                    });
                
                
            });
    } // else for play component
};

UI.prototype.playAudio=function playAudio(file){
    var self=this;
    
    console.log(self.player);
    if (self.player!==null) return -1;
    
    $("#audioStartStop").addClass("pulsatingaudio");
    
    //var player=require('play-sound')(opts = {player:"aplay"});
    
    var opts;
    if (file.substring(file.length-3)==="wav") opts={player:"aplay"};
    else opts={player:"mplayer"};
    var player=require('play-sound')(opts);
    var fileToPlay;
    
    if(file[0]==="/") fileToPlay=file; // Indicates file with an absolute path
    else fileToPlay=self.configDir+'/media/'+file;  // file in relative path (into media/ folder)
    
    self.player=player.play(fileToPlay, function(err){
        console.log(err);
        if (err) throw err;
        $("#audioStartStop").removeClass("pulsatingaudio");
        self.player=null;
    });
}


UI.prototype.exportAssemblyClick=function exportAssemblyClick(){
  $("#exportDialog").val(""); // Clean value before send click event
  $("#exportDialog").click();
}

UI.prototype.importAssemblyClick=function importAssemblyClick(){
    // console.log("CLIC ON IMPORT ASSEMBLY!!!");
    $("#importDialog").val(""); // Clean value before send click event
    $("#importDialog").click();
}


UI.prototype.exportAssembly=function exportAssembly(path){
    try{
        var self=this;
         //alert("Saving "+self.configDir+"to "+path);
        
        var fs= require('fs');
        var archiver = require('archiver');
        var fse=require('fs-extra');
        
        // Copyinf files to tmp
        var dirname=self.configDir.replace(self.configBaseDir, ""); // Stores assembly name
        var tmpdir="/tmp"+dirname;
        fse.emptyDir(tmpdir, function(){
            // When dir is empty let's copy files to tmp
            fse.copy(self.configDir, tmpdir, {overwrite: true}, function(){
                // And now let's zip it
        
            var output = fs.createWriteStream(path);
            var archive = archiver('zip', { zlib : { level: 9 } // Sets the compression level.
            });
        
                
            output.on('close', function () {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
            });
            
            archive.on('error', function(err){
                throw err;
            });
            
            archive.pipe(output);
            
            archive.glob("/**/*", {root:tmpdir, dot:true, realpath:false}); //some glob pattern here
            
            archive.finalize();
             
             
            });
        });
        
    }
    catch (e){
        console.log("Exporting Error: "+e);
    }
    
}



UI.prototype.importAssembly=function importAssembly(file){
    // console.log("on immport Assembly");
    var self=this;
    var fs = require('fs');
    var decompress = require('decompress');
    var fse=require('fs-extra');
    var tmpdir="/tmp/extractedImportedAssembly/";
    try{
        fse.emptyDir(tmpdir, function(){
            // When dir is empty let's extract
            decompress(file, tmpdir).then(files => {
            // And now move extracted files to configBaseDir
            var items=fs.readdirSync(tmpdir+"tmp");
            // items[0] contains dir name
            
            console.log(self.configBaseDir+"/"+items[0]);
            if (fs.existsSync(self.configBaseDir+"/"+items[0])) {
                //alert("ja existeix...");
                vex.dialog.confirm({
                    message: i18n.gettext('ask_overwrite_assembly'),
                    buttons: [
                    $.extend({}, vex.dialog.buttons.YES, {
                        className: 'vex-dialog-button-primary',
                        //text: i18n.gettext("confirm.save.msg.yes"),
                        text: i18n.gettext("overwrite_assembly"),
                        click: function() {
                            // If answers yes, overwrite
                            fse.copy(tmpdir+"tmp", self.configBaseDir, {overwrite: true}, function(){
                               chrome.runtime.reload();
                            });   
                        }}),
                    $.extend({}, vex.dialog.buttons.NO, {
                        className: 'vex-dialog-button',
                        //text: i18n.gettext("confirm.save.msg.cancel"),
                        text: i18n.gettext("cancel_overwrite_assembly"),
                        click: function() {
                            vex.close(this);
                        }})
                    ],
                    callback: function () {}
                });
            }
            else{
            // I el copiem al lloc
             fse.copy(tmpdir+"tmp", self.configBaseDir, {overwrite: true}, function(){
                chrome.runtime.reload();
                });   
            }
                        
            
            }).catch(
                     (reason) => {
                        vex.dialog.alert(i18n.gettext("error_on_import"));
                });
        });
    
    
    
    } catch(e){
        console.log("Exception "+e);
        };
    
    
        
}


UI.prototype.showControlPanel=function showControlPanel(){
    $("#controlPanel").fadeIn(100);
    $(".controlButton.buttonhidden").removeClass("buttonhidden").addClass("visible");
}

UI.prototype.hideControlPanel=function hideControlPanel(){
    $("#controlPanel").fadeOut(200);
    $(".controlButton.visible").removeClass("visible").addClass("buttonhidden");
}

UI.prototype.bindEvents=function bindEvents(){
    var self=this;
    
    /* Menu Events */    
    
    $(window).on("click", function(){
        if (!self.menuHidden) {
            //$("#controlPanel").slideUp("fast");
            //$("#controlPanel").hide();
            self.hideControlPanel();
            self.menuHidden=true;}
        });
    
    $("#menuButton").on("click", function(event){
        //console.log("self.menuHidden is "+self.menuHidden);
        event.stopPropagation();
        if (self.menuHidden) {self.showControlPanel(); }
        else {self.hideControlPanel(); }
            
        self.menuHidden=!self.menuHidden;
        });
    
    
    $("#btShowEditMode").on("click", function(event){
        event.stopPropagation();
        
        //$("#controlPanel").hide(); // hide menu
        self.hideControlPanel();
        //self.menuHidden=true;
        self.menuHidden=!self.menuHidden;
        
        $("#controlPanelPlayer").hide();
        $("#controlPanelEdit").show();
        self.gridster.enable();
        self.gridster.enable_resize();
        $(".gridster li").addClass("editable");
        
        $(".PlayComponentButton").css("display", "none"); // Hide play component button
        
        self.mode="editor";
        self.bindCompomentsEvents();  // Rebinding for click or double click

    });
    
    $("#btResetAssembly").on("click", function(event){
        event.stopPropagation();
        for (var component in self.components){
            console.log(self.components[component]);
            //alert(component);
            self.components[component].resetComponent();
            self.components[component].reDrawComponent();
            
            window.setTimeout(function(){ // Settimeout is to give time for end previous animation (gridster)
                Utils.resizeFonts();
            }, 10);
        }
        
    });
    
    $("#btShowPlayerMode").on("click", function(event){
        event.stopPropagation();
        
        //$("#controlPanel").hide(); // hide menu
        self.hideControlPanel();
        //self.menuHidden=true;
        self.menuHidden=!self.menuHidden;
        
        $("#controlPanelEdit").hide();
        $("#controlPanelPlayer").show();
        self.gridster.disable();
        self.gridster.disable_resize();
        $(".gridster li").removeClass("editable");
        self.mode="player";
        $(".PlayComponentButton").css("display", "block"); // show play component button
        
        self.bindCompomentsEvents();  // Rebinding for click or double click
    });
    
    // Fit text when resizing window
    $(window).on("resize", function(){
         window.setTimeout(function(){ // Settimeout is to give time for end previous animation (gridster)
                Utils.resizeFonts();
            }, 100);
        
    });
    
    /* Components Events */
    self.bindCompomentsEvents();
    
    //https://www.youtube.com/embed/BF7w-xJUlwM
    
    $("#audioStartStop").on("click", function(event){
        event.stopPropagation();
        if (self.player) self.player.kill();
        self.player=null;
        $("#audioStartStop").removeClass("pulsatingaudio");
        });
    
    $("#btSave").on("click", function(event){
        event.stopPropagation();
        self.saveComponents();
        });
    
    $("#btSaveConfig").on("click", function(event){
        event.stopPropagation();
        self.saveComponents();
        });
    
    $("#btExport").on("click", function(event){
        event.stopPropagation();
        self.exportAssemblyClick();
    });
    
    $("#btExportConfig").on("click", function(event){
        event.stopPropagation();
        self.exportAssemblyClick();
    });
    
    $("#exportDialog").on("change", function(){
        var filePath = this.value;
        //
        //  Bug.. quan exportem dos vegades sembla que el change no va...
        //
        self.exportAssembly(filePath);
    });
    
    $("#btOptions").on("click", function(){
        self.ShowConfigWindow();
        });
    
    $("#btLlxHelp, #btLlxHelpConfig").on("click", function(){
        self.ShowHelp();
        });
        
    $("#btQuit, #btQuitConfig").on("click", function(){
        // Compare saved version with current
        var saveItems=self.gridster.serialize();
        var saveData={"metadata": self.metadata, "components":saveItems};
        var saveDataStringified=JSON.stringify(saveData, null, '\t');
        
        fs.accessSync(self.configFile, fs.R_OK | fs.W_OK);
        var file=fs.readFileSync(self.configFile);
        var fileContent=(JSON.parse(file));
        var fileSaved=JSON.stringify(fileContent, null, '\t');
        
        // if (saveDataStringified===fileSaved)  require('nw.gui').Window.get().reload(3);
        if (saveDataStringified===fileSaved)  chrome.runtime.reload();
        
        else{ // If is not the same string, let's ask for save it
            vex.dialog.confirm({
                message: i18n.gettext("confirm.save.msg"),
                buttons: [
                $.extend({}, vex.dialog.buttons.NO, {
                    className: 'vex-dialog-button-primary',
                    text: i18n.gettext("confirm.save.msg.yes"),
                    click: function() {
                        self.saveComponents();
                        //require('nw.gui').Window.get().reload(3);
                        chrome.runtime.reload();
                    }}),
                $.extend({}, vex.dialog.buttons.NO, {
                    className: 'vex-dialog-button',
                    text: i18n.gettext("confirm.save.msg.cancel"),
                    click: function() {
                        vex.close(this);
                    }}),
                    $.extend({}, vex.dialog.buttons.NO, {
                        text: i18n.gettext("confirm.save.msg.no"),
                        click: function() {
                            //require('nw.gui').Window.get().reload(3);
                            chrome.runtime.reload();
                            
                        }})
                    ],
                callback: function () {}
                });
        }
        
        });
    
};

UI.prototype.ShowHelp=function ShowHelp(){
    const { exec } = require('child_process');
    exec('lliurex-help class-jam', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
          }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});

    
}

UI.prototype.ShowConfigWindow=function ShowConfigWindow(){
    var self=this;
    
    //console.log(self.filedata);

    //var message=i18n.gettext("Select.Assembly.Components");
    var message=i18n.gettext("global.config");
    var checked="";
    
    if (appGlobal.useUpperCase) checked="checked";
    
    var input="<div style='display: table-cell'>";
    input+='<label for="toggle-mays" class="col-md-12" style="display:table-cell; margin: 20px 0px 20px 0px"><div class="col-md-9" style="height:1.5em; font-weight:600">'+i18n.gettext("select.mays")+'</div><div class="col-md-3" style="height:1.5em"><input id="toggle-mays" '+checked+' type="checkbox" data-size="mini" data-onstyle="success"></div></label>';
    

    //input+='<div style="display: table-cell; margin: 20px 0px 20px 0px" class="col-md-12"><div class="col-md-9">'+i18n.gettext("select.background")+'</div><input type="file" class="col-md-3" accept=".jpg, .png, .gif" name="setupBgAssembly" id="setupBgAssembly"></div>';
    
    input+='<div style="display: table-cell; margin: 20px 0px 20px 0px" class="col-md-12"><div class="col-md-9">'+i18n.gettext("select.background")+'</div><button class="col-md-3 btn btn-success" "BtsetupBgAssembly" id="BtsetupBgAssembly">'+i18n.gettext("select.background.bt")+'</button></div>';
    
    //console.log(self.components);
    //console.log(self.filedata);
    
    input+="<div style='display:table-cell'>"+i18n.gettext("Select.Assembly.Components")+"</div>";
    
    for (index in self.filedata) {
        //alert(index);
        var componentItem=self.components[self.filedata[index].component].getComponentControlIcon(self.filedata[index].component);
        console.log(componentItem);
        console.log(typeof(componentItem));
    
        input=input+componentItem.prop("outerHTML");
    }
    
    input+="</div>";
    
    vex.dialog.open({
        message:message,
        input:input,
        showCloseButton: true,
        escapeButtonCloses: true,
        overlayClosesOnClick: false,
        afterOpen: function(){
             $(function() {
                    $('#toggle-mays').bootstrapToggle({
                      on: 'Enabled',
                      off: 'Disabled'
                    });
                  });
            
            $("#BtsetupBgAssembly").on("click", function(){
                const fs = require('fs');
                //var folder=self.configDir+'css/images/backgrounds/';
                var folder='css/images/backgrounds/';
                
                var text="<select class='image-picker show-html' id='bg_selector'>";
                
                // Checking media/backgrounds folder
                
                if (!fs.existsSync(self.configDir+"/media")) {
                    fs.mkdirSync(self.configDir+"/media", 0744);
                }
               if (!fs.existsSync(self.configDir+"/media/backgrounds")) {
                    fs.mkdirSync(self.configDir+"/media/backgrounds", 0744);
               }
                
                // Adding default background images
                var files=fs.readdirSync(folder);
                files.forEach(file => {
                    console.log(file);
                    var filename="css/images/backgrounds/"+file;
                    console.log(filename);
                    var newitem="<option data-img-src='"+filename+"' value='"+file+"'>";
                    console.log(newitem);
                    text+=newitem;
                });
                
                // Adding files in custom media for assembly
                files=fs.readdirSync(self.configDir+"/media/backgrounds");
                files.forEach(file => {
                    console.log(file);
                    var filename="file:///"+self.configDir+"/media/backgrounds/"+file;
                    console.log(filename);
                    var newitem="<option data-img-src='"+filename+"' value='"+file+"'>";
                    console.log(newitem);
                    text+=newitem;
                });
                                
                text+="</select>";
                
                // Adding hidden input for file selector
                text+='<input style="display:none" type="file" class="col-md-3" accept=".jpg, .png, .gif" name="addNewBg" id="addNewBg"></input>';
                
                console.log(text);
            
                vex.dialog.open({
                    message:"Select Image",
                    input:text,
                    showCloseButton: true,
                    /*escapeButtonCloses: true,*/
                    buttons:
                        [
                        $.extend({}, vex.dialog.buttons.YES, {
                            className: 'vex-dialog-button-primary',
                            text: i18n.gettext("selectBgOk")/*,
                            click: function() {}*/
                        }),
                        $.extend({}, vex.dialog.buttons.NO, {
                            className: 'vex-dialog-button',
                            text: i18n.gettext("selectBgAdd"),
                            click: function() {
                                $("#addNewBg").click();
                                return false;
                            }
                        }),
                        $.extend({}, vex.dialog.buttons.NO, {
                            className: 'vex-dialog-button',
                            text: i18n.gettext("selectBgCancel"),
                            click: function() {
                            vex.close(this);
                        }})
                        
                        ],
                    /*overlayClosesOnClick: false,*/
                    afterOpen: function(){
                        $("select.image-picker").imagepicker();
                        
                        $(".thumbnail").addClass("thumbnailBG");
                        $(".thumbnail").each(function(key, val){
                            var src=$(val).find("img").attr("src");
                            if (src.substring(0,4)=="file") // Add remove button if it's a custom file
                            {
                            var delbt=$(document.createElement("div")).addClass("removeBgButton").attr("src", src);
                            $(val).append(delbt);
                            $(val).parent().css("position", "relative");
                            $(delbt).on("click", function(ev){
      
                                vex.dialog.confirm({
                                    message: i18n.gettext('ask_delete_background'),
                                    buttons: [
                                        $.extend({}, vex.dialog.buttons.YES, {
                                        className: 'vex-dialog-button-primary',
                                        text: i18n.gettext("yes_remove_bg"),
                                        click: function() {
                                            // yes-> Delete item
                                            var fs=require("fs");
                                            console.log($(ev.target));
                                            //console.log($(ev.target).attr("src"));
                                            fs.unlinkSync($(ev.target).attr("src").replace("file:///", ""));
                                            $(ev.target).parent().parent().remove();
                                            
                                            } // end click on yes
                                        }),
                                        $.extend({}, vex.dialog.buttons.NO, {
                                        className: 'vex-dialog-button',
                                        text: i18n.gettext("No_keep_bg"),
                                        click: function() {
                                            vex.close(this);
                                        }})
                                        ],
                                        callback: function () {}
                                    });
                                  
                                
                                
                                
                                
                                
                                
                                
                                
                                
                                
                                });
                            
                            
                            } // end if
                            
                        }); // end each
                        
                        
                        
                        
                        
                        
                         $("#addNewBg").on("change", function(){
                            var fs=require("fs");
                            var fse=require("fs-extra");
                            
                            var newImg=($("#addNewBg").val());
                            var newNameArray=newImg.split("/");
                            var newName=newNameArray[newNameArray.length-1];
                            if  (fs.existsSync(self.configDir+"/media/backgrounds/"+newName)){
                                vex.dialog.alert({
                                    message:i18n.gettext("bgimage.exists")
                                });
                            } else {
                                // If not exists file in media/backgrounds, let's copy it
                                fse.copySync(newImg, self.configDir+"/media/backgrounds/"+newName);
                                              var newitem=$(document.createElement("option")).attr("data-img-src", "file:///"+self.configDir+"/media/backgrounds/"+newName).attr("value",newName);
                                              $("#bg_selector").append(newitem);
                                              // Redraw ImagePicker
                                              $("select.image-picker").imagepicker();
                            }
                             return false;
                        });
                    },
                    //callback: function(data){ if (data) dialog.processDialog();Utils.resizeFonts(); }
                    callback: function(data){
                        //console.log("********");
                        //console.log(data);
                        if (data){
                            self.metadata.background=($("#bg_selector").val());
                            self.paintBackground();
                            }
                        }
                });
                
                return false;
            });
            
            Utils.resizeFonts(); 
            
            },
        callback: function(data){
            for (i in self.components){
                //alert(i+" is "+self.components[i].visible);
                $("#"+i).attr("visible", self.components[i].visible);
                if(self.components[i].visible) $("#"+i).css("display", "list-item");
                else $("#"+i).css("display", "none");
            }
            
            appGlobal.useUpperCase=($("#toggle-mays").prop("checked"));
            
        }
    });
    
    $(".componentVisibilitySelector").on("click", function(){
            var id=$(this).attr("target");
                        
            if(self.components[id].visible){
                self.components[id].visible=false;
                $("#"+id+"ConfContainer").css("opacity", "0.3");
            } else {
                self.components[id].visible=true;
                $("#"+id+"ConfContainer").css("opacity", "1");
                }
        });
    
  
}

UI.prototype.saveComponents=function saveComponents(){
    // Stores components configuration, status and metainfo in disk
    var self=this;
    var fs=require("fs");
    
    var saveItems=self.gridster.serialize();
    //console.log(JSON.stringify(saveItems));
    
    // Adding useUpperCase property to metadata
    self.metadata.useUpperCase=self.useUpperCase.toString();
    
    var saveData={"metadata": self.metadata, "components":saveItems};
    
     fs.writeFileSync(self.configFile, JSON.stringify(saveData, null, '\t'));
    
    $("#infoPanel").html(i18n.gettext("saved.assembly.message"));
    $("#infoPanel").fadeIn();
     window.setTimeout(function(){
        $("#infoPanel").fadeOut();
    },3000);

    
    
}


UI.prototype.getComponentConfig=function getComponentConfig(component){
    // Returns true if component is present in config file or false if not
    try{
        var self=this;
        for (item in self.filedata)
            if(self.filedata[item].component==component){
                return self.filedata[item];
            }
        //return false;
        
        // If there is no component in filedata, let's create it empty
        
        //self.componentHelper[component](self); // Call function to create object in function of its type
        self.components[component]=eval(self.componentHelper[component]);
        
        
        
        //self.components[component].init({}, {}, self.configDir, false); // Adding empty config for actions
        self.components[component].init({}, {}, self.configDir, false, {});
        // Setting empty config
        self.components[component].setBaseConfig();
        //console.log("CONFIG:::::::"+component);
        //console.log(self.components[component].config);
        
        var gridItem=self.components[component].drawComponent();
        // Adding item to self.filedata
        var newItem={component: $(gridItem).attr("id"),
                    componentdata: $(gridItem).attr('data'),
                    componentconfig: $(gridItem).attr('config'),
                    componentvisibility: "true",
                    col: 1,
                    row: 1,
                    size_x: 1,
                    size_y: 1};
        
        self.filedata.push(newItem);
        return newItem;
        
    } catch(err){
        console.log("Error in getComponentConfig: "+err);
        return false;
    }
};

UI.prototype.loadComponents=function loadComponents(){
    var self=this;
    
    // Parse all components possible, and check if is configured.
    for (component in self.componentHelper){
        var item=self.getComponentConfig(component);
        
        // If component is configured, load content and draws it
        console.log(item.component);
        
        //self.filedata[item] ==> ITEM
                
        var x=item.size_x || 1;
        var y=item.size_y || 1;
        var col=item.col || 1;
        var row=item.row || 1;
        
        var current=item.component;
        var currentdata=JSON.parse(item.componentdata);
        
        // Setting up component visibility
        var currentvisibility="";
        console.log(item.componentvisibility);
        if (item.componentvisibility) {currentvisibility=JSON.parse(item.componentvisibility);}
        
        // loading widget component if exists
        var currentconfig={};
        if(item.componentconfig) {currentconfig=JSON.parse(item.componentconfig);}
        
        // loading widget layout if exists (for menu and agenda)
        var componentLayout="";
        if(item.componentLayout) {componentLayout=item.componentLayout;};
        
        // loading widget actions
        var currentcomponentactions={};

        if(item.componentactions) {
            console.log(typeof(item.componentactions));
            if (typeof(item.componentactions)=="object"){
                currentcomponentactions=item.componentactions;
                } // If is object no need to parse
            else {currentcomponentactions=JSON.parse(item.componentactions);
                }
            }
        //self.componentHelper[current](self); // Call function to create object in function of its type
        self.components[component]=eval(self.componentHelper[component]);
        
        self.components[current].init(currentdata, currentconfig, self.configDir, currentvisibility,currentcomponentactions, componentLayout);
        var gridItem=self.components[current].drawComponent();
        
        // Setting visibility to item
        $(gridItem).attr("visible", currentvisibility);
        
        // Adding item to gridster
        self.gridster.add_widget(gridItem, x, y, col, row);
        
        // Hiding item if is not visible
        if (!currentvisibility){$(gridItem).css("display", "none");}
                        
            // End if

    } // End for
    
    // Fit text to its container
    Utils.resizeFonts();
       
}

UI.prototype.createDirStructure=function createDirStructure(){
    var self=this;
    var fs=require("fs");
    fs.mkdirSync(self.configDir);
    // fs.mkdirSync(self.configDir+"/classmates"); // -> TO-DO; Move to new asemblea creatio process
}

UI.prototype.checkConfigDir=function checkConfigDir(){
    var fs=require("fs");
    var self=this;
    
    //var filedata={};
    
    try{
       fs.accessSync(self.configFile, fs.R_OK | fs.W_OK);
       var file=fs.readFileSync(self.configFile);
       var fileContent=(JSON.parse(file));
       self.metadata=fileContent.metadata;
       self.filedata = fileContent.components;
       
       // Setting self.useUpperCase if is defined
       self.useUpperCase=false;
       if (self.metadata.hasOwnProperty("useUpperCase"))
        if (self.metadata.useUpperCase=="true") self.useUpperCase=true;
        
        // Setting background if is defined
        if (self.metadata.hasOwnProperty("background"))
            {
                self.paintBackground();
            }
        
       
       
       self.loadComponents();
    }catch(e){
        // Config dir does not exists, let's create it
        console.log(e);
        
        if (!fs.existsSync(self.configDir)){
            // Caldrà modificar açò per adaptar-ho a la nova estructura...
            self.createDirStructure();
            fs.createReadStream("config.json").pipe(fs.createWriteStream(self.configFile)).on("close", function(){
                // When finish, let's reload components
                fs.accessSync(self.configFile, fs.R_OK | fs.W_OK);
                var file=fs.readFileSync(self.configFile);
                var fileContent=(JSON.parse(file));
                self.metadata=fileContent.metadata;
                self.filedata = fileContent.components;
                
                self.loadComponents();
                });
        }
        
    } // catch
    
}

UI.prototype.paintBackground=function paintBackground(){
    var self=this;
    var bg="";
    var fs=require("fs");
                
    if (fs.existsSync(self.configDir+"/media/backgrounds/"+self.metadata.background))
        bg="file:///"+self.configDir+"/media/backgrounds/"+self.metadata.background;
    else if (fs.existsSync("css/images/backgrounds/"+self.metadata.background))
        bg="css/images/backgrounds/"+self.metadata.background;
    
    console.log(bg);    
    if (bg!=="")
        {
            $("body").css("background-image", "url("+bg+")");
            $("playWindow").css("background-image", "url("+bg+")");
            
        }
}


UI.prototype.showLoadDialog=function showLoadDialog(){
    var self=this;
    
    var loadDiv=$(document.createElement("div")).addClass("loadMainContainer").attr("id", "loadMainContainer");
    var loadContainer=$(document.createElement("div")).addClass("loadContainer");
    
    var fileSelector=$(document.createElement("div")).addClass("fileSelector");
    var hrtop=$(document.createElement("div")).addClass("hr").css("margin-bottom", "10px");
    var hrbottom=$(document.createElement("div")).addClass("hr").css("margin-top", "10px");
        
    var frame=$(document.createElement("div")).addClass("frame").attr("id", "frameFileSelector");
    var slidee=$(document.createElement("ul")).addClass("slidee");
    
    var text=$(document.createElement("div")).html("").addClass("loadWinHelpMessage").attr("id","loadWinHelpMessage");
    
        
    var fs=require("fs");
    
    // Create config dir if not exists
    if (!fs.existsSync(self.configBaseDir)) {
        fs.mkdirSync(self.configBaseDir); }
    
    // Read config
    var assembleaList=fs.readdirSync(self.configBaseDir);
    for (assemblea in assembleaList){
        if (fs.lstatSync(self.configBaseDir+"/"+assembleaList[assemblea]).isDirectory() &&
            assembleaList[assemblea][0]!="."){
            // Check if it's a directory
        
        var config=JSON.parse(fs.readFileSync(self.configBaseDir+"/"+assembleaList[assemblea]+"/config.json"));
        console.log(config.metadata.id);
        var li=$(document.createElement("li"));
        var iconImage="url(css/images/icons/asmode.png)";
        if (typeof(config.metadata.icon)!=="undefined") iconImage="url("+config.metadata.icon+")";
        var content=$(document.createElement("div")).attr("id", config.metadata.id).addClass("asItem").css("background-image", iconImage).attr("iconimage", config.metadata.icon);
        var asName=$(document.createElement("input")).attr("type","text").val(config.metadata.name).addClass("asName");
        $(content).append(asName);
        
        //$(li).attr("draggable","true").attr("ondragstart", "drag(event)");
        $(li).attr("data-draggable","item");
        
        $(li).append(content);
        $(slidee).append(li);
        
        }
    }
    
    var new_li=$(document.createElement("li"));
    var content=$(document.createElement("div")).html("Nou").attr("id", "btNewAssembly").addClass("asItem").css("background-image", "url(css/images/icons/new_assembly.png)");
    var import_li=$(document.createElement("li"));
    var content_import=$(document.createElement("div")).html("Importa").attr("id", "btImportAssembly").addClass("asItem").css("background-image", "url(css/images/icons/import_assembly.png)");
    
    $(new_li).append(content);
    $(import_li).append(content_import);
    $(slidee).append(new_li);
    $(slidee).append(import_li);
    
    $(frame).append(slidee);
    
    
    $(loadContainer).append(text);
    
    // Adjust FileSelector properties
    // window.innerWidth
    // Fer el fileselector amb width=130*nº elements i amb un margin-left en funció del tamany de la finestra...
    
    /*var width=(assembleaList.length+2)*130;
    $(fileSelector).css("width", 1.5*width+"px").css("margin-left", ((window.innerWidth/2)-(width/2)-90)+"px");*/
    
    
    $(fileSelector).append(hrtop);
    $(fileSelector).append(frame);
    $(fileSelector).append(hrbottom);
    
    // Scrollbar
    /*var scrollbar=$(document.createElement("div")).addClass("scrollbar");
    var handle=$(document.createElement("div")).addClass("handle");
    $(scrollbar).append(handle);
    
    $(fileSelector).append(scrollbar);*/
    
    // Pages
    var pages=$(document.createElement("ul")).addClass("pages");
    $(fileSelector).append(pages);
    
    $(loadContainer).append(fileSelector);
    $(loadDiv).append(loadContainer);
    
    // Create trash icon
    
    var trash=$(document.createElement("div")).addClass("trashIcon").attr("id","trash");
    $(loadDiv).append(trash);
    
    
    $("body").append(loadDiv);
    
                               
    $("#loadMainContainer").on("dragover", function(event) {
    event.preventDefault();  
    event.stopPropagation();
    });
    
    $("#loadMainContainer").on("dragleave", function(event) {
        event.preventDefault();  
        event.stopPropagation();
    });
    
    $("#loadMainContainer").on("drop", function(e) {
  // this/e.target is current target element.

      if (e.stopPropagation) {
         e.stopPropagation(); // Stops some browsers from redirecting.
      }
    var asToDelete=$($(e.originalEvent.dataTransfer.getData('text/html'))[0]).attr("id");
    if ($(e.target).attr("id")=="trash") {
      vex.dialog.confirm({
            message: i18n.gettext('ask_delete_assembly'),
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, {
                className: 'vex-dialog-button-primary',
                //text: i18n.gettext("confirm.save.msg.yes"),
                text: i18n.gettext("delete_assembly"),
                click: function() {
                // If answers yes, delete
                $(self.dragSrcEl).html("");
                $(self.dragSrcEl).animate({
                  opacity: 0.25,
                  width: "10px"
                  }, 500, function() {
                    var fs=require("fs-extra");
                    // And delete from disk
                    var rmdir=self.configBaseDir+"/"+asToDelete;
                    console.log(rmdir);
                    fs.removeSync(rmdir);
                    $(self.dragSrcEl).remove();
    
                  
                  
                  
                  });
                
                } // end click on yes
            }),
            $.extend({}, vex.dialog.buttons.NO, {
            className: 'vex-dialog-button',
            text: i18n.gettext("cancel_delete_assembly"),
            click: function() {
                $(self.dragSrcEl).css("opacity", "1");
                vex.close(this);
            }})
            ],
            callback: function () {}
        });
      
      
    } else{
      $(self.dragSrcEl).css("opacity", "1");
    }
    
    $("#trash").removeClass("trashIconDrag").addClass("trashIcon");
    
    return false;
    });
    
    $("#trash").on("dragenter", function(event) {
    event.preventDefault();  
    event.stopPropagation();
    $("#trash").addClass("trashIconDrag");    
    });
    
    $("#trash").on("dragleave", function(event) {
    event.preventDefault();  
    event.stopPropagation();
    
    $("#trash").removeClass("trashIconDrag").addClass("trashIcon");
    });
    
    
      
    var options = {
	horizontal: 1,
	itemNav: 'basic',
	speed: 300,
	mouseDragging: 0,
	touchDragging: 1,
    pagesBar: $('.pages'),
      activatePageOn: 'click',
        pageBuilder:          // Page item generator.
		function (index) {
			return '<li>' + (index + 1) + '</li>';
		}
    };
    $('#frameFileSelector').sly(options);
      
      
    // Event listener
    $(".asItem").on("click", function(){
        if ($(this).hasClass("selected")){
            $("#loadWinHelpMessage").html("");
            if ($(this).attr("id")=="btNewAssembly"){
                // Show dialog (if is not shown!)
                if($(".newAsDiv").length==0) self.createNewAssembly();
            }
            else if ($(this).attr("id")=="btImportAssembly"){
                // check if it's importing an assembly
                self.importAssemblyClick();
            }
            else self.LaunchAssembly($(this).attr("id"));
        } else {
            // Removes new assembly dialog if is shown
            if($(".newAsDiv").length>0) {
                
                $(".newAsDiv").fadeOut(0.3, function(){
                                        $(".newAsDiv").remove();
                                        $(".fileSelector").css("margin-top", "250px");
                    });
                
            }
            
            // Unselect
            $(".asItem").removeClass("selected");
            $(this).addClass("selected");
            
            
            // detect which button has been clicked to show helpe message
            var help_text="";
            if ($(this).attr("id")=="btNewAssembly") help_text="click_twice_to_new_assembly";
            else if ($(this).attr("id")=="btImportAssembly") help_text="click_twice_to_import_assembly";
            else help_text="click_twice_to_open";
            $("#loadWinHelpMessage").html(i18n.gettext(help_text));
            
        }
     });
    
    $(".asName").on("click", function(event){
        // Just prevent default and stop propagation to avoid load assemby on double click
        event.preventDefault();  
        event.stopPropagation();
    });
    
    $(".asName").on('keyup', function (e) {
        if (e.keyCode == 13) {
            $(e.target).blur();
        }
    });

    $(".asName").on("change", function(event){
        // Changes on text input. Let's rename Assembly
        var newName=$(event.target).val();
        var oldName=$(event.target).parent().attr("id");
        var newid=self.renameAssembly(oldName, newName);
        $(event.target).parent().attr("id", newid);
        
    });
    
    
    // Setting "draggable" atribute to items with "data-draggable" set to item...
    for (var items = document.querySelectorAll('[data-draggable="item"]'), 
        len = items.length, 
        i = 0; i < len; i ++)
    {
        items[i].setAttribute('draggable', 'true');
        
        $(items[i]).on("dragstart", function(e) {
            
                this.style.opacity = '0.4';
              
                self.dragSrcEl = this;
              
                e.originalEvent.dataTransfer.effectAllowed = 'move';
                e.originalEvent.dataTransfer.setData('text/html', this.innerHTML);
                          
            /*//$(event.target).css("display", "none");
             //$(event.target).css("opacity", "0");
            this.style.opacity = '0.2';
            
            event.originalEvent.dataTransfer.setData("item", ($($(event.target).find("div")[0]).attr("id")));
            var dragimg=($($(event.target).find("div")[0]).attr("iconimage"));
 
            $(".dragIcon").remove();
            var img = document.createElement("img");
            $(img).addClass("dragIcon");
            $("body").append(img);
            
            
            $(img).attr("src", dragimg);
                   
            event.originalEvent.dataTransfer.setDragImage(img, 50, 50);
            console.log($("#tralari_pajaritos"));*/

            });
    }    
};

UI.prototype.renameAssembly=function renameAssembly(oldName, newName){
    var self=this;
    var fs=require("fs");
    var id=newName.replace(/([^a-z0-9]+)/gi, '');
    var oldDir=self.configBaseDir+"/"+oldName;
    var newDir=self.configBaseDir+"/"+id;
    var configFile=oldDir+"/config.json";
    
    fs.accessSync(configFile, fs.R_OK | fs.W_OK);
    var file=fs.readFileSync(configFile);
    var fileContent=(JSON.parse(file));
    
    // Rename Content and change dir name
    fileContent.metadata.id=id;
    fileContent.metadata.name=newName;
    
    var saveData={"metadata": fileContent.metadata, "components":fileContent.components};
    fs.writeFileSync(configFile, JSON.stringify(saveData, null, '\t'));
    fs.renameSync(oldDir, newDir);
    
    return id; // Returns new id for item   
                  
};

    

UI.prototype.createNewAssembly=function createNewAssembly(){
    var self=this;
    var fs=require("fs");
    
    var inputNameLabel=$(document.createElement("div")).html(i18n.gettext("input.new.assembly.name")).addClass("NewAsFormControl");
    var inputName=$(document.createElement("input")).attr("type", "text").attr("name", "newAsName").html(i18n.gettext("newAsName")).addClass("form-control").attr("required", "required");
    var newAsDiv=$(document.createElement("div")).addClass("newAsDiv").css("margin-left", (window.innerWidth/2-250)+"px");
    
    var inputSelectLabel=$(document.createElement("div")).html(i18n.gettext("input.new.assembly.icon")).addClass("NewAsFormControl");
    var selectImage=$(document.createElement("select")).addClass("image-picker");
    var op=[];
    
    var avatarDir = 'css/images/avatars/';
    
    var files = fs.readdirSync(avatarDir);
    
    for (var i in files) {
        op[i]=$(document.createElement("option")).attr("data-img-src", avatarDir+files[i]).val(i);  
        $(selectImage).append(op[i]);
    }
    
    // Create container for select
    var image_picker_selector_newAs=$(document.createElement("div")).addClass("image_picker_selector_newAs");
    
    $(newAsDiv).append(inputNameLabel, inputName);
    $(image_picker_selector_newAs).append(selectImage);
    $(newAsDiv).append(inputSelectLabel, image_picker_selector_newAs);
    
    
    // Ok Button
    var bt_ok=$(document.createElement("button")).html(i18n.gettext("CreateAssembly.bt.ok")).addClass("btn btn-success").css("float", "right").css("margin-left", "5px").attr("id", "createNewAsButtonOk");
    var bt_cancel=$(document.createElement("button")).html(i18n.gettext("CreateAssembly.bt.cancel")).addClass("btn").css("float", "right").attr("id", "createNewAsButtonCancel");
    //(<button type="submit" class="vex-dialog-button-primary vex-dialog-button vex-first">OK</button>
    
    $(newAsDiv).append(bt_ok, bt_cancel);
    
    // Create image picker
    $(selectImage).imagepicker();
    $("#loadMainContainer").append(newAsDiv);
    $(newAsDiv).css("display", "block");
    
    
    $(".fileSelector").css("margin-top", "30px");
    
    // Event Listeners
    $("#createNewAsButtonOk").on("click", function(){
        var name=$("[name=newAsName]").val();
        if (name==="") {
            $("[name=newAsName]").focus().css("color");
            }
            else {
                var icon=$(".thumbnail.selected").find("img").attr("src");
                
                var fs=require("fs");
                var id=name.replace(/([^a-z0-9]+)/gi, '');
                self.configDir=self.configBaseDir+"/"+id;
                fs.mkdirSync(self.configDir);
                fs.mkdirSync(self.configDir+"/components");
                self.configFile=self.configDir+"/config.json";
                newAsJSON='{"metadata":{ "id":"'+id+'", "name": "'+name+'", "icon":"'+icon+'"}, "components": [] }';
                fs.writeFileSync(self.configFile, newAsJSON);
                
                // And now, let's load assembly
                self.LaunchAssembly(id);
                
            }
            
        
        });
    
    $("#createNewAsButtonCancel").on("click", function(){
        $(".newAsDiv").fadeOut(0.3, function(){
            $(".newAsDiv").remove();
            $(".fileSelector").css("margin-top", "250px");
        });
    });
    
    
}


UI.prototype.speakPhrase=function speakPhrase(phrase) {
    // Howto: https://developer.chrome.com/apps/tts
    
    if(phrase === "")
    {
        return -1;
    }// "spanish espeak", "catalan espeak", "english espeak"
    else
    {
        //phrase='<?xml version="1.0"?><speak>' +phrase+'</speak>';
        //phrase='<speak>' +phrase+'</speak>';
        //chrome.tts.speak(phrase, {'enqueue': true, 'lang':navigator.language, 'voiceName':"catalan espeak"});
        chrome.tts.speak(phrase, {'enqueue': true, 'lang':'es', 'voiceName':"catalan espeak"});
                
        /*chrome.tts.getVoices(
          function(voices) {
            for (var i = 0; i < voices.length; i++) {
              console.log('Voice ' + i + ':');
              console.log('  name: ' + voices[i].voiceName);
              console.log('  lang: ' + voices[i].lang);
              console.log('  gender: ' + voices[i].gender);
              console.log('  extension id: ' + voices[i].extensionId);
              console.log('  event types: ' + voices[i].eventTypes);
            }
          });*/
        
        
         
         
    }
}



UI.prototype.LaunchAssembly=function LaunchAssembly(id){
    var fs=require("fs");
    var self=this;
    var filedata={};
    
    self.configDir=self.configBaseDir+"/"+id;
    self.configFile=self.configDir+"/config.json";
         
    // loading components
    self.checkConfigDir();
        
    setTimeout(function(){
        // setting events
        self.bindEvents();
        // Aplying font resize
        self.setCustomCSS();
        Utils.resizeFonts();
        $(".loadMainContainer").remove(); // Destroys load dialog
        //$("#btShowPlayerMode").click(); // Set player mode
        // Setting player mode
        self.gridster.disable();
        self.gridster.disable_resize();
        $(".gridster li").removeClass("editable");
        self.mode="player";
        
    }, 100);
};


UI.prototype.registerComponents=function registerComponents(){
    
    var self=this;
        
        var fs=require("fs");
        
            var componentDescriptors=fs.readdirSync("components");
            
            var componentCSSFileList=[];
            var componentJSFileList=[];
            for (var JSONdescriptor in componentDescriptors){
                // Getting file extension
                var file=componentDescriptors[JSONdescriptor].split(".");
                var fileExt=file[file.length-1];
                if (fileExt=="json") {
                    var comp=JSON.parse(fs.readFileSync("components/"+componentDescriptors[JSONdescriptor]));
                    // Extract data from components: CSS, JS
                    componentCSSFileList.push("components/"+comp.style);
                    componentJSFileList.push("components/"+comp.script);
                    
                    // Registering Components i ComponentHelper
                var componentName=comp.component+"Component";
                self.componentHelper[componentName]=comp.constructorCall;
                    
                }
            }
            
            // Loading Components Scripts
            for (var componentJSFile in componentJSFileList){
                var JSFile=componentJSFileList[componentJSFile];
                if (JSFile.substring(JSFile.length-3)==".js") {
                    // If it's a js file, let's get it
                    var script=$(document.createElement("script")).attr("type", "text/javascript");
                    $(script).attr("src", JSFile);
                    $("head").append(script);
                }
            }
            
            // Loading Components CSS
            for (var componentCSSFile in componentCSSFileList){
                var CSSFile=componentCSSFileList[componentCSSFile];
                if (CSSFile.substring(CSSFile.length-4)==".css") {
                    // If it's a CSS file, let's get it
                    var link=$(document.createElement("link")).attr("rel", "stylesheet").attr("type", "text/css");
                    $(link).attr("href", CSSFile);
                    $("head").append(link);
                }
            }
}


UI.prototype.setCustomCSS=function setCustomCSS(){
    var self=this;
    
    window.setTimeout(function(){ // Settimeout is to give time to update styles...
                
        var customPath=self.configDir+"/.customCSS";
        var fs=require("fs");
        
        var cssStyles="";
        
        if (fs.existsSync(customPath)){
        
            var customCSSFileList=fs.readdirSync(customPath);
            console.log("customPath is:"+customPath);
            for (var customCSSFile in customCSSFileList){
                
                var CSSFile=customPath+"/"+customCSSFileList[customCSSFile];
                        
                if (CSSFile.substring(CSSFile.length-4)==".css") {
                    // If it's a CSS file, let's get it
                    
                    console.log(CSSFile);
                    if (fs.existsSync(CSSFile)){
                        var csstemp=fs.readFileSync(CSSFile);
                        // A little hack of my friends... replace relative (extension) path to absolute...
                        cssStyles+=csstemp.toString().split("url(").join( "url(file://"+customPath+"/");
                        cssStyles+="\n";
                    } 
                } // endif (customCSSFile.substring(customCSSFile.length-4)==".css") 
            }
            
            
            $("#customStyles").empty();
            $("#customStyles").html(cssStyles);
            
        } //   endif (fs.existsSync(customPath))
        
    }, 100); // end setTimeout
};

UI.prototype.getAudioFilename=function getAudioFilename(){
    var self=this;
    var fs= require('fs');
                
    // +self.configDir+'/media/
    var i=0;
    var fullpath;
    do{
        i++;
        fullpath=self.configDir+"/media/record_"+i+".wav";
    } while (fs.existsSync(fullpath));
    return fullpath;  
};


$(document).ready(function() {    
    // Removing splash touching file in /tmp
    require ("fs");
    var filepath="/tmp/.classroom-assembly-working";
    var fd = fs.openSync(filepath, 'w');
    fs.closeSync(fs.openSync(filepath, 'w'));
        
    // Setting up vex
    vex.defaultOptions.className = 'vex-theme-default';
    
    // Translating static HTML
    i18n.translateHtml();
    
    // Event handlers
    var app=new UI();
    
    appGlobal=app;
    app.speakPhrase("");
    
    
    // Registering Components
    
    app.registerComponents();
    
    // Binding change event on import dialog
    $("#importDialog").on("change", function(){
        console.log("Detect change in importDialog");
        var filePath = this.value;
        app.importAssembly(filePath);
    });
    
    app.showLoadDialog(); // Shows load dialog and launches assembly
    
});

