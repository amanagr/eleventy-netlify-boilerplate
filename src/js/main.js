"use strict";

import {Button, Carousel, Collapse, Dropdown, Scrollspy, Tab} from 'bootstrap';

function go_to_app_download_link(platform) {
    var request = new Request(
        "https://api.github.com/repos/zulip/zulip-desktop/releases",
        {
            method: "GET",
        }
    );
    fetch(request)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Something went wrong on api server!");
            }
        })
        .then(function (response) {
            const version = response[0]["name"].slice(1);

            const PLATFORM_TO_SETUP_FILE = {
                linux: "Zulip-" + version + "-x86_64.AppImage",
                mac: "Zulip-" + version + ".dmg",
                windows: "Zulip-Web-Setup-" + version + ".exe",
            };
            const link =
                "https://github.com/zulip/zulip-desktop/releases/download/v" +
                version +
                "/" +
                PLATFORM_TO_SETUP_FILE[platform];
            window.location.href = link;
        })
        .catch(function (error) {
            console.error(error);
        });
}

function redirect_to_app_platform() {
    let OS = "windows";

    if (navigator.appVersion.indexOf("Win") != -1) OS = "windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OS = "mac";
    if (navigator.appVersion.indexOf("X11") != -1) OS = "linux";
    if (navigator.appVersion.indexOf("Linux") != -1) OS = "linux";
    if (navigator.appVersion.indexOf("Android") != -1) OS = "android";
    if (navigator.appVersion.indexOf("like Mac") != -1) OS = "ios";

    const redirect_to = "/apps/" + OS + ".html";
    if (!window.location.href.endsWith(redirect_to)) {
        window.location.href = redirect_to;
    }
}

document.getElementById("apps-nav-btn").onclick = redirect_to_app_platform;

const download_btn = document.getElementById("apps-download-btn");
if (download_btn) {
	download_btn.onclick = function () {
		go_to_app_download_link(download_btn.dataset.platform);
	}
}

