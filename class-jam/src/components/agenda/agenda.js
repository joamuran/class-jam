
function agendaComponentClass(){
    var self=this;
    
    this.agendaBaseOptions={"assembly":{text: "", img:"assembly.png"},
                            "language":{text: "", img:"language.png"},
                            "writing":{text: "", img:"writing.png"},
                            "reading":{text: "", img:"reading.png"},
                            "library":{text: "", img:"library.png"},
                            "logopedia":{text: "", img:"logopedia.png"},
                            "break":{text: "", img:"break.png"},
                            "games":{text: "", img:"games.png"},
                            "workshop":{text: "", img:"workshop.png"},
                            "physiotherapy":{text: "", img:"physiotherapy.png"},
                            "movie":{text: "", img:"movie.png"},
                            "party":{text: "", img:"party.png"},
                            "excursion":{text: "", img:"excursion.png"},
                            "medicinecabinet":{text: "", img:"medicinecabinet.png"},
                            "agenda":{text: "", img:"agenda.png"},
                            "sport":{text: "", img:"sport.png"},
                            "physicaleducation":{text: "", img:"physicaleducation.png"},
                            "music":{text: "", img:"music.png"},
                            "dinningroom":{text: "", img:"dinningroom.png"},
                            "plastic":{text: "", img:"plastic.png"},
                            "maths":{text: "", img:"maths.png"},
                            "home":{text: "", img:"home.png"},
                            "park":{text: "", img:"park.png"},
                            "town":{text: "", img:"town.png"},
                            "cinema":{text: "", img:"cinema.png"},
                            "restaurant":{text: "", img:"restaurant.png"},
                            "pool":{text: "", img:"pool.png"},
                            "shopping":{text: "", img:"shopping.png"},
                            "cycling":{text: "", img:"cycling.png"},
                            "tv":{text: "", img:"tv.png"},
                            "play":{text: "", img:"play.png"},
                            "sleep":{text: "", img:"sleep.png"},
                            "shower":{text: "", img:"shower.png"},
                            "videogames":{text: "", img:"videogames.png"},
                            "computer":{text: "", img:"computer.png"},
                            "painting":{text: "", img:"painting.png"},
                            "homework":{text: "", img:"homework.png"},
                            "birthday":{text: "", img:"birthday.png"},
                            "travel":{text: "", img:"travel.png"},
                            "hospital":{text: "", img:"hospital.png"},
                            "mall":{text: "", img:"mall.png"},
                            "toylibrary":{text: "", img:"toylibrary.png"}};
    this.name="Activities";
    this.icon="components/componentIcons/agenda.png";
    this.componentname="agenda";
    
    this.playableData={"top_text":"what.will.we.do.today",
        getCurrentInfo: function getCurrentInfo(){
            return self.info;
        }/*,
        setCurrentInfo: function setCurrentInfo(data){
        self.info.weather=data;}*/
    }
    
    this.playComponent=function(){};
    
    this.layout="vertical"; // Default value

    
}

agendaComponentClass.prototype=new Component();
agendaComponentClass.prototype.constructor = agendaComponentClass;

agendaComponentClass.prototype.resetComponent=function resetComponent(){
    var self=this;
    self.info=[];
}

agendaComponentClass.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    self.info=[];
    self.config=self.agendaBaseOptions;
    //console.log("CONFIG:::::::");
    //console.log(self.config);
};

agendaComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
        
    var li=$(document.createElement("li")).attr("id","agendaComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).addClass("component").attr("componentLayout", self.layout);
    
    var titlezoom;
    var fontzoom;
    var fontzoomEmpty;
    var classforAgendaItem;
    
    // Setting up layout
    if (self.layout==="horizontal") { // Horizontal
        titlezoom="0.5";
        fontzoomEmpty="0.6"; 
        fontzoom="1.1";
        classforAgendaItem="col-md-2 iconAgendaContentHorizontal"; 
        
    } else {                    // Vertical
        titlezoom="1";
        fontzoomEmpty="0.5";
        fontzoom="0.5";
        classforAgendaItem="iconAgendaContentVertical";
    }
    
    var agendatext=$(document.createElement("div")).addClass("titleAgendanText textfluid").attr("fontzoom", titlezoom).html(i18n.gettext("agenda.today"));
    $(li).append(agendatext);

    var componentHeight=Math.floor(100/(self.info.length+1));
    
    if (self.info.length===0){
        
        var span=$(document.createElement("div")).addClass("iconAgendaItemText textfluid").html(textToWrite).attr("fontzoom", fontzoomEmpty);
        $(span).html(i18n.gettext("No tasks defined for today")).css("top", "40%");
        $(li).append(span);
        
        return li;
    }
    
    for (var item in self.info){
        
        // Getting text
        var textToWrite=self.config[item].text;
        
        if (textToWrite==="") textToWrite=i18n.gettext(item);
        
        // Getting Image
        var url_base="components/agenda/img/";
        if (self.config[item].hasOwnProperty("custom") && self.config[item].custom=="true")
        url_base="file:///"+appGlobal.configDir+"/components/agenda/";
        
        var agendaitemText=$(document.createElement("div")).addClass("iconAgendaItemText textfluid").html(textToWrite).attr("fontzoom", fontzoom);
        
        var agendaitem=$(document.createElement("div")).addClass(classforAgendaItem).css("height", componentHeight+"%").css("background-image","url("+url_base+self.config[item].img+")");

        $(agendaitem).append(agendaitemText);
        $(li).append(agendaitem);
    }
    
    // Adding play button
    var PlayComponentButton=self.getPlayComponentButton();
    $(li).append(PlayComponentButton);
    
    
        
    return li;
};

agendaComponentClass.prototype.reDrawComponent=function reDrawComponent(){
    var self=this;
       
    var item=$("#agendaComponent");
    
    $(item).attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config));
    $(item).empty();
    var agendaicon=self.drawComponent();
    
    // we have to add resizer because we have removed it
    var spanResizer=$(document.createElement("span")).addClass("gs-resize-handle").addClass("gs-resize-handle-both");
    $(item).append($(agendaicon).html()).append(spanResizer);
    
}


agendaComponentClass.prototype.getASDialog=function getASDialog(){
    var sortable=require("sortablejs");
    
    var self=this;
    var ret={"message": i18n.gettext("agenda.component.title")};
    
    var input=$(document.createElement("div")).attr("id", "agendaSelector");
    
    var leftside=$(document.createElement("div")).attr("id", "agendaSelectLeft").addClass("col-md-8 list-group");
    var rightside=$(document.createElement("div")).attr("id", "agendaSelectRight").addClass("col-md-3 col-md-offset-1 list-group");
    
    
    var col_md=2;
    
    // And draw elements
    for (var agenda in self.config){
        if (self.config[agenda].active!="false"){   
            var agendaText=self.config[agenda].text;
            if (self.config[agenda].text==="") agendaText=i18n.gettext(agenda);
            
            // Setting background
            var url_base="components/agenda/img/";
            if (self.config[agenda].hasOwnProperty("custom") && self.config[agenda].custom=="true")
            url_base="file:///"+appGlobal.configDir+"/components/agenda/";
            
            //console.log(agenda);
            var option=$(document.createElement("div")).addClass(agenda).addClass("agendaSelectIcon").attr("agenda",agenda).addClass("list-group-item col-md-"+col_md);
            var text=$(document.createElement("div")).html(agendaText).addClass("agendaSelectInfo");
            //console.log(agendaText);
            $(option).css("background-image", "url("+url_base+self.config[agenda].img+")");
            $(option).append(text);
            
            $(leftside).append(option);
            /*if (typeof(self.info[agenda])=="undefined") $(leftside).append(option);
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
        $(".agendaSelectIcon").on("click", function(){

            // Click to select agenda
            $(".agendaSelectIcon").removeClass("agendaSelected");
            $(this).addClass("agendaSelected");
        });
    
        // Fix VEX dialog Settings for fullscreen (a little hack)
        $(".vex-content").addClass("vexExtraWidth");
        $(".vex.vex-theme-default").addClass("vexExtraHeight");
        $(".vex-dialog-input").addClass("vex_dialog_input_maxHeight");
    
        var windowHeight=($($(".vexExtraWidth")[0]).css("height"));
        var newHeight=(windowHeight.substring(0,windowHeight.length-2)-150)+"px";
        console.log(newHeight);
        $("#agendaSelectLeft").css("max-height",newHeight);
        $("#agendaSelectRight").css("max-height",newHeight);
        $(".vex-content.vexExtraWidth").css("top", "50px");
        $(".vexExtraWidth").removeClass("vexExtraWidth").addClass("vexExtraWidthExpanded");
        
        
        for (var item in self.info){
            console.log("***");
            console.log(item);
            var target=$("#agendaSelectLeft [agenda='"+item+"']");
         
            // Prepare to move from leftside
            var width=$(target).css("width");
            var height=$(target).css("height");
            $(target).removeClass("col-md-2").css("width", width).css("height", height).attr("dimensions", '{"width":"'+width+'", "height":"'+height+'"}');
         
            // Moving to rightside
            $("#agendaSelectRight").append(target);
         
            $(target).css("width","").css("height", "");
            $(target).css("width", "100%").addClass("col-md-12");
            
            
        }
        
            
        // Set Sortable    
        sortable.create(agendaSelectLeft, {
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
        
        sortable.create(agendaSelectRight, {
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
        //var selected=$($(".agendaSelected")[0]).attr("agenda");
        //if (selected) self.info.agenda=selected;
        itemsSelected=$("#agendaSelectRight").find(".agendaSelectIcon");
        //for (var item in itemsSelected){ // DANGEROUS!!!
        for (var i=0; i<itemsSelected.length;i++){  // Better like this
            //console.log($(itemsSelected[i]).attr("agenda"));
            console.log(typeof(self.info));
            console.log(self.info);
            self.info[$(itemsSelected[i]).attr("agenda")]=true;
            //self.info.push($(itemsSelected[i]).attr("agenda"));
        }
        
        self.reDrawComponent();
        appGlobal.bindCompomentsEvents();
    };
        
    return ret;
        
    
}


agendaComponentClass.prototype.drawConfigureComponent=function drawConfigureComponent(agenda){
    var self=this;
    
    // Custom components storages images in agenda config path; default components in app path.
    var url_base="components/agenda/img/";
    if (self.config[agenda].hasOwnProperty("custom") && self.config[agenda].custom=="true")
        url_base="file:///"+appGlobal.configDir+"/components/agenda/";
    
    var configRow=$(document.createElement("div")).addClass("agendaConfigItem").addClass("col-md-2").attr("agenda_data", agenda).css("background-image","url("+url_base+self.config[agenda].img+")");
        
        // Add text translated or customized text if exists
        var agendaText=$(document.createElement("div")).addClass("agendaText").html(i18n.gettext(agenda));
        if (self.config[agenda].text!=="") agendaText=self.config[agenda].text;
        
        var text=$(document.createElement("div")).addClass("agendaConfigText").append(agendaText);
   
        var visibilityIcon=$(document.createElement("div")).addClass("visibilityIcon").attr("title", i18n.gettext("Hide.or.show.activity"));
        
        var deleteBt=$(document.createElement("div")).addClass("deleteAgendaComponent").attr("delete_target", agenda).attr("title", i18n.gettext("Delete.activity"));
        var editBt=$(document.createElement("div")).addClass("editAgendaComponent").attr("edit_target", agenda).attr("text", self.config[agenda].text).attr("imgbg", url_base+self.config[agenda].img).attr("title", i18n.gettext("Edit.activity"));
                
        //console.log(self.config[agenda].active);
        
        if (self.config[agenda].active=="false") {
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


agendaComponentClass.prototype.bindEventsForConfigAgenda=function bindEventsForConfigAgenda(){
    var self=this;
    
   $(".addNewAgendaComponent").off("click");
    $(".agendaConfigRow").off("click");
    $(".visibilityIcon").off("click");
    $(".editAgendaComponent").off("click");
    $(".deleteAgendaComponent").off("click");
    
    $(".addNewAgendaComponent").on("click", function(){
        // Create new dialog for adding item
        self.showDialogForEditActivity();
        
        });
    
    
    $(".agendaConfigRow").on("click", function(){
        
        if($(this).hasClass("agendaStatusActive")) $(this).removeClass("agendaStatusActive");
        else $(this).addClass("agendaStatusActive");
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
    
    
    $(".editAgendaComponent").on("click", function(ev){
        //self.showDialogForEditActivity(name=null, image=null, text=null);
        var name=($(ev.target).attr("edit_target"));
        var text=($(ev.target).attr("text"));
        var image=($(ev.target).attr("imgbg"));
        self.showDialogForEditActivity(name, image, text);
    });
    
    $(".deleteAgendaComponent").on("click", function(ev){
        
            vex.dialog.confirm({
                message: i18n.gettext('ask_delete_agenda_item'),
                buttons: [
                $.extend({}, vex.dialog.buttons.YES, {
                    className: 'vex-dialog-button-primary',
                    //text: i18n.gettext("confirm.save.msg.yes"),
                    text: i18n.gettext("yes"),
                    click: function() {
                        var item_to_delete=$(ev.target).attr("delete_target");
                        $("[agenda_data="+item_to_delete+"]").remove();
                        
                        delete self.config[item_to_delete];
                        delete self.info[item_to_delete];
                        
                        $("#agendaComponent").attr("config", JSON.stringify(self.config));
                        $("#agendaComponent").attr("data", JSON.stringify(self.info));
                        
                        self.reDrawComponent();
                        appGlobal.bindCompomentsEvents();
                        
                        // Saving Assembly
                        appGlobal.saveComponents();
                        //appGlobal.components["agendaComponent"].config["assembly"]
                        
                        
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


agendaComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("agenda.component.options")};    
    
    
    var AgendaConfigForm=$(document.createElement("div")).attr("id", "agendaConfigForm");
    
    //var AgendaLayoutSelectorText=$(document.createElement("div")).html(i18n.gettext("component.select.layout")).addClass("col-md-12").css("border-bottom", "1px solid #3288e6").css("margin-bottom", "10px");
    var AgendaLayoutSelectorText=$(document.createElement("div")).html(i18n.gettext("component.select.layout")).css("width", "100%").css("border-bottom", "1px solid #3288e6").css("margin-bottom", "10px");
    $(AgendaConfigForm).append(AgendaLayoutSelectorText);
    
    var divHV=$(document.createElement("div")).css("width", "100%");
    
    var divH=$(document.createElement("div")).attr("id", "HotizontalLayout").addClass("col-md-4 col-md-offset-1 LayoutSelector");
    //var divHText=$(document.createElement("div")).html(i18n.gettext("horizontal")).addClass("col-md-9");
    //var divHIcon=$(document.createElement("img")).addClass("col-md-3").attr("id", "divHIcon").attr("src", "css/images/icons/hlayout.png");
    var divHText=$(document.createElement("div")).html(i18n.gettext("horizontal")).addClass("textLayoutSelector");
    var divHIcon=$(document.createElement("img")).attr("id", "divHIcon").attr("src", "css/images/icons/hlayout.png");
    $(divH).append(divHText, divHIcon);
    
    var divV=$(document.createElement("div")).attr("id", "VerticalLayout").addClass("col-md-4 col-md-offset-2 LayoutSelector");
    //var divVText=$(document.createElement("div")).html(i18n.gettext("vertical")).addClass("col-md-9");
    //var divVIcon=$(document.createElement("img")).addClass("col-md-3").attr("id", "divVIcon").attr("src", "css/images/icons/vlayout.png");
    var divVText=$(document.createElement("div")).html(i18n.gettext("vertical")).addClass("textLayoutSelector");
    var divVIcon=$(document.createElement("img")).attr("id", "divVIcon").attr("src", "css/images/icons/vlayout.png");
    $(divV).append(divVText, divVIcon);
    
    $(divHV).append(divH, divV);
    $(AgendaConfigForm).append(divHV);
    
    var AgendaItemsSelectorText=$(document.createElement("div")).html(i18n.gettext("agenda.select.components")).addClass("col-md-12").css("border-bottom", "1px solid #3288e6").css("margin-bottom", "10px");
    $(AgendaConfigForm).append(AgendaItemsSelectorText);
    
    /*
    WIP HERE:
    
    Queda afegir aci l'apartat d'escollir la disposició en vertical o horitzontal
    una vegada es trie, es guarda en l'element i redibuixem.
    
    Fet això, passar el mateix (compte que he inclòs un div contenidor) a la configuració del menú.
    
    */
       
    var input=$(document.createElement("div")).attr("id", "agendaConfig").addClass("col-md-12");
    //for (i in self.agendaOptions){
    for (var agenda in self.config){
        
        var configRow=self.drawConfigureComponent(agenda);
        
        $(input).append(configRow);
        
    }
    
    // Adding new item for add component
    var addConfigBt=$(document.createElement("div")).addClass("agendaConfigItem addNewAgendaComponent").addClass("col-md-2").attr("agenda_data", "add_new_item").css("background-image","url(/css/images/icons/addAlum.png)").attr("id","addNewComponentForAgenda");
    $(input).append(addConfigBt);
    
    
    
    $(AgendaConfigForm).append(input);
    ret.input=$(AgendaConfigForm).prop("outerHTML");
    
    //ret.input=$(input).prop("outerHTML");    
    
    ret.bindEvents=function(){
        
        self.bindEventsForConfigAgenda();
        
    };
    
    ret.processDialog=function(){
        console.log ($("#agendaComponent").attr("config"));
        
        for (var agenda in self.config){
            var is_active=$(".agendaConfigItem[agenda_data='"+agenda+"']").find(".visibilityIcon").hasClass("visibleItem");
            console.log(agenda+" is "+is_active+" and is "+typeof(is_active));
            self.config[agenda].active=is_active.toString();
            
            //var item="."+agenda+".agendaStatusActive";
            //console.log(item);
            
        }
        
        $("#agendaComponent").attr("config", JSON.stringify(self.config));
        
    // <div class="agendaConfigItem col-md-2" agenda_data="assembly" data="assembly" style="background-image: url(&quot;components/agenda/img/assembly.png&quot;);"><div class="hideparentDiv"></div><div class="agendaConfigText"><div class="agendaText">Assemblea</div></div><div class="visibilityIcon hidenItem"></div></div>
        
        
    };
    
    console.log(ret);
    return ret;
};




agendaComponentClass.prototype.showDialogForEditActivity=function showDialogForEditActivity(name=null, image=null, text=null){
    var self=this;
    var ActName=name;
    var ActImg=image;
    var ActText=text || "";
    var ImgText =i18n.gettext("click.to.select.img");
    
    var imgComponent="";
    var defaultValueForImg="";
    if (image!==null) {
        
        var imgarray=image.split("/");
        var img=imgarray[imgarray.length-1];
        imgComponent=" style='background-image: url("+image+")' imageName='"+img+"' ";
        defaultValueForImg=" value='"+image+"'";
        
    }
    text="<div id='NewActivityImage'"+imgComponent+">"+ImgText+"</div>";
    
    
    
    text+='<label class="form-check-label col-md-12" style="margin-bottom: 16px;"><span name="speakOnShow_label" style="margin-left: 20px;">'+i18n.gettext("new.activity.name")+'</span><input type="text" class="col-md-6" value="'+ActText+'" name="newActName" id="newActName"></div></label>';
    
    text+="<input id='uploadImgForActivity' name='uploadImgForActivity' type='file' style='display:none;'  accept='.jpg, .png, .gif'"+defaultValueForImg+"></input>";
            
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
                        console.log($("#newActName").val());
                        console.log($("#NewActivityImage").attr("imageName"));
                        
                        // Is a new activity or we are modifying it?
                        
                        if (name!==null){
                            // If we are modifying an element, we have just to modify it, but no add to Agenda
                            
                            var newitem={"custom":"true","active":"true","img":$("#NewActivityImage").attr("imageName"),"text":$("#newActName").val() };
                            self.config[name]=newitem;
                            
                            var item=self.drawConfigureComponent(name);
                            
                            // Modify DOM Item
                            $(".agendaConfigItem[agenda_data="+name+"]").replaceWith(item);
                            
                            //console.log(item);
                            
                            
                        } else {
                            // If we are adding a new element, we have to create it and add it to Agenda
                            // Get last id for custom activity
                            var num=0;
                            var basename="customActivity";
                            var newid=basename+num.toString();
                            while (self.config.hasOwnProperty(newid)){
                                num++;
                                newid=basename+num.toString();
                            }
                            
                            // Create item and add to component config
                            var newitem={"custom":"true","active":"true","img":$("#NewActivityImage").attr("imageName"),"text":$("#newActName").val() };
                            self.config[newid]=newitem;
                            
                            var item=self.drawConfigureComponent(newid);
                            console.log("**********");
                            console.log(newitem);
                            console.log(item);
                            // Add new item to DOM
                            $(item).insertBefore("#addNewComponentForAgenda");
                            
                            
                        } // End else
                        
                        // And finally rebind events
                        self.bindEventsForConfigAgenda();
                        
                        
                    
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
                
                $("#NewActivityImage").on("click", function(){
                    $("#uploadImgForActivity").click();
                });
                
                $("#uploadImgForActivity").on("change", function(ev){
                    var fse=require("fs-extra");
                    var fs=require("fs");
                    
                    var fullpath=$(ev.target).val();
                    
                    var newNameArray=fullpath.split("/");
                    var newName=newNameArray[newNameArray.length-1];
                    
                    var destPath=appGlobal.configDir+"/components/agenda";
                    var newPath=destPath+"/"+newName;
                    
                    // Create path for agenda customization if not exists
                    if (!fs.existsSync(destPath)){
                        fs.mkdirSync(destPath);
                    }
                    
                    // Check if there is another image with this name
                    if  (fs.existsSync(newPath)){
                                vex.dialog.confirm({
                                    message:i18n.gettext("custom.agenda.image.exists"),
                                    buttons: [
                                        $.extend({}, vex.dialog.buttons.YES, {
                                            className: 'vex-dialog-button-primary',
                                            text: i18n.gettext("yes"),
                                            click: function() {
                                                // If answers yes, overwrite
                                                fse.copySync(fullpath, newPath);
                                                $("#NewActivityImage").attr("imageName", newName).css("background-image", "url(file:///"+newPath+")");
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
                                $("#NewActivityImage").attr("imageName", newName).css("background-image", "url(file:///"+newPath+")");
                            }
                             return false;  
                });
                        
            },
                    
            callback: function(){ }
        });
            
}


agendaComponentClass.prototype.getPlayableContent=function getPlayableContent(){
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
        var url_base="components/agenda/img/";
        if (self.config[i].hasOwnProperty("custom") && self.config[i].custom=="true")
        url_base="file:///"+appGlobal.configDir+"/components/agenda/";
        
        // Setting text to write
        var textToWrite=self.config[i].text;
        if (textToWrite==="") textToWrite=i18n.gettext(i);
        
        var agendaitemText=$(document.createElement("div")).addClass("iconAgendaItemTextPlay textfluid").html(textToWrite).attr("fontzoom", "0.5");
        
        var agendaitem=$(document.createElement("div")).addClass("iconAgendaContentPlay").css("background-image","url("+url_base+self.config[i].img+")");
        
        var img=$(document.createElement("div")).addClass("item").css("transform","rotateY("+baseDeg+"deg) translateZ(250px)");
        
        baseDeg+=incDeg;
        
        $(img).append(agendaitem, agendaitemText);
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



agendaComponentClass.prototype.PlayComponent=function PlayComponent(compDiv){
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