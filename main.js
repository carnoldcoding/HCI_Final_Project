//JQuery control functions
$(document).ready(function(){

    // $(".url-bar").submit(function() {
    // });

    $(document).mousemove(function(event){
        var id = event.target.id;
        var tagName = event.target.tagName;

        // ignore certain basic elements
        if(id.indexOf('selector') !== -1 || tagName === 'BODY' || tagName === 'HTML') { 
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


        //TODO follow the instructions, make it so if user clicks on targeted element, that element gets a gray outline or something


    });

});

//Form submit on enter keypress
$('input').keypress(function(event) {
    if (event.which == 13) {  //enter key = 13
        event.preventDefault();
        $(".url-bar").submit();
    }
});


