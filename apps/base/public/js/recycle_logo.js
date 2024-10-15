var color = {
    brown: "color:#560000;font-size:11px;",
    red: "color:#d83128;font-size:11px;",
    yellow: "color:#ea991b;font-size:11px;",
    green: "color:#1eb087;font-size:11px;",
    blue: "color:#4da4e0;font-size:11px;",
    black: "color:#222222;font-size:11px;"
};

if (typeof console === "object" && console.log && typeof console.log === "function") {

    console.log(
        "\n         _   _    \
        \n        / /\\/\\ \\    \
        \n       / /  \\ \\ \\    \
        \n      / / /\\ \\ \\ \\    \
        \n     / / /\\ \\ \\ \\ \\    \
        \n    / / /  \\ \\ \\ \\ \\    \
        \n   / / /___/ /\\ \\ \\ \\    \
        \n  / / /_____/ /\\ \\ \\ \\    \
        \n / /_________/\\ \\ \\ \\ \\    \
        "
    );
}

function isUA(userAgent) {
    return navigator.userAgent.toLowerCase().indexOf(userAgent) > -1;
}