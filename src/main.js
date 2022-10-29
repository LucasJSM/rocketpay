import "./css/index.css"
import IMask from "imask"

const ccBackgroundColor1 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
)
const ccBackgroundColor2 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
)
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBackgroundColor1.setAttribute("fill", colors[type][0])
  ccBackgroundColor2.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `/cc-${type}.svg`)
}

const securityCodeField = document.querySelector("#security-code")
const securityCodePattern = { mask: "0000" }
const securityCodeMasked = IMask(securityCodeField, securityCodePattern)

const expirationDateField = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDateField, expirationDatePattern)

const cardNumberField = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d{0,1}|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (append, dynamicMasked) {
    const number = (dynamicMasked.value + append).replace(/\D/g, "")
    const matchRegexMask = (item) => number.match(item.regex)
    const foundMask = dynamicMasked.compiledMasks.find(matchRegexMask)

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumberField, cardNumberPattern)

document.querySelector("#add-card").addEventListener("click", () => {
  alert("Cartão adicionado")
})

document
  .querySelector("form")
  .addEventListener("submit", (event) => event.preventDefault())

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  updateCardHolder(cardHolder)
})

const updateCardHolder = (cardHolder) => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
}

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

const updateSecurityCode = (code) => {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

const updateCardNumber = (number) => {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

const updateExpirationDate = (date) => {
  const ccExpiration = document.querySelector(".cc-expiration .value")

  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
