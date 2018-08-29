module.exports = {
    "extends": "argosity",
    "parser": "babel-eslint",
    "settings": {
        "react": {
            "pragma": "React",  // Pragma to use, default to "React"
            "version": "16.0", // React version, default to the latest React stable release
        },
    },
    "rules": {
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "yoda": ["error", "always", { "onlyEquality": true }],
    }
};
