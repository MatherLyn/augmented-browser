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
        baidu: {
            name: '百度',
            pic: '../assets/baidu.png'
        },
        google: {
            name: '谷歌',
            pic: '../assets/google.png'
        },
        bing: {
            name: '必应',
            pic: '../assets/bing.png'
        },
        sogou: {
            name: '搜狗',
            pic: '../assets/sogou.png'
        }
    }
    var searchEngine = document.getElementById('searchEngine')
    var searchBar = document.getElementById('searchBar')
    var search = document.getElementById('search')
    var engines = Object.keys(searchEngines)
    var engineString = ''

    for (var i = 0; i < engines.length; i++) {
        engineString += '<li class="search-engine-option ' + (i == 0 ? 'search-engine-first' : '') + '" style="background-image:url(' + searchEngines[engines[i]].pic + ')" id="' + engines[i] + '"></li>'
    }
    //<img class="search-engine-pic" src="' + searchEngines[engines[i]].pic + '" alt="' + searchEngines[engines[i]].name + '">
    engineString += '<li class="search-engine-option"><img class="search-engine-pic" id="currentChosen" src="" alt=""></li>'

    searchEngine.innerHTML = engineString

    var choosing = false
    var searchEngineFirst = document.getElementsByClassName('search-engine-first')[0]
    var currentChosen = document.getElementById('currentChosen')
    var searchEngineChosen = 'baidu'
    try {
        chrome.storage.sync.get({searchEngineChosen}, function (item) {
            console.log(item)
            searchEngineChosen = item['searchEngineChosen']
            currentChosen.setAttribute('src', searchEngines[searchEngineChosen].pic)
            currentChosen.setAttribute('alt', searchEngines[searchEngineChosen].name)
            console.log('Get search engine option in storage.')
        })
    } catch {
        console.log('Unable to get search engine option in storage.')
    }
    searchEngine.addEventListener('click', function (event) {
        choosing = !choosing
        if (choosing) {
            searchEngineFirst.style.marginTop = 0
            searchEngine.classList.remove('search-engine-default')
        } else {
            searchEngineChosen = event.target.id
            try {
                chrome.storage.sync.set({'searchEngineChosen': searchEngineChosen}, function() {
                    console.log('Search engine option saved.')
                })
            } catch (e) {
                console.log('Unable to save search engine option.')
            }
            currentChosen.setAttribute('src', searchEngines[searchEngineChosen].pic)
            searchEngineFirst.style.marginTop = '-12rem'
            searchEngine.classList.add('search-engine-default')
            searchBar.focus()
        }
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
    var shortcutString = ''
    var shortcutPagingString = ''
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
    var pagingNum = 2
    var currentPaging = 0
    var len = shortcuts.length
    var itemNumInOnePage = Math.ceil(len / pagingNum)

    // init doms
    for (var i = 0; i < pagingNum; i++) {
        shortcutString += '<ul class="shortcut-page ' + (i === 0 ? 'shortcut-first-page' : '') + '" id="shortcutPage' + i + '">'
        for (var j = 0; j < itemNumInOnePage; j++) {
            shortcutString += '<li class="shortcut">'
                + '<div class="shortcut-frame" id="shortcut' + (i * itemNumInOnePage + j) + '"></div></li>'
        }
        shortcutString += '</ul>'
    }

    try {
        chrome.storage.sync.get({shortcuts}, function (item) {
            console.log(123123)
            console.log(item)
            if (Object.prototype.toString.call(item.shortcuts) === '[object Array]') {
                if (shortcuts.length < item.shortcuts.length) {
                    shortcuts = shortcuts.slice(0, item.shortcuts.length)
                }
                for (var i = 0; i < item.shortcuts.length; i++) {
                    if (item.shortcuts[i].url !== '' && item.shortcuts[i].pic !== '') {
                        shortcuts[i] = item.shortcuts[i]
                    }
                }
                console.log('Get shortcuts options in storage.')
            } else {
                try {
                    chrome.storage.sync.set({'shortcuts': shortcuts}, function () {
                        console.log('Shortcuts options saved.')
                    })
                } catch (e) {
                    console.log('Unable to save hortcuts options in storage.')
                }
            }
        })
    } catch (e) {
        console.log('Unable to get shortcut option in storage.')
    }

    var shortcutList = document.getElementById('shortcutList')
    shortcutList.innerHTML = shortcutString

    var shortcutPaging = document.getElementById('shortcutPaging')
    for (var i = 0; i < pagingNum; i++) {
        shortcutPagingString += '<div class="shortcut-paging-button' + (i === 0 ? ' shortcut-paging-focus' : '') + '" id="shortcutPaging' + i + '"></div>'
    }
    shortcutPaging.innerHTML = shortcutPagingString





    // add events
    shortcutList.addEventListener('click', function (event) {
        var id = event.target.id
        if (/^shortcut\d+$/.test(id)) {
            var index = parseInt(id.substring(8))
            if (shortcuts[index].url === '' && shortcuts[index].pic === '') {
                // add one input for initializing shortcut url

            } else {
                window.location.href = shortcuts[index].url
            }
        }
    }, false)


    shortcutPaging.addEventListener('click', function (event) {
        if (/\d$/.test(event.target.id)) {
            var paging = document.getElementsByClassName('shortcut-paging-button')
            var index = parseInt(event.target.id.substring(14))
            var firstPage = document.getElementById('shortcutPage0')
            if (currentPaging === index) {
                return
            } else {
                currentPaging = index
                firstPage.style.marginLeft = -currentPaging * 100 + '%'
                for (var i = 0; i < paging.length; i++) {
                    if (i === index) {
                        paging[i].classList.add('shortcut-paging-focus')
                    } else {
                        paging[i].classList.remove('shortcut-paging-focus')
                    }
                }
            }
        }
        
    }, false)
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