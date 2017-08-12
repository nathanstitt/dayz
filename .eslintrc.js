module.exports = {
    "extends": "argosity",
    "parser": "babel-eslint",
    "rules": {
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "yoda": ["error", "always", { "onlyEquality": true }],
    }
};
