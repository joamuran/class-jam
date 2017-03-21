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
    this.metadata={};
    this.filedata={};
    this.components=[];
    
    
    // config paths
    this.configBaseDir=process.env.HOME+"/.classroom-assembly";
    this.configDir="";
    //this.configFile=this.configDir+"/config.json";
    this.configFile="";
    
    
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
        self.saveComponents();
        });
    
    $("#btSaveConfig").on("click", function(event){
        event.stopPropagation();
        self.saveComponents();
        });
    
};

UI.prototype.saveComponents=function saveComponents(){
    // Stores components configuration, status and metainfo in disk
    var self=this;
    var fs=require("fs");
    var saveItems=self.gridster.serialize();
    //console.log(JSON.stringify(saveItems));
    var saveData={"metadata": self.metadata, "components":saveItems};
    
    fs.writeFileSync(self.configFile, JSON.stringify(saveData, null, '\t'));    
}


UI.prototype.loadComponents=function loadComponents(){
    var self=this;
    //console.log(self.filedata);
    
    for (item in self.filedata){
        console.log("Parsing "+self.filedata[item].component);
        
        var x=self.filedata[item].size_x || 1;
        var y=self.filedata[item].size_y || 1;
        var col=self.filedata[item].col || 1;
        var row=self.filedata[item].row || 1;
        
        var current=self.filedata[item].component;
        var currentdata=JSON.parse(self.filedata[item].componentdata);
        
        // loading widget component if exists
        var currentconfig={};
        if(self.filedata[item].componentconfig) {currentconfig=JSON.parse(self.filedata[item].componentconfig)};
        
        self.componentHelper[current](self); // Call function to create object in function of its type
        
        self.components[current].init(currentdata, currentconfig, self.configDir);
        var item=self.components[current].drawComponent();
        //console.log(item);
        self.gridster.add_widget(item, x, y, col, row);
        
    }
    
    // Fit text to its container
    resizeFonts();

    
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


UI.prototype.showLoadDialog=function showLoadDialog(){
    var self=this;
    
    var loadDiv=$(document.createElement("div")).addClass("loadMainContainer").attr("id", "loadMainContainer");
    var loadContainer=$(document.createElement("div")).addClass("loadContainer");
    
    var fileSelector=$(document.createElement("div")).addClass("fileSelector");
    var hrtop=$(document.createElement("div")).addClass("hr").css("margin-bottom", "10px");
    var hrbottom=$(document.createElement("div")).addClass("hr").css("margin-top", "10px");
        
    var frame=$(document.createElement("div")).addClass("frame").attr("id", "frameFileSelector");
    var slidee=$(document.createElement("ul")).addClass("slidee");
        
    var fs=require("fs");
    var assembleaList=fs.readdirSync(self.configBaseDir);
    for (assemblea in assembleaList){
        var config=JSON.parse(fs.readFileSync(self.configBaseDir+"/"+assembleaList[assemblea]+"/config.json"));
        console.log(config.metadata.id);
        var li=$(document.createElement("li"));
        var iconImage="url(css/images/icons/asmode.png)";
        if (typeof(config.metadata.icon)!=="undefined") iconImage="url("+config.metadata.icon+")";
        var content=$(document.createElement("div")).html(config.metadata.name).attr("id", config.metadata.id).addClass("asItem").css("background-image", iconImage);
        
        $(li).append(content);
        $(slidee).append(li);
        
    }
    
    var new_li=$(document.createElement("li"));
    var content=$(document.createElement("div")).html("Nou").attr("id", "btNewAssembly").addClass("asItem");
    
    $(new_li).append(content);
    $(slidee).append(new_li);
    
    $(frame).append(slidee);
    
    // Adjust FileSelector properties
    // window.innerWidth
    // Fer el fileselector amb width=130*nº elements i amb un margin-left en funció del tamany de la finestra...
    var width=(assembleaList.length+1)*130;
    $(fileSelector).css("width", width+"px").css("margin-left", ((window.innerWidth/2)-(width/2)-30)+"px");
    
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
    var li1=$(document.createElement("li")).html("1");
    var li2=$(document.createElement("li")).html("2");
    var li3=$(document.createElement("li")).html("3");
    $(pages).append(li1, li2, li3);
    $(fileSelector).append(pages);
    
    
    $(loadContainer).append(fileSelector);
    $(loadDiv).append(loadContainer);
    
    
    
    
    
    $("body").append(loadDiv);
    
    
    var $wrap = $('#frameFileSelector').parent();
    
    // Activate sly
    $('#frameFileSelector').sly({
      horizontal: 1,
      itemNav: 'centered',
      activateMiddle: 1,
      smart: 1,
      activateOn: 'click',
      mouseDragging: 1,
      touchDragging: 1,
      releaseSwing: 1,
      pagesBar: $wrap.find('.pages'),
      activatePageOn: 'click',
      speed: 300,
      
        });

    // Event listener
    $(".asItem").on("click", function(){
        if ($(this).hasClass("selected")){
            if ($(this).attr("id")=="btNewAssembly"){
                // Show dialog (if is not shown!)
                if($(".newAsDiv").length==0) self.createNewAssembly();
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
        }
     });
    
};

UI.prototype.createNewAssembly=function createNewAssembly(){
    var self=this;
    
    var inputNameLabel=$(document.createElement("div")).html(i18n.gettext("input.new.assembly.name")).addClass("NewAsFormControl");
    var inputName=$(document.createElement("input")).attr("type", "text").attr("name", "newAsName").html(i18n.gettext("newAsName")).addClass("form-control").attr("required", "required");
    var newAsDiv=$(document.createElement("div")).addClass("newAsDiv").css("margin-left", (window.innerWidth/2-250)+"px");
    
    var inputSelectLabel=$(document.createElement("div")).html(i18n.gettext("input.new.assembly.icon")).addClass("NewAsFormControl");
    var selectImage=$(document.createElement("select")).addClass("image-picker");
    var op1=$(document.createElement("option")).attr("data-img-src", "css/images/icons/asmode.png").val("1");
    var op2=$(document.createElement("option")).attr("data-img-src", "css/images/icons/check.png").val("2");
    var op3=$(document.createElement("option")).attr("data-img-src", "css/images/icons/options.png").val("3");
    $(selectImage).append(op1, op2, op3);

    
    $(newAsDiv).append(inputNameLabel, inputName);
    $(newAsDiv).append(inputSelectLabel, selectImage);
    
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
        resizeFonts();
        $(".loadMainContainer").remove(); // Destroys load dialog
        $("#btShowPlayerMode").click(); // Set player mode
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

