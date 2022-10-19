import "./css/index.css"

const ccBackgroundColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBackgroundColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCreditCardType(type) {
  const ccColors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }
  ccBackgroundColor1.setAttribute("fill", ccColors[type][0])
  ccBackgroundColor2.setAttribute("fill", ccColors[type][1])
  ccLogo.setAttribute("src", `/cc-${type}.svg`)
}

// setCreditCardType("masterCard");
globalThis.setCreditCardType = setCreditCardType;