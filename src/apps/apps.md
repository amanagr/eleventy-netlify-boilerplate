---
layout: layouts/base.njk
title: Apps
permalink: apps.html
js:
  code: |-
    let OS = "windows";
    if (navigator.appVersion.indexOf("Win")!=-1) OS = "windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OS = "mac";
    if (navigator.appVersion.indexOf("X11")!=-1) OS = "linux";
    if (navigator.appVersion.indexOf("Linux")!=-1) OS = "linux";
    if (navigator.appVersion.indexOf("Android")!=-1) OS = "android";
    if (navigator.appVersion.indexOf("like Mac")!=-1) OS = "ios";
    const redirect_to = "/apps/" + OS + '.html';
    if (!window.location.href.endsWith(redirect_to)) {
      window.location.href = redirect_to;
    }

---
