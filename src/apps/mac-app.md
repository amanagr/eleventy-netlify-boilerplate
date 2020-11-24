---
layout: layouts/base.njk
title: Mac app
permalink: apps/mac.html
app_heading: Zulip for macOS
app_description: >-
  Zulip on macOS is even better than Zulip on the web, with a cleaner look, tray
  integration, native notifications, and support for multiple Zulip accounts.


  For download instructions, go to the [desktop app install guide](https://zulip.com/help/desktop-app-install-guide).
app_image: /images/macbook.png
js:
  code: |-
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

    console.log('Your OS: '+OSName);
---
