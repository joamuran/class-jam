// Gridster: http://dsmorse.github.io/gridster.js/
// https://paulund.co.uk/create-interactive-grid-dashboard
// http://maharshi-singh.blogspot.com.es/2013/10/gridsterjs-saving-state-and-dynamic.html

/*
TO-DO:

- Afegir botó per afegir items i el corresponent diàleg

*/

function resizeFonts(){
    // Resizes al fonts defined with fluid class according to its zoom component and its container
    $(".textfluid").each(function(){
        var zoom=$(this).attr("fontzoom");
        if (typeof(zoom)==="undefined") zoom=1;
        $(this).fitText(1/zoom);
    });
}

function UI(){
    
    this.menuHidden=true;
    this.components=[];
    // TO-DO !!
    //this.configFile=process.env.HOME+"/Dropbox/.asConfig/config.json";
    this.configFile="config.json";
    
    this.gridsterResizeInterval=null; // To resize internal items when resizing gridster container
    
    // Component Helper: Array with component identifier and its init function
    this.componentHelper={
        "dataComponent": function(ref){
            ref.components.dataComponent=new dataComponentClass();
        },
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
              return {
                  /* add element ID, data and config to widget info for serialize */
                  component: $w.attr('id'),
                  componentdata: $w.attr('data'),
                  componentconfig: $w.attr('config'),
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
        
        // Get dialog content in function of running mode
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
            $("#controlPanel").hide();
            self.hideControlPanel();
            self.menuHidden=true;}
        });
    
    $("#menuButton").on("click", function(event){
        event.stopPropagation();
        if (self.menuHidden) self.showControlPanel();
        else self.hideControlPanel();
            
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
        var fs=require("fs");
        var saveItems=self.gridster.serialize();
        //console.log(JSON.stringify(saveItems));
        fs.writeFileSync(self.configFile, JSON.stringify(saveItems, null, '\t'));    
        
        });
    
    $("#btSaveConfig").on("click", function(event){
        event.stopPropagation();
        var fs=require("fs");
        var saveItems=self.gridster.serialize();
        //console.log(JSON.stringify(saveItems));
        fs.writeFileSync(self.configFile, JSON.stringify(saveItems, null, '\t'));    
        
        });
    
};


UI.prototype.loadComponents=function loadComponents(){
    // this.configFile=process.env.HOME+"/Dropbox/.asConfig/config.json";
    
    var fs=require("fs");
    var self=this;
    
    var filedata={};
    try{
       fs.accessSync(self.configFile, fs.R_OK | fs.W_OK);
       var file=fs.readFileSync(self.configFile);
       filedata = JSON.parse(file);
    }catch(e){
        alert("config not exists");
    }
    
    //console.log(self.componentHelper);
    for (item in filedata){
        console.log("Parsing "+filedata[item].component);
        
        var x=filedata[item].size_x || 1;
        var y=filedata[item].size_y || 1;
        var col=filedata[item].col || 1;
        var row=filedata[item].row || 1;
        
        var current=filedata[item].component;
        var currentdata=JSON.parse(filedata[item].componentdata);
        
        // loading widget component if exists
        var currentconfig={};
        if(filedata[item].componentconfig) {currentconfig=JSON.parse(filedata[item].componentconfig)};
        
        self.componentHelper[current](self); // Call function to create object in function of its type
        
        self.components[current].init(currentdata, currentconfig);
        var item=self.components[current].drawComponent();
        //console.log(item);
        self.gridster.add_widget(item, x, y, col, row);
        
    }
    
    // Fit text to its container
    resizeFonts();

    
}


$(document).ready(function() {
    
    // Setting up vex
    vex.defaultOptions.className = 'vex-theme-default';
    
    // Translating static HTML
    i18n.translateHtml();
    
    // Event handlers
    var app=new UI();
    
    // loading components
    app.loadComponents();
    
    // setting events
    app.bindEvents();
    
    // Aplying font resize
    setTimeout(function(){
            resizeFonts();
    }, 100);
    
    // Set player mode
    $("#btShowPlayerMode").click();
    //$("#btShowEditMode").click();
    
});

