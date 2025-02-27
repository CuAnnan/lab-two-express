// IIFE
(function(){
    let $searchButton;
    let $temperatureFeedback;
    function $(elementId)
    {
        return document.getElementById(elementId);
    }

    function $$(querySelector)
    {
        return document.querySelectorAll(querySelector);
    }

    function celsiusToFarenheit(celsius)
    {
        //(0°C × 9/5) + 32 = 32°F
        return celsius * 9 / 5 + 32;
    }

    function parseLocation()
    {

        let [url, argsString] =  document.location.href.split('?');
        let keyValuePairs = argsString.split('&');
        let args = {}
        for(let keyValuePair of keyValuePairs)
        {
            let [key, value] = keyValuePair.split('=');
            args[key] = value;
        }
        return {
            page:url.split('/').pop().split('.')[0],
            args
        }
    }

    window.addEventListener('load', function()
    {
        let $pageFeedback = $(`feedback`);
        let $pageFeedbackValue = $(`feedbackValue`);
        let $feedbackIcon = $('feedbackIcon');
        let urlParts = parseLocation();
        console.log(urlParts);
        $('citySearchButton').addEventListener('click', function(){
            let city = $('city').value;
            fetch('/getJSON?city='+city)
                .then(res=>res.json())
                .then(json=>{
                    $$('nav ul li a').forEach((link)=>{
                        link.href = link.href.split('?')[0]+`?city=${city}`;
                    });
                });
        });

    });
})();