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
        var aluImg=$(document.createElement("img")).attr("src", "components/classmates/img/"+self.config[alu].img).addClass("col-md-6 aluImg");
        var aluName=$(document.createElement("div")).html(self.config[alu].name).addClass("col-md-6 aluName");
        //var configRow=$(document.createElement("div"));
        $(aluItem).append(aluImg, aluName);
        $(input).append(aluItem);
        
        
        
    }
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        $(".monthConfigRow").on("click", function(){
            
            if($(this).hasClass("monthStatusActive")) $(this).removeClass("monthStatusActive");
            else $(this).addClass("monthStatusActive");
            });  
    };
    
    ret.processDialog=function(){
        for (var month in self.config){
            var item="."+month+".monthStatusActive";
            var found=$("#monthConfig").find("[month_data="+month+"].monthStatusActive");
            if (found.length>0) self.config[month]=true; else self.config[month]=false;
        }
        
        // Apply changes to data in widget
        $("#monthComponent").attr("config", JSON.stringify(self.config));
        
        
    };
    
        
    return ret;
};


