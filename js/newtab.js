// A global toolkit for development.
function Toolkit() {
    this.store = new Store()
    // Tookit is a Singleton
    if (typeof Toolkit.instance === 'object') {
        return Toolkit.instance
    }
    Toolkit.instance = this
    return this
}

// A global store for managing data.
function Store () {
    this.searchEngines = {
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
    this.shortcuts = [
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
    // 3 states:
    //  0: view mode
    //  1: route mode
    //  2: settings mode
    this.state = 0
    // Store is also a Singleton
    if (typeof Store.instance === 'object') {
        return Store.instance
    }
    Store.instance = this
    return this
}

// Use setInterval to initialize a timer.
function initTimer() {
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
    // This is a closure, which means timer will not be recoveried.
    return setInterval(function () {
        var newTime = getTimerValue()
        if (newTime === time) {
            return
        } else {
            timer.innerHTML = newTime
            time = newTime
        }
    }, 5000)
}

// 
function initSearchBar(toolkit) {
    var searchEngine = document.getElementById('searchEngine')
    var searchBar = document.getElementById('searchBar')
    var search = document.getElementById('search')
    var bgContainer = document.getElementById('bgContainer')
    var engines = Object.keys(toolkit.store.searchEngines)
    var engineString = ''

    for (var i = 0; i < engines.length; i++) {
        engineString += '<li class="search-engine-option ' + (i == 0 ? 'search-engine-first' : '') + '" style="background-image:url(' + toolkit.store.searchEngines[engines[i]].pic + ')" id="' + engines[i] + '"></li>'
    }
    // <li class="search-engine-option{{ i == 0 ? ' search-engine-first' : '' }}" style="background-image:url({{ toolkit.store.searchEngines[engines[i]].pic }})" id="{{ engines[i] }}"></li>
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
            currentChosen.setAttribute('src', toolkit.store.searchEngines[searchEngineChosen].pic)
            currentChosen.setAttribute('alt', toolkit.store.searchEngines[searchEngineChosen].name)
            console.log('Get search engine option in storage.')
        })
    } catch {
        console.log('Unable to get search engine option in storage.')
    }


    // add events
    document.addEventListener('click', function (event) {
        console.log(event.target)
    }, false)

    searchEngine.addEventListener('click', function (event) {
        choosing = !choosing
        console.log(choosing)
        if (choosing) {
            searchEngineFirst.style.marginTop = 0
            searchEngine.classList.remove('search-engine-default')
        } else {
            if (event.target.id === 'baidu' || event.target.id === 'google' || event.target.id === 'bing' || event.target.id === 'sogou') {
                if (searchEngineChosen !== event.target.id) {
                    searchEngineChosen = event.target.id
                    try {
                        chrome.storage.sync.set({'searchEngineChosen': searchEngineChosen}, function() {
                            console.log('Search engine option saved.')
                        })
                    } catch (e) {
                        console.log('Unable to save search engine option.')
                    }
                    currentChosen.setAttribute('src', toolkit.store.searchEngines[searchEngineChosen].pic)
                }
            }
            searchEngineFirst.style.marginTop = '-12rem'
            searchEngine.classList.add('search-engine-default')
        }
        searchBar.focus()
    }, false)

    searchBar.addEventListener('click', function (event) {
        bgContainer.style.webkitFilter = 'blur(2px)'
        bgContainer.style.transform = 'scale(1.1)'
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

    bgContainer.addEventListener('click', function () {
        if (choosing) {
            searchEngineFirst.style.marginTop = '-12rem'
            searchEngine.classList.add('search-engine-default')
            choosing = !choosing
        }
        bgContainer.style.webkitFilter = 'blur(0px)'
        bgContainer.style.transform = 'scale(1)'
    }, false)

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            if (document.activeElement.id === 'searchBar') {
                search.click()
            } else {
                searchBar.click()
                searchBar.focus()
            }
        }
    }, false)
}

function initShortcuts(toolkit) {
    var shortcutString = ''
    var shortcutPagingString = ''
    var pagingNum = 2
    var currentPaging = 0
    var len = toolkit.store.shortcuts.length
    var itemNumInOnePage = Math.ceil(len / pagingNum)
    var bgContainer = document.getElementById('bgContainer')
    var searchBar = document.getElementById('searchBar')
    var timerContainer = document.getElementById('timerContainer')
    var searchBarContainer = document.getElementById('searchBarContainer')
    var shortcutContainer = document.getElementById('shortcutContainer')
    var settingsBtn = document.getElementById('settingsBtn')
    var settings = document.getElementById('settings')

    // Init doms
    // Init shortcuts page
    for (var i = 0; i < pagingNum; i++) {
        shortcutString += '<ul class="shortcut-page ' + (i === 0 ? 'shortcut-first-page' : '') + '" id="shortcutPage' + i + '">'
        for (var j = 0; j < itemNumInOnePage; j++) {
            shortcutString += '<li class="shortcut">'
                + '<div class="shortcut-frame" id="shortcut' + (i * itemNumInOnePage + j) + '"></div></li>'
        }
        shortcutString += '</ul>'
    }

    console.log()

    var shortcutList = document.getElementById('shortcutList')
    shortcutList.innerHTML = shortcutString

    // Init shortcut paging buttons
    var shortcutPaging = document.getElementById('shortcutPaging')
    for (var i = 0; i < pagingNum; i++) {
        shortcutPagingString += '<div class="shortcut-paging-button' + (i === 0 ? ' shortcut-paging-focus' : '') + '" id="shortcutPaging' + i + '"></div>'
    }
    shortcutPaging.innerHTML = shortcutPagingString

    // Init shortcut settings
    var shortcutSettings = document.getElementById('shortcutSettings')
    var shortcutSettingsString = '<div class="settings-item-container-title">快捷方式</div>'
    for (var i = 0; i < len; i++) {
        shortcutSettingsString += '<li class="settings-item"><label for="shortcutConfig' + i + '">' + (i + 1) + '</label><input type="text" name="shortcutConfig' + i + '" id="shortcutConfig' + i + '"></li>'
    }
    shortcutSettings.innerHTML = shortcutSettingsString

    // get the store from storage
    try {
        chrome.storage.sync.get({'shortcuts': toolkit.store.shortcuts}, function (item) {
            console.log(item)
            if (Object.prototype.toString.call(item.shortcuts) === '[object Array]') {
                if (len < item.shortcuts.length) {
                    toolkit.store.shortcuts = toolkit.store.shortcuts.slice(0, item.shortcuts.length)
                }
                for (var i = 0; i < item.shortcuts.length; i++) {
                    if (item.shortcuts[i].url !== '' && item.shortcuts[i].pic !== '') {
                        toolkit.store.shortcuts[i] = item.shortcuts[i]
                        var shortcutDOM = document.getElementById('shortcut' + i)
                        shortcutDOM.style.backgroundImage = 'url(' + item.shortcuts[i].pic + ')'
                        var input = document.getElementById('shortcutConfig' + i)
                        input.value = item.shortcuts[i].url
                    }
                }
                console.log('Get shortcuts options in storage.')
            } else {
                try {
                    chrome.storage.sync.set({'shortcuts': toolkit.store.shortcuts}, function () {
                        console.log('Shortcuts options saved.')
                    })
                } catch (e) {
                    console.log('Unable to save hortcuts options in storage.')
                }
            }
            len = toolkit.store.shortcuts.length
        })
    } catch (e) {
        console.log('Unable to get shortcut option in storage.')
    }

    // Add events
    // These are all closures.
    searchBar.addEventListener('focus', function (event) {
        timerContainer.style.transform = 'translateY(-2rem)'
        searchBarContainer.style.transform = 'translateY(-2rem)'
        if (!shortcutContainer.classList.contains('display')) {
            shortcutContainer.classList.add('display')
        }
    }, false)

    bgContainer.addEventListener('click', function (event) {
        timerContainer.style.transform = 'translateY(0rem)'
        searchBarContainer.style.transform = 'translateY(0rem)'
        if (shortcutContainer.classList.contains('display')) {
            shortcutContainer.classList.remove('display')
        }
    }, false)

    settingsBtn.addEventListener('click', function (event) {
        var settings = document.getElementById('settings')
        if (settings.classList.contains('display')) {
            settings.classList.remove('display')
        } else {
            settings.classList.add('display')
        }
    }, false)

    settings.addEventListener('click', function (event) {
        if (event.target.id === 'settings') {
            if (settings.classList.contains('display')) {
                settings.classList.remove('display')
            }
        }
        return
    }, false)

    shortcutList.addEventListener('click', function (event) {
        var id = event.target.id
        if (/^shortcut\d+$/.test(id)) {
            var index = parseInt(id.substring(8))
            if (toolkit.store.shortcuts[index].url === '' && toolkit.store.shortcuts[index].pic === '') {
                // add one input for initializing shortcut url
                if (!settings.classList.contains('display')) {
                    settings.classList.add('display')
                }
                input.focus()
            } else {
                window.location.href = toolkit.store.shortcuts[index].url
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
}

function initWeatherPlugin () {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.seniverse.com/v3/weather/now.json?key=Szn1FPHrDWKiAAeDZ&location=beijing&language=zh-Hans&unit=c')
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText)
            console.log(response)
        }
    }
    xhr.send()
}

function initState (toolkit) {
    
}

function initSettings (toolkit) {
    var shortcutSettings = document.getElementById('shortcutSettings')
    var timer = null
    shortcutSettings.addEventListener('input', function (event) {
        var id = event.target.id.substring(14)
        console.log(id)
        if (timer !== null) {
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(function () {
            // request for icon
            var value = event.target.value
            console.log(value)
            var iconUrl = value + '/favicon.ico'
            var xhr = new XMLHttpRequest()
            xhr.open('GET', iconUrl)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        toolkit.store.shortcuts[id].url = value
                        toolkit.store.shortcuts[id].pic = iconUrl
                        var shortcut = document.getElementById('shortcut' + id)
                        shortcut.style.backgroundImage = 'url(' + iconUrl + ')'
                        return
                    }
                }
            }
            xhr.send()
        }, 2000)
    }, false)
}

window.onload = function () {
    var bg = chrome.extension.getBackgroundPage()
    window.toolkit = new Toolkit()
    chrome.storage.sync.get('shortcuts', function (item) {
        console.log(item)
    })
    
    initTimer()
    initSearchBar(toolkit)
    initShortcuts(toolkit)
    initWeatherPlugin()
    initSettings(toolkit)
}

window.onunload = function () {
    try {
        chrome.storage.sync.set({'shortcuts': toolkit.store.shortcuts}, function () {
            console.log('Shortcuts options saved.')
        })
    } catch (e) {
        console.log('Unable to save hortcuts options in storage.')
    }
}