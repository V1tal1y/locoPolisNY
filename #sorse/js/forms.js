
/* 
    

    $('form').submit(function(event){
        data_form = $(this).serialize();
        $.ajax({
        url: "send.php",
        type: "POST",
        data: data_form,
        dataType: "html",
        success: funcS
        });
        return false;
    });

    function explode(){
        $('.shadow, .sf').fadeOut('slow');
    }
    function funcS(){
        $('.sf1, .sf2').fadeOut('slow')
        $('.shadow, .sf3').fadeIn('slow');
        setTimeout(explode, 3000);
    }
    
*/
