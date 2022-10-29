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

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolderClass = ".cc-holder .value"
  const defaultName = "FULANO DA SILVA"

  updateField(ccHolderClass, defaultName, cardHolder.value)
})

securityCodeMasked.on("accept", () => {
  const ccSecurityClass = ".cc-security .value"
  const defaultSecurityCode = "123"

  updateField(ccSecurityClass, defaultSecurityCode, securityCodeMasked.value)
})

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)

  const ccNumberClass = ".cc-number"
  const defaultCardNumber = "1234 5678 9012 3456"

  updateField(ccNumberClass, defaultCardNumber, cardNumberMasked.value)
})

expirationDateMasked.on("accept", () => {
  const ccExpDateClass = ".cc-expiration .value"
  const defaultExpDate = "02/32"

  updateField(ccExpDateClass, defaultExpDate, expirationDateMasked.value)
})

const updateField = (ccSelector, defaultLabel, element) => {
  const ccElement = document.querySelector(ccSelector)

  ccElement.innerText = element.length === 0 ? defaultLabel : element
}

document
  .querySelector("form")
  .addEventListener("submit", (event) => event.preventDefault())

const verifyInputs = () => {
  if (
    !cardHolder.value ||
    !cardNumberMasked.value ||
    !expirationDateMasked.value ||
    !securityCodeMasked.value
  ) {
    return 1
  }

  return 0
}

const verifyCardNumber = (cardType) => {
  if (cardType === "default") {
    return 1
  }

  return 0
}

const addCard = document.querySelector("#add-card")
addCard.addEventListener("click", () => {
  const hasEmptyInput = verifyInputs()

  if (hasEmptyInput) {
    alert("Campos vazios")

    return
  }

  const cardType = cardNumberMasked.masked.currentMask.cardType
  const cardTypeIsDefault = verifyCardNumber(cardType)
  if (cardTypeIsDefault) {
    alert("Número do cartão inválido")

    return
  }

  alert("Cartão adicionado")
})
