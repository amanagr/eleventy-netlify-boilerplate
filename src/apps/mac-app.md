---
layout: layouts/apps.njk
title: Mac app
permalink: apps/mac.html
app_heading: Zulip for macOS
app_description: >-
  Zulip on macOS is even better than Zulip on the web, with a cleaner look, tray
  integration, native notifications, and support for multiple Zulip accounts.


  For download instructions, go to the [desktop app install guide](https://zulip.com/help/desktop-app-install-guide).
app_image: /images/macbook.png
js:
  code: >-
    	const request = new Request('https://api.github.com/repos/zulip/zulip/releases', {method: 'GET'});
    	fetch(request)
    	  .then(response => {
    	    if (response.status === 200) {
    	    	console.log(response.json())
    	    } else {
    	      throw new Error('Something went wrong on api server!');
    	    }
    	  })
    	  .then(response => {
    	    console.debug(response);
    	  }).catch(error => {
    	    console.error(error);
    	  });
  lang: javascript
---
