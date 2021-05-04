//JQuery control functions
$(document).ready(function(){

    // $(".url-bar").submit(function() {
    // });

});

//Form submit on enter keypress
$('input').keypress(function(event) {
    if (event.which == 13) {  //enter key = 13
        event.preventDefault();
        $(".url-bar").submit();
    }
});


