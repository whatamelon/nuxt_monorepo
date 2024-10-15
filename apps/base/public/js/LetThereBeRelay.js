var color = {
    brown: "color:#560000;font-size:11px;",
    red: "color:#d83128;font-size:11px;",
    yellow: "color:#ea991b;font-size:11px;",
    green: "color:#1eb087;font-size:11px;",
    blue: "color:#4da4e0;font-size:11px;",
    black: "color:#222222;font-size:11px;"
};

if (typeof console === "object" && console.log && typeof console.log === "function") {
    if (isUA('chrome') && !isUA('edge')) {
        console.log(
            "%c    ___      __         \
            \n%c   / _ \\%c___%c / /%c__%c ___ __ \
            \n%c  / , _/%c -_)%c /%c _ `%c/ // / \
            \n%c /_/|_|%c\\__/%c_/%c\\_,_/%c\\_, /  \
            \n%c                 /___/   \
            \n%cThen God said, Let there be %cR%ce%cl%ca%cy.\n",
            color.red,
            color.red, color.black, color.red, color.black,color.red,
            color.red, color.black, color.red, color.black,color.red,
            color.red, color.black, color.red, color.black,color.red,
            color.red,
            color.blue,color.red,color.black, color.red, color.black,color.red
        );
        console.log(
            `
            If you see this, Why\ \ don't you join us?
            `
        )
        console.log("\x3e \x3e \x3e https://mmemory.notion.site/2022-a8a308d21ae54aa3a02a7390a2b2fb98\n")
    } else {
        console.log(
        "    ___      __         \
        \n   / _ \\___ / /__ ___ __ \
        \n  / , _/ -_) / _ `/ // / \
        \n /_/|_|\\__/_/\\_,_/\\_, /  \
        \n                 /___/   \
        \n Then God said, Let there be Relay."
        );
        console.log(
            `
            If you see this, Why\ \ don't you join us?
            `
        )
        console.log("\x3e \x3e \x3e https://mmemory.notion.site/2022-a8a308d21ae54aa3a02a7390a2b2fb98\n")
    }
}

function isUA(userAgent) {
    return navigator.userAgent.toLowerCase().indexOf(userAgent) > -1;
}