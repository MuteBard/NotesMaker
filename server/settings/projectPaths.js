'use strict';
 
const ENV = process.env;
 
const BLENDER = {
    key: "BLENDER",
    pretty:"Blender",
    path: ENV['BLENDER_PATH'],
    visible: ENV['BLENDER_VISIBLE'] === 'true'
};

const GODOT = {
    key: "GODOT",
    pretty:"Godot",
    path: ENV['GODOT_PATH'],
    visible: ENV['GODOT_VISIBLE'] === 'true'
};

const UNITY = {
    key: "UNITY",
    pretty:"Unity",
    path: ENV['UNITY_PATH'],
    visible: ENV['UNITY_VISIBLE'] === 'true'
};

const MATH = {
    key: "MATH",
    pretty:"Math",
    path: ENV['MATH_PATH'],
    visible: ENV['MATH_VISIBLE'] === 'true'
};

const SUBSTANCE_PAINTER = {
    key: "SUBSTANCE_PAINTER",
    pretty:"Substance Painter",
    path: ENV['SUBSTANCE_PAINTER_PATH'],
    visible: ENV['SUBSTANCE_PAINTER_VISIBLE'] === 'true'
};

module.exports = {
    BLENDER,
    GODOT,
    UNITY,
    MATH,
    SUBSTANCE_PAINTER,
}