import './js/polyfill.js';
import ImageEditor from './js/imageEditor.js';
import './css/index.styl';

// commands
import './js/command/addIcon.js';
import './js/command/addImageObject.js';
import './js/command/addObject.js';
import './js/command/addShape.js';
import './js/command/addText.js';
import './js/command/applyFilter.js';
import './js/command/changeIconColor.js';
import './js/command/changeShape.js';
import './js/command/changeText.js';
import './js/command/changeTextStyle.js';
import './js/command/clearObjects.js';
import './js/command/flip.js';
import './js/command/loadImage.js';
import './js/command/removeFilter.js';
import './js/command/removeObject.js';
import './js/command/resizeCanvasDimension.js';
import './js/command/rotate.js';
import './js/command/setObjectProperties.js';
import './js/command/setObjectPosition.js';

module.exports = ImageEditor;
