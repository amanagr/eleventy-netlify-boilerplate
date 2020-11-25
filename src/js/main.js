// function get_app_download_link () {
//     const request = new Request('https://api.github.com/repos/zulip/zulip/releases', {method: 'GET'});

//     fetch(request)
//         .then(response => {
//         if (response.status === 200) {
//             console.log(response.json())
//         } else {
//             throw new Error('Something went wrong on api server!');
//         }})
//         .then(response => {
//             console.debug(response);
//         }).catch(error => {
//             console.error(error);
//         });
// };

// function redirect_to_app_platform() {
//     let OS = "windows";

//     if (navigator.appVersion.indexOf("Win")!=-1) OS = "windows";
//     if (navigator.appVersion.indexOf("Mac")!=-1) OS = "mac";
//     if (navigator.appVersion.indexOf("X11")!=-1) OS = "linux";
//     if (navigator.appVersion.indexOf("Linux")!=-1) OS = "linux";
//     if (navigator.appVersion.indexOf("Android")!=-1) OS = "android";
//     if (navigator.appVersion.indexOf("like Mac")!=-1) OS = "ios";

//     const redirect_to = "/apps/" + OS + '.html';
//     if (!window.location.href.endsWith(redirect_to)) {
//       window.location.href = redirect_to;
//     }
// }

console.log("HI")