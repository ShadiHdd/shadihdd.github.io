/*
 *  ____                  _
 * / ___| _ __   ___  ___| | __
 * \___ \| '_ \ / _ \/ __| |/ /
 *  ___) | |_) |  __/ (__|   <
 * |____/| .__/ \___|\___|_|\_\
 *       |_|
 */

/*
 This is free and unencumbered software released into the public domain.

 Anyone is free to copy, modify, publish, use, compile, sell, or
 distribute this software, either in source code form or as a compiled
 binary, for any purpose, commercial or non-commercial, and by any
 means.

 In jurisdictions that recognize copyright laws, the author or authors
 of this software dedicate any and all copyright interest in the
 software to the public domain. We make this dedication for the benefit
 of the public at large and to the detriment of our heirs and
 successors. We intend this dedication to be an overt act of
 relinquishment in perpetuity of all present and future rights to this
 software under copyright law.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

 For more information, please refer to <http://unlicense.org>
*/

// https://wwwtyro.github.io/speck/

// Refactored as monolithic js for simple browser usage
// (nothing more complicated than <script> is needed for use)

// requires glMatrix

// requires a global variable "mouseDown" (boolean)

// example usage:

//
// <html>
//     <script src="newsrc/glMatrix.js"></script>
//     <script src="newsrc/speck.js"></script>
//     <body>
//     <canvas id="my_canvas"></canvas>
//     </body>
//     <script type="text/javascript">

//         // mouseDown is assumed to exist by speck.init
//         var mouseDown = 0;
//         window.onload = function() {

//             document.body.addEventListener("mousedown", function() {
//                 mouseDown = 1;
//             });
//             document.body.addEventListener("mouseup", function() {
//                 mouseDown = 0;
//             });

//             speck.init(
//                 "my_canvas",
//                 `
//                 -1.6068   -3.6892    0.4282 O
//                  1.6438   -0.5751    1.8214 N
//                  0.7620    5.1495    0.4960 N
//                 -0.6683   -2.7817   -1.3376 N
//                  1.2991    0.4997    0.8228 C
//                 -0.1729    0.6438    0.6301 C
//                 `);
//         };

//     </script>
// </html>

var Speck = {};

// Attributes:
//  elements
//  consts
//  cube
//  wgl
//  shaders
//  view
//  renderer
//  parseatoms
//  new

(function(sp){

var elements = {};
elements[  0] = elements[ 'Xx'] = {'symbol':  'Xx', 'name':       'unknown', 'mass':   1.00000000, 'radius':  -0.9000, 'color': [1.000, 0.078, 0.576], 'number': 0};
elements[  1] = elements[  'H'] = {'symbol':   'H', 'name':      'hydrogen', 'mass':   1.00794000, 'radius':  0.3100, 'color': [1.000, 1.000, 1.000], 'number': 1};
elements[  2] = elements[ 'He'] = {'symbol':  'He', 'name':        'helium', 'mass':   4.00260200, 'radius':  0.2800, 'color': [0.851, 1.000, 1.000], 'number': 2};
elements[  3] = elements[ 'Li'] = {'symbol':  'Li', 'name':       'lithium', 'mass':   6.94100000, 'radius':  1.2800, 'color': [0.800, 0.502, 1.000], 'number': 3};
elements[  4] = elements[ 'Be'] = {'symbol':  'Be', 'name':     'beryllium', 'mass':   9.01218200, 'radius':  0.9600, 'color': [0.761, 1.000, 0.000], 'number': 4};
elements[  5] = elements[  'B'] = {'symbol':   'B', 'name':         'boron', 'mass':  10.81100000, 'radius':  0.8400, 'color': [1.000, 0.710, 0.710], 'number': 5};
elements[  6] = elements[  'C'] = {'symbol':   'C', 'name':        'carbon', 'mass':  12.01070000, 'radius':  0.7300, 'color': [0.565, 0.565, 0.565], 'number': 6};
elements[  7] = elements[  'N'] = {'symbol':   'N', 'name':      'nitrogen', 'mass':  14.00670000, 'radius':  0.7100, 'color': [0.188, 0.314, 0.973], 'number': 7};
elements[  8] = elements[  'O'] = {'symbol':   'O', 'name':        'oxygen', 'mass':  15.99940000, 'radius':  0.6600, 'color': [1.000, 0.051, 0.051], 'number': 8};
elements[  9] = elements[  'F'] = {'symbol':   'F', 'name':      'fluorine', 'mass':  18.99840320, 'radius':  0.5700, 'color': [0.565, 0.878, 0.314], 'number': 9};
elements[ 10] = elements[ 'Ne'] = {'symbol':  'Ne', 'name':          'neon', 'mass':  20.17970000, 'radius':  0.5800, 'color': [0.702, 0.890, 0.961], 'number': 10};
elements[ 11] = elements[ 'Na'] = {'symbol':  'Na', 'name':        'sodium', 'mass':  22.98976928, 'radius':  1.6600, 'color': [0.671, 0.361, 0.949], 'number': 11};
elements[ 12] = elements[ 'Mg'] = {'symbol':  'Mg', 'name':     'magnesium', 'mass':  24.30500000, 'radius':  1.4100, 'color': [0.541, 1.000, 0.000], 'number': 12};
elements[ 13] = elements[ 'Al'] = {'symbol':  'Al', 'name':      'aluminum', 'mass':  26.98153860, 'radius':  1.2100, 'color': [0.749, 0.651, 0.651], 'number': 13};
elements[ 14] = elements[ 'Si'] = {'symbol':  'Si', 'name':       'silicon', 'mass':  28.08550000, 'radius':  1.1100, 'color': [0.941, 0.784, 0.627], 'number': 14};
elements[ 15] = elements[  'P'] = {'symbol':   'P', 'name':    'phosphorus', 'mass':  30.97376200, 'radius':  1.0700, 'color': [1.000, 0.502, 0.000], 'number': 15};
elements[ 16] = elements[  'S'] = {'symbol':   'S', 'name':        'sulfur', 'mass':  32.06500000, 'radius':  1.0500, 'color': [1.000, 1.000, 0.188], 'number': 16};
elements[ 17] = elements[ 'Cl'] = {'symbol':  'Cl', 'name':      'chlorine', 'mass':  35.45300000, 'radius':  1.0200, 'color': [0.122, 0.941, 0.122], 'number': 17};
elements[ 18] = elements[ 'Ar'] = {'symbol':  'Ar', 'name':         'argon', 'mass':  39.94800000, 'radius':  1.0600, 'color': [0.502, 0.820, 0.890], 'number': 18};
elements[ 19] = elements[  'K'] = {'symbol':   'K', 'name':     'potassium', 'mass':  39.09830000, 'radius':  2.0300, 'color': [0.561, 0.251, 0.831], 'number': 19};
elements[ 20] = elements[ 'Ca'] = {'symbol':  'Ca', 'name':       'calcium', 'mass':  40.07800000, 'radius':  1.7600, 'color': [0.239, 1.000, 0.000], 'number': 20};
elements[ 21] = elements[ 'Sc'] = {'symbol':  'Sc', 'name':      'scandium', 'mass':  44.95591200, 'radius':  1.7000, 'color': [0.902, 0.902, 0.902], 'number': 21};
elements[ 22] = elements[ 'Ti'] = {'symbol':  'Ti', 'name':      'titanium', 'mass':  47.86700000, 'radius':  1.6000, 'color': [0.749, 0.761, 0.780], 'number': 22};
elements[ 23] = elements[  'V'] = {'symbol':   'V', 'name':      'vanadium', 'mass':  50.94150000, 'radius':  1.5300, 'color': [0.651, 0.651, 0.671], 'number': 23};
elements[ 24] = elements[ 'Cr'] = {'symbol':  'Cr', 'name':      'chromium', 'mass':  51.99610000, 'radius':  1.3900, 'color': [0.541, 0.600, 0.780], 'number': 24};
elements[ 25] = elements[ 'Mn'] = {'symbol':  'Mn', 'name':     'manganese', 'mass':  54.93804500, 'radius':  1.3900, 'color': [0.611, 0.478, 0.780], 'number': 25};
elements[ 26] = elements[ 'Fe'] = {'symbol':  'Fe', 'name':          'iron', 'mass':  55.84500000, 'radius':  1.3200, 'color': [0.878, 0.400, 0.200], 'number': 26};
elements[ 27] = elements[ 'Co'] = {'symbol':  'Co', 'name':        'cobalt', 'mass':  58.69340000, 'radius':  1.2600, 'color': [0.941, 0.565, 0.627], 'number': 27};
elements[ 28] = elements[ 'Ni'] = {'symbol':  'Ni', 'name':        'nickel', 'mass':  58.93319500, 'radius':  1.2400, 'color': [0.314, 0.816, 0.314], 'number': 28};
elements[ 29] = elements[ 'Cu'] = {'symbol':  'Cu', 'name':        'copper', 'mass':  63.54600000, 'radius':  1.3200, 'color': [0.784, 0.502, 0.200], 'number': 29};
elements[ 30] = elements[ 'Zn'] = {'symbol':  'Zn', 'name':          'zinc', 'mass':  65.38000000, 'radius':  1.2200, 'color': [0.490, 0.502, 0.690], 'number': 30};
elements[ 31] = elements[ 'Ga'] = {'symbol':  'Ga', 'name':       'gallium', 'mass':  69.72300000, 'radius':  1.2200, 'color': [0.761, 0.561, 0.561], 'number': 31};
elements[ 32] = elements[ 'Ge'] = {'symbol':  'Ge', 'name':     'germanium', 'mass':  72.64000000, 'radius':  1.2000, 'color': [0.400, 0.561, 0.561], 'number': 32};
elements[ 33] = elements[ 'As'] = {'symbol':  'As', 'name':       'arsenic', 'mass':  74.92160000, 'radius':  1.1900, 'color': [0.741, 0.502, 0.890], 'number': 33};
elements[ 34] = elements[ 'Se'] = {'symbol':  'Se', 'name':      'selenium', 'mass':  78.96000000, 'radius':  1.2000, 'color': [1.000, 0.631, 0.000], 'number': 34};
elements[ 35] = elements[ 'Br'] = {'symbol':  'Br', 'name':       'bromine', 'mass':  79.90400000, 'radius':  1.2000, 'color': [0.651, 0.161, 0.161], 'number': 35};
elements[ 36] = elements[ 'Kr'] = {'symbol':  'Kr', 'name':       'krypton', 'mass':  83.79800000, 'radius':  1.1600, 'color': [0.361, 0.722, 0.820], 'number': 36};
elements[ 37] = elements[ 'Rb'] = {'symbol':  'Rb', 'name':      'rubidium', 'mass':  85.46780000, 'radius':  2.2000, 'color': [0.439, 0.180, 0.690], 'number': 37};
elements[ 38] = elements[ 'Sr'] = {'symbol':  'Sr', 'name':     'strontium', 'mass':  87.62000000, 'radius':  1.9500, 'color': [0.000, 1.000, 0.000], 'number': 38};
elements[ 39] = elements[  'Y'] = {'symbol':   'Y', 'name':       'yttrium', 'mass':  88.90585000, 'radius':  1.9000, 'color': [0.580, 1.000, 1.000], 'number': 39};
elements[ 40] = elements[ 'Zr'] = {'symbol':  'Zr', 'name':     'zirconium', 'mass':  91.22400000, 'radius':  1.7500, 'color': [0.580, 0.878, 0.878], 'number': 40};
elements[ 41] = elements[ 'Nb'] = {'symbol':  'Nb', 'name':       'niobium', 'mass':  92.90638000, 'radius':  1.6400, 'color': [0.451, 0.761, 0.788], 'number': 41};
elements[ 42] = elements[ 'Mo'] = {'symbol':  'Mo', 'name':    'molybdenum', 'mass':  95.96000000, 'radius':  1.5400, 'color': [0.329, 0.710, 0.710], 'number': 42};
elements[ 43] = elements[ 'Tc'] = {'symbol':  'Tc', 'name':    'technetium', 'mass':  98.00000000, 'radius':  1.4700, 'color': [0.231, 0.620, 0.620], 'number': 43};
elements[ 44] = elements[ 'Ru'] = {'symbol':  'Ru', 'name':     'ruthenium', 'mass': 101.07000000, 'radius':  1.4600, 'color': [0.141, 0.561, 0.561], 'number': 44};
elements[ 45] = elements[ 'Rh'] = {'symbol':  'Rh', 'name':       'rhodium', 'mass': 102.90550000, 'radius':  1.4200, 'color': [0.039, 0.490, 0.549], 'number': 45};
elements[ 46] = elements[ 'Pd'] = {'symbol':  'Pd', 'name':     'palladium', 'mass': 106.42000000, 'radius':  1.3900, 'color': [0.000, 0.412, 0.522], 'number': 46};
elements[ 47] = elements[ 'Ag'] = {'symbol':  'Ag', 'name':        'silver', 'mass': 107.86820000, 'radius':  1.4500, 'color': [0.753, 0.753, 0.753], 'number': 47};
elements[ 48] = elements[ 'Cd'] = {'symbol':  'Cd', 'name':       'cadmium', 'mass': 112.41100000, 'radius':  1.4400, 'color': [1.000, 0.851, 0.561], 'number': 48};
elements[ 49] = elements[ 'In'] = {'symbol':  'In', 'name':        'indium', 'mass': 114.81800000, 'radius':  1.4200, 'color': [0.651, 0.459, 0.451], 'number': 49};
elements[ 50] = elements[ 'Sn'] = {'symbol':  'Sn', 'name':           'tin', 'mass': 118.71000000, 'radius':  1.3900, 'color': [0.400, 0.502, 0.502], 'number': 50};
elements[ 51] = elements[ 'Sb'] = {'symbol':  'Sb', 'name':      'antimony', 'mass': 121.76000000, 'radius':  1.3900, 'color': [0.620, 0.388, 0.710], 'number': 51};
elements[ 52] = elements[ 'Te'] = {'symbol':  'Te', 'name':     'tellurium', 'mass': 127.60000000, 'radius':  1.3800, 'color': [0.831, 0.478, 0.000], 'number': 52};
elements[ 53] = elements[  'I'] = {'symbol':   'I', 'name':        'iodine', 'mass': 126.90470000, 'radius':  1.3900, 'color': [0.580, 0.000, 0.580], 'number': 53};
elements[ 54] = elements[ 'Xe'] = {'symbol':  'Xe', 'name':         'xenon', 'mass': 131.29300000, 'radius':  1.4000, 'color': [0.259, 0.620, 0.690], 'number': 54};
elements[ 55] = elements[ 'Cs'] = {'symbol':  'Cs', 'name':        'cesium', 'mass': 132.90545190, 'radius':  2.4400, 'color': [0.341, 0.090, 0.561], 'number': 55};
elements[ 56] = elements[ 'Ba'] = {'symbol':  'Ba', 'name':        'barium', 'mass': 137.32700000, 'radius':  2.1500, 'color': [0.000, 0.788, 0.000], 'number': 56};
elements[ 57] = elements[ 'La'] = {'symbol':  'La', 'name':     'lanthanum', 'mass': 138.90547000, 'radius':  2.0700, 'color': [0.439, 0.831, 1.000], 'number': 57};
elements[ 58] = elements[ 'Ce'] = {'symbol':  'Ce', 'name':        'cerium', 'mass': 140.11600000, 'radius':  2.0400, 'color': [1.000, 1.000, 0.780], 'number': 58};
elements[ 59] = elements[ 'Pr'] = {'symbol':  'Pr', 'name':  'praseodymium', 'mass': 140.90765000, 'radius':  2.0300, 'color': [0.851, 1.000, 0.780], 'number': 59};
elements[ 60] = elements[ 'Nd'] = {'symbol':  'Nd', 'name':     'neodymium', 'mass': 144.24200000, 'radius':  2.0100, 'color': [0.780, 1.000, 0.780], 'number': 60};
elements[ 61] = elements[ 'Pm'] = {'symbol':  'Pm', 'name':    'promethium', 'mass': 145.00000000, 'radius':  1.9900, 'color': [0.639, 1.000, 0.780], 'number': 61};
elements[ 62] = elements[ 'Sm'] = {'symbol':  'Sm', 'name':      'samarium', 'mass': 150.36000000, 'radius':  1.9800, 'color': [0.561, 1.000, 0.780], 'number': 62};
elements[ 63] = elements[ 'Eu'] = {'symbol':  'Eu', 'name':      'europium', 'mass': 151.96400000, 'radius':  1.9800, 'color': [0.380, 1.000, 0.780], 'number': 63};
elements[ 64] = elements[ 'Gd'] = {'symbol':  'Gd', 'name':    'gadolinium', 'mass': 157.25000000, 'radius':  1.9600, 'color': [0.271, 1.000, 0.780], 'number': 64};
elements[ 65] = elements[ 'Tb'] = {'symbol':  'Tb', 'name':       'terbium', 'mass': 158.92535000, 'radius':  1.9400, 'color': [0.189, 1.000, 0.780], 'number': 65};
elements[ 66] = elements[ 'Dy'] = {'symbol':  'Dy', 'name':    'dysprosium', 'mass': 162.50000000, 'radius':  1.9200, 'color': [0.122, 1.000, 0.780], 'number': 66};
elements[ 67] = elements[ 'Ho'] = {'symbol':  'Ho', 'name':       'holmium', 'mass': 164.93032000, 'radius':  1.9200, 'color': [0.000, 1.000, 0.612], 'number': 67};
elements[ 68] = elements[ 'Er'] = {'symbol':  'Er', 'name':        'erbium', 'mass': 167.25900000, 'radius':  1.8900, 'color': [0.000, 0.902, 0.459], 'number': 68};
elements[ 69] = elements[ 'Tm'] = {'symbol':  'Tm', 'name':       'thulium', 'mass': 168.93421000, 'radius':  1.9000, 'color': [0.000, 0.831, 0.322], 'number': 69};
elements[ 70] = elements[ 'Yb'] = {'symbol':  'Yb', 'name':     'ytterbium', 'mass': 173.05400000, 'radius':  1.8700, 'color': [0.000, 0.749, 0.220], 'number': 70};
elements[ 71] = elements[ 'Lu'] = {'symbol':  'Lu', 'name':      'lutetium', 'mass': 174.96680000, 'radius':  1.8700, 'color': [0.000, 0.671, 0.141], 'number': 71};
elements[ 72] = elements[ 'Hf'] = {'symbol':  'Hf', 'name':       'hafnium', 'mass': 178.49000000, 'radius':  1.7500, 'color': [0.302, 0.761, 1.000], 'number': 72};
elements[ 73] = elements[ 'Ta'] = {'symbol':  'Ta', 'name':      'tantalum', 'mass': 180.94788000, 'radius':  1.7000, 'color': [0.302, 0.651, 1.000], 'number': 73};
elements[ 74] = elements[  'W'] = {'symbol':   'W', 'name':      'tungsten', 'mass': 183.84000000, 'radius':  1.6200, 'color': [0.129, 0.580, 0.839], 'number': 74};
elements[ 75] = elements[ 'Re'] = {'symbol':  'Re', 'name':       'rhenium', 'mass': 186.20700000, 'radius':  1.5100, 'color': [0.149, 0.490, 0.671], 'number': 75};
elements[ 76] = elements[ 'Os'] = {'symbol':  'Os', 'name':        'osmium', 'mass': 190.23000000, 'radius':  1.4400, 'color': [0.149, 0.400, 0.588], 'number': 76};
elements[ 77] = elements[ 'Ir'] = {'symbol':  'Ir', 'name':       'iridium', 'mass': 192.21700000, 'radius':  1.4100, 'color': [0.090, 0.329, 0.529], 'number': 77};
elements[ 78] = elements[ 'Pt'] = {'symbol':  'Pt', 'name':      'platinum', 'mass': 195.08400000, 'radius':  1.3600, 'color': [0.816, 0.816, 0.878], 'number': 78};
elements[ 79] = elements[ 'Au'] = {'symbol':  'Au', 'name':          'gold', 'mass': 196.96656900, 'radius':  1.3600, 'color': [1.000, 0.820, 0.137], 'number': 79};
elements[ 80] = elements[ 'Hg'] = {'symbol':  'Hg', 'name':       'mercury', 'mass': 200.59000000, 'radius':  1.3200, 'color': [0.722, 0.722, 0.816], 'number': 80};
elements[ 81] = elements[ 'Tl'] = {'symbol':  'Tl', 'name':      'thallium', 'mass': 204.38330000, 'radius':  1.4500, 'color': [0.651, 0.329, 0.302], 'number': 81};
elements[ 82] = elements[ 'Pb'] = {'symbol':  'Pb', 'name':          'lead', 'mass': 207.20000000, 'radius':  1.4600, 'color': [0.341, 0.349, 0.380], 'number': 82};
elements[ 83] = elements[ 'Bi'] = {'symbol':  'Bi', 'name':       'bismuth', 'mass': 208.98040000, 'radius':  1.4800, 'color': [0.620, 0.310, 0.710], 'number': 83};
elements[ 84] = elements[ 'Po'] = {'symbol':  'Po', 'name':      'polonium', 'mass': 210.00000000, 'radius':  1.4000, 'color': [0.671, 0.361, 0.000], 'number': 84};
elements[ 85] = elements[ 'At'] = {'symbol':  'At', 'name':      'astatine', 'mass': 210.00000000, 'radius':  1.5000, 'color': [0.459, 0.310, 0.271], 'number': 85};
elements[ 86] = elements[ 'Rn'] = {'symbol':  'Rn', 'name':         'radon', 'mass': 220.00000000, 'radius':  1.5000, 'color': [0.259, 0.510, 0.588], 'number': 86};
elements[ 87] = elements[ 'Fr'] = {'symbol':  'Fr', 'name':      'francium', 'mass': 223.00000000, 'radius':  2.6000, 'color': [0.259, 0.000, 0.400], 'number': 87};
elements[ 88] = elements[ 'Ra'] = {'symbol':  'Ra', 'name':        'radium', 'mass': 226.00000000, 'radius':  2.2100, 'color': [0.000, 0.490, 0.000], 'number': 88};
elements[ 89] = elements[ 'Ac'] = {'symbol':  'Ac', 'name':      'actinium', 'mass': 227.00000000, 'radius':  2.1500, 'color': [0.439, 0.671, 0.980], 'number': 89};
elements[ 90] = elements[ 'Th'] = {'symbol':  'Th', 'name':       'thorium', 'mass': 231.03588000, 'radius':  2.0600, 'color': [0.000, 0.729, 1.000], 'number': 90};
elements[ 91] = elements[ 'Pa'] = {'symbol':  'Pa', 'name':  'protactinium', 'mass': 232.03806000, 'radius':  2.0000, 'color': [0.000, 0.631, 1.000], 'number': 91};
elements[ 92] = elements[  'U'] = {'symbol':   'U', 'name':       'uranium', 'mass': 237.00000000, 'radius':  1.9600, 'color': [0.000, 0.561, 1.000], 'number': 92};
elements[ 93] = elements[ 'Np'] = {'symbol':  'Np', 'name':     'neptunium', 'mass': 238.02891000, 'radius':  1.9000, 'color': [0.000, 0.502, 1.000], 'number': 93};
elements[ 94] = elements[ 'Pu'] = {'symbol':  'Pu', 'name':     'plutonium', 'mass': 243.00000000, 'radius':  1.8700, 'color': [0.000, 0.420, 1.000], 'number': 94};
elements[ 95] = elements[ 'Am'] = {'symbol':  'Am', 'name':     'americium', 'mass': 244.00000000, 'radius':  1.8000, 'color': [0.329, 0.361, 0.949], 'number': 95};
elements[ 96] = elements[ 'Cm'] = {'symbol':  'Cm', 'name':        'curium', 'mass': 247.00000000, 'radius':  1.6900, 'color': [0.471, 0.361, 0.890], 'number': 96};
elements[ 97] = elements[ 'Bk'] = {'symbol':  'Bk', 'name':     'berkelium', 'mass': 247.00000000, 'radius':  1.6600, 'color': [0.541, 0.310, 0.890], 'number': 97};
elements[ 98] = elements[ 'Cf'] = {'symbol':  'Cf', 'name':   'californium', 'mass': 251.00000000, 'radius':  1.6800, 'color': [0.631, 0.212, 0.831], 'number': 98};
elements[ 99] = elements[ 'Es'] = {'symbol':  'Es', 'name':   'einsteinium', 'mass': 252.00000000, 'radius':  1.6500, 'color': [0.702, 0.122, 0.831], 'number': 99};
elements[100] = elements[ 'Fm'] = {'symbol':  'Fm', 'name':       'fermium', 'mass': 257.00000000, 'radius':  1.6700, 'color': [0.702, 0.122, 0.729], 'number': 100};
elements[101] = elements[ 'Md'] = {'symbol':  'Md', 'name':   'mendelevium', 'mass': 258.00000000, 'radius':  1.7300, 'color': [0.702, 0.051, 0.651], 'number': 101};
elements[102] = elements[ 'No'] = {'symbol':  'No', 'name':      'nobelium', 'mass': 259.00000000, 'radius':  1.7600, 'color': [0.741, 0.051, 0.529], 'number': 102};
elements[103] = elements[ 'Lr'] = {'symbol':  'Lr', 'name':    'lawrencium', 'mass': 262.00000000, 'radius':  1.6100, 'color': [0.780, 0.000, 0.400], 'number': 103};
elements[104] = elements[ 'Rf'] = {'symbol':  'Rf', 'name': 'rutherfordium', 'mass': 261.00000000, 'radius':  1.5700, 'color': [0.800, 0.000, 0.349], 'number': 104};
elements[105] = elements[ 'Db'] = {'symbol':  'Db', 'name':       'dubnium', 'mass': 262.00000000, 'radius':  1.4900, 'color': [0.820, 0.000, 0.310], 'number': 105};
elements[106] = elements[ 'Sg'] = {'symbol':  'Sg', 'name':    'seaborgium', 'mass': 266.00000000, 'radius':  1.4300, 'color': [0.851, 0.000, 0.271], 'number': 106};
elements[107] = elements[ 'Bh'] = {'symbol':  'Bh', 'name':       'bohrium', 'mass': 264.00000000, 'radius':  1.4100, 'color': [0.878, 0.000, 0.220], 'number': 107};
elements[108] = elements[ 'Hs'] = {'symbol':  'Hs', 'name':       'hassium', 'mass': 277.00000000, 'radius':  1.3400, 'color': [0.902, 0.000, 0.180], 'number': 108};
elements[109] = elements[ 'Mt'] = {'symbol':  'Mt', 'name':    'meitnerium', 'mass': 268.00000000, 'radius':  1.2900, 'color': [0.922, 0.000, 0.149], 'number': 109};
elements[110] = elements[ 'Ds'] = {'symbol':  'Ds', 'name':            'Ds', 'mass': 271.00000000, 'radius':  1.2800, 'color': [0.922, 0.000, 0.149], 'number': 110};
elements[111] = elements['Uuu'] = {'symbol': 'Uuu', 'name':           'Uuu', 'mass': 272.00000000, 'radius':  1.2100, 'color': [0.922, 0.000, 0.149], 'number': 111};
elements[112] = elements['Uub'] = {'symbol': 'Uub', 'name':           'Uub', 'mass': 285.00000000, 'radius':  1.2200, 'color': [0.922, 0.000, 0.149], 'number': 112};
elements[113] = elements['Uut'] = {'symbol': 'Uut', 'name':           'Uut', 'mass': 284.00000000, 'radius':  1.3600, 'color': [0.922, 0.000, 0.149], 'number': 113};
elements[114] = elements['Uuq'] = {'symbol': 'Uuq', 'name':           'Uuq', 'mass': 289.00000000, 'radius':  1.4300, 'color': [0.922, 0.000, 0.149], 'number': 114};
elements[115] = elements['Uup'] = {'symbol': 'Uup', 'name':           'Uup', 'mass': 288.00000000, 'radius':  1.6200, 'color': [0.922, 0.000, 0.149], 'number': 115};
elements[116] = elements['Uuh'] = {'symbol': 'Uuh', 'name':           'Uuh', 'mass': 292.00000000, 'radius':  1.7500, 'color': [0.922, 0.000, 0.149], 'number': 116};
elements[117] = elements['Uus'] = {'symbol': 'Uus', 'name':           'Uus', 'mass': 294.00000000, 'radius':  1.6500, 'color': [0.922, 0.000, 0.149], 'number': 117};
elements[118] = elements['Uuo'] = {'symbol': 'Uuo', 'name':           'Uuo', 'mass': 296.00000000, 'radius':  1.5700, 'color': [0.922, 0.000, 0.149], 'number': 118};
sp.elements = elements;

// consts

var consts = {};

var MIN_ATOM_RADIUS = Infinity;
var MAX_ATOM_RADIUS = -Infinity;
for (var i = 0; i <= 118; i++) {
    MIN_ATOM_RADIUS = Math.min(MIN_ATOM_RADIUS, elements[i].radius);
    MAX_ATOM_RADIUS = Math.max(MAX_ATOM_RADIUS, elements[i].radius);
}

consts.MIN_ATOM_RADIUS = MIN_ATOM_RADIUS;
consts.MAX_ATOM_RADIUS = MAX_ATOM_RADIUS;

sp.consts = consts;

// cube

var cube = {

	position: [

		// -X
		-1, -1, -1,
		-1, -1,  1,
		-1,  1,  1,
		-1, -1, -1,
		-1,  1,  1,
		-1,  1, -1,

		// +X
		1, -1,  1,
		1, -1, -1,
		1,  1, -1,
		1, -1,  1,
		1,  1, -1,
		1,  1,  1,

		// -Y
		-1, -1, -1,
		 1, -1, -1,
		 1, -1,  1,
		-1, -1, -1,
		 1, -1,  1,
		-1, -1,  1,

		// +Y
		-1, 1,  1,
		 1, 1,  1,
		 1, 1, -1,
		-1, 1,  1,
		 1, 1, -1,
		-1, 1, -1,

		// -Z
 		 1, -1, -1,
		-1, -1, -1,
		-1,  1, -1,
		 1, -1, -1,
		-1,  1, -1,
		 1,  1, -1,

		// +Z
		-1, -1, 1,
		 1, -1, 1,
		 1,  1, 1,
		-1, -1, 1,
		 1,  1, 1,
		-1,  1, 1

	],

	normal: [

		// -X
		-1, 0, 0,
		-1, 0, 0,
		-1, 0, 0,
		-1, 0, 0,
		-1, 0, 0,
		-1, 0, 0,

		// +X
		1, 0, 0,
		1, 0, 0,
		1, 0, 0,
		1, 0, 0,
		1, 0, 0,
		1, 0, 0,

		// -Y
		0, -1, 0,
		0, -1, 0,
		0, -1, 0,
		0, -1, 0,
		0, -1, 0,
		0, -1, 0,

		// +Y
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,

		// -Z
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,

		// +Z
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
	  0, 0, 1

	]

};

sp.cube = cube;

// webgl

var wgl = {};

wgl.GLBuffer = function(gl) {

    var self = this;

    self.initialize = function() {
        self.buffer = gl.createBuffer();
    };

    self.bind = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, self.buffer);
    };

    self.set = function(data) {
        self.bind();
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    };

    self.initialize();
};

wgl.buildAttribs = function(gl, layout) {
    var attribs = {};
    for (var key in layout) {
        attribs[key] = {
            buffer: new wgl.GLBuffer(gl),
            size: layout[key]
        };
    }
    return attribs;
};

wgl.getExtensions = function(gl, extArray) {
    var ext = {};
    for (var i = 0; i < extArray.length; i++) {
        var e = gl.getExtension(extArray[i]);
        if (e === null) {
            throw "Extension " + extArray[i] + " not available.";
        }
        ext[extArray[i]] = e;
    }
    return ext;
};

wgl.Framebuffer = function(gl, color, depth, ext) {

    var self = this;

    self.initialize = function() {
        self.fb = gl.createFramebuffer();
        self.bind();
        if (color.length > 1) {
            var drawBuffers = [];
            for (var i = 0; i < color.length; i++) {
                drawBuffers.push(ext["COLOR_ATTACHMENT" + i + "_WEBGL"]);
            }
            ext.drawBuffersWEBGL(drawBuffers);
            for (var i = 0; i < color.length; i++) {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, ext["COLOR_ATTACHMENT" + i + "_WEBGL"],
                    gl.TEXTURE_2D, color[i].texture, 0);
            }
        } else {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color[0].texture, 0);
        }
        if (depth !== undefined) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depth.texture, 0);
        }
    };

    self.bind = function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, self.fb);
    };

    self.initialize();

};

wgl.Texture = function(gl, index, data, width, height, options) {
    options = options || {};
    options.target = options.target || gl.TEXTURE_2D;
    options.mag = options.mag || gl.NEAREST;
    options.min = options.min || gl.NEAREST;
    options.wraps = options.wraps || gl.CLAMP_TO_EDGE;
    options.wrapt = options.wrapt || gl.CLAMP_TO_EDGE;
    options.internalFormat = options.internalFormat || gl.RGBA;
    options.format = options.format || gl.RGBA;
    options.type = options.type || gl.UNSIGNED_BYTE;

    var self = this;

    self.initialize = function() {
        self.index = index;
        self.activate();
        self.texture = gl.createTexture();
        self.bind();
        gl.texParameteri(options.target, gl.TEXTURE_MAG_FILTER, options.mag);
        gl.texParameteri(options.target, gl.TEXTURE_MIN_FILTER, options.min);
        gl.texParameteri(options.target, gl.TEXTURE_WRAP_S, options.wraps);
        gl.texParameteri(options.target, gl.TEXTURE_WRAP_T, options.wrapt);
        gl.texImage2D(options.target, 0, options.internalFormat, width, height,
            0, options.format, options.type, data);
    };

    self.bind = function() {
        gl.bindTexture(options.target, self.texture);
    };

    self.activate = function() {
        gl.activeTexture(gl.TEXTURE0 + self.index);
    };

    self.reset = function() {
        self.activate();
        self.bind();
        gl.texImage2D(options.target, 0, options.internalFormat, width, height,
            0, options.format, options.type, data);
    };

    self.initialize();
};

wgl.Renderable = function(gl, program, buffers, primitiveCount) {

    var self = this;

    self.primitiveCount = primitiveCount;

    self.initialize = function() {
    };

    self.render = function() {
        program.use();
        for (name in buffers) {
            var buffer = buffers[name].buffer;
            var size = buffers[name].size;
            try {
                var location = program.attribs[name].location;
            } catch (e) {
                console.log("Could not find location for", name);
                throw e;
            }
            buffer.bind();
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
        }
        gl.drawArrays(gl.TRIANGLES, 0, 3 * primitiveCount);
        for (name in self.buffers) {
            gl.disableVertexAttribArray(program.attributes[name].location);
        }
    };

    self.initialize();
};

wgl.InstancedRenderable = function(gl, program, buffers, primitiveCount, instancedExt) {

    var self = this;

    self.initialize = function() {
    };

    self.render = function() {
        program.use();
        for (name in buffers) {
            var buffer = buffers[name].buffer;
            var size = buffers[name].size;
            try {
                var location = program.attribs[name].location;
            } catch (e) {
                console.log("Could not find location for", name);
                throw e;
            }
            buffer.bind();
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
            instancedExt.vertexAttribDivisorANGLE(location, buffers[name].divisor);
        }
        instancedExt.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6*2*3, primitiveCount);
        for (name in self.buffers) {
            gl.disableVertexAttribArray(program.attributes[name].location);
        }
    };

    self.initialize();
};

wgl.Program = function(gl, vertexSource, fragmentSource) {

    var self = this;

    self.initialize = function() {
        self.program = self.compileProgram(vertexSource, fragmentSource);
        self.attribs = self.gatherAttribs();
        self.uniforms = self.gatherUniforms();
    };

    self.use = function() {
        gl.useProgram(self.program);
    };

    self.compileProgram = function(vertexSource, fragmentSource) {
        var vertexShader = self.compileShader(vertexSource, gl.VERTEX_SHADER);
        var fragmentShader = self.compileShader(fragmentSource, gl.FRAGMENT_SHADER);
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(program));
            throw "Failed to compile program.";
        }
        return program;
    };

    self.compileShader = function(source, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var err = gl.getShaderInfoLog(shader);
            var lineno = parseInt(err.split(':')[2]);
            var split = source.split("\n");
            for (var i in split) {
                var q = parseInt(i);
                console.log(q + "  " + split[i]);
                if (i == lineno - 1) {
                    console.warn(err);
                }
            }
            typeString = type == gl.VERTEX_SHADER ? "vertex" : "fragment";
            throw "Failed to compile " + typeString + " shader.";
        }
        return shader;
    };

    self.setUniform = function(name, type, value) {
        var args = Array.prototype.slice.call(arguments, 2);
        self.use(); // Make this idempotent. At the context level, perhaps?
        try {
            // console.log(name);
            // console.log(self.uniforms);
            // console.log(self.uniforms[name]);
            var location = self.uniforms[name].location;
        }
        catch(e) {
            console.log(name);
            throw e;
        }
        gl['uniform' + type].apply(gl, [location].concat(args));
    };

    self.gatherUniforms = function() {
        var uniforms = {};
        var nUniforms = gl.getProgramParameter(self.program, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < nUniforms; i++) {
            var uniform = gl.getActiveUniform(self.program, i);
            uniforms[uniform.name] = {
                name: uniform.name,
                location: gl.getUniformLocation(self.program, uniform.name),
                type: uniform.type,
                size: uniform.size
            };
        }
        return uniforms;
    };

    self.gatherAttribs = function() {
        var attribs = {};
        var nAttribs = gl.getProgramParameter(self.program, gl.ACTIVE_ATTRIBUTES);
        for (var i = 0; i < nAttribs; i++) {
            var attrib = gl.getActiveAttrib(self.program, i);
            attribs[attrib.name] = {
                name: attrib.name,
                location: gl.getAttribLocation(self.program, attrib.name),
                type: attrib.type,
                size: attrib.size
            };
        }
        return attribs;
    };

    self.initialize();

};
sp.wgl = wgl;

// shaders

var shaders = {
ao: `#version 100
precision highp float;

attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1);
}


// __split__


#version 100
precision highp float;

uniform sampler2D uSceneColor;
uniform sampler2D uSceneDepth;
uniform sampler2D uAccumulatorOut;
uniform float uRes;
uniform float uAO;
uniform float uBrightness;
uniform float uOutlineStrength;

void main() {
    vec2 p = gl_FragCoord.xy/uRes;
    vec4 sceneColor = texture2D(uSceneColor, p);
    if (uOutlineStrength > 0.0) {
        float depth = texture2D(uSceneDepth, p).r;
        float r = 1.0/511.0;
        float d0 = abs(texture2D(uSceneDepth, p + vec2(-r,  0)).r - depth);
        float d1 = abs(texture2D(uSceneDepth, p + vec2( r,  0)).r - depth);
        float d2 = abs(texture2D(uSceneDepth, p + vec2( 0, -r)).r - depth);
        float d3 = abs(texture2D(uSceneDepth, p + vec2( 0,  r)).r - depth);
        float d = max(d0, d1);
        d = max(d, d2);
        d = max(d, d3);
        sceneColor.rgb *= pow(1.0 - d, uOutlineStrength * 32.0);
        sceneColor.a = max(step(0.003, d), sceneColor.a);
    }
    vec4 dAccum = texture2D(uAccumulatorOut, p);
    float shade = max(0.0, 1.0 - (dAccum.r + dAccum.g + dAccum.b + dAccum.a) * 0.25 * uAO);
    shade = pow(shade, 2.0);
    gl_FragColor = vec4(uBrightness * sceneColor.rgb * shade, sceneColor.a);
}`,
accumulator: `#version 100
precision highp float;

attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1);
}


// __split__


#version 100
precision highp float;

uniform sampler2D uSceneDepth;
uniform sampler2D uSceneNormal;
uniform sampler2D uRandRotDepth;
uniform sampler2D uAccumulator;
uniform mat4 uRot;
uniform mat4 uInvRot;
uniform vec2 uSceneBottomLeft;
uniform vec2 uSceneTopRight;
uniform vec2 uRotBottomLeft;
uniform vec2 uRotTopRight;
uniform float uDepth;
uniform float uRes;
uniform int uSampleCount;

void main() {

    float dScene = texture2D(uSceneDepth, gl_FragCoord.xy/uRes).r;

    vec3 r = vec3(uSceneBottomLeft + (gl_FragCoord.xy/uRes) * (uSceneTopRight - uSceneBottomLeft), 0.0);

    r.z = -(dScene - 0.5) * uDepth;
    r = vec3(uRot * vec4(r, 1));
    float depth = -r.z/uDepth + 0.5;

    vec2 p = (r.xy - uRotBottomLeft)/(uRotTopRight - uRotBottomLeft);

    float dRandRot = texture2D(uRandRotDepth, p).r;

    float ao = step(dRandRot, depth * 0.99);

    vec3 normal = texture2D(uSceneNormal, gl_FragCoord.xy/uRes).rgb * 2.0 - 1.0;
    vec3 dir = vec3(uInvRot * vec4(0, 0, 1, 0));
    float mag = dot(dir, normal);
    float sampled = step(0.0, mag);

    ao *= sampled;

    vec4 acc = texture2D(uAccumulator, gl_FragCoord.xy/uRes);

    if (uSampleCount < 256) {
        acc.r += ao/255.0;
    } else if (uSampleCount < 512) {
        acc.g += ao/255.0;
    } else if (uSampleCount < 768) {
        acc.b += ao/255.0;
    } else {
        acc.a += ao/255.0;
    }

    gl_FragColor = acc;

}`,
atoms: `#version 100
precision highp float;

attribute vec3 aImposter;
attribute vec3 aPosition;
attribute float aRadius;
attribute vec3 aColor;

uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uModel;
uniform float uAtomScale;
uniform float uRelativeAtomScale;
uniform float uAtomShade;

varying vec3 vColor;
varying vec3 vPosition;
varying float vRadius;

void main() {
    vRadius = uAtomScale * (1.0 + (aRadius - 1.0) * uRelativeAtomScale);
    gl_Position = uProjection * uView * uModel * vec4(vRadius * aImposter + aPosition, 1.0);
    vColor = mix(aColor, vec3(1,1,1), uAtomShade);
    vPosition = vec3(uModel * vec4(aPosition, 1));
}


// __split__


#version 100
#extension GL_EXT_frag_depth: enable
precision highp float;

uniform vec2 uBottomLeft;
uniform vec2 uTopRight;
uniform float uRes;
uniform float uDepth;
uniform int uMode;

varying vec3 vPosition;
varying float vRadius;
varying vec3 vColor;

vec2 res = vec2(uRes, uRes);

float raySphereIntersect(vec3 r0, vec3 rd) {
    float a = dot(rd, rd);
    vec3 s0_r0 = r0 - vPosition;
    float b = 2.0 * dot(rd, s0_r0);
    float c = dot(s0_r0, s0_r0) - (vRadius * vRadius);
    float disc = b*b - 4.0*a*c;
    if (disc <= 0.0) {
        return -1.0;
    }
    return (-b - sqrt(disc))/(2.0*a);
}

void main() {
    vec3 r0 = vec3(uBottomLeft + (gl_FragCoord.xy/res) * (uTopRight - uBottomLeft), 0.0);
    vec3 rd = vec3(0, 0, -1);
    float t = raySphereIntersect(r0, rd);
    if (t < 0.0) {
        discard;
    }
    vec3 coord = r0 + rd * t;
    vec3 normal = normalize(coord - vPosition);
    if (uMode == 0) {
        gl_FragColor = vec4(vColor, 1);
    } else if (uMode == 1) {
        gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
    }
    gl_FragDepthEXT = -coord.z/uDepth;
}`,
    blur: `#version 100
precision highp float;

attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1);
}


// __split__


#version 100
precision highp float;

uniform sampler2D uTexture;
uniform float uRes;
uniform int leftRight;

void main() {
    vec2 dir;
    if (leftRight == 1) {
        dir = vec2(1,0)/uRes;
    } else {
        dir = vec2(0,1)/uRes;
    }
    const int range = 16;
    vec4 sample = vec4(0,0,0,0);
    for (int i = -range; i <= range; i++) {
        vec2 p = gl_FragCoord.xy/uRes + dir * float(i);
        sample += texture2D(uTexture, p);
    }
    sample /= float(range) * 2.0 + 1.0;
    gl_FragColor = sample;
}`,
bonds: `#version 100
precision highp float;

attribute vec3 aImposter;
attribute vec3 aPosA;
attribute vec3 aPosB;
attribute float aRadA;
attribute float aRadB;
attribute vec3 aColA;
attribute vec3 aColB;

uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 uRotation;
uniform float uBondRadius;
uniform float uAtomScale;
uniform float uRelativeAtomScale;

varying vec3 vNormal;
varying vec3 vPosA, vPosB;
varying float vRadA, vRadB;
varying vec3 vColA, vColB;
varying float vRadius;

mat3 alignVector(vec3 a, vec3 b) {
    vec3 v = cross(a, b);
    float s = length(v);
    float c = dot(a, b);
    mat3 I = mat3(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    );
    mat3 vx = mat3(
        0, v.z, -v.y,
        -v.z, 0, v.x,
        v.y, -v.x, 0
    );
    return I + vx + vx * vx * ((1.0 - c) / (s * s));
}

void main() {
    vRadius = uBondRadius;
    vec3 pos = vec3(aImposter);
    // Scale the box in x and z to be bond-radius.
    pos = pos * vec3(vRadius, 1, vRadius);
    // Shift the origin-centered cube so that the bottom is at the origin.
    pos = pos + vec3(0, 1, 0);
    // Stretch the box in y so that it is the length of the bond.
    pos = pos * vec3(1, length(aPosA - aPosB) * 0.5, 1);
    // Find the rotation that aligns vec3(0, 1, 0) with vec3(uPosB - uPosA) and apply it.
    vec3 a = normalize(vec3(-0.000001, 1.000001, 0.000001));
    vec3 b = normalize(aPosB - aPosA);
    mat3 R = alignVector(a, b);
    pos = R * pos;
    // Shift the cube so that the bottom is centered at the middle of atom A.
    pos = pos + aPosA;

    vec4 position = uModel * vec4(pos, 1);
    gl_Position = uProjection * uView * position;
    vPosA = aPosA;
    vPosB = aPosB;
    vRadA = uAtomScale * (1.0 + (aRadA - 1.0) * uRelativeAtomScale);
    vRadB = uAtomScale * (1.0 + (aRadB - 1.0) * uRelativeAtomScale);
    vColA = aColA;
    vColB = aColB;
}


// __split__


#version 100
#extension GL_EXT_frag_depth: enable
precision highp float;

uniform mat4 uRotation;
uniform vec2 uBottomLeft;
uniform vec2 uTopRight;
uniform float uDepth;
uniform float uRes;
uniform float uBondShade;
uniform int uMode;

varying vec3 vPosA, vPosB;
varying float vRadA, vRadB;
varying vec3 vColA, vColB;
varying float vRadius;

mat3 alignVector(vec3 a, vec3 b) {
    vec3 v = cross(a, b);
    float s = length(v);
    float c = dot(a, b);
    mat3 I = mat3(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    );
    mat3 vx = mat3(
        0, v.z, -v.y,
        -v.z, 0, v.x,
        v.y, -v.x, 0
    );
    return I + vx + vx * vx * ((1.0 - c) / (s * s));
}

void main() {

    vec2 res = vec2(uRes, uRes);
    vec3 r0 = vec3(uBottomLeft + (gl_FragCoord.xy/res) * (uTopRight - uBottomLeft), uDepth/2.0);
    vec3 rd = vec3(0, 0, -1);

    vec3 i = normalize(vPosB - vPosA);
         i = vec3(uRotation * vec4(i, 0));
    vec3 j = normalize(vec3(-0.000001, 1.000001, 0.000001));
    mat3 R = alignVector(i, j);

    vec3 r0p = r0 - vec3(uRotation * vec4(vPosA, 0));
    r0p = R * r0p;
    vec3 rdp = R * rd;

    float a = dot(rdp.xz, rdp.xz);
    float b = 2.0 * dot(rdp.xz, r0p.xz);
    float c = dot(r0p.xz, r0p.xz) - vRadius*vRadius;
    float disc = b*b - 4.0*a*c;
    if (disc <= 0.0) {
        discard;
    }
    float t = (-b - sqrt(disc))/(2.0*a);
    if (t < 0.0) {
        discard;
    }

    vec3 coord = r0p + rdp * t;
    if (coord.y < 0.0 || coord.y > length(vPosA - vPosB)) {
        discard;
    }

    vec3 color;
    if (coord.y < vRadA + 0.5 * (length(vPosA - vPosB) - (vRadA + vRadB))) {
        color = vColA;
    } else {
        color = vColB;
    }

    color = mix(color, vec3(1,1,1), uBondShade);

    R = alignVector(j, i);
    vec3 normal = normalize(R * vec3(coord.x, 0, coord.z));

    coord = r0 + rd * t;
    if (uMode == 0) {
        gl_FragColor = vec4(color, 1);
    } else if (uMode == 1) {
        gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
    }
    gl_FragDepthEXT = -(coord.z - uDepth/2.0)/uDepth;
}`,
dof: `#version 100
precision highp float;

attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1);
}


// __split__


#version 100
precision highp float;

uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform float uRes;
uniform float uDOFPosition;
uniform float uDOFStrength;
uniform int leftRight;

void main() {

    vec2 samples[64];
    samples[0] = vec2(0.857612, 0.019885);
    samples[1] = vec2(0.563809, -0.028071);
    samples[2] = vec2(0.825599, -0.346856);
    samples[3] = vec2(0.126584, -0.380959);
    samples[4] = vec2(0.782948, 0.594322);
    samples[5] = vec2(0.292148, -0.543265);
    samples[6] = vec2(0.130700, 0.330220);
    samples[7] = vec2(0.236088, 0.159604);
    samples[8] = vec2(-0.305259, 0.810505);
    samples[9] = vec2(0.269616, 0.923026);
    samples[10] = vec2(0.484486, 0.371845);
    samples[11] = vec2(-0.638057, 0.080447);
    samples[12] = vec2(0.199629, 0.667280);
    samples[13] = vec2(-0.861043, -0.370583);
    samples[14] = vec2(-0.040652, -0.996174);
    samples[15] = vec2(0.330458, -0.282111);
    samples[16] = vec2(0.647795, -0.214354);
    samples[17] = vec2(0.030422, -0.189908);
    samples[18] = vec2(0.177430, -0.721124);
    samples[19] = vec2(-0.461163, -0.327434);
    samples[20] = vec2(-0.410012, -0.734504);
    samples[21] = vec2(-0.616334, -0.626069);
    samples[22] = vec2(0.590759, -0.726479);
    samples[23] = vec2(-0.590794, 0.805365);
    samples[24] = vec2(-0.924561, -0.163739);
    samples[25] = vec2(-0.323028, 0.526960);
    samples[26] = vec2(0.642128, 0.752577);
    samples[27] = vec2(0.173625, -0.952386);
    samples[28] = vec2(0.759014, 0.330311);
    samples[29] = vec2(-0.360526, -0.032013);
    samples[30] = vec2(-0.035320, 0.968156);
    samples[31] = vec2(0.585478, -0.431068);
    samples[32] = vec2(-0.244766, -0.906947);
    samples[33] = vec2(-0.853096, 0.184615);
    samples[34] = vec2(-0.089061, 0.104648);
    samples[35] = vec2(-0.437613, 0.285308);
    samples[36] = vec2(-0.654098, 0.379841);
    samples[37] = vec2(-0.128663, 0.456572);
    samples[38] = vec2(0.015980, -0.568170);
    samples[39] = vec2(-0.043966, -0.771940);
    samples[40] = vec2(0.346512, -0.071238);
    samples[41] = vec2(-0.207921, -0.209121);
    samples[42] = vec2(-0.624075, -0.189224);
    samples[43] = vec2(-0.120618, 0.689339);
    samples[44] = vec2(-0.664679, -0.410200);
    samples[45] = vec2(0.371945, -0.880573);
    samples[46] = vec2(-0.743251, 0.629998);
    samples[47] = vec2(-0.191926, -0.413946);
    samples[48] = vec2(0.449574, 0.833373);
    samples[49] = vec2(0.299587, 0.449113);
    samples[50] = vec2(-0.900432, 0.399319);
    samples[51] = vec2(0.762613, -0.544796);
    samples[52] = vec2(0.606462, 0.174233);
    samples[53] = vec2(0.962185, -0.167019);
    samples[54] = vec2(0.960990, 0.249552);
    samples[55] = vec2(0.570397, 0.559146);
    samples[56] = vec2(-0.537514, 0.555019);
    samples[57] = vec2(0.108491, -0.003232);
    samples[58] = vec2(-0.237693, -0.615428);
    samples[59] = vec2(-0.217313, 0.261084);
    samples[60] = vec2(-0.998966, 0.025692);
    samples[61] = vec2(-0.418554, -0.527508);
    samples[62] = vec2(-0.822629, -0.567797);
    samples[63] = vec2(0.061945, 0.522105);

    float invRes = 1.0/uRes;
    vec2 coord = gl_FragCoord.xy * invRes;

    float strength = uDOFStrength * uRes/768.0;

    float depth = texture2D(uDepth, coord).r;
    float range = uDOFPosition - depth;
    float scale = abs(range);

    vec4 sample = texture2D(uColor, coord);
    float count = 1.0;
    for(int i = 0; i < 64; i++) {
        vec2 p = samples[i];
        p = coord + scale * 64.0 * strength * p * invRes;
        float d = texture2D(uDepth, p).r;
        float r = uDOFPosition - d;
        float s = abs(r);
        sample += texture2D(uColor, p) * s;
        count += s;
    }

    gl_FragColor = sample/count;
}`,
fxaa: `#version 100
precision highp float;

attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1);
}


// __split__


#version 100
precision highp float;

uniform sampler2D uTexture;
uniform float uRes;

void main() {
    float FXAA_SPAN_MAX = 8.0;
    float FXAA_REDUCE_MUL = 1.0/8.0;
    float FXAA_REDUCE_MIN = 1.0/128.0;

    vec2 texCoords = gl_FragCoord.xy/uRes;

    vec4 rgbNW = texture2D(uTexture, texCoords + (vec2(-1.0, -1.0) / uRes));
    vec4 rgbNE = texture2D(uTexture, texCoords + (vec2(1.0, -1.0) / uRes));
    vec4 rgbSW = texture2D(uTexture, texCoords + (vec2(-1.0, 1.0) / uRes));
    vec4 rgbSE = texture2D(uTexture, texCoords + (vec2(1.0, 1.0) / uRes));
    vec4 rgbM  = texture2D(uTexture, texCoords);

    vec4 luma = vec4(0.299, 0.587, 0.114, 1.0);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);

    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0/(min(abs(dir.x), abs(dir.y)) + dirReduce);

    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * rcpDirMin)) / uRes;

    vec4 rgbA = (1.0/2.0) *
        (texture2D(uTexture, texCoords.xy + dir * (1.0/3.0 - 0.5)) +
         texture2D(uTexture, texCoords.xy + dir * (2.0/3.0 - 0.5)));
    vec4 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) *
        (texture2D(uTexture, texCoords.xy + dir * (0.0/3.0 - 0.5)) +
         texture2D(uTexture, texCoords.xy + dir * (3.0/3.0 - 0.5)));
    float lumaB = dot(rgbB, luma);

    if((lumaB < lumaMin) || (lumaB > lumaMax)){
        gl_FragColor = rgbA;
    } else {
        gl_FragColor = rgbB;
    }

}`,
textured_quad: `#version 100
precision highp float;

attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1);
}


// __split__


#version 100
precision highp float;

uniform sampler2D uTexture;
uniform float uRes;

void main() {
    gl_FragColor = texture2D(uTexture, gl_FragCoord.xy/uRes);
}`
};
sp.shaders = shaders;

// view

var View = {};

(function(view){

function clamp(min, max, value) {
    return Math.min(max, Math.max(min, value));
}

var newView = view.new = function() {
    return {
        aspect: 1.0,
        zoom: 0.125,
        translation: {
            x: 0.0,
            y: 0.0
        },
        atomScale: 0.6,
        relativeAtomScale: 1.0,
        bondScale: 0.5,
        rotation: glMatrix.mat4.create(),
        ao: 0.75,
        aoRes: 256,
        brightness: 0.5,
        outline: 0.0,
        spf: 32,
        maxaos: 1024,
        bonds: false,
        bondThreshold: 1.2,
        bondShade: 0.5,
        atomShade: 0.5,
        resolution: 768,
        dofStrength: 0.0,
        dofPosition: 0.5,
        fxaa: 1
    };
};


var center = view.center = function(v, system) {
    var maxX = -Infinity;
    var minX = Infinity;
    var maxY = -Infinity;
    var minY = Infinity;
    for(var i = 0; i < system.atoms.length; i++) {
        var a = system.atoms[i];
        var r = elements[a.symbol].radius;
        r = 2.5 * v.atomScale * (1 + (r - 1) * v.relativeAtomScale);
        var p = glMatrix.vec4.fromValues(a.x, a.y, a.z, 0);
        glMatrix.vec4.transformMat4(p, p, v.rotation);
        maxX = Math.max(maxX, p[0] + r);
        minX = Math.min(minX, p[0] - r);
        maxY = Math.max(maxY, p[1] + r);
        minY = Math.min(minY, p[1] - r);
    }
    var cx = minX + (maxX - minX) / 2.0;
    var cy = minY + (maxY - minY) / 2.0;
    v.translation.x = cx;
    v.translation.y = cy;
    var scale = Math.max(maxX - minX, maxY - minY);
    v.zoom = 1/(scale * 1.01);
};


var override = view.override = function(v, data) {
    for (var key in data) {
        v[key] = data[key];
    }
    resolve(v);
};


var clone = view.clone = function(v) {
    return deserialize(serialize(v));
};


var serialize = view.serialize = function(v) {
    return JSON.stringify(v);
};


var deserialize = view.deserialize = function(v) {
    v = JSON.parse(v);
    v.rotation = glMatrix.mat4.clone(v.rotation);
    return v;
};


var resolve = view.resolve = function(v) {
    v.dofStrength = clamp(0, 1, v.dofStrength);
    v.dofPosition = clamp(0, 1, v.dofPosition);
    v.zoom = clamp(0.001, 2.0, v.zoom);
    v.atomScale = clamp(0, 1, v.atomScale);
    v.relativeAtomScale = clamp(0, 1, v.relativeAtomScale);
    v.bondScale = clamp(0, 1, v.bondScale);
    v.bondShade = clamp(0, 1, v.bondShade);
    v.atomShade = clamp(0, 1, v.atomShade);
    v.ao = clamp(0, 1, v.ao);
    v.brightness = clamp(0, 1, v.brightness);
    v.outline = clamp(0, 1, v.outline);
};


var translate = view.translate = function(v, dx, dy) {
    v.translation.x -= dx/(v.resolution * v.zoom);
    v.translation.y += dy/(v.resolution * v.zoom);
    resolve(v);
};


var rotate = view.rotate = function(v, dx, dy) {
    var m = glMatrix.mat4.create();
    glMatrix.mat4.rotateY(m, m, dx * 0.005);
    glMatrix.mat4.rotateX(m, m, dy * 0.005);
    glMatrix.mat4.multiply(v.rotation, m, v.rotation);
    resolve(v);
};


var getRect = view.getRect = function(v) {
    var width = 1.0/v.zoom;
    var height = width/v.aspect;
    var bottom = -height/2 + v.translation.y;
    var top = height/2 + v.translation.y;
    var left = -width/2 + v.translation.x;
    var right = width/2 + v.translation.x;
    return {
        bottom: bottom,
        top: top,
        left: left,
        right: right
    };
};


var getBondRadius = view.getBondRadius = function(v) {
    return v.bondScale * v.atomScale *
        (1 + (consts.MIN_ATOM_RADIUS - 1) * v.relativeAtomScale);
};

})(View);

sp.view = View;

// system

var System = {};

(function(system){

var newSystem = system.new = function() {
    return {
        atoms: [],
        farAtom: undefined,
        bonds: []
    };
};


var calculateBonds = system.calculateBonds = function(s) {
    var bonds = [];
    var sorted = s.atoms.slice();
    sorted.sort(function(a, b) {
        return a.z - b.z;
    });
    for (var i = 0; i < sorted.length; i++) {
        var a = sorted[i];
        var j = i + 1;
        while(j < sorted.length && sorted[j].z < sorted[i].z + 2.5 * 2 * consts.MAX_ATOM_RADIUS) {
            var b = sorted[j];
            var l = glMatrix.vec3.fromValues(a.x, a.y, a.z);
            var m = glMatrix.vec3.fromValues(b.x, b.y, b.z);
            var d = glMatrix.vec3.distance(l, m);
            var ea = elements[a.symbol];
            var eb = elements[b.symbol];
            if (d < 2.5*(ea.radius+eb.radius)) {
                bonds.push({
                    posA: {
                        x: a.x,
                        y: a.y,
                        z: a.z
                    },
                    posB: {
                        x: b.x,
                        y: b.y,
                        z: b.z
                    },
                    radA: ea.radius,
                    radB: eb.radius,
                    colA: {
                        r: ea.color[0],
                        g: ea.color[1],
                        b: ea.color[2]
                    },
                    colB: {
                        r: eb.color[0],
                        g: eb.color[1],
                        b: eb.color[2]
                    },
                    cutoff: d/(ea.radius+eb.radius)
                });
            }
            j++;
        }
    }
    bonds.sort(function(a, b) {
        return a.cutoff - b.cutoff;
    });
    s.bonds = bonds;
};


var addAtom = system.addAtom = function(s, symbol, x, y, z) {
    s.atoms.push({
        symbol: symbol,
        x: x,
        y: y,
        z: z,
    });
};

var getCentroid = system.getCentroid = function(s) {
    var xsum = 0;
    var ysum = 0;
    var zsum = 0;
    for (var i = 0; i < s.atoms.length; i++) {
        xsum += s.atoms[i].x;
        ysum += s.atoms[i].y;
        zsum += s.atoms[i].z;
    }
    return {
        x: xsum/s.atoms.length,
        y: ysum/s.atoms.length,
        z: zsum/s.atoms.length
    };
};

var center = system.center = function(s) {
    var shift = getCentroid(s);
    for (var i = 0; i < s.atoms.length; i++) {
        var atom = s.atoms[i];
        atom.x -= shift.x;
        atom.y -= shift.y;
        atom.z -= shift.z;
    }
};

var getFarAtom = system.getFarAtom = function(s) {
    if (s.farAtom !== undefined) {
        return s.farAtom;
    }
    s.farAtom = s.atoms[0];
    var maxd = 0.0;
    for (var i = 0; i < s.atoms.length; i++) {
        var atom = s.atoms[i];
        var r = elements[atom.symbol].radius;
        var rd = Math.sqrt(r*r + r*r + r*r) * 2.5;
        var d = Math.sqrt(atom.x*atom.x + atom.y*atom.y + atom.z*atom.z) + rd;
        if (d > maxd) {
            maxd = d;
            s.farAtom = atom;
        }
    }
    return s.farAtom;
};

var getRadius = system.getRadius = function(s) {
    var atom = getFarAtom(s);
    var r = consts.MAX_ATOM_RADIUS;
    var rd = Math.sqrt(r*r + r*r + r*r) * 2.5;
    return Math.sqrt(atom.x*atom.x + atom.y*atom.y + atom.z*atom.z) + rd;
};

})(System);

sp.system = System;


// renderer

function loadProgram(gl, src) {
    src = src.split('// __split__');
    return new wgl.Program(gl, src[0], src[1]);
}

var Renderer = function(canvas, resolution, aoResolution) {

    var self = this;

    var range,
        samples,
        system;

    var gl;

    var rAtoms = null,
        rBonds = null,
        rDispQuad = null,
        rAccumulator = null,
        rAO = null,
        rDOF = null,
        rFXAA = null;

    var tSceneColor, tSceneNormal, tSceneDepth,
        tRandRotDepth, tRandRotColor,
        tAccumulator, tAccumulatorOut,
        tFXAA, tFXAAOut,
        tDOF,
        tAO;

    var fbSceneColor, fbSceneNormal,
        fbRandRot,
        fbAccumulator,
        fbFXAA,
        fbDOF,
        fbAO;

    var progAtoms,
        progBonds,
        progAccumulator,
        progAO,
        progFXAA,
        progDOF,
        progDisplayQuad;

    var ext;

    var sampleCount = 0,
        colorRendered = false,
        normalRendered = false;

    self.getAOProgress = function(view) {
        return sampleCount/view.maxaos;
    };

    self.initialize = function() {

        // Initialize canvas/gl.
        canvas.width = canvas.height = resolution;
        gl = canvas.getContext('webgl');
        self.gl = gl;
        sp.gl = gl;
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clearColor(0,0,0,0);
        gl.clearDepth(1);
        gl.viewport(0,0,resolution,resolution);


        ext = wgl.getExtensions(gl, [
            "EXT_frag_depth",
            "WEBGL_depth_texture",
        ]);

        self.createTextures();

        // Initialize shaders.
        progAtoms = loadProgram(gl, shaders.atoms);
        progBonds = loadProgram(gl, shaders.bonds);
        progDisplayQuad = loadProgram(gl, shaders.textured_quad);
        progAccumulator = loadProgram(gl, shaders.accumulator);
        progAO = loadProgram(gl, shaders.ao);
        progFXAA = loadProgram(gl, shaders.fxaa);
        progDOF = loadProgram(gl, shaders.dof);

        var position = [
            -1, -1, 0,
             1, -1, 0,
             1,  1, 0,
            -1, -1, 0,
             1,  1, 0,
            -1,  1, 0
        ];

        // Initialize geometry.
        var attribs = wgl.buildAttribs(gl, {aPosition: 3});
        attribs.aPosition.buffer.set(new Float32Array(position));
        var count = position.length / 9;

        rDispQuad = new wgl.Renderable(gl, progDisplayQuad, attribs, count);
        rAccumulator = new wgl.Renderable(gl, progAccumulator, attribs, count);
        rAO = new wgl.Renderable(gl, progAO, attribs, count);
        rFXAA = new wgl.Renderable(gl, progFXAA, attribs, count);
        rDOF = new wgl.Renderable(gl, progDOF, attribs, count);

        samples = 0;

    };

    self.createTextures = function() {
        // fbRandRot
        tRandRotColor = new wgl.Texture(gl, 0, null, aoResolution, aoResolution);

        tRandRotDepth = new wgl.Texture(gl, 1, null, aoResolution, aoResolution, {
            internalFormat: gl.DEPTH_COMPONENT,
            format: gl.DEPTH_COMPONENT,
            type: gl.UNSIGNED_SHORT
        });

        fbRandRot = new wgl.Framebuffer(gl, [tRandRotColor], tRandRotDepth);

        // fbScene
        tSceneColor = new wgl.Texture(gl, 2, null, resolution, resolution);

        tSceneNormal = new wgl.Texture(gl, 3, null, resolution, resolution);

        tSceneDepth = new wgl.Texture(gl, 4, null, resolution, resolution, {
            internalFormat: gl.DEPTH_COMPONENT,
            format: gl.DEPTH_COMPONENT,
            type: gl.UNSIGNED_SHORT
        });

        fbSceneColor = new wgl.Framebuffer(gl, [tSceneColor], tSceneDepth);

        fbSceneNormal = new wgl.Framebuffer(gl, [tSceneNormal], tSceneDepth);

        // fbAccumulator
        tAccumulator = new wgl.Texture(gl, 5, null, resolution, resolution);
        tAccumulatorOut = new wgl.Texture(gl, 6, null, resolution, resolution);
        fbAccumulator = new wgl.Framebuffer(gl, [tAccumulatorOut]);

        // fbAO
        tAO = new wgl.Texture(gl, 7, null, resolution, resolution);
        fbAO = new wgl.Framebuffer(gl, [tAO]);

        // fbFXAA
        tFXAA = new wgl.Texture(gl, 8, null, resolution, resolution);
        tFXAAOut = new wgl.Texture(gl, 9, null, resolution, resolution);
        fbFXAA = new wgl.Framebuffer(gl, [tFXAAOut]);

        // fbDOF
        tDOF = new wgl.Texture(gl, 10, null, resolution, resolution);
        fbDOF = new wgl.Framebuffer(gl, [tDOF]);
    };

    self.setSystem = function(newSystem, view) {

        system = newSystem;

        function make36(arr) {
            var out = [];
            for (var i = 0; i < 36; i++) {
                out.push.apply(out, arr);
            }
            return out;
        }

        // Atoms
        var attribs = wgl.buildAttribs(gl, {
            aImposter: 3, aPosition: 3, aRadius: 1, aColor: 3
        });

        var imposter = [];
        var position = [];
        var radius = [];
        var color = [];

        for (var i = 0; i < system.atoms.length; i++) {
            imposter.push.apply(imposter, cube.position);
            var a = system.atoms[i];
            position.push.apply(position, make36([a.x, a.y, a.z]));
            radius.push.apply(radius, make36([elements[a.symbol].radius]));
            var c = elements[a.symbol].color;
            color.push.apply(color, make36([c[0], c[1], c[2]]));
        }

        attribs.aImposter.buffer.set(new Float32Array(imposter));
        attribs.aPosition.buffer.set(new Float32Array(position));
        attribs.aRadius.buffer.set(new Float32Array(radius));
        attribs.aColor.buffer.set(new Float32Array(color));

        var count = imposter.length / 9;

        rAtoms = new wgl.Renderable(gl, progAtoms, attribs, count);

        // Bonds

        if (view.bonds) {

            rBonds = null;

            if (system.bonds.length > 0) {

                var attribs = wgl.buildAttribs(gl, {
                    aImposter: 3,
                    aPosA: 3,
                    aPosB: 3,
                    aRadA: 1,
                    aRadB: 1,
                    aColA: 3,
                    aColB: 3
                });

                var imposter = [];
                var posa = [];
                var posb = [];
                var rada = [];
                var radb = [];
                var cola = [];
                var colb = [];

                for (var i = 0; i < system.bonds.length; i++) {
                    var b = system.bonds[i];
                    if (b.cutoff > view.bondThreshold) break;
                    imposter.push.apply(imposter, cube.position);
                    posa.push.apply(posa, make36([b.posA.x, b.posA.y, b.posA.z]));
                    posb.push.apply(posb, make36([b.posB.x, b.posB.y, b.posB.z]));
                    rada.push.apply(rada, make36([b.radA]));
                    radb.push.apply(radb, make36([b.radB]));
                    cola.push.apply(cola, make36([b.colA.r, b.colA.g, b.colA.b]));
                    colb.push.apply(colb, make36([b.colB.r, b.colB.g, b.colB.b]));
                }

                attribs.aImposter.buffer.set(new Float32Array(imposter));
                attribs.aPosA.buffer.set(new Float32Array(posa));
                attribs.aPosB.buffer.set(new Float32Array(posb));
                attribs.aRadA.buffer.set(new Float32Array(rada));
                attribs.aRadB.buffer.set(new Float32Array(radb));
                attribs.aColA.buffer.set(new Float32Array(cola));
                attribs.aColB.buffer.set(new Float32Array(colb));

                var count = imposter.length / 9;

                rBonds = new wgl.Renderable(gl, progBonds, attribs, count);

            }

        }

    };

    self.reset = function() {
        sampleCount = 0;
        colorRendered = false;
        normalRendered = false;
        tAccumulator.reset();
        tAccumulatorOut.reset();
    };

    self.render = function(view) {
        if (system === undefined) {
            return;
        }
        if (rAtoms == null) {
            return;
        }

        range = System.getRadius(system) * 2.0;

        if (!colorRendered) {
            color(view);
        } else if (!normalRendered){
            normal(view);
        } else {
            for (var i = 0; i < view.spf; i++) {
                if (sampleCount > view.maxaos) {
                    break;
                }
                sample(view);
                sampleCount++;
            }
        }
        display(view);
    };

    function color(view) {
        colorRendered = true;
        gl.viewport(0, 0, resolution, resolution);
        fbSceneColor.bind();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var rect = View.getRect(view);
        var projection = glMatrix.mat4.create();
        glMatrix.mat4.ortho(projection, rect.left, rect.right, rect.bottom, rect.top, 0, range);
        var viewMat = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(viewMat, [0, 0, 0], [0, 0, -1], [0, 1, 0]);
        var model = glMatrix.mat4.create();
        glMatrix.mat4.translate(model, model, [0, 0, -range/2]);
        glMatrix.mat4.multiply(model, model, view.rotation);
        progAtoms.setUniform("uProjection", "Matrix4fv", false, projection);
        progAtoms.setUniform("uView", "Matrix4fv", false, viewMat);
        progAtoms.setUniform("uModel", "Matrix4fv", false, model);
        progAtoms.setUniform("uBottomLeft", "2fv", [rect.left, rect.bottom]);
        progAtoms.setUniform("uTopRight", "2fv", [rect.right, rect.top]);
        progAtoms.setUniform("uAtomScale", "1f", 2.5 * view.atomScale);
        progAtoms.setUniform("uRelativeAtomScale", "1f", view.relativeAtomScale);
        progAtoms.setUniform("uRes", "1f", resolution);
        progAtoms.setUniform("uDepth", "1f", range);
        progAtoms.setUniform("uMode", "1i", 0);
        progAtoms.setUniform("uAtomShade", "1f", view.atomShade);
        rAtoms.render();

        if (view.bonds && rBonds != null) {
            fbSceneColor.bind();
            progBonds.setUniform("uProjection", "Matrix4fv", false, projection);
            progBonds.setUniform("uView", "Matrix4fv", false, viewMat);
            progBonds.setUniform("uModel", "Matrix4fv", false, model);
            progBonds.setUniform("uRotation", "Matrix4fv", false, view.rotation);
            progBonds.setUniform("uDepth", "1f", range);
            progBonds.setUniform("uBottomLeft", "2fv", [rect.left, rect.bottom]);
            progBonds.setUniform("uTopRight", "2fv", [rect.right, rect.top]);
            progBonds.setUniform("uRes", "1f", resolution);
            progBonds.setUniform("uBondRadius", "1f", 2.5 * View.getBondRadius(view));
            progBonds.setUniform("uBondShade", "1f", view.bondShade);
            progBonds.setUniform("uAtomScale", "1f", 2.5 * view.atomScale);
            progBonds.setUniform("uRelativeAtomScale", "1f", view.relativeAtomScale);
            progBonds.setUniform("uMode", "1i", 0);
            rBonds.render();
        }
    }


    function normal(view) {
        normalRendered = true;
        gl.viewport(0, 0, resolution, resolution);
        fbSceneNormal.bind();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var rect = View.getRect(view);
        var projection = glMatrix.mat4.create();
        glMatrix.mat4.ortho(projection, rect.left, rect.right, rect.bottom, rect.top, 0, range);
        var viewMat = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(viewMat, [0, 0, 0], [0, 0, -1], [0, 1, 0]);
        var model = glMatrix.mat4.create();
        glMatrix.mat4.translate(model, model, [0, 0, -range/2]);
        glMatrix.mat4.multiply(model, model, view.rotation);
        progAtoms.setUniform("uProjection", "Matrix4fv", false, projection);
        progAtoms.setUniform("uView", "Matrix4fv", false, viewMat);
        progAtoms.setUniform("uModel", "Matrix4fv", false, model);
        progAtoms.setUniform("uBottomLeft", "2fv", [rect.left, rect.bottom]);
        progAtoms.setUniform("uTopRight", "2fv", [rect.right, rect.top]);
        progAtoms.setUniform("uAtomScale", "1f", 2.5 * view.atomScale);
        progAtoms.setUniform("uRelativeAtomScale", "1f", view.relativeAtomScale);
        progAtoms.setUniform("uRes", "1f", resolution);
        progAtoms.setUniform("uDepth", "1f", range);
        progAtoms.setUniform("uMode", "1i", 1);
        progAtoms.setUniform("uAtomShade", "1f", view.atomShade);
        rAtoms.render();

        if (view.bonds && rBonds != null) {
            fbSceneNormal.bind();
            progBonds.setUniform("uProjection", "Matrix4fv", false, projection);
            progBonds.setUniform("uView", "Matrix4fv", false, viewMat);
            progBonds.setUniform("uModel", "Matrix4fv", false, model);
            progBonds.setUniform("uRotation", "Matrix4fv", false, view.rotation);
            progBonds.setUniform("uDepth", "1f", range);
            progBonds.setUniform("uBottomLeft", "2fv", [rect.left, rect.bottom]);
            progBonds.setUniform("uTopRight", "2fv", [rect.right, rect.top]);
            progBonds.setUniform("uRes", "1f", resolution);
            progBonds.setUniform("uBondRadius", "1f", 2.5 * View.getBondRadius(view));
            progBonds.setUniform("uBondShade", "1f", view.bondShade);
            progBonds.setUniform("uAtomScale", "1f", 2.5 * view.atomScale);
            progBonds.setUniform("uRelativeAtomScale", "1f", view.relativeAtomScale);
            progBonds.setUniform("uMode", "1i", 1);
            rBonds.render();
        }
    }


    function sample(view) {
        gl.viewport(0, 0, aoResolution, aoResolution);
        var v = View.clone(view);
        v.zoom = 1/range;
        v.translation.x = 0;
        v.translation.y = 0;
        var rot = glMatrix.mat4.create();
        for (var i = 0; i < 3; i++) {
            var axis = glMatrix.vec3.random(glMatrix.vec3.create(), 1.0);
            glMatrix.mat4.rotate(rot, rot, Math.random() * 10, axis);
        }
        v.rotation = glMatrix.mat4.multiply(glMatrix.mat4.create(), rot, v.rotation);
        fbRandRot.bind();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var rect = View.getRect(v);
        var projection = glMatrix.mat4.create();
        glMatrix.mat4.ortho(projection, rect.left, rect.right, rect.bottom, rect.top, 0, range);
        var viewMat = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(viewMat, [0, 0, 0], [0, 0, -1], [0, 1, 0]);
        var model = glMatrix.mat4.create();
        glMatrix.mat4.translate(model, model, [0, 0, -range/2]);
        glMatrix.mat4.multiply(model, model, v.rotation);
        progAtoms.setUniform("uProjection", "Matrix4fv", false, projection);
        progAtoms.setUniform("uView", "Matrix4fv", false, viewMat);
        progAtoms.setUniform("uModel", "Matrix4fv", false, model);
        progAtoms.setUniform("uBottomLeft", "2fv", [rect.left, rect.bottom]);
        progAtoms.setUniform("uTopRight", "2fv", [rect.right, rect.top]);
        progAtoms.setUniform("uAtomScale", "1f", 2.5 * v.atomScale);
        progAtoms.setUniform("uRelativeAtomScale", "1f", view.relativeAtomScale);
        progAtoms.setUniform("uRes", "1f", aoResolution);
        progAtoms.setUniform("uDepth", "1f", range);
        progAtoms.setUniform("uMode", "1i", 0);
        progAtoms.setUniform("uAtomShade", "1f", view.atomShade);
        rAtoms.render();

        if (view.bonds && rBonds != null) {
            progBonds.setUniform("uProjection", "Matrix4fv", false, projection);
            progBonds.setUniform("uView", "Matrix4fv", false, viewMat);
            progBonds.setUniform("uModel", "Matrix4fv", false, model);
            progBonds.setUniform("uRotation", "Matrix4fv", false, v.rotation);
            progBonds.setUniform("uDepth", "1f", range);
            progBonds.setUniform("uBottomLeft", "2fv", [rect.left, rect.bottom]);
            progBonds.setUniform("uTopRight", "2fv", [rect.right, rect.top]);
            progBonds.setUniform("uRes", "1f", aoResolution);
            progBonds.setUniform("uBondRadius", "1f", 2.5 * View.getBondRadius(view));
            progBonds.setUniform("uBondShade", "1f", view.bondShade);
            progBonds.setUniform("uAtomScale", "1f", 2.5 * view.atomScale);
            progBonds.setUniform("uRelativeAtomScale", "1f", view.relativeAtomScale);
            progBonds.setUniform("uMode", "1i", 0);
            rBonds.render();
        }

        gl.viewport(0, 0, resolution, resolution);
        var sceneRect = View.getRect(view);
        var rotRect = View.getRect(v);
        var invRot = glMatrix.mat4.invert(glMatrix.mat4.create(), rot);
        fbAccumulator.bind();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        progAccumulator.setUniform("uSceneDepth", "1i", tSceneDepth.index);
        progAccumulator.setUniform("uSceneNormal", "1i", tSceneNormal.index);
        progAccumulator.setUniform("uRandRotDepth", "1i", tRandRotDepth.index);
        progAccumulator.setUniform("uAccumulator", "1i", tAccumulator.index);
        progAccumulator.setUniform("uSceneBottomLeft", "2fv", [sceneRect.left, sceneRect.bottom]);
        progAccumulator.setUniform("uSceneTopRight", "2fv", [sceneRect.right, sceneRect.top]);
        progAccumulator.setUniform("uRotBottomLeft", "2fv", [rotRect.left, rotRect.bottom]);
        progAccumulator.setUniform("uRotTopRight", "2fv", [rotRect.right, rotRect.top]);
        progAccumulator.setUniform("uRes", "1f", resolution);
        progAccumulator.setUniform("uDepth", "1f", range);
        progAccumulator.setUniform("uRot", "Matrix4fv", false, rot);
        progAccumulator.setUniform("uInvRot", "Matrix4fv", false, invRot);
        progAccumulator.setUniform("uSampleCount", "1i", sampleCount);
        rAccumulator.render();
        tAccumulator.activate();
        tAccumulator.bind();
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, resolution, resolution, 0);
    }

    function display(view) {
        gl.viewport(0, 0, resolution, resolution);
        if (view.fxaa > 0 || view.dofStrength > 0) {
            fbAO.bind();
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        progAO.setUniform("uSceneColor", "1i", tSceneColor.index);
        progAO.setUniform("uSceneDepth", "1i", tSceneDepth.index);
        progAO.setUniform("uAccumulatorOut", "1i", tAccumulatorOut.index);
        progAO.setUniform("uRes", "1f", resolution);
        progAO.setUniform("uAO", "1f", 2.0 * view.ao);
        progAO.setUniform("uBrightness", "1f", 2.0 * view.brightness);
        progAO.setUniform("uOutlineStrength", "1f", view.outline);
        rAO.render();

        if (view.fxaa > 0) {
            if (view.dofStrength > 0) {
                fbFXAA.bind();
            } else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
            for (var i = 0; i < view.fxaa; i++) {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                if (i == 0) {
                    progFXAA.setUniform("uTexture", "1i", tAO.index);
                } else {
                    progFXAA.setUniform("uTexture", "1i", tFXAA.index);
                }
                progFXAA.setUniform("uRes", "1f", resolution);
                rFXAA.render();
                tFXAA.activate();
                tFXAA.bind();
                gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, resolution, resolution, 0);
            }
        }

        if (view.dofStrength > 0) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            if (view.fxaa > 0) {
                progDOF.setUniform("uColor", "1i", tFXAA.index);
            } else {
                progDOF.setUniform("uColor", "1i", tAO.index);
            }
            progDOF.setUniform("uDepth", "1i", tSceneDepth.index);
            progDOF.setUniform("uDOFPosition", "1f", view.dofPosition);
            progDOF.setUniform("uDOFStrength", "1f", view.dofStrength);
            progDOF.setUniform("uRes", "1f", resolution);
            rDOF.render();
        }
    }

    self.initialize();
};
sp.renderer = Renderer;

// parseatoms

// data: block of atoms w/ coords. e.g.
//
// `
//  -1.6068   -3.6892    0.4282 O
//   1.6438   -0.5751    1.8214 N
//   0.7620    5.1495    0.4960 N
// `

var parseatoms = function(data) {

    var lines = data.split('\n');
    var natoms = lines.length;
    var nframes = 1;
    var atoms = [];

    for(var j = 0; j < natoms; j++) {
        var line = lines[j].match(/\S+/g);
        if (line != null) {
            var atom = {};

            atom.symbol = line[3];
            atom.position = [
                parseFloat(line[0]),
                parseFloat(line[1]),
                parseFloat(line[2])
            ];
            atoms.push(atom);
        }
    }

    return atoms;
};

sp.parseatoms = parseatoms;

// new

sp.new = function(cid, data){

    var self = {};
    self.needReset = true;

    var cvs = document.getElementById(cid);
    var atoms = parseatoms(data);

    // set up system
    var system = System.new();

    for (var i = 0; i < atoms.length; i++) {
        var a = atoms[i];
        var x = a.position[0];
        var y = a.position[1];
        var z = a.position[2];
        System.addAtom(system, a.symbol, x, y, z);
    }
    System.center(system);
    System.calculateBonds(system);

    // set up view settings
    var view_settings = View.new();

    view_settings.bonds = false;
    view_settings.atomScale = 0.5;
    view_settings.relativeAtomScale = 1.0;
    view_settings.atomShade = 0.5;
    view_settings.brightness = 0.4;
    view_settings.outline = 0.1;
    view_settings.dofStrength = 0.25;
    view_settings.dofPosition = 0.5;
    view_settings.resolution = "512"; // square frame dimension in pixels
    view_settings.ao = 0.75;
    view_settings.aoRes = "128"; // ambient occlusion resolution
    view_settings.spf = 24; // samples of AOC to apply per frame
    view_settings.maxaos = 256; // maximum number of ao samples per image
    view_settings.fxaa = 1; // anti-aliasing passes
    View.resolve(view_settings);
    View.center(view_settings, system);

    // set up renderer
    var renderer = new Renderer(cvs, view_settings.resolution, view_settings.aoRes);
    renderer.setSystem(system, view_settings);

    var lastX;
    var lastY;
    function drag_listener(e) {
        if (!mouseDown) {
            document.body.removeEventListener("mousemove", drag_listener);
            return;
        }
        var dx = e.clientX - lastX;
        var dy = e.clientY - lastY;
        if (dx == 0 && dy == 0) {
            return;
        }
        lastX = e.clientX;
        lastY = e.clientY;

        View.rotate(view_settings, dx, dy);
        View.center(view_settings, system);

        self.needReset = true;

    }
    cvs.addEventListener("mousedown", function(e) {
        e.preventDefault();
        lastX = e.clientX;
        lastY = e.clientY;
        document.body.addEventListener("mousemove", drag_listener);
    });

    self.system = system;
    self.view = view_settings;
    self.renderer = renderer;
    self.render = function() {

        if (self.needReset) {
            renderer.reset();
            self.needReset = false;
        }
        if (self.renderer.getAOProgress(self.view) < 1) {
            self.renderer.render(self.view);
        };
    };

    return self;
};

})(Speck);
