const Cache = require("@11ty/eleventy-cache-assets");
const repo_names = [
    "zulip",
    "zulip-desktop",
    "zulip-mobile",
    "python-zulip-api",
    "zulip-js",
    "zulipbot",
    "zulip-terminal",
];

module.exports = async function () {
    // https://developer.github.com/v3/repos/#get
    const contributor_username_to_data = {};
    const repo_contributors_data = {};
    for (const repo of repo_names) {
        // Fetch top 100 contributors to the repository.
        let contributors = await Cache(
            "https://api.github.com/repos/zulip/" +
                repo +
                "/contributors?per_page=100&page=1",
            {
                duration: "1d", // 1 day
                type: "json", // also supports "text" or "buffer"
            }
        );
        repo_contributors_data[repo] = [];

        for (const contributor of contributors) {
            const username = contributor.login;
            if (!contributor_username_to_data[username]) {
                contributor_username_to_data[username] = {};
            }
            const minified_contributor = {
                avatar_url: contributor.avatar_url,
                username: username,
                contributions: contributor.contributions,
                profile: contributor.html_url,
            };

            contributor_username_to_data[username][repo] = minified_contributor;
            repo_contributors_data[repo].push(minified_contributor);
        }
    }

    repo_contributors_data["total"] = [];
    for (const username in contributor_username_to_data) {
        contributor_username_to_data[username]["total"] = JSON.parse(
            JSON.stringify(
                Object.values(contributor_username_to_data[username])[0]
            )
        ); // To make a deep copy
        contributor_username_to_data[username]["total"].contributions = 0;
        for (const repo of repo_names) {
            if (contributor_username_to_data[username][repo] != undefined) {
                contributor_username_to_data[username]["total"].contributions +=
                    contributor_username_to_data[username][repo].contributions;
            }
        }
        repo_contributors_data["total"].push(
            contributor_username_to_data[username]["total"]
        );
    }

    repo_contributors_data["total"].sort((a, b) =>
        a.contributions > b.contributions ? -1 : 1
    );



    // Get today's date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '/' + mm + '/' + dd;
    return {
        repo_contributors_data: repo_contributors_data,
        date: today,
    };
};
