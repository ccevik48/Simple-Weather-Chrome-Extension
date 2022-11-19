let newLocation = "";
document.addEventListener("DOMContentLoaded", () => {

    chrome.storage.sync.get('Loc', function (location) {
        document.getElementById("greet").innerText = location.Loc;
    });

    chrome.storage.sync.get('currentTemp', function (temperature) {
        document.getElementById("curTemp").innerText = temperature.currentTemp;
    });

    chrome.storage.sync.get('currentTempC', function (temperature) {
        document.getElementById("curTempC").innerText = temperature.currentTempC;
    });

    chrome.storage.sync.get('wicon', function (iconurl) {
        console.log("url: ", iconurl)
        document.getElementById("wicon").setAttribute('src', iconurl.wicon);
    });

    chrome.storage.sync.get('lastRefresh', function (lastTime) {
        document.getElementById("lastRefresh").innerText = lastTime.lastRefresh;
    });
    
    var btn = document.getElementById("setLoc")
    // document.getElementById("setLoc").click(function () {
    btn.addEventListener('click',function() {
        chrome.storage.sync.get('Loc', function (location) {
            
            location.Loc = document.getElementById("name").value;
            if (location.Loc) {
                newLocation = location.Loc;
            }

            chrome.storage.sync.set({ 'Loc': newLocation });

            document.getElementById("greet").innerText = newLocation;
            document.getElementById("name").value = '';
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${newLocation}&APPID=<API KEY GOES HERE>`

            console.log("042: ", url)

            
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const {temp} = data.main;
                    console.log(data)
                    let KtoF = (temp*9.0/5) - 459.67;
                    KtoF = KtoF.toFixed(0);
                    document.getElementById("curTemp").innerText =  KtoF ;
                    chrome.storage.sync.set({ 'currentTemp': KtoF });

                    let KtoC = temp - 273.15;
                    KtoC = KtoC.toFixed(0);
                    document.getElementById("curTempC").innerText =  KtoC ;
                    chrome.storage.sync.set({ 'currentTempC': KtoC });

                    let iconcode = data.weather[0].icon;
                    let iconurl = `http://openweathermap.org/img/w/${iconcode}.png`
                    console.log(iconurl)
                    document.getElementById("wicon").setAttribute('src', iconurl)
                    
                    chrome.storage.sync.set({ 'wicon': iconurl });

                    let dateTime = new Date();
                    let month = dateTime.getMonth() + 1;
                    let days = dateTime.getDate();
                    let mins = dateTime.getMinutes();
                    let minsZero = "0";
                    let hrs = dateTime.getHours();
                    if(mins < 10) {
                        minsZero += mins;
                    }
                    else {
                        minsZero = mins;
                    }
                    if(hrs != 12) {
                        hrs = hrs%12;
                    }
                    let lastRefreshTime = `${month}/${days}  ${hrs}:${minsZero}`;
                    document.getElementById("lastRefresh").innerText = lastRefreshTime;
                    chrome.storage.sync.set({'lastRefresh': lastRefreshTime });
                });

            
        });
    });

    var rfrsh = document.getElementById("refresh")
    rfrsh.addEventListener('click',function() {
        console.log("refreshing... ")
        chrome.storage.sync.get('Loc', function (location) {
            location.Loc = document.getElementById("greet").innerText;
            newLocation = location.Loc
            console.log(location.Loc," amd ", newLocation)
        

            const url = `http://api.openweathermap.org/data/2.5/weather?q=${newLocation}&APPID=<API KEY GOES HERE>`

            console.log("102: ", url)
            
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                    const {temp} = data.main;
                    let KtoF = (temp*9.0/5) - 459.67;
                    KtoF = KtoF.toFixed(0);

                    let iconcode = data.weather[0].icon;
                    console.log("iconcode: "+iconcode)
                    let iconurl = `http://openweathermap.org/img/w/${iconcode}.png`
                    
                    let KtoC = temp - 273.15;
                    KtoC = KtoC.toFixed(0);

                    let dateTime = new Date();
                    let month = dateTime.getMonth() + 1;
                    let days = dateTime.getDate();
                    let mins = dateTime.getMinutes();
                    let minsZero = "0";
                    if(mins < 10) {
                        minsZero += mins;
                    }
                    else {
                        minsZero = mins;
                    }
                    let hrs = dateTime.getHours();
                    if(hrs != 12) {
                        hrs = hrs%12;
                    }
                    let lastRefreshTime = `${month}/${days}  ${hrs}:${minsZero}`;

                    document.getElementById("curTemp").innerText =  KtoF ;
                    document.getElementById("curTempC").innerText =  KtoC ;
                    // document.getElementById("wicon").attr('src', iconurl);
                    document.getElementById("wicon").setAttribute('src', iconurl);
                    // pic3 = iconurl
                    document.getElementById("lastRefresh").innerText = lastRefreshTime;
                    chrome.storage.sync.set({ 'currentTemp': KtoF });
                    chrome.storage.sync.set({ 'currentTempC': KtoC });
                    chrome.storage.sync.set({ 'wicon': iconurl });
                    chrome.storage.sync.set({'lastRefresh': lastRefreshTime });
                });

        });
    });
});
