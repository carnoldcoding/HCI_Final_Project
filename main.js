//JQuery control functions
$(document).ready(function() {

    //Hover effect
    $(document).mousemove(function(event) {
        var id = event.target.id;
        var tagName = event.target.tagName;

        // ignore certain elements
        if (id.indexOf('selector') !== -1 || tagName === 'BODY' || tagName === 'HTML' || tagName === 'I' ||
            tagName === 'B' || !$(event.target).parent().hasClass("card-body") || id === "section1" ||
            $(event.target).hasClass("row-center") || $(event.target).hasClass("col")) {
            return;
        }

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
            targetWidth = targetOffset.width;


        //Calculate position and height for the 4 selector elements (sides) based on target
        //The added/subtracted pixels form a 2 px gap between the selector box and the target
        elements.top.css({
            left: (targetOffset.left - 4),
            top: (targetOffset.top - 4),
            width: (targetWidth + 5)
        });

        elements.bottom.css({
            top: (targetOffset.top + targetHeight + 1),
            left: (targetOffset.left - 3),
            width: (targetWidth + 4)
        });

        elements.left.css({
            left: (targetOffset.left - 5),
            top: (targetOffset.top - 4),
            height: (targetHeight + 8)
        });

        elements.right.css({
            left: (targetOffset.left + targetWidth + 1),
            top: (targetOffset.top - 4),
            height: (targetHeight + 8)
        });
    });

    //Prevent the selector box from being 'sticky'
    //Detects scrolling on any element and the window itself, then resets width and position of selector sides to 0
    //and it works with the transition animation, which is neat!
    $('*').add(document).scroll(function(event) {
        var elements = {
            top: $('#selector-top'),
            left: $('#selector-left'),
            right: $('#selector-right'),
            bottom: $('#selector-bottom')
        };

        elements.top.css({
            left: 0,
            top: 0,
            width: 0
        });

        elements.bottom.css({
            top: 0,
            left: 0,
            width: 0
        });

        elements.left.css({
            left: 0,
            top: 0,
            height: 0
        });

        elements.right.css({
            left: 0,
            top: 0,
            height: 0
        });
    });

    //arrays for storing selected elements for later
    var selectedText = [];
    var selectedImgs = [];

    //Selecting elements
    $(document).click(function(event) {
        var id = event.target.id;
        var tagName = event.target.tagName;

        // ignore certain elements
        if (id.indexOf('selector') !== -1 || tagName === 'BODY' || tagName === 'HTML' || $(event.target).hasClass("row-center")) {
            return;
        }

        var selected = $(event.target).hasClass('selected');

        //check to see if clicked element is part of the webpage they're scraping (so inside the card boxes)
        var isClickable = false;
        if ($(event.target).parent().hasClass("card-body") && id != "section1") isClickable = true;

        if (!selected && isClickable) { //user clicked unselected element, so it's now selected. 
            $(event.target).addClass('selected');
            //Adding element to arrays for later download
            if (tagName === "IMG") {
                selectedImgs.push($(event.target).attr('src'));
            }
            if (tagName === "P" || tagName === "H5") {
                selectedText.push($(event.target).html());
            }

        } else { //user clicked selected element, so it's deselected & removed from download list
            $(event.target).removeClass('selected');
            if (tagName === "IMG") {
                var index = selectedImgs.indexOf($(event.target).attr('src'));
                if (index > -1) {
                    selectedImgs.splice(index, 1);
                }
            }
            if (tagName === "P" || tagName === "H5") {
                var index = selectedText.indexOf($(event.target).html());
                if (index > -1) {
                    selectedText.splice(index, 1);
                }

            }
        }

        //And finally, check status of selected text/img arrays to see if empty or not, then update buttons accordingly

        if (selectedText.length <= 0) { //if empty
            $("#txt-btn").html("Download All Text");
        } else { //if not empty (something is selected)
            $("#txt-btn").html("Download Selected Text");
        }

        if (selectedImgs.length <= 0) {
            $("#img-btn").html("Download All Images");
        } else {
            $("#img-btn").html("Download Selected Images");
        }
    });

    //https://phppot.com/javascript/how-to-export-html-to-word-document-with-javascript/
    //https://qawithexperts.com/article/javascript/convert-html-to-word-with-images-using-javascript-or-using-j/251
    exportHTML = function exportHTML() {
        if (selectedText.length <= 0) {
            return;
        }
        var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'></head><body>";

        var footer = "</body></html>";
        var fullHTML = header;

        var i;
        for (i = 0; i < selectedText.length; i++) {
            fullHTML += selectedText[i] + "<br>";
        }
        fullHTML += footer;

        var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(fullHTML);
        var fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'text.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }


    imgDL = function imgDL() {

        var i = 1;

        selectedImgs.forEach(function(selectedImgs){
              //https://stackoverflow.com/questions/17311645/download-image-with-javascript
            //https://stackoverflow.com/questions/283956/is-there-any-way-to-specify-a-suggested-filename-when-using-data-uri/16523173#16523173
            var link = document.createElement('a');
            link.download = String(i).concat(".jpg");
            link.href = 'data:,' + selectedImgs;
            link.click();
            link.remove();

            i++;
        });
    }


        //This uses JSZip.js, JSZip-Utils.js, and FileSaver.js but they dont load correctly and crash for some reason. Probably wouldn't work anyways. But this is how we'd download multiple files.
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
    if (event.which == 13) { //enter key = 13
        event.preventDefault();
        $(".url-bar").submit();
    }
});

var exportHTML;

function doExport() {
    exportHTML();
}

var imgDL;

function doImgDL() {
    imgDL();
}


function table1() {
    var table = document.getElementById("TableParse");
    var select1 = document.getElementById("Table-Select");
    var twitterHTML = '<thead>' +
        '<td>' +
        '<h3 style="text-align:center">Twitter Handles</h3>' +
        '</td>' +
        '<tr>' +
        '<th scope="col">#</th>' +
        '<th scope="col">First</th>' +
        '<th scope="col">Last</th>' +
        '<th scope="col">Handle</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr>' +
        '<th scope="row">1</th>' +
        '<td>Joe</td>' +
        '<td>Biden</td>' +
        '<td>@POTUS</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">2</th>' +
        '<td>John</td>' +
        '<td>Austin</td>' +
        '<td>@tweeter</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">3</th>' +
        '<td>Kevin</td>' +
        '<td>Carter</td>' +
        '<td>@Kevin</td>' +
        '</tr>' +
        '</tbody>';

    var emailHMTL = '<table>' +
        '<thead>' +
        '<br>' +
        '<td>' +
        '<h3 style="text-align:center">Emails</h3>' +
        '</td>' +
        '<tr>' +
        '<th scope="col">#</th>' +
        '<th scope="col">First</th>' +
        '<th scope="col">Last</th>' +
        '<th scope="col">Email</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr>' +
        '<th scope="row">1</th>' +
        '<td>Joe</td>' +
        '<td>Biden</td>' +
        '<td>jb@gmail.com</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">2</th>' +
        '<td>John</td>' +
        '<td>Austin</td>' +
        '<td>jAust@gmail.com</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">3</th>' +
        '<td>Kevin</td>' +
        '<td>Carter</td>' +
        '<td>kevin@gmail.com</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';

    if (select1.value == "email") {
        console.log(table.innerHTML);
        table.innerHTML = "";
        table.innerHTML = emailHMTL;
        console.log(table.innerHTML);
    } else if (select1.value == "twitter") {
        console.log(table.innerHTML);
        table.innerHTML = "";
        table.innerHTML = twitterHTML;
        console.log(table.innerHTML);
    } else {
        table.innerHTML = "";
        table.innerHTML = twitterHTML;
    }
}