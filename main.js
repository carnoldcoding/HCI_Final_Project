//JQuery control functions
$(document).ready(function(){

    $(".url-bar").submit(function() {
        console.log("form submitted");
        //TODO do stuff
    });

});

//Form submit on enter keypress
$('input').keypress(function(event) {
    if (event.which == 13) {  //enter key = 13
        event.preventDefault();
        $(".url-bar").submit();
    }
});


