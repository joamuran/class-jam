
function menuComponentClass(){
    var self=this;
    
    this.menuBaseOptions={"paella":{text: "", img:"paella.png"},
                            "lentilles":{text: "", img:"lentilles.png"},
                            "arros al forn":{text: "", img:"arros_forn.png"},
                            
                            "bledes amb creïlles":{text:"", img:"bledes_amb_creïlles.png"},
                            "pit de pollastre":{text:"", img:"chicken_breast.png"},
                            "pa":{text:"", img:"pa.png"},
                            "fruita":{text:"", img:"fruita.png"},
                            "lluç":{text:"", img:"lluç.png"},
                            "iogurt":{text:"", img:"iogurt.png"},
                            "mandonguilles":{text:"", img:"mandonguilles.png"},
                            "bajoques amb creïlles":{text:"", img:"judias_verdes_con_patatas.png"},
                            "llomello":{text:"", img:"llomello.png"},
                            "cigrons":{text:"", img:"cigrons.png"},
                            "truita de creïlles":{text:"", img:"truita_de_creïlles.png"},
                            "titot":{text:"", img:"titot.png"},
                            "amanida":{text:"", img:"amanida.png"},
                            "espaguetis":{text:"", img:"espaguetis.png"},
                            "salmó":{text:"", img:"salmó.png"},
                            "calamars a la romana":{text:"", img:"calamars_a_la_romana.png"},
                            "embotits":{text:"", img:"embotits.png"},
                            "sopa":{text:"", img:"sopa.png"},
                            "canelons":{text:"", img:"cannelloni.png"},
                            "arròs a la cubana":{text:"", img:"arròs.png"},
                            "cuixa de pollastre":{text:"", img:"cuixa_de_pollastre.png"},
                            "encisam":{text:"", img:"encisam.png"}
                            };
    this.name="Menu";
    this.icon="components/componentIcons/menu.png";
    this.componentname="menu";
    
    this.playableData={"top_text":"what.will.we.eat.today",
        getCurrentInfo: function getCurrentInfo(){
            return self.info;
        }/*,
        setCurrentInfo: function setCurrentInfo(data){
        self.info.weather=data;}*/
    };
    
    this.playComponent=function(){};
    
    this.layout="horizontal";  // default value

    
}

menuComponentClass.prototype=new Component();
menuComponentClass.prototype.constructor = menuComponentClass;

menuComponentClass.prototype.resetComponent=function resetComponent(){
    var self=this;
    self.info=[];
}

menuComponentClass.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    self.info=[];
    self.config=self.menuBaseOptions;
    //console.log("CONFIG:::::::");
    //console.log(self.config);
};

menuComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    
    console.log(self);
    
    var li=$(document.createElement("li")).attr("id","menuComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).addClass("component").attr("componentLayout", self.layout);
    
    var titlezoom;
    var fontzoom;
    var fontzoomEmpty;
    var classforMenuItem;
    
    // Setting up layout
    if (self.layout==="horizontal") { // Horizontal
        titlezoom="0.5";
        fontzoomEmpty="0.6"; 
        fontzoom="1.1";
        classforMenuItem="iconMenuContentHorizontal";
    } else {                    // Vertical
        titlezoom="1";
        fontzoomEmpty="0.5";
        fontzoom="0.5";
        classforMenuItem="iconMenuContentVertical"; 
    }
    
    var menutext=$(document.createElement("div")).addClass("titleMenunText textfluid").attr("fontzoom", titlezoom).html(i18n.gettext("menu.today"));
    $(li).append(menutext);

    var componentHeight=Math.floor(100/(self.info.length+1));
    
    if (self.info.length===0){
        
        
        var span=$(document.createElement("div")).addClass("iconMenuItemText textfluid").html(textToWrite).attr("fontzoom", fontzoom);
        $(span).html(i18n.gettext("No menus defined for today")).css("top", "40%");
        $(li).append(span);
        
        return li;
    }
    
    for (var item in self.info){
        
        // Getting text
        var textToWrite=self.config[item].text;
        var fontzoom;
        
        if (textToWrite==="") textToWrite=i18n.gettext(item);
        
        // Getting Image
        var url_base="components/menu/img/";
        if (self.config[item].hasOwnProperty("custom") && self.config[item].custom=="true")
        url_base="file:///"+appGlobal.configDir+"/components/menu/";
        
        var menuitemText=$(document.createElement("div")).addClass("iconMenuItemText textfluid").html(textToWrite).attr("fontzoom", fontzoom);
        
        var menuitem=$(document.createElement("div")).addClass(classforMenuItem).css("height", componentHeight+"%").css("background-image","url("+url_base+self.config[item].img+")");

        $(menuitem).append(menuitemText);
        $(li).append(menuitem);
    }
    
    // Adding play button
    var PlayComponentButton=self.getPlayComponentButton();
    $(li).append(PlayComponentButton);
    
    
        
    return li;
};

menuComponentClass.prototype.reDrawComponent=function reDrawComponent(){
    var self=this;
       
    var item=$("#menuComponent");
    
    $(item).attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config));
    $(item).empty();
    var menuicon=self.drawComponent();
    
    // we have to add resizer because we have removed it
    var spanResizer=$(document.createElement("span")).addClass("gs-resize-handle").addClass("gs-resize-handle-both");
    $(item).append($(menuicon).html()).append(spanResizer);
    
}


menuComponentClass.prototype.getASDialog=function getASDialog(){
    var sortable=require("sortablejs");
    
    var self=this;
    var ret={"message": i18n.gettext("menu.component.title")};
    
    var input=$(document.createElement("div")).attr("id", "menuSelector");
    
    var leftside=$(document.createElement("div")).attr("id", "menuSelectLeft").addClass("col-md-8 list-group");
    var rightside=$(document.createElement("div")).attr("id", "menuSelectRight").addClass("col-md-3 col-md-offset-1 list-group");
    
    
    var col_md=2;
    
    // And draw elements
    for (var menu in self.config){
        if (self.config[menu].active!="false"){   
            var menuText=self.config[menu].text;
            if (self.config[menu].text==="") menuText=i18n.gettext(menu);
            
            // Setting background
            var url_base="components/menu/img/";
            if (self.config[menu].hasOwnProperty("custom") && self.config[menu].custom=="true")
            url_base="file:///"+appGlobal.configDir+"/components/menu/";
            
            //console.log(menu);
            var option=$(document.createElement("div")).addClass(menu).addClass("menuSelectIcon").attr("menu",menu).addClass("list-group-item col-md-"+col_md);
            var text=$(document.createElement("div")).html(menuText).addClass("menuSelectInfo");
            //console.log(menuText);
            $(option).css("background-image", "url("+url_base+self.config[menu].img+")");
            $(option).append(text);
            
            $(leftside).append(option);
            /*if (typeof(self.info[menu])=="undefined") $(leftside).append(option);
            else {
                $(rightside).append(option);
                $(option).removeClass("col-md-2").addClass("col-md-12");
                
            }*/
        }
            
    }
    
    $(input).append(leftside);
    $(input).append(rightside);
    
    // Adding to return the content of form
    ret.input=$(input).prop("outerHTML");
    
    //console.log(ret.input);
    
    ret.bindEvents=function(){
        $(".menuSelectIcon").on("click", function(){

            // Click to select menu
            $(".menuSelectIcon").removeClass("menuSelected");
            $(this).addClass("menuSelected");
        });
    
        // Fix VEX dialog Settings for fullscreen (a little hack)
        $(".vex-content").addClass("vexExtraWidth");
        $(".vex.vex-theme-default").addClass("vexExtraHeight");
        $(".vex-dialog-input").addClass("vex_dialog_input_maxHeight");
    
        var windowHeight=($($(".vexExtraWidth")[0]).css("height"));
        var newHeight=(windowHeight.substring(0,windowHeight.length-2)-150)+"px";
        console.log(newHeight);
        $("#menuSelectLeft").css("max-height",newHeight);
        $("#menuSelectRight").css("max-height",newHeight);
        $(".vex-content.vexExtraWidth").css("top", "50px");
        $(".vexExtraWidth").removeClass("vexExtraWidth").addClass("vexExtraWidthExpanded");
        
        
        for (var item in self.info){
            console.log("***");
            console.log(item);
            var target=$("#menuSelectLeft [menu='"+item+"']");
         
            // Prepare to move from leftside
            var width=$(target).css("width");
            var height=$(target).css("height");
            $(target).removeClass("col-md-2").css("width", width).css("height", height).attr("dimensions", '{"width":"'+width+'", "height":"'+height+'"}');
         
            // Moving to rightside
            $("#menuSelectRight").append(target);
         
            $(target).css("width","").css("height", "");
            $(target).css("width", "100%").addClass("col-md-12");
            
            
        }
        
            
        // Set Sortable    
        sortable.create(menuSelectLeft, {
                            group: "shared",
                            animation: 150,
                            onAdd: function (evt){
                                console.log('adding right', [evt.item, evt.from]);
                                $(evt.item).css("width","").css("height", "").addClass("col-md-2");
                                },
                            onStart:function (evt){
                                console.log(evt);
                                var width=$(evt.item).css("width");
                                var height=$(evt.item).css("height");
                                $(evt.item).removeClass("col-md-2").css("width", width).css("height", height).attr("dimensions", '{"width":"'+width+'", "height":"'+height+'"}');
                                
                                }
                          });
        
        sortable.create(menuSelectRight, {
                            group: "shared",
                            animation: 150,
                            onUpdate:function(evt){
                                $(evt.item).css("width","").css("height", "");
                                $(evt.item).css("width", "100%").addClass("col-md-12");
                                },
                            onAdd: function (evt){
                                $(evt.item).css("width","").css("height", "");
                                $(evt.item).css("width", "100%").addClass("col-md-12");
                                },
                            onStart:function (evt){
                                var width=JSON.parse($(evt.item).attr("dimensions")).width;
                                var height=JSON.parse($(evt.item).attr("dimensions")).height;
                                $(evt.item).removeClass("col-md-12").css("width", width).css("height", height);
                                }
                          });
        
        
    
        
    };
    
    ret.processDialog=function(){
        self.info={};
        //var selected=$($(".menuSelected")[0]).attr("menu");
        //if (selected) self.info.menu=selected;
        itemsSelected=$("#menuSelectRight").find(".menuSelectIcon");
        //for (var item in itemsSelected){ // DANGEROUS!!!
        for (var i=0; i<itemsSelected.length;i++){  // Better like this
            //console.log($(itemsSelected[i]).attr("menu"));
            console.log(typeof(self.info));
            console.log(self.info);
            self.info[$(itemsSelected[i]).attr("menu")]=true;
            //self.info.push($(itemsSelected[i]).attr("menu"));
        }
        
        self.reDrawComponent();
        appGlobal.bindCompomentsEvents();
    };
        
    return ret;
        
    
}


menuComponentClass.prototype.drawConfigureComponent=function drawConfigureComponent(menu){
    var self=this;
    
    // Custom components storages images in menu config path; default components in app path.
    var url_base="components/menu/img/";
    if (self.config[menu].hasOwnProperty("custom") && self.config[menu].custom=="true")
        url_base="file:///"+appGlobal.configDir+"/components/menu/";
    
    var configRow=$(document.createElement("div")).addClass("menuConfigItem").addClass("col-md-2").attr("menu_data", menu).css("background-image","url("+url_base+self.config[menu].img+")");
        
        // Add text translated or customized text if exists
        var menuText=$(document.createElement("div")).addClass("menuText").html(i18n.gettext(menu));
        if (self.config[menu].text!=="") menuText=self.config[menu].text;
        
        var text=$(document.createElement("div")).addClass("menuConfigText").append(menuText);
   
        var visibilityIcon=$(document.createElement("div")).addClass("visibilityIcon").attr("title", i18n.gettext("Hide.or.show.menu"));
        
        var deleteBt=$(document.createElement("div")).addClass("deleteMenuComponent").attr("delete_target", menu).attr("title", i18n.gettext("Delete.menu"));
        var editBt=$(document.createElement("div")).addClass("editMenuComponent").attr("edit_target", menu).attr("text", self.config[menu].text).attr("imgbg", url_base+self.config[menu].img).attr("title", i18n.gettext("Edit.menu"));
                
        //console.log(self.config[menu].active);
        
        if (self.config[menu].active=="false") {
            $(visibilityIcon).addClass("hidenItem");
            var hideparentdiv=$(document.createElement("div")).addClass("hideparentDiv");
            $(configRow).append(hideparentdiv);
        }
        else {
            $(visibilityIcon).addClass("visibleItem");
        }
        //console.log(text);        
        $(configRow).append(text);
        $(configRow).append(visibilityIcon);
        $(configRow).append(editBt);
        $(configRow).append(deleteBt);
        
        
        
        return configRow;
    }


menuComponentClass.prototype.bindEventsForConfigMenu=function bindEventsForConfigMenu(){
    var self=this;
    
   $(".addNewMenuComponent").off("click");
    $(".menuConfigRow").off("click");
    $(".visibilityIcon").off("click");
    $(".editMenuComponent").off("click");
    $(".deleteMenuComponent").off("click");
    
    $("#HorizontalLayout").off("click");
    $("#VerticalLayout").off("click");
    
    $("#HorizontalLayout").on("click", function(){
        $("#HorizontalLayout").addClass("selected");
        $("#VerticalLayout").removeClass("selected");
        });
    
    $("#VerticalLayout").on("click", function(){
        $("#HorizontalLayout").removeClass("selected");
        $("#VerticalLayout").addClass("selected");
        });
    
    
    $(".addNewMenuComponent").on("click", function(){
        // Create new dialog for adding item
        self.showDialogForEditMenu();
        
        });
    
    
    $(".menuConfigRow").on("click", function(){
        
        if($(this).hasClass("menuStatusActive")) $(this).removeClass("menuStatusActive");
        else $(this).addClass("menuStatusActive");
        });
    
    
    $(".visibilityIcon").on("click", function(e){
        var target=$(e.target);
        if ($(target).hasClass("visibleItem")) {
            $(target).removeClass("visibleItem");
            $(target).addClass("hidenItem");
            var hideparentdiv=$(document.createElement("div")).addClass("hideparentDiv");
            $($(target).parent()).prepend(hideparentdiv);
            
        } else{
            $(target).removeClass("hidenItem");
            $(target).addClass("visibleItem");
            $($($(target).parent()).find(".hideparentDiv")).remove();
            
            }
        
        });
    
    
    $(".editMenuComponent").on("click", function(ev){
        var name=($(ev.target).attr("edit_target"));
        var text=($(ev.target).attr("text"));
        var image=($(ev.target).attr("imgbg"));
        self.showDialogForEditMenu(name, image, text);
    });
    
    $(".deleteMenuComponent").on("click", function(ev){
        
            vex.dialog.confirm({
                message: i18n.gettext('ask_delete_menu_item'),
                buttons: [
                $.extend({}, vex.dialog.buttons.YES, {
                    className: 'vex-dialog-button-primary',
                    //text: i18n.gettext("confirm.save.msg.yes"),
                    text: i18n.gettext("yes"),
                    click: function() {
                        var item_to_delete=$(ev.target).attr("delete_target");
                        $("[menu_data="+item_to_delete+"]").remove();
                        
                        delete self.config[item_to_delete];
                        delete self.info[item_to_delete];
                        
                        $("#menuComponent").attr("config", JSON.stringify(self.config));
                        $("#menuComponent").attr("data", JSON.stringify(self.info));
                        
                        self.reDrawComponent();
                        appGlobal.bindCompomentsEvents();
                        
                        // Saving Assembly
                        appGlobal.saveComponents();
                        //appGlobal.components["menuComponent"].config["assembly"]
                        
                        
                        //alert("delete!");
                    }}),
                $.extend({}, vex.dialog.buttons.NO, {
                    className: 'vex-dialog-button',
                    //text: i18n.gettext("confirm.save.msg.cancel"),
                    text: i18n.gettext("no"),
                    click: function() {
                        vex.close(this);
                    }})
                ],
                callback: function () {}
            });
        
        
    });
                

    
}


menuComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("menu.component.options")};
    
    
    var MenuConfigForm=$(document.createElement("div")).attr("id", "menuConfigForm");
    
    
    var MenuLayoutSelectorText=$(document.createElement("div")).html(i18n.gettext("component.select.layout")).addClass("LayoutSelectorText");
    $(MenuConfigForm).append(MenuLayoutSelectorText);
    
    var divHV=$(document.createElement("div")).css("width", "100%").css("display", "-webkit-box");
    
    var divH=$(document.createElement("div")).attr("id", "HorizontalLayout").addClass("col-md-4 col-md-offset-1 LayoutSelector");
    
    var divHText=$(document.createElement("div")).html(i18n.gettext("horizontal")).addClass("textLayoutSelector");
    var divHIcon=$(document.createElement("img")).attr("id", "divHIcon").attr("src", "css/images/icons/hlayout.png");
    $(divH).append(divHText, divHIcon);
    
    var divV=$(document.createElement("div")).attr("id", "VerticalLayout").addClass("col-md-4 col-md-offset-2 LayoutSelector");
    
    // Setting up current layout
    if (self.layout=="horizontal") $(divH).addClass("selected");
    else $(divV).addClass("selected");
        
    var divVText=$(document.createElement("div")).html(i18n.gettext("vertical")).addClass("textLayoutSelector");
    var divVIcon=$(document.createElement("img")).attr("id", "divVIcon").attr("src", "css/images/icons/vlayout.png");
    $(divV).append(divVText, divVIcon);
    
    $(divHV).append(divH, divV);
    $(MenuConfigForm).append(divHV);
    
    var MenuItemsSelectorText=$(document.createElement("div")).html(i18n.gettext("menu.select.components")).addClass("LayoutSelectorText");
    $(MenuConfigForm).append(MenuItemsSelectorText);
    
    // Select dishes
    
    var input=$(document.createElement("div")).attr("id", "menuConfig");
    //for (i in self.menuOptions){
    for (var menu in self.config){
        
        var configRow=self.drawConfigureComponent(menu);
        
        $(input).append(configRow);
        
    }
    
    // Adding new item for add component
    var addConfigBt=$(document.createElement("div")).addClass("menuConfigItem addNewMenuComponent").addClass("col-md-2").attr("menu_data", "add_new_item").css("background-image","url(/css/images/icons/addAlum.png)").attr("id","addNewComponentForMenu");
    $(input).append(addConfigBt);
    
    $(MenuConfigForm).append(input);
    ret.input=$(MenuConfigForm).prop("outerHTML");    
    
    ret.bindEvents=function(){
        // draw upper vex dialog
        $(".vex-content").css("margin-top", "-100px");
        self.bindEventsForConfigMenu();
        
    };
    
    ret.processDialog=function(){
        console.log ($("#menuComponent").attr("config"));
        
        if ($("#HorizontalLayout").hasClass("selected")) self.layout="horizontal";
        else self.layout="vertical";
        
        for (var menu in self.config){
            var is_active=$(".menuConfigItem[menu_data='"+menu+"']").find(".visibilityIcon").hasClass("visibleItem");
            console.log(menu+" is "+is_active+" and is "+typeof(is_active));
            self.config[menu].active=is_active.toString();
            
            //var item="."+menu+".menuStatusActive";
            //console.log(item);
            
        }
        
        $("#menuComponent").attr("config", JSON.stringify(self.config));
        $("#menuComponent").attr("componentlayout", self.layout);
        self.reDrawComponent();
        
    // <div class="menuConfigItem col-md-2" menu_data="assembly" data="assembly" style="background-image: url(&quot;components/menu/img/assembly.png&quot;);"><div class="hideparentDiv"></div><div class="menuConfigText"><div class="menuText">Assemblea</div></div><div class="visibilityIcon hidenItem"></div></div>
        
        
    };
    
    console.log(ret);
    return ret;
};




menuComponentClass.prototype.showDialogForEditMenu=function showDialogForEditMenu(name=null, image=null, text=null){
    var self=this;
    var DishName=name;
    var DishImg=image;
    var DishText=text || "";
    var ImgText =i18n.gettext("click.to.select.img");
    
    var imgComponent="";
    var defaultValueForImg="";
    if (image!==null) {
        
        var imgarray=image.split("/");
        var img=imgarray[imgarray.length-1];
        imgComponent=" style='background-image: url("+image+")' imageName='"+img+"' ";
        defaultValueForImg=" value='"+image+"'";
        
    }
    text="<div id='NewMenuImage'"+imgComponent+">"+ImgText+"</div>";
    
    
    
    text+='<label class="form-check-label col-md-12" style="margin-bottom: 16px;"><span name="speakOnShow_label" style="margin-left: 20px;">'+i18n.gettext("new.menu.name")+'</span><input type="text" class="col-md-6" value="'+DishText+'" name="newDishName" id="newDishName"></div></label>';
    
    text+="<input id='uploadImgForMenu' name='uploadImgForMenu' type='file' style='display:none;'  accept='.jpg, .png, .gif'"+defaultValueForImg+"></input>";
            
    vex.dialog.open({
        message:"Select Image",
        input:text,
        showCloseButton: true,
        /*escapeButtonCloses: true,*/
        buttons:
            [
            $.extend({}, vex.dialog.buttons.YES, {
                className: 'vex-dialog-button-primary',
                text: i18n.gettext("ok"),
                click: function() {
                         // Image has been saved. Let's create a new item to add to component
                        console.log($("#newDishName").val());
                        console.log($("#NewMenuImage").attr("imageName"));
                        
                        // Is a new dish or we are modifying it?
                        
                        if (name!==null){
                            // If we are modifying an element, we have just to modify it, but no add to Menu
                            
                            var newitem={"custom":"true","active":"true","img":$("#NewMenuImage").attr("imageName"),"text":$("#newDishName").val() };
                            self.config[name]=newitem;
                            
                            var item=self.drawConfigureComponent(name);
                            
                            // Modify DOM Item
                            $(".menuConfigItem[menu_data="+name+"]").replaceWith(item);
                            
                            //console.log(item);
                            
                            
                        } else {
                            // If we are adding a new element, we have to create it and add it to Menu
                            // Get last id for custom dish
                            var num=0;
                            var basename="customMenu";
                            var newid=basename+num.toString();
                            while (self.config.hasOwnProperty(newid)){
                                num++;
                                newid=basename+num.toString();
                            }
                            
                            // Create item and add to component config
                            var newitem={"custom":"true","active":"true","img":$("#NewMenuImage").attr("imageName"),"text":$("#newDishName").val() };
                            self.config[newid]=newitem;
                            
                            var item=self.drawConfigureComponent(newid);
                            console.log("**********");
                            console.log(newitem);
                            console.log(item);
                            // Add new item to DOM
                            $(item).insertBefore("#addNewComponentForMenu");
                            
                            
                        } // End else
                        
                        // And finally rebind events
                        self.bindEventsForConfigMenu();
                        
                        
                    
                }
            }),
            $.extend({}, vex.dialog.buttons.NO, {
                className: 'vex-dialog-button',
                text: i18n.gettext("cancel"),
                click: function() {
                vex.close(this);
            

        
            }})
                        
            ],
            /*overlayClosesOnClick: false,*/
            afterOpen: function(){
                
                $("#NewMenuImage").on("click", function(){
                    $("#uploadImgForMenu").click();
                });
                
                $("#uploadImgForMenu").on("change", function(ev){
                    var fse=require("fs-extra");
                    var fs=require("fs");
                    
                    var fullpath=$(ev.target).val();
                    
                    var newNameArray=fullpath.split("/");
                    var newName=newNameArray[newNameArray.length-1];
                    
                    var destPath=appGlobal.configDir+"/components/menu";
                    var newPath=destPath+"/"+newName;
                    
                    // Create path for menu customization if not exists
                    if (!fs.existsSync(destPath)){
                        fs.mkdirSync(destPath);
                    }
                    
                    // Check if there is another image with this name
                    if  (fs.existsSync(newPath)){
                                vex.dialog.confirm({
                                    message:i18n.gettext("custom.menu.image.exists"),
                                    buttons: [
                                        $.extend({}, vex.dialog.buttons.YES, {
                                            className: 'vex-dialog-button-primary',
                                            text: i18n.gettext("yes"),
                                            click: function() {
                                                // If answers yes, overwrite
                                                fse.copySync(fullpath, newPath);
                                                $("#NewMenuImage").attr("imageName", newName).css("background-image", "url(file:///"+newPath+")");
                                            }}),
                                        $.extend({}, vex.dialog.buttons.NO, {
                                            className: 'vex-dialog-button',
                                            text: i18n.gettext("no"),
                                            click: function() {
                                            vex.close(this);
                                            }})
                                        ],
                                    callback: function () {}
                    
                                });
                                
                            } else {
                                console.log(fullpath);
                                console.log(destPath);
                                fse.copySync(fullpath, newPath);
                                $("#NewMenuImage").attr("imageName", newName).css("background-image", "url(file:///"+newPath+")");
                            }
                             return false;  
                });
                        
            },
                    
            callback: function(){ }
        });
            
}


menuComponentClass.prototype.getPlayableContent=function getPlayableContent(){
    // Differ than generic method
    var self=this;
    
    var item=$(document.createElement("div")).addClass("PlayableContent");
    
    var currentList=self.playableData.getCurrentInfo();
    
    var toptext=$(document.createElement("div")).html(i18n.gettext(self.playableData.top_text)).css("text-align","center").css("top", "0px").attr("fontzoom", "1").addClass("textfluid").css("z-index","1001").css("position", "absolute");

    var container=$(document.createElement("div")).addClass("container");
    var carousel=$(document.createElement("div")).addClass("carousel");
    
    /*var img1=$(document.createElement("div")).css("background", "#ff44aa").addClass("item").css("transform","rotateY(0deg) translateZ(250px)");
    var img2=$(document.createElement("div")).css("background", "#ff44ff").addClass("item").css("transform","rotateY(90deg) translateZ(250px)");
    var img3=$(document.createElement("div")).css("background", "#ffaaaa").addClass("item").css("transform","rotateY(180deg) translateZ(250px)");
    var img4=$(document.createElement("div")).css("background", "#aa44aa").addClass("item").css("transform","rotateY(270deg) translateZ(250px)");
    
     $(carousel).append(img1, img2, img3, img4);
     */
    
    var incDeg=360/(Object.keys(currentList).length);
    var baseDeg=0;
    
    for (i in currentList){
        // Setting base url for images
        var url_base="components/menu/img/";
        if (self.config[i].hasOwnProperty("custom") && self.config[i].custom=="true")
        url_base="file:///"+appGlobal.configDir+"/components/menu/";
        
        // Setting text to write
        var textToWrite=self.config[i].text;
        if (textToWrite==="") textToWrite=i18n.gettext(i);
        
        var menuitemText=$(document.createElement("div")).addClass("iconMenuItemTextPlay textfluid").html(textToWrite).attr("fontzoom", "0.5");
        
        var menuitem=$(document.createElement("div")).addClass("iconMenuContentPlay").css("background-image","url("+url_base+self.config[i].img+")");
        
        var img=$(document.createElement("div")).addClass("item").css("transform","rotateY("+baseDeg+"deg) translateZ(250px)");
        
        baseDeg+=incDeg;
        
        $(img).append(menuitem, menuitemText);
        $(carousel).append(img);
        
    }
     
    $(container).append(carousel);
     
    var prev=$(document.createElement("div")).addClass("prev");
    var next=$(document.createElement("div")).addClass("next");

    $(item).append(toptext, container, prev,next);
    
    
    //$(item).append(toptext, icon, bottomtext);
    $(item).attr("incdeg", incDeg); // Adding degrees to increase
    return item;
    
}



menuComponentClass.prototype.PlayComponent=function PlayComponent(compDiv){
    var self=this;
    //var id=$(component).attr("id");
    
    console.log("CAlling playable content!");
    //var compDiv=self.components[id].getPlayableContent();
    var incDeg=$(compDiv).attr("incdeg");
    
    console.log(compDiv);
    
    console.log("Playwindow: "+$(".playWindow").length);
    
    var playWindow=$(document.createElement("div")).addClass("playWindow");
    console.log("Adding playWindow to body");
    $("body").append(playWindow);
       
    $(playWindow).animate({
        opacity: 1
        }, 500, function() {
            var closebutton=$(document.createElement("div")).addClass("playWindowCloseButton");
            
            $(playWindow).append(compDiv);
            $(playWindow).append(closebutton);
            
            Utils.resizeFonts();
            
            // Animate slider
            var carousel = $(".carousel"),
                currdeg  = 0;
            
            $(".next").on("click", { d: "n" }, rotate);
            $(".prev").on("click", { d: "p" }, rotate);
            
            function rotate(e){
              if(e.data.d=="n"){
                console.log("Press on next...");
                console.log("currdeg: "+currdeg+" incDeg: "+incDeg);
                currdeg = currdeg - incDeg;
                console.log("currdeg: "+currdeg);
                
              }
              if(e.data.d=="p"){
                console.log("Press on prev...");
                console.log("currdeg: "+currdeg+" incDeg: "+incDeg);

                currdeg =  Number(currdeg) + Number(incDeg);
                console.log("currdeg: "+currdeg);
              }
              carousel.css({
                "-webkit-transform": "rotateY("+currdeg+"deg)",
                "-moz-transform": "rotateY("+currdeg+"deg)",
                "-o-transform": "rotateY("+currdeg+"deg)",
                "transform": "rotateY("+currdeg+"deg)"
              });
              setTimeout( function() {Utils.resizeFonts();}, 500 );

            }
            
            
            
            
           $(closebutton).on("click", function(){
            
                $(playWindow).animate({
                    opacity: 0
                    },500,function(){
                        $(".playWindow").remove();
                    });
            });
                       
        
            
            
        });
}