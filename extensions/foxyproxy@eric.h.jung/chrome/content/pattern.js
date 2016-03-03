/**
  FoxyProxy
  Copyright (C) 2006-2016 Eric H. Jung and FoxyProxy, Inc.
  http://getfoxyproxy.org/
  eric.jung@getfoxyproxy.org

  This source code is released under the GPL license,
  available in the LICENSE file at the root of this installation
  and also online at http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
**/

let exampleURL, pattern, generatedPattern, caseSensitive, fpc, isSuperAdd,
  isNew, Cc = Components.classes;
function onLoad() {
  let m = window.arguments[0].inn.pattern;
  if (m.pattern !== "") {
    isNew = false;
  } else {
    isNew = true;
  }
  document.getElementById("enabled").checked = m.enabled;
  document.getElementById("name").value = m.name;
  document.getElementById("pattern").value = m.pattern;
  document.getElementById("matchtype").selectedIndex = m.isRegEx ? 1 : 0;
  document.getElementById("whiteblacktype").selectedIndex = m.isBlackList ? 1 : 0;
  document.getElementById("caseSensitive").checked = m.caseSensitive;
  document.getElementById("temp").checked = m.temp;
  isSuperAdd = window.arguments[0].inn.superadd;
  if (isSuperAdd) {
    document.getElementById("superadd").setAttribute("hidden", false);
    document.getElementById("not-superadd").setAttribute("hidden", true);
  } else {
    var enabled = m.enabled;
    document.getElementById("superadd").setAttribute("hidden", true);
    document.getElementById("not-superadd").setAttribute("hidden", false);
  }
  exampleURL = document.getElementById("exampleURL");
  pattern = document.getElementById("pattern");
  generatedPattern = document.getElementById("generatedPattern");
  caseSensitive = document.getElementById("caseSensitive");
  fpc = Components.classes["@leahscape.org/foxyproxy/common;1"].getService().
    wrappedJSObject;
  updateGeneratedPattern();
  sizeToContent();
}

function onOK() {
  let r = document.getElementById("matchtype").value == "r";
  let p = Components.classes["@leahscape.org/foxyproxy/common;1"].getService()
    .wrappedJSObject.validatePattern(window, r, generatedPattern.value);
  if (p) {
    let ret = Components.classes["@leahscape.org/foxyproxy/match;1"].createInstance()
      .wrappedJSObject;
    // We want to add tha pattern itself as its name iff the user created a new
    // pattern but did not specify a name herself.
    // TODO: Assigning the return value of a getElementId()-call to a variable
    // destroys the layout in pattern.xul [sic!].
    if (isNew && document.getElementById("name").value === "") {
      document.getElementById("name").value = pattern.value;
    }
    ret.init({enabled: document.getElementById("enabled").checked, name:
      document.getElementById("name").value, pattern: pattern.value, temp:
      document.getElementById("temp").checked, isRegEx: r, caseSensitive:
      caseSensitive.checked, isBlackList: document.
      getElementById("whiteblacktype").value == "b"});
    window.arguments[0].out = {pattern:ret};
    return true;
  }
  return false;
}

function updateGeneratedPattern() {
  generatedPattern.value = fpc.applyTemplate(exampleURL.value, pattern.value,
    caseSensitive.checked, (document.getElementById("matchtype").value == "r"));
}
