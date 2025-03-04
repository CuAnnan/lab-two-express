// IIFE
(function(){
    // some html elements
    let $searchButton;
    let $temperatureFeedback;
    let $pageFeedback;
    let $pageFeedbackValue;
    let $feedbackIcon;

    // some control variables
    let urlParts;
    // this one will be the result of the constraints variable for the current page
    let pageConstraints;

    // an associative array of values that map the html page to the json field in the data to search for
    // what value to use as the tipping point
    // and what the below color and above color should be for those tipping points
    const constraints = {
        'temperature':  {field:'temperatureCelsius', boundSeparator:20,     below:'blue',    above:'yellow'},
        'humidity':     {field:'humidity', boundSeparator:0.6, below:'lightblue', above:'gray'},
        'uv':           {field:'uvIndex', boundSeparator:5, below:'orange', above:'yellow'},
        'wind':         {field:'windSpeed', boundSeparator:19, below:'green', above:'orange'}
    };

    // helper functions
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

    /**
     * Returns the page part of the link, ie the part before the .html, and any get params that have been passed to it in
     * an associative array
     * @returns {{page: string, args: {}}}
     */
    function parseLocation()
    {

        let [url, argsString] =  document.location.href.split('?');
        let keyValuePairs = argsString?argsString.split('&'):[];
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

    function parseWeatherData(weatherData)
    {
        $pageFeedbackValue.innerHTML = weatherData;
        $pageFeedbackValue.dataset.weatherData = weatherData;
        if(parseInt(weatherData)>=pageConstraints.boundSeparator)
        {
            $feedbackIcon.style.color=pageConstraints.above;
        }
        else
        {
            $feedbackIcon.style.color=pageConstraints.below;
        }
    }

    window.addEventListener('load', function()
    {
        $pageFeedback =         $(`feedback`);
        $pageFeedbackValue =    $(`feedbackValue`);
        $feedbackIcon =         $('feedbackIcon');
        let $cityInput =          $('city');

        urlParts = parseLocation();
        let city = urlParts?.args?.city;
        if(city)
        {
            $cityInput.value = city;
            $$('nav ul li a').forEach((link) => {
                link.href = link.href.split('?')[0] + `?city=${city}`;
            });
        }

        if(urlParts.page && urlParts.page !== "index")
        {
            pageConstraints =constraints[urlParts.page];
            fetch(`/getWeatherJSON?city=${city}&field=${pageConstraints.field}`)
                .then(res=>res.json())
                .then(json=>{
                    parseWeatherData(json.data);
                });
            if(urlParts.page === 'temperature')
            {
                $('temperatureToggle').addEventListener('click', function(evt){
                    let celsius = evt.target.innerHTML === 'Celsius';
                    if(celsius)
                    {
                        evt.target.innerHTML = 'Farenheit';
                        $pageFeedbackValue.innerHTML = celsiusToFarenheit(parseInt($pageFeedbackValue.dataset.weatherData));
                    }
                    else
                    {
                        evt.target.innerHTML = 'Celsius';
                        $pageFeedbackValue.innerHTML = $pageFeedbackValue.dataset.weatherData;
                    }
                });
            }
        }


        $('citySearchButton').addEventListener('click', function(){
            let city = $cityInput.value;
            $('JSONFeedback').innerHTML = "";
            fetch('/getCityJSON?city='+city)
                .then(res=>res.json())
                .then(json=>{
                    if(json.errorCode)
                    {
                        $('JSONFeedback').innerHTML = json.errorMessage;
                    }
                    else
                    {
                        $$('nav ul li a').forEach((link) => {
                            link.href = link.href.split('?')[0] + `?city=${city}`;
                        });
                        if(urlParts.page && urlParts.page !== "index")
                        {
                            parseWeatherData(json.city[pageConstraints.field]);
                        }
                    }
                });
        });
    });
})();