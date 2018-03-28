
function UtilsClass(){}

UtilsClass.prototype.resizeFonts=function resizeFonts(){
    
    //console.log(window.innerWidth+ " "+window.innerHeight);
    
    // RESIZE UI 
    // From: Original size 1280x967
    //var WinZoom=(window.innerWidth/1280)*100;
    
    
    console.log($("#gridster").css("width")+" "+$("#gridster").css("height")+" * "+$("#dashBoard").css("zoom"));
    
    
    // getting elements sizes and positions to scale entire workspace
    
    var X=0;
    var Y=0;
    var dbTop=$("#dashBoard").position().top;
    $(".component").each(function(index, item) {
        console.log($(item).position().left);
        
        var dimX=$(item).position().left+item.offsetWidth+30;
        var dimY=$(item).position().top+item.offsetHeight+10+dbTop;
        
        if (dimX>X) X=dimX;
        if (dimY>Y) Y=dimY;
    });
    // X and Y are max values for items.
    
    var WinZoomY=(window.innerHeight/Y)*100;
    var WinZoomX=(window.innerWidth/X)*100;
    var WinZoom=WinZoomX;
    if (WinZoomX>WinZoomY) WinZoom=WinZoomY;
    
    $("#dashBoard").css("zoom", WinZoom+"%");
    
    
    // Setting uppercase in Player mode if it's selected
    if (appGlobal.useUpperCase && appGlobal.mode==="player"){
            $("body").css("text-transform","uppercase");
            $("#header").css("text-transform","capitalize");
    } else {
        $("body").css("text-transform","capitalize");
    }
        
    // Resizes al fonts defined with fluid class according to its zoom component and its container
    $(".textfluid").each(function(){
        var zoom=$(this).attr("fontzoom");
        if (typeof(zoom)==="undefined") zoom=1;
        $(this).fitText(1/zoom);
    });
};


UtilsClass.prototype.getYoutubeInfo=function getYoutubeInfo(videoId){
    
    var gUrl="http://www.joamuran.net/classroom-assembly/getVideoInfo.php?id="+videoId;
    var response;
    
    $.ajax({
        async: false,
        url: gUrl,
        type: "GET",
        success: function(resp){
            try{
                response=resp.items[0].snippet;
            }   catch(err){return false;}
            },
        dataType: "json"
    });

    console.log(response);
    return response;
    
};

UtilsClass.prototype.copyFileToMedia=function copyFileToMedia(configdir, filepath){
    const md5File = require('md5-file');
    const fs=require("fs");
    const fse=require("fs-extra");
    
    var patharray=filepath.split("/");
    var filename=patharray[patharray.length-1];
       
    var destPath=configdir+"/media/"+filename;
       
    if (!fs.existsSync(configdir+"/media")) fs.mkdirSync(configdir+"/media");
       
    // alert("Copying "+filepath+" to "+destPath);
    if (fs.existsSync(destPath)) {//alert("File exists");
        
        // of filepath does not exists, user has no selected
        // any new file, so, the destpath is current destpath
        if (!fs.existsSync(filepath)) return destPath;
        
        var hash1 = md5File.sync(destPath);
        var hash2 = md5File.sync(filepath);
        
        if (hash1!==hash2) {
            var counter=0;
            
            do{
                destPath=configdir+"/media/"+counter+"_"+filename;
                counter++;
            } while (fs.existsSync(destPath));
            
            //alert("copying "+filepath+" to "+destPath);
            fse.copySync(filepath, destPath);
            
        } else {} // hash1==hash2 --> nothing to do. File exists
    } else {
        //alert("copying "+filepath+" to "+destPath);
        //alert("copying "+filepath+" to "+destPath);
        fse.copySync(filepath, destPath);
    }
    
    return destPath;
       
};


UtilsClass.prototype.recordAudio=function recordAudio(file, cb){
        var self=this;
        self.recording=false;
        self.initialStatus=true;
        self.submit_form=false;
    
        var textPrepare=i18n.gettext("Press.mic.to.record.audio");
        var dialogContent="<div class='microphone col-md-4 col-md-offset-4' id='recordAudio'></div><div class='col-md-6 col-md-offset-3 audioRecordMessage'><span id='audioRecordMessage'>"+textPrepare+"</span></div>";
        
         
         // Show dialog
         vex.dialog.open({
            message:  i18n.gettext("Recording.audio"),
            input: dialogContent,
            showCloseButton: true,
            escapeButtonCloses: false,
            overlayClosesOnClick: false,
            
             buttons: [
                $.extend({}, vex.dialog.buttons.NO, {
                    text: i18n.gettext("BtAcceptAudio"),
                    className: 'ActiveButtonAccept',
                    click: function () {
                        if(self.recording)  return false;
                        if(self.initialStatus) {
                            
                            vex.dialog.confirm({
                                message: i18n.gettext('quit.without.record'),
                                callback: function (value) {
                                if (value){
                                    self.submit_form=false; // return false to callback (not using audio)
                                    setTimeout(function(){ vex.closeTop(); }, 800);
                                }
                                return false;
                                }
                             });
                        } else{
                            // Audio has been recorded
                                self.submit_form=true; // return true to callback (use this audio)
                                vex.closeTop();
                        }
                        
                        return true;
                    
                        }
                    }),     // For Yes
                $.extend({}, vex.dialog.buttons.NO, {
                    text: i18n.gettext("BtPlayAudio"),
                    className: 'InActiveButtonPlay',
                    click: function () {
                        self.submit_form=false;
                        if (!self.recording &&  !self.initialStatus) {
                            appGlobal.playAudio(file);
                            //alert("Paying audio");
                        } else return false;
                    }
                   })
                ],    // For NO
            
            afterOpen:function(){
                self.submit_form=false;
                self.recording=false;
                const { spawn } = require('child_process');
                var proc;
                
                // Binding events here...
                $("#recordAudio").on("click", function(){
                    if(!self.recording){
                        $("#recordAudio").removeClass("microphone");
                        $("#recordAudio").addClass("microphoneRecording");
                        $(".ActiveButtonAccept").removeClass("ActiveButtonAccept").addClass("InActiveButtonAccept");
                        $(".ActiveButtonPlay").removeClass("ActiveButtonPlay").addClass("InActiveButtonPlay");
                        //$("#audioRecordMessage").empty();
                        $("#audioRecordMessage").html(i18n.gettext("Recording. Press mic to stop recording"));
                        self.recording=true;
                        
                        // Perform recording
                        
                        proc = spawn('arecord',[file]);
                        proc.on('close', (code, signal) => {
                          console.log(`child process terminated due to receipt of signal ${signal}`);
                          //alert("stop recording");
                        });
                        
                        
                        
                    } else{
                        $("#recordAudio").removeClass("microphoneRecording");
                        $("#recordAudio").addClass("microphone");
                        $(".InActiveButtonAccept").removeClass("InActiveButtonAccept").addClass("ActiveButtonAccept");
                        $(".InActiveButtonPlay").removeClass("InActiveButtonPlay").addClass("ActiveButtonPlay");
                        //$("#audioRecordMessage").empty();
                        $("#audioRecordMessage").html(i18n.gettext("Press mic to discard and record another audio"));
                        self.recording=false;
                        
                        // Stop recording process
                        //console.log("Time to kill...");
                        self.initialStatus=false;
                        proc.kill('SIGHUP');
                        
                        
                    }
                    
                });
                
                },
            /*beforeClose: function(){
                // Cleaning previous errors
                //alert("Before close. submit form is "+self.submit_form);
                //alert("Before close. self.recording is  "+self.recording);
                //console.log(self.recording+"*"+self.initialStatus);
                //if (!self.submit_form && !self.recording) return true;
                return true;
            },*/
            
            callback: function(){
                console.log("*************");
                console.log(self);
                cb(self.submit_form);
                }
            
            });

         
         // When dialog is shown, let's bind events for dialog
         //dialog.bindEvents();
         //Utils.resizeFonts();
    
}
