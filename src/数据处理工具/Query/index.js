


/* eslint-disable no-undef */
/* eslint-disable indent */

const { require } = requireFrom();

const { UiBox } = require("./query.js");

let b1 = UiBox.create(), b2 = UiBox.create(), b3 = UiBox.create();
b1.parent = ui;
b2.parent = b1;
b3.parent = b2;

b2.classList = ["class1", "class2"];
b3.name = "nameB3";
b3.attributes = {
    "key1": "value1"
};

console.log(b1.querySelectorAll(".class1"));
console.log(b1.querySelectorAll(".class1.class2"));
console.log(b1.querySelectorAll("#nameB3"));
console.log(b1.querySelectorAll("[key1=value1]"));


function requireFrom(_ = {
    "./query.js": function() {
        /* query.js */
    },
}) {
    /* require.js */
}

