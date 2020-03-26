!function initTimer() {
    function getTimerValue() {
        var date = new Date()
        var hour = date.getHours()
        var minute = date.getMinutes()
        if (hour < 10) {
            hour = '0' + hour
        }
        if (minute < 10) {
            minute = '0' + minute
        }
        return hour + ' : ' + minute
    }
    var timer = document.getElementById('timer')
    var time = getTimerValue()
    timer.innerHTML = time
    return setInterval(function () {
        var newTime = getTimerValue()
        if (newTime === time) {
            return
        } else {
            timer.innerHTML = newTime
            time = newTime
        }
    }, 5000)
}()

!function initSearchBar() {
    var searchEngines = {
        'baidu': '百度',
        'google': '谷歌',
        'bing': '必应',
        'sogou': '搜狗'
    }
    var searchEngineChosen = 'baidu'
    var searchEngine = document.getElementById('searchEngine')
    var searchBar = document.getElementById('searchBar')
    var search = document.getElementById('search')
    var engines = Object.keys(searchEngines)
    var engineString = ''

    for (var i = 0; i < engines.length; i++) {
        engineString += '<option value="' + engines[i] + '">' + searchEngines[engines[i]] + '</option>'
    }

    searchEngine.innerHTML = engineString
    searchEngine.addEventListener('change', function () {
        searchEngineChosen = searchEngine.value
    }, false)

    search.addEventListener('click', function () {
        var searchString = searchBar.value || ''
        switch (searchEngineChosen) {
            case 'baidu': {
                location.href = 'https://www.baidu.com/s?ie=utf-8&wd=' + searchString
                break
            }
            case 'google': {
                location.href = 'https://www.google.com/search?q=' + searchString
                break
            }
            case 'sogou': {
                location.href = 'http://www.sogou.com/web?query=' + searchString
                break
            }
            case 'bing': {
                location.href = 'https://www.bing.com/search?q=' + searchString
                break
            }
        }
    }, false)
}()

!function initShortcuts() {
    var shortcut = document.getElementById('shortcut')
    var shortcutString = ''
    var defaultSrc = '/assets/default-icon.png'
    var shortcuts = [
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' },
        { url: '', pic: '' }
    ]
    if (chrome && chrome.storage && chrome.storage.sync && chrome.storage.sync.get) {
        chrome.storage.sync.get('shortcuts', function (item) {
            if (Object.prototype.toString.call(item) === '[object Array]') {
                shortcuts = item
            }
        })
    }
    for (var i = 0; i < shortcuts.length; i++) {
        shortcutString += '<li class="shortcut" id="shortcut' + i + '">'
            + '<div class="shortcut-frame"><img src="' + (shortcuts[i].pic || defaultSrc) + '" class="shortcut-pic"></div></li>'
    }
    shortcut.innerHTML = shortcutString
}()

!function initWeatherPlugin () {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.seniverse.com/v3/weather/now.json?key=Szn1FPHrDWKiAAeDZ&location=beijing&language=zh-Hans&unit=c')
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText)
            console.log(response)
        }
    }
    xhr.send()
}()