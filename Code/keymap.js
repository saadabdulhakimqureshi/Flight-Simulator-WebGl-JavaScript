// keymappings and handler for keypress.

/**
 * Alters the bounds of the view. 
 * @param {string} key
 * @returns {void|null} 
*/
function alterViewBound(key) {
  switch (key) {
    case '1':
      if (config.frustrum.left <= -2) {
        return;
      }
      config.frustrum.left -= 1;
      break;
    case '!':
      if (config.frustrum.left >= 0) {
        return;
      }
      config.frustrum.left += 1;
      break;
    case '2':
      if (config.frustrum.right <= 2) {
        return;
      }
      config.frustrum.right -= 1;
      break;
    case '@':
      if (config.frustrum.right >= 4) {
        return;
      }
      config.frustrum.right += 1;
      break;
    case '3':
      if (config.frustrum.above <= 2) {
        return;
      }
      config.frustrum.above -= 1;
      break;
    case '#':
      if (config.frustrum.above >= 4) {
        return;
      }
      config.frustrum.above += 1;
      break;
    case '4':
      if (config.frustrum.bottom <= -2) {
        return;
      }
      config.frustrum.bottom -= 1;
      break;
    case '$':
      if (config.frustrum.bottom >= -1) {
        return;
      }
      config.frustrum.bottom += 1;
      break;
    case '5':
      if (config.frustrum.near <= 3) {
        return;
      }
      config.frustrum.near -= 1;
      break;
    case '%':
      if (config.frustrum.near >= 5) {
        return;
      }
      config.frustrum.near += 1;
      break;
    case '6':
      if (config.frustrum.far >= 75) {
        return;
      }
      config.frustrum.far += 1;
      break;
    case '^':
      if (config.frustrum.far <= 20) {
        return;
      }
      config.frustrum.far -= 1;
      break;
    default:
      return;
  }
}

/**
 * Alters the speed of the plane. 
 * @param {string} key
 * @returns {void|null} 
*/
function speedControls(key) {
    switch (key) {
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        if (config.speed >= 100) {
            return;
        }

        config.speed += 0.5;
        break;
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        if (config.speed <= 0) {
          return;
        }

        config.speed -= 0.5;
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }   
}

/**
 * Alters the pitch, roll and yaw angles per the given control. 
 * @param {string} key
 * @returns {void|null} 
*/
function flightDynamics(key) {
  switch (key) {
    case "w":
      if (config.flight.pitch <= -90) {
        return;
      }
      config.flight.pitch -= config.flight.delta;
      break;
    case "a":
      if (config.flight.yaw >= 90) {
        return;
      }
      config.flight.yaw += config.flight.delta;
      break;
    case "s":
      if (config.flight.pitch >= 90) {
        return;
      }
      config.flight.pitch += config.flight.delta;
      break;
    case "d":
      if (config.flight.yaw <= -90) {
        return;
      }
      config.flight.yaw -= config.flight.delta;
      break;
    case "q":
      if (config.flight.roll >= 90) {
        return;
      }
      config.flight.roll += config.flight.delta;
      break;
    case "e":
      if (config.flight.roll <= -90) {
        return;
      }
      config.flight.roll -= config.flight.delta;
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }   
}

/**
 * Key-handler that carries out implemented simulator controls.
 * 
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key#examples
 * @param {event} event - the keydown event 
*/
function keyHandler(event) {
    // extract keycode
    const keyCode = event.keyCode;

    // handle each class of operation separately
    if (keyCode >= 49 && keyCode <= 54) {
        // alter bounds of view
        alterViewBound(event.key);
    } else if (keyCode >= 65 && keyCode <= 90) {
        // implement flight dynamics
        flightDynamics(event.key.toLowerCase());
    } else if (keyCode == 27) {
        // escape key i.e., quit
        window.alert("Exitting the simulator!");
        window.close();
    } else if (keyCode == 38 || keyCode == 40) {
        // speed controls
        speedControls(event.key);
    }
}
