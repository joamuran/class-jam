function classmatesComponentClass(){
    this.name="Classmates Selector";
    this.icon="components/componentIcons/classmates.png";
    this.items2Delete=[];
    
}

classmatesComponentClass.prototype=new Component();
classmatesComponentClass.prototype.constructor = classmatesComponentClass;




classmatesComponentClass.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    self.info={};
    self.config={};
};


classmatesComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    
    var li=$(document.createElement("li")).attr("id","classmatesComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).addClass("component");
    // Minimal values for widget size
    $(li).attr("data-min-sizex","2").attr("data-min-sizey","1").attr("data-max-sizex","6").attr("data-max-sizey","8");
    
    
    // Calculate children in classroom
    var numalum=0;
    var rows, cols;
    var grid_template_rows="";
    
    for (var i in self.info) if (self.info[i]) numalum++;
    // And now rows and columns
    if (numalum<10) {
        cols=3;
        classMatesContainer="classMatesContainer3cols";  }
    else {
        cols=4;
        classMatesContainer="classMatesContainer4cols"; }
    
    rows=Math.floor(numalum/cols)+1;
    var row_percent=100/(rows+1);
    for (i=0; i<rows; i++){ grid_template_rows+=row_percent+"% "; }
    
        
    if (JSON.stringify(self.info)==="{}"){
        $(li).html("").addClass("emptySchool");
    } else {
        var container=$(document.createElement("div")).addClass("classmatesContainer").addClass(classMatesContainer).css("grid-template-rows", grid_template_rows);
        for (i in self.info){
            if (!self.info[i]) continue; // Ignore students that are at home
            
            //console.log(self.info[i]);
            
            var aluname="Sense Nom";
            var aluimg="components/classmates/img/ninya.jpeg";
            
            console.log(typeof(self.config[i]));
            if (typeof(self.config[i])==="object"){                
                if(self.config[i].name) aluname=self.config[i].name;
                if(self.config[i].img) aluimg="file://"+self.configDir+"/components/classmates/"+self.config[i].img;
            }
            
            
            var aluicon=$(document.createElement("div")).addClass("aluicon").css("background-image", "url("+aluimg+")");
            var spanaluname=$(document.createElement("span")).html(aluname).addClass("spanaluname");
            $(aluicon).append(spanaluname);
            //$(aluicon).attr("title", aluname);
            
            /*var aluiconimg=$(document.createElement("div")).addClass("aluiconimg").css("background-image", aluimg);
            var aluiconname=$(document.createElement("div")).addClass("aluiconname").html(aluname);*/
            //$(aluicon).append(aluiconimg, aluiconname);
            console.log(aluname+" "+aluimg);
            
            $(container).append(aluicon);
            
            
        }
        var titlediv=$(document.createElement("div")).html(i18n.gettext("classmates.frontend.tile")).css("height","15%").addClass("textfluid").attr("fontzoom", "0.8");
        $(li).append(titlediv, container);
        
        
    }
        
    
    
    
         
    return li;
};


classmatesComponentClass.prototype.getASDialog=function getASDialog(){
    var self=this;
                  
    var ret={"message": i18n.gettext("classmates.frontend.tile")}; 
 
    var input=$(document.createElement("div"));
    var bus=$(document.createElement("ol")).attr("data-draggable", "target").addClass("DragBus col-md-12");
    var school=$(document.createElement("ol")).attr("data-draggable", "target").addClass("DragSchool col-md-6");
    var home=$(document.createElement("ol")).attr("data-draggable", "target").addClass("DragHome col-md-6");
    
    
    // Drawing classmates
       
    console.log(self.info);
    console.log(self.config);
    
       for (i in self.config){
            var aluname="Sense Nom";
            var aluimg="components/classmates/img/ninya.jpeg";
       
            if (typeof(self.config[i])==="object"){
                console.log(self.config[i]);
                
                if(self.config[i].name) aluname=self.config[i].name;
                if(self.config[i].img) aluimg="file://"+self.configDir+"/components/classmates/"+self.config[i].img;
            }
            
            var spanaluname=$(document.createElement("span")).html(aluname).addClass("spanaluname");
            var aluicon=$(document.createElement("li")).addClass("aluiconDrag").css("background-image", "url("+aluimg+")").attr("data-draggable","item").append(spanaluname).attr("imageSource", aluimg);
            $(aluicon).attr("sourceimg", aluimg);
            $(aluicon).attr("title", aluname).attr("aluid",i);
            
            
            console.log(self.info);
            if(!self.info.hasOwnProperty(i)){
                $(bus).append(aluicon);
            } else{
                if(self.info[i]){ $(school).append(aluicon); }
                else {$(home).append(aluicon);}
            }
            
        }
    
    $(input).append(bus, school, home);
    ret.input=$(input).prop("outerHTML");
    
    ret.bindEvents=function(){
        $(".vex-content").addClass("vexExtraWidth");
        $(".vex.vex-theme-default").addClass("vexExtraHeight");
        $(".vex-dialog-input").addClass("vex_dialog_input_maxHeight");
        self.manageDragAndDrop();
        
        
        
    };
    
    ret.processDialog=function(){
        $("ol.DragSchool").find("li").each(function() {
            var alu=$(this).attr("aluid");
            self.info[alu]=true;
            });
        
        $("ol.DragHome").find("li").each(function() {
            var alu=$(this).attr("aluid");
            self.info[alu]=false;
            });
        
        self.reDrawComponent();
        
        // No grava açò... cal vore per què...
        //$("#classmatesComponent").attr("data",JSON.stringify(self.info));
    };
        
    return ret;
        
    
};

classmatesComponentClass.prototype.reDrawComponent=function reDrawComponent(){
    var self=this;
    
    var item=$("#classmatesComponent");
    
    
    alert(JSON.stringify(self.config));
    alert(JSON.stringify(self.info));
    
    $(item).attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config));
    $(item).empty();
    var classmatesContent=self.drawComponent();
    
    // we have to add resizer because we have removed it
    var spanResizer=$(document.createElement("span")).addClass("gs-resize-handle").addClass("gs-resize-handle-both");
    $(item).append($(classmatesContent).html()).append(spanResizer);
}

classmatesComponentClass.prototype.manageDragAndDrop=function manageDragAndDrop(){
    var self=this;
    
    
    //get the collection of draggable items and add their draggable attribute
    for (var items = document.querySelectorAll('[data-draggable="item"]'), 
        len = items.length, 
        i = 0; i < len; i ++)
    {
        items[i].setAttribute('draggable', 'true');
    }

    //variable for storing the dragging item reference 
    //this will avoid the need to define any transfer data 
    //which means that the elements don't need to have IDs 
    var item = null;

    //dragstart event to initiate mouse dragging
    
    // Bug described in.. http://stackoverflow.com/questions/30887707/html-drag-drop-setdragimage-doesnt-set-ghost-image-on-first-drag
    
    var dragIcon = document.createElement('img');
    dragIcon.width = 30;
    dragIcon.src="/components/classmates/img/ninyo.jpeg";
    
    
    document.addEventListener('dragstart', function(e)
    {
        //set the item reference to this element
        item = e.target;
        
        
        dragIcon.src=$(item).attr("sourceimg"); 
        console.log(dragIcon);
        event.dataTransfer.setDragImage(dragIcon, 100, 125);
          
        
        e.dataTransfer.setData('text', '');
        
    
    }, false);

    //dragover event to allow the drag by preventing its default
    //ie. the default action of an element is not to allow dragging 
    document.addEventListener('dragover', function(e)
    {
        if(item)
        {
            e.preventDefault();
        }
    
    }, false);  

    //drop event to allow the element to be dropped into valid targets
    document.addEventListener('drop', function(e)
    {
        //if this element is a drop target, move the item here 
        //then prevent default to allow the action (same as dragover)
        if(e.target.getAttribute('data-draggable') == 'target')
        {
            e.target.appendChild(item);
            
            e.preventDefault();
        }
    
    }, false);
    
    //dragend event to clean-up after drop or abort
    //which fires whether or not the drop target was valid
    document.addEventListener('dragend', function(e)
    {
        item = null;
    
    }, false);

    
}

classmatesComponentClass.prototype.SelectImageForAlu=function SelectImageForAlu(){
    var self=this;
    
    $(".aluImg").off("click");
    $(".aluImg").on("click", function(){
        var alu=$(this).attr("id").replace("img", "");
        var fileselector=$(document.createElement("input")).attr("id", "fileSelector").attr("type", "file").css("display", "none");
        $(classmatesConfig).append(fileselector);
        $(fileselector).on("change", function(){
            
            try{
                // Check mimetype for image
                var newImage=this.value;
                // https://www.npmjs.com/package/file-type
                const readChunk = require('read-chunk');
                const fileType = require('file-type');
                const buffer = readChunk.sync(newImage, 0, 4100);
                
                // Check if exists classmates subdir
                var fs=require("fs");
                var classmatesdir=self.configDir+"/components/classmates/";
                if (!fs.existsSync(classmatesdir)) {
                    fs.mkdirSync(classmatesdir); }
    
                //console.log(fileType(buffer));
                    
                if (fileType(buffer).mime.split("/")[0]=="image"){
                    var fs=require('fs');
                       
                    var filename=newImage.split("/").pop();
                    var oldImage=self.configDir+"/components/classmates/"+filename;
                        
                    console.log(oldImage+ " - "+newImage);
                    
                    //var writeStream=fs.createWriteStream(oldImage);
                    
                    // RESIZE
                        var gm = require('gm');
                        gm(newImage)
                        .resize(353, 257)
                        .write(oldImage, function (err) {
                          if (!err) {
                            $("#img"+alu).attr("src", "file://"+oldImage);
                            self.config[alu].img=filename;
                          }
                          else console.log("ERROR: "+err);
                        });
                    
                        
                    /*var stream=fs.createReadStream(newImage).pipe(fs.createWriteStream(oldImage));
                    
                    
                    
                    
                    stream.on('close', function(){
                        // Wait for stream has been copied
                        $("#img"+alu).attr("src", "file://"+oldImage);

                        self.config[alu].img=filename;
                        //console.log(self.config);
                    }); */
                }
            } catch (err){
                    console.log(err);
            }
            });
            $(fileselector).click();
        });
};
        


classmatesComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("classmates.component.options")};
    
    // Emty delete items list
    self.items2Delete=[];
    
    var input=$(document.createElement("div")).attr("id", "classmatesConfig");
    //for (i in self.monthOptions){
    console.log(self.config);
    for (var alu in self.config){
        //var aluItem=$(document.createElement("div")).attr("id", alu).addClass("col-md-3 aluItem");
        var aluItem=$(document.createElement("div")).attr("id", alu).addClass("aluItem");
        // image file
        var aluImgFile="";
        if(self.config[alu].img!="")
        {
            aluImgFile="file://"+self.configDir+"/components/classmates/"+self.config[alu].img;}
        else 
            aluImgFile="components/classmates/img/ninyo.jpeg";
                
        var aluImg=$(document.createElement("img")).attr("src", aluImgFile).addClass("aluImg").attr("id", "img"+alu);
        //var aluName=$(document.createElement("div")).html(self.config[alu].name).addClass("aluName textfluid").attr("fontzoom",1.5);
        var aluName=$(document.createElement("input")).attr("type", "text").attr("value", self.config[alu].name).addClass("aluName textfluid").attr("fontzoom",1.5);
        //var configRow=$(document.createElement("div"));
        var aluRemove=$(document.createElement("span")).addClass("removeAluButton").attr("title", "Delete").attr("targetalu", alu);
        
        $(aluItem).append(aluImg, aluName,aluRemove);
        $(input).append(aluItem);
        
    }
    
    // Adding "new" button
    var newItem=$(document.createElement("div")).attr("id", "newAlu").addClass("col-md-3 aluItem newAluButton");
    $(input).append(newItem);
        
    
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        self.SelectImageForAlu();
        
        $("#newAlu").on("click", function(){
            // Look for last id added:
            var lastindex=0;
            var newItemId="alu"+lastindex;
            while($("#"+newItemId).length!==0){
                lastindex++;
                newItemId="alu"+lastindex;
            }
            
            
            //var aluItem=$(document.createElement("div")).attr("id", newItemId).addClass("col-md-3 aluItem");
            var aluItem=$(document.createElement("div")).attr("id", newItemId).addClass("aluItem");
            // image file
            var aluImgFile="components/classmates/img/ninyo.jpeg";
            var aluImg=$(document.createElement("img")).attr("src", aluImgFile).addClass("aluImg").attr("id", "imgalu"+newItemId);
            var aluName=$(document.createElement("input")).attr("type", "text").attr("value", "Nou").addClass("aluName textfluid").attr("fontzoom",1.5);
            console.log(aluItem);
            $(aluItem).append(aluImg, aluName);
            $(aluItem).insertBefore("#newAlu");
            
            // Rebind some events like click on image
            self.SelectImageForAlu(); 
            
            resizeFonts();
            
            }); // End click on newAlu
        
        $(".removeAluButton").on("click", function(e){
            var target=$(e.target).attr("targetalu");
        $("#"+target).remove();
        self.items2Delete.push(target);
            
        });
        
    $("input").blur();
    
    }; // End binding events callback function
    
    ret.processDialog=function(){
        
        var componentconfig={};
        
        //{\"alu01\":{\"img\":\"\",\"name\":\"alup1\"},\"alu02\":{\"img\":\"\",\"name\":\"alup2\"}}
        $("div.aluItem").each(function( ) {
            var id=$(this).attr("id");
            var img=$(this).find("img").attr("src");
            var name=$(this).find("input").val();
            
            if (id!=="newAlu") { // Ignore Button
                //alert("adding "+id);
                var filename="";
                if (img.substr(0,7)==="file://") filename=img.split("/").pop();
                componentconfig[id]={"img": filename, "name": name};
                self.info[id]=true;
            }
            
            for (var i in self.items2Delete) {
                alert("delete "+self.items2Delete[i]);
                console.log(self.info);
                delete self.info[self.items2Delete[i]];
                console.log(self.info);
                };
            
            
            
            
        });
        //console.log(componentconfig);
        self.config=componentconfig;
        
        
        
        $("#classmatesComponent").attr("config", JSON.stringify(componentconfig));
        
        //$("#classmatesComponent").attr("config", JSON.stringify(self.config));
        
        $("#btSave").click();
        self.reDrawComponent();
        
        
        
    };
    
        
    return ret;
};


