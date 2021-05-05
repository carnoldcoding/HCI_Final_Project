//JQuery control functions
$(document).ready(function(){

    //Hover effect
    $(document).mousemove(function(event){
        var id = event.target.id;
        var tagName = event.target.tagName;

        // ignore certain elements
        if(id.indexOf('selector') !== -1 || tagName === 'BODY' || tagName === 'HTML' || tagName ==='I' || tagName ==='B') { 
            return;
        } 

        if (!$(event.target).parent().hasClass("card-body")){
            return;
        }

        // if (tagName !== "IMG" || tagName !== "P" || tagName !== "H4" || tagName !== "H5" ){
        //     return;
        // }


        //these elements form the sides of the outline around targeted/selected elements
        var elements = {                  
            top: $('#selector-top'),
            left: $('#selector-left'),
            right: $('#selector-right'),
            bottom: $('#selector-bottom')
        };

        //Store target element information
        var $target = event.target;
         targetOffset = $target.getBoundingClientRect(),
         targetHeight = targetOffset.height,
         targetWidth  = targetOffset.width;


        //Calculate position and height for the 4 selector elements (sides) based on target
        //The added/subtracted pixels form a 2 px gap between the selector box and the target
        elements.top.css({
            left:  (targetOffset.left - 4),
            top:   (targetOffset.top - 4),
            width: (targetWidth + 5)
        });
        
        elements.bottom.css({
            top:   (targetOffset.top + targetHeight + 1),
            left:  (targetOffset.left  - 3),
            width: (targetWidth + 4)
        });
        
        elements.left.css({
            left:   (targetOffset.left  - 5),
            top:    (targetOffset.top  - 4),
            height: (targetHeight + 8)
        });
        
        elements.right.css({
            left:   (targetOffset.left + targetWidth + 1),
            top:    (targetOffset.top  - 4),
            height: (targetHeight + 8)
        });
    });

    var selectedText = [];
    var selectedImgs = [];

    //Selecting elements
    $(document).click(function(event){
        var id = event.target.id;
        var tagName = event.target.tagName;

        // ignore certain elements
        if(id.indexOf('selector') !== -1 || tagName === 'BODY' || tagName === 'HTML') { 
            return;
        } 

        var selected = $(event.target).hasClass('selected');

        var isClickable = false;
        if ($(event.target).parent().hasClass("card-body") && id != "section1") isClickable = true;     //checks to see if clicked element is part of the webpage they're scraping        

        if (!selected && isClickable){                     //user clicked unselected element, so it's now selected. 
            $(event.target).addClass('selected');
            //Adding element to arrays for later download
            if (tagName === "IMG"){
                selectedImgs.push($(event.target).attr('src'));
            }
            if (tagName === "P" || tagName === "H5"){
                selectedText.push($(event.target).html());
            }
            
        }
        else {                                              //user clicked selected element, so it's deselected & removed from download list
            $(event.target).removeClass('selected');    
            if (tagName === "IMG"){
                var index = selectedImgs.indexOf($(event.target).attr('src'));
                if (index > -1) {
                    selectedImgs.splice(index, 1);
                  }
            }
            if (tagName === "P" || tagName === "H5"){
                var index = selectedText.indexOf($(event.target).html());
                if (index > -1) {
                    selectedText.splice(index, 1);
                  }

            }
        }

    });    

    //https://phppot.com/javascript/how-to-export-html-to-word-document-with-javascript/
    //https://qawithexperts.com/article/javascript/convert-html-to-word-with-images-using-javascript-or-using-j/251
    exportHTML = function exportHTML(){
        var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
             "xmlns:w='urn:schemas-microsoft-com:office:word' "+
             "xmlns='http://www.w3.org/TR/REC-html40'>"+
             "<head><meta charset='utf-8'></head><body>";

        var footer = "</body></html>";
        var fullHTML = header;

        var i;
        for (i = 0; i < selectedText.length; i++){
            fullHTML+=selectedText[i]+ "<br>";
        }
        fullHTML+=footer;
        
        var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(fullHTML);
        var fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'text.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }

    
    imgDL = function imgDL(){
        console.log("imgdl");
        console.log(selectedImgs);

        var i = 1;
        selectedImgs.forEach(function(selectedImgs){
              //https://stackoverflow.com/questions/17311645/download-image-with-javascript
            // var a = $("<a>")
            //     .attr("href", selectedImgs)
            //     .attr("download", String(i).concat(".jpeg"))
            //     .appendTo("body");
        
            // a[0].click();
            // a.remove();

            //https://stackoverflow.com/questions/283956/is-there-any-way-to-specify-a-suggested-filename-when-using-data-uri/16523173#16523173
            var link = document.createElement('a');
            link.download = String(i).concat(".jpeg");
            link.href = 'data:,' + selectedImgs;
            link.click();
            link.remove();
        
            i++;
        });
    }

//This uses JSZip.js, JSZip-Utils.js, and FileSaver.js but they dont load correctly and crash for some reason
        // var zip = new JSZIP();
        // var count = 0;
        
        // //https://gist.github.com/c4software/981661f1f826ad34c2a5dc11070add0f
        // selectedImgs.forEach(function(selectedImgs){
        //     var filename = count;
        //     // loading a file and add it in a zip file
        //     JSZipUtils.getBinaryContent(selectedImgs, function (err, data) {
        //        if(err) {
        //           throw err; // or handle the error
        //        }
        //        zip.file(filename, data, {binary:true});
        //        count++;
        //        if (count == urls.length) {
        //          zip.generateAsync({type:'blob'}).then(function(content) {
        //             saveAs(content, "imgs.zip");
        //          });
        //       }
        //     });
        // });

});

//Form submit on enter keypress
$('input').keypress(function(event) {
    if (event.which == 13) {  //enter key = 13
        event.preventDefault();
        $(".url-bar").submit();
    }
});

var exportHTML;

function doExport(){
    exportHTML();
}

var imgDL;

function doImgDL(){
    imgDL();
}


