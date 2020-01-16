var newLocation = "Perth";
$(function () {

    chrome.storage.sync.get('Loc', function (location) {
        $('#greet').text(location.Loc);
    });

    chrome.storage.sync.get('currentTemp', function (temperature) {
        $('#curTemp').text(temperature.currentTemp);
    });

    chrome.storage.sync.get('currentTempC', function (temperature) {
        $('#curTempC').text(temperature.currentTempC);
    });

    chrome.storage.sync.get('wicon', function (iconurl) {
        $('#wicon').attr('src',iconurl.wicon);
    });
    
    chrome.storage.sync.get('lastRefresh', function (lastTime) {
        $('#lastRefresh').text(lastTime.lastRefresh);
    });

    
    $('#setLoc').click(function () {
        chrome.storage.sync.get('Loc', function (location) {
            
            location.Loc = $('#name').val();
            if (location.Loc) {
                newLocation = location.Loc;
            }

            chrome.storage.sync.set({ 'Loc': newLocation });

            $('#greet').text(newLocation);
            $('#name').val('');
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${newLocation}&APPID=<your API key goes here>`;

            
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const {temp} = data.main;
                    //const {ico} = data.weather[0].icon;
                    var KtoF = (temp*9.0/5) - 459.67;
                    KtoF = KtoF.toFixed(0);
                    $('#curTemp').text( KtoF );
                    chrome.storage.sync.set({ 'currentTemp': KtoF });

                    var KtoC = temp - 273.15;
                    KtoC = KtoC.toFixed(0);
                    $('#curTempC').text( KtoC );
                    chrome.storage.sync.set({ 'currentTempC': KtoC });

                    var iconcode = data.weather[0].icon;
                    var iconurl = `http://openweathermap.org/img/w/${iconcode}.png`;
                    $('#wicon').attr('src', iconurl);
                    chrome.storage.sync.set({ 'wicon': iconurl });
                
                    var dateTime = new Date();
                    var mins = dateTime.getMinutes();
                    var hrs = dateTime.getHours();
                    var lastRefreshTime = `${hrs}:${mins}`;
                    $('#lastRefresh').text(lastRefreshTime);
                    chrome.storage.sync.set({'lastRefresh': lastRefreshTime });
                });

            
        });
    });

    $('#refresh').click(function () {
        chrome.storage.sync.get('Loc', function (location) {
            location.Loc = $('#greet').text();
        

            const url = `http://api.openweathermap.org/data/2.5/weather?q=${location.Loc}&APPID=<your API key goes here>`;

            
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const {temp} = data.main;
                    var KtoF = (temp*9.0/5) - 459.67;
                    KtoF = KtoF.toFixed(0);

                    var iconcode = data.weather[0].icon;
                    var iconurl = `http://openweathermap.org/img/w/${iconcode}.png`;
                    
                    var KtoC = temp - 273.15;
                    KtoC = KtoC.toFixed(0);
                
                    var dateTime = new Date();
                    var mins = dateTime.getMinutes();
                    var hrs = dateTime.getHours();
                    var lastRefreshTime = `${hrs}:${mins}`;

                    $('#curTemp').text( KtoF );
                    $('#curTempC').text( KtoC );
                    $('#wicon').attr('src', iconurl);
                    $('#lastRefresh').text(lastRefreshTime);
                    chrome.storage.sync.set({ 'currentTemp': KtoF });
                    chrome.storage.sync.set({ 'currentTempC': KtoC });
                    chrome.storage.sync.set({ 'wicon': iconurl });
                    chrome.storage.sync.set({'lastRefresh': lastRefreshTime });
                });

        });
    });
});
