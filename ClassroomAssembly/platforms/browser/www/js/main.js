// Gridster: http://dsmorse.github.io/gridster.js/
// https://paulund.co.uk/create-interactive-grid-dashboard
// http://maharshi-singh.blogspot.com.es/2013/10/gridsterjs-saving-state-and-dynamic.html

/*
TO-DO:

- Afegir botó per afegir items i el corresponent diàleg

*/

function resizeFonts(){
    
    $("body").css("font-font-family","indieFlower");
    /*$("body, .vex, .vex-theme-flat-attack, .vex-content").css("font-font-family","indieFlower");*/
    
    
    // Resizes al fonts defined with fluid class according to its zoom component and its container
    $(".textfluid").each(function(){
        var zoom=$(this).attr("fontzoom");
        if (typeof(zoom)==="undefined") zoom=1;
        $(this).fitText(1/zoom);
    });
}

function UI(){
    
    this.menuHidden=true;
    this.metadata={};
    this.filedata={};
    this.components=[];
    
    
    // config paths
    //this.configBaseDir=process.env.HOME+"/.classroom-assembly";
    this.configBaseDir="/ClassroomAssembly";
    this.configDir="";
    //this.configFile=this.configDir+"/config.json";
    this.configFile="/ClassroomAssembly/config.json";
    
    
    this.gridsterResizeInterval=null; // To resize internal items when resizing gridster container
    
    // Component Helper: Array with component identifier and its init function
    this.componentHelper={
        /*"dataComponent": function(ref){
            ref.components.dataComponent=new dataComponentClass();
        },*/
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
        }
        
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
                            resizeFonts();
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
            overlayClosesOnClick: true,
            callback: function(data){ if (data) dialog.processDialog();resizeFonts(); }
            });
         
         // When dialog is shown, let's bind events for dialog
         dialog.bindEvents();
         resizeFonts(); // Resizing fonts when showing dialog
         
         
         
         
        });
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
        console.log("self.menuHidden is "+self.menuHidden);
        event.stopPropagation();
        if (self.menuHidden) {self.showControlPanel(); console.log("111");}
        else {self.hideControlPanel(); console.log("222");}
            
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
        self.mode="editor";
        self.bindCompomentsEvents();  // Rebinding for click or double click

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
        self.bindCompomentsEvents();  // Rebinding for click or double click
    });
    
    // Fit text when resizing window
    $(window).on("resize", function(){
         window.setTimeout(function(){ // Settimeout is to give time for end previous animation (gridster)
                resizeFonts();
            }, 100);
        
    });
    
    /* Components Events */
    self.bindCompomentsEvents();
    
    
    $("#btSave").on("click", function(event){
        event.stopPropagation();
        self.saveComponents();
        });
    
    $("#btSaveConfig").on("click", function(event){
        event.stopPropagation();
        self.saveComponents();
        });

    $("#btOptions").on("click", function(){
        self.ShowComponentsWindow();
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
        
        if (saveDataStringified===fileSaved)  require('nw.gui').Window.get().reload(3);
        else{ // If is not the same string, let's ask for save it
            vex.dialog.confirm({
                message: i18n.gettext("confirm.save.msg"),
                buttons: [
                $.extend({}, vex.dialog.buttons.NO, {
                    className: 'vex-dialog-button-primary',
                    text: i18n.gettext("confirm.save.msg.yes"),
                    click: function() {
                        self.saveComponents();
                        require('nw.gui').Window.get().reload(3);
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
                            require('nw.gui').Window.get().reload(3);
                            
                        }})
                    ],
                callback: function () {}
                });
        }
        
        });
    
    
};

UI.prototype.ShowComponentsWindow=function ShowComponentsWindow(){
    var self=this;
    
    //console.log(self.filedata);

    var message="Select Assembly Components";
    var input="";
    
    console.log(self.components);
    console.log(self.filedata);
    
    for (index in self.filedata) {
        //alert(index);
        var componentItem=self.components[self.filedata[index].component].getComponentControlIcon(self.filedata[index].component);
        console.log(componentItem);
        console.log(typeof(componentItem));
        
        input=input+componentItem.prop("outerHTML");
    }
    
    vex.dialog.open({
        message:message,
        input:input,
        showCloseButton: true,
        escapeButtonCloses: true,
        overlayClosesOnClick: true,
        callback: function(data){
            for (i in self.components){
                //alert(i+" is "+self.components[i].visible);
                $("#"+i).attr("visible", self.components[i].visible);
                if(self.components[i].visible) $("#"+i).css("display", "list-item");
                else $("#"+i).css("display", "none");
            }
            }
    });
    
    $(".componentVisibilitySelector").on("click", function(){
            //alert($(this).attr("id"));
            var id=$(this).attr("id");
            
            if(self.components[id].visible){
                self.components[id].visible=false;
                $(this).css("opacity", "0.3");
            } else {
                self.components[id].visible=true;
                $(this).css("opacity", "1");
                }
            
            
        });
    
    // Cal mirar com fer que al fer clic als elements funcione açò... a vore com ho faig a la resta de diàlesgs de components i els callbacks...
    
    /*$(retdiv).on("click", function(){
        alert($(this).attr("id"));
        });*/
    
}

UI.prototype.saveComponents=function saveComponents(){
    // Stores components configuration, status and metainfo in disk
    var self=this;
    var fs=require("fs");
    var saveItems=self.gridster.serialize();
    //console.log(JSON.stringify(saveItems));
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
        
        self.componentHelper[component](self); // Call function to create object in function of its type
        self.components[component].init({}, {}, self.configDir, false);
        // Setting empty config
        self.components[component].setBaseConfig();
        
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
        
        self.componentHelper[current](self); // Call function to create object in function of its type
        
        self.components[current].init(currentdata, currentconfig, self.configDir, currentvisibility);
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
    resizeFonts();
    
    
}

UI.prototype.createDirStructure=function createDirStructure(){
    var self=this;
    var fs=require("fs");
    fs.mkdirSync(self.configDir);
    // fs.mkdirSync(self.configDir+"/classmates"); // -> TO-DO; Move to new asemblea creatio process
}

UI.prototype.loadFileSystem=function loadFileSystem(path){
    
    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,
    function (fileSystem) {
        fileSystem.root.getFile(path, {create: false}, 
            function (fileEntry) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    alert(evt.target.result);
                    return evt.target.result;
                };
                reader.readAsText(fileEntry);
            },
            onError);
        },
        onError);
 
}

UI.prototype.checkConfigDir=function checkConfigDir(){
    //var fs=require("fs");
    var self=this;
    
    //var filedata={};
    
    try{
        alert("1");
        alert(self.configFile);
        /*$.getJSON(self.configFile, function(output){
            alert("2");
            console.log(output);
			var fileContent=output;
            self.metadata=fileContent.metadata;
            self.filedata = fileContent.components;
            
            self.loadComponents();
		});*/
        
        self.loadFileSystem(self.configFile);
        
        
    }catch(e){
        alert("3");
        console.log(e);
    } // catch
    
}


UI.prototype.showLoadDialog=function showLoadDialog(){
    var self=this;
    self.LaunchAssembly();
};

UI.prototype.LaunchAssembly=function LaunchAssembly(){
    //var fs=require("fs");
    var self=this;
    var filedata={};
    
    self.configFile="/ClassroomAssembly/config.json";
         
    // loading components
    self.checkConfigDir();
    
    setTimeout(function(){
        // setting events
        self.bindEvents();
        // Aplying font resize
        resizeFonts();
        $(".loadMainContainer").remove(); // Destroys load dialog
        //$("#btShowPlayerMode").click(); // Set player mode
        // Setting player mode
        self.gridster.disable();
        self.gridster.disable_resize();
        $(".gridster li").removeClass("editable");
        self.mode="player";
        
    }, 100);
};

$(document).ready(function() {
    
    // Setting up vex
    vex.defaultOptions.className = 'vex-theme-default';
    
    // Translating static HTML
    i18n.translateHtml();
    
    // Event handlers
    var app=new UI();
    
    app.showLoadDialog(); // Shows load dialog and launches assembly
    
});

