function classmatesComponentClass(){
}

classmatesComponentClass.prototype=new Component();
classmatesComponentClass.prototype.constructor = classmatesComponentClass;

classmatesComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    
    var li=$(document.createElement("li")).attr("id","classmatesComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).addClass("component");
    
    // Minimal values for widget size
    $(li).attr("data-min-sizex","2").attr("data-min-sizey","1").attr("data-max-sizex","4").attr("data-max-sizey","3");
         
    return li;
};


classmatesComponentClass.prototype.getASDialog=function getASDialog(){
    var self=this;
                  
    var ret={"message": i18n.gettext("data.component.title")};
 
    var input=$(document.createElement("div")).html("hola");
    //$(input).append(leftCol, centerCol, rightCol);

    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        
    };
    
    ret.processDialog=function(){
    
    };
        
    return ret;
        
    
};


classmatesComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("classmates.component.options")};
    
    
    var input=$(document.createElement("div")).attr("id", "classmatesConfig");
    //for (i in self.monthOptions){
    console.log(self.config);
    for (var alu in self.config){        
        var aluItem=$(document.createElement("div")).attr("id", alu).addClass("col-md-3 aluItem");
        // image file
        var aluImgFile="";
        if(self.config[alu].img!="")
        {
            aluImgFile="file://"+self.configDir+"/classmates/"+self.config[alu].img;}
        else 
            aluImgFile="components/classmates/img/ninyo.jpeg";
        
        
        var aluImg=$(document.createElement("img")).attr("src", aluImgFile).addClass("aluImg").attr("id", "img"+alu);
        var aluName=$(document.createElement("div")).html(self.config[alu].name).addClass("aluName textfluid").attr("fontzoom",1.5);
        //var configRow=$(document.createElement("div"));
        $(aluItem).append(aluImg, aluName);
        $(input).append(aluItem);
        
        
        
    }
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
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
    
                    //console.log(fileType(buffer));
                    
                    if (fileType(buffer).mime.split("/")[0]=="image"){
                        var fs=require('fs');
                        
                        // WIP
                        
                        //oldImage="/tmp/test";
                        
                        //oldImage=self.configDir+"/classmates/"+self.config[alu].img;
                        
                        // Geting image name
                        var filename=newImage.split("/").pop();
                        var oldImage=self.configDir+"/classmates/"+filename;
                        
                        console.log(oldImage+ " - "+newImage);
                        
                        var stream=fs.createReadStream(newImage).pipe(fs.createWriteStream(oldImage));
                        
                        stream.on('close', function(){
                            // Wait for stream has been copied
                            $("#img"+alu).attr("src", "file://"+oldImage);

                            self.config[alu].img=filename;
                            //console.log(self.config);
                        });
                        
                        
                        
                        
                        
                        
                    }
                
                } catch (err){
                    console.log(err);
                }
                });
            
            $(fileselector).click();
            
            });  
    };
    
    ret.processDialog=function(){
        /*for (var month in self.config){
            var item="."+month+".monthStatusActive";
            var found=$("#monthConfig").find("[month_data="+month+"].monthStatusActive");
            if (found.length>0) self.config[month]=true; else self.config[month]=false;
        }
        
        // Apply changes to data in widget
        $("#monthComponent").attr("config", JSON.stringify(self.config));*/
        $("#classmatesComponent").attr("config", JSON.stringify(self.config));
        $("#btSave").click();
        
        
        
    };
    
        
    return ret;
};


