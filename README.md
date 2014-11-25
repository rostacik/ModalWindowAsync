showModalDialog workaround / sample
================

Sample of possible solution to swap out "old IE6 times" JavaScript code **window.showModalDialog** often  still used in corporate legacy apps, with help of **jQuery** (mainly async part) and **jQuery UI** (the dialog part and its corresponding CSS).

Why :
-
Currently, from **Chrome version 37** there is no support for showModalDialog (more on this here : [http://blog.chromium.org/2014/07/disabling-showmodaldialog.html](http://blog.chromium.org/2014/07/disabling-showmodaldialog.html)). And it seems like we are not that far from not having it also in **Firefox** (more on this here [https://developer.mozilla.org/en-US/Firefox/Releases/28/Site_Compatibility](https://developer.mozilla.org/en-US/Firefox/Releases/28/Site_Compatibility) and here [https://bugzilla.mozilla.org/show_bug.cgi?id=981796](https://bugzilla.mozilla.org/show_bug.cgi?id=981796)). Interesting post also here : [http://stackoverflow.com/questions/20733962/why-is-window-showmodaldialog-deprecated-what-to-use-instead](http://stackoverflow.com/questions/20733962/why-is-window-showmodaldialog-deprecated-what-to-use-instead).

This is not the only solution to this problem. Some people switched to dialog element : [http://www.w3.org/html/wg/drafts/html/master/interactive-elements.html#the-dialog-element](http://www.w3.org/html/wg/drafts/html/master/interactive-elements.html#the-dialog-element),  some use shims and/or extensions like :

- [https://github.com/niutech/showModalDialog](https://github.com/niutech/showModalDialog) or 
- [https://github.com/chuckhendo/showModalDialog-shim](https://github.com/chuckhendo/showModalDialog-shim) or even use the store (chrome only)
- [https://chrome.google.com/webstore/detail/showmodaldialog-shim/nmpaogfdjncgofndedhcimbdmnlbpnlg](https://chrome.google.com/webstore/detail/showmodaldialog-shim/nmpaogfdjncgofndedhcimbdmnlbpnlg) 

which in many cases use **window.open** to open popup. This could be enough (if and only if you want to open window with say iframe and interact there (change settings - post them to controller, API or anywhere on the server) and not return any value), but if you need to rewrite your old JS code that relied on return of some value from showModalDialog (and if possible with least impact on codebase you have), then you have problem with unique behavior of showModalDialog and fact **it stops the execution of code until some action is taken** to interact with modal window. The UI is blocked (window is modal - interestingly in Chrome the behavior was same if you opened window with window.open and window.showModalDialog) and user can take some action and after this action, result is used in JavaScript code that follows under showModalDialog. Seems easy, but it's not.

The problem :
-
So, obviously the main problems are :

- How can we pause the execution of code that is after calling of showModalDialog and later resume with some value?
- How can we pass the value "the clean way" to the host page from another page that showModalDialog opens?
- How can we make the code run with least changes in existing code base, across IE9 up and all other browsers in their latest versions?

The solution :
-
I will try to make the long story short :

**Pausing of JavaScript** until some condition can be done in different ways. I saw while digging deep over the web that someone used **yield**, another used **throw** or event **while (true)** and the break. I personally think, that the cleanest way is to use async code and to defer the execution of code that needs the result value until user makes decision. Same way jQuery uses async to execute handlers of AJAX requests. I see the same pattern here. You can use anything to solve this problem. There is vast number of libs out there that can do the job. I thought it might be a good idea to use implementation from jQuery, since jQuery UI dialog requires it and I don't have to link another one purpose lib.

(sidenote : I saw some older opinions, that jQuery's implementation of async isn't that good, I leave this up to you but I think this is not longer the case)

**Passing back the value** from modal window (another page) has also some different possible solutions. You can "reach" to host page and search for specific element to set the value of say input. But this feels little hacky to me and you have trouble if you want to use same "picker" page over different "host" pages. Input elements with high chance will be differently named/will have different IDs. The "more cleaner to me" solution I borrowed from discussions on stackoverflow is that we can use window.open and from opened window you can send message with help of **messaging API** that is now part of HTML5. More on this for example here :

- [https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage)  
- [http://en.wikipedia.org/wiki/Web_Messaging](http://en.wikipedia.org/wiki/Web_Messaging)

However there is small change here : I am using jQuery dialog to open modal window. But the notion remains, we are using window object of "host" page where we post messages. Since there can be more "listeners" (and also senders) I am doing check if the ID of iframe where we load our page is same we hope for. This code might interfere with your code, if you for some reason listen if messages arrive on window object. Please be aware of this.

Where to look in the solution :
-
Two main "areas" are where you should look are **host.js** and **popup.js**. I used Visual Studio 2013 Update 4. You can find them here : [https://github.com/rostacik/ModalWindowAsync/tree/master/ModalWindowAsync/Scripts/Dialog](https://github.com/rostacik/ModalWindowAsync/tree/master/ModalWindowAsync/Scripts/Dialog). These two files are used in host.html and popup.html and popup2.html that you can find here : [https://github.com/rostacik/ModalWindowAsync/tree/master/ModalWindowAsync/Dialog](https://github.com/rostacik/ModalWindowAsync/tree/master/ModalWindowAsync/Dialog).

Please feel free to send me any comments and/or ideas to make this better : dusan a t rostacik d o t net. Pull requests are welcome. Thank you.

Dušan 