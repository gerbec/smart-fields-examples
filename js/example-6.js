const fieldsExample6 = dlocalInstance.fields({
    fonts: [{
        cssSrc: 'https://rsms.me/inter/inter-ui.css'
    }],
    locale: 'en',
    country: 'BR'
});

// chek other elements of the form

let name = document.getElementById('name')
let nameContainer = document.getElementById('nameContainer')

let country = document.getElementById('country')
let countryContainer = document.getElementById('countryContainer')

let cpf_cnpj = document.getElementById('cpf_cnpj')
let cpf_cnpjContainer = document.getElementById('cpf_cnpjContainer')

// onChange
name.addEventListener("keyup", function () {
    checkRequired(name, nameContainer)
})

country.addEventListener("onchange", function () {
    checkRequired(country, countryContainer)
})


cpf_cnpj.addEventListener("keyup", function () {
    checkRequired(cpf_cnpj, cpf_cnpjContainer)
})

// onAutofilled

const onAnimationStart = event => {
    switch (event.animationName) {
        case 'onAutoFillStart':
            document.getElementById('nameContainer').classList.add("autofilled");
            break;
        case 'onAutoFillCancel':
            document.getElementById('nameContainer').classList.remove("autofilled");
            break;
    }
};
name.addEventListener('animationstart', onAnimationStart);

function checkRequired(input, container) {
    if (input.value) {
        container.classList.remove("hasError");
        return true;
    } else {
        container.classList.add("hasError");
        return false;
    }
}

// on submit

function submit() {
    const isNameComplete = checkRequired(name, nameContainer);
    const isCountryComplete = checkRequired(country, countryContainer);
    const isCPF_CNPJComplete = checkRequired(cpf_cnpj, cpf_cnpjContainer);
    if (!isPanComplete) {
        document.getElementById('fieldPanContainer').classList.add("Field--required");
        document.getElementById('fieldPanContainer').classList.add("hasError");
    }
    if (!isExpirationComplete) {
        document.getElementById('fieldExpirationContainer').classList.add("Field--required");
        document.getElementById('fieldExpirationContainer').classList.add("hasError");
    }
    if (!isCVVComplete) {
        document.getElementById('fieldCVVContainer').classList.add("Field--required");
        document.getElementById('fieldCVVContainer').classList.add("hasError");
    }

    if (!isPanComplete || !isExpirationComplete || !isCVVComplete || !isNameComplete || !isCountryComplete || !
        isCPF_CNPJComplete) {
        return;
    }
    loader(true)
    dlocalInstance.createToken(panField, {
            Name: name.value
        }).then((result) => {
            loader(false)
            var example = document.querySelector(".example-6");
            example.querySelector(".token").innerText = result.token;
            example.classList.add("submitted");
        })
        .catch((response) => {
            loader(false)
        })
}

// config fields

const panField = fieldsExample6.create('pan', {
    style: {
        base: {
            fontSize: "15px",
            fontFamily: "'Open Sans', sans-serif",
            lineHeight: '30px',
            fontSmoothing: 'antialiased',
            fontWeight: '500',
            '::placeholder': {
                color: "#B8BBC0"
            },
            iconColor: "#adbfd3",
            '::placeholder': {
                color: "#adbfd3"
            }
        },
        focus: {
            '::placeholder': {
                color: "#adbfd3"
            }
        }
    },
    placeholder: "4111 1111 1111 1111"
});

const cvvField = fieldsExample6.create('cvv', {
    style: {
        base: {
            fontSize: "15px",
            fontFamily: "'Open Sans', sans-serif",
            lineHeight: '30px',
            fontSmoothing: 'antialiased',
            fontWeight: '500',
            '::placeholder': {
                color: "white"
            }
        },
        focus: {
            '::placeholder': {
                color: "#adbfd3"
            }
        }
    },
    placeholder: "123"
});



const expirationField = fieldsExample6.create('expiration', {
    style: {
        base: {
            fontSize: "15px",
            fontFamily: "'Open Sans', sans-serif",
            lineHeight: '30px',
            fontSmoothing: 'antialiased',
            fontWeight: '500',
            '::placeholder': {
                color: "white"
            }
        },
        focus: {
            '::placeholder': {
                color: "#adbfd3"
            }
        }
    },
    placeholder: monthStr + "/" + year
});

// mount fields

panField.mount(document.getElementById('containerPan'));
expirationField.mount(document.getElementById('containerExpiration'));
cvvField.mount(document.getElementById('containerCVV'));

// onReady

let isPanReady = false;
panField.on('ready', function (event) {
    isPanReady = true;
    if (isPanReady && isExpirationReady && isCVVReady) {
        loader(false);
    }
});

let isExpirationReady = false;
expirationField.on('ready', function (event) {
    isExpirationReady = true;
    if (isPanReady && isExpirationReady && isCVVReady) {
        loader(false);
    }
});

let isCVVReady = false;
cvvField.on('ready', function (event) {
    isCVVReady = true;
    if (isPanReady && isExpirationReady && isCVVReady) {
        loader(false);
    }
});

//onComplete

let isPanComplete = false;
panField.on('complete', function (event) {
    isPanComplete = event.complete;
    if (isPanComplete) {
        expirationField.focus();
    }
})

let isExpirationComplete = false;
expirationField.on('complete', function (event) {
    isExpirationComplete = event.complete;
    if (isExpirationComplete) {
        cvvField.focus();
    }
})

let isCVVComplete = false;
cvvField.on('complete', function (event) {
    isCVVComplete = event.complete;
    if (isCVVComplete) {
        name.focus();
    }
})

// onClick

function clickPan() {
    panField.focus();
}

function clickExpiration() {
    expirationField.focus();
}

function clickCVV() {
    cvvField.focus();
}

// onBlur

panField.on('blur', function (event) {
    if (event.empty) {
        document.getElementById('panOverlay').style.visibility = "visible"
    } else if (event.error) {
        document.getElementById('fieldPanContainer').classList.add("Field--required");
        document.getElementById('fieldPanContainer').classList.add("hasError");
        let error = event.error.message ? event.error.message : "Enter your credit card number."
        document.getElementById('panErrorMsg').innerHTML = error
    } else {
        document.getElementById('fieldPanContainer').classList.remove("Field--required");
        document.getElementById('fieldPanContainer').classList.remove("hasError");
    }

    document.getElementById('containerPan').classList.remove("focus");
})

expirationField.on('blur', function (event) {
    if (event.error) {
        document.getElementById('fieldExpirationContainer').classList.add("Field--required");
        document.getElementById('fieldExpirationContainer').classList.add("hasError");
        let error = event.error.message ? event.error.message : "Enter your credit card expiration."
        document.getElementById('expirationErrorMsg').innerHTML = error
    } else {
        document.getElementById('fieldExpirationContainer').classList.remove("Field--required");
        document.getElementById('fieldExpirationContainer').classList.remove("hasError");
    }
    document.getElementById('containerExpiration').classList.remove("focus");
})

cvvField.on('blur', function (event) {
    if (event.error) {
        document.getElementById('fieldCVVContainer').classList.add("Field--required");
        document.getElementById('fieldCVVContainer').classList.add("hasError");
        let error = event.error.message ? event.error.message : "Enter your credit card CVV."
        document.getElementById('cvvErrorMsg').innerHTML = error
    } else {
        document.getElementById('fieldCVVContainer').classList.remove("Field--required");
        document.getElementById('fieldCVVContainer').classList.remove("hasError");
    }
    document.getElementById('containerCVV').classList.remove("focus");
})

// onFocus

panField.on('focus', function (event) {
    document.getElementById('containerPan').classList.add("focus");
    document.getElementById('panOverlay').style.visibility = "hidden"
})

expirationField.on('focus', function (event) {
    document.getElementById('containerExpiration').classList.add("focus");
})

cvvField.on('focus', function (event) {
    document.getElementById('containerCVV').classList.add("focus");
})

// onAutofilled

panField.on('autofilled', function (event) {
    if (event.autofilled) {
        document.getElementById('fieldPanContainer').classList.add("autofilled");
    } else {
        document.getElementById('fieldPanContainer').classList.remove("autofilled");
    }
})

expirationField.on('autofilled', function (event) {
    if (event.autofilled) {
        document.getElementById('fieldExpirationContainer').classList.add("autofilled");
    } else {
        document.getElementById('fieldExpirationContainer').classList.remove("autofilled");
    }
})

cvvField.on('autofilled', function (event) {
    if (event.autofilled) {
        document.getElementById('fieldCVVContainer').classList.add("autofilled");
    } else {
        document.getElementById('fieldCVVContainer').classList.remove("autofilled");
    }
})

// onChange

panField.on('change', function (event) {
    if (!event.error) {
        document.getElementById('fieldPanContainer').classList.remove("hasError");
        document.getElementById('fieldPanContainer').classList.remove("Field--required");
    } else {
        document.getElementById('fieldPanContainer').classList.add("hasError");
        document.getElementById('fieldPanContainer').classList.add("Field--required");
        let error = event.error.message ? event.error.message : "Enter your credit card number."
        document.getElementById('panErrorMsg').innerHTML = error
    }
    if (event.empty) {
        document.getElementById('containerPan').classList.add("empty");
    } else {
        document.getElementById('containerPan').classList.remove("empty");
    }
})

expirationField.on('change', function (event) {
    if (!event.error) {
        document.getElementById('fieldExpirationContainer').classList.remove("Field--required");
        document.getElementById('fieldExpirationContainer').classList.remove("hasError");
    } else {
        document.getElementById('fieldExpirationContainer').classList.add("Field--required");
        document.getElementById('fieldExpirationContainer').classList.add("hasError");
        let error = event.error.message ? event.error.message : "Enter your credit card expiration."
        document.getElementById('expirationErrorMsg').innerHTML = error
    }
    if (event.empty) {
        document.getElementById('containerExpiration').classList.add("empty");
    } else {
        document.getElementById('containerExpiration').classList.remove("empty");
    }
})


cvvField.on('change', function (event) {
    if (!event.error) {
        document.getElementById('fieldCVVContainer').classList.remove("Field--required");
        document.getElementById('fieldCVVContainer').classList.remove("hasError");
    } else {
        document.getElementById('fieldCVVContainer').classList.add("Field--required");
        document.getElementById('fieldCVVContainer').classList.add("hasError");
        let error = event.error.message ? event.error.message : "Enter your credit card CVV."
        document.getElementById('cvvErrorMsg').innerHTML = error
    }
    if (event.empty) {
        document.getElementById('containerCVV').classList.add("empty");
    } else {
        document.getElementById('containerCVV').classList.remove("empty");
    }
})

// onBrand

panField.on('brand', function (event) {
    let visa = document.getElementById('visa')
    let master = document.getElementById('mastercard')
    let amex = document.getElementById('amex')
    let discover = document.getElementById('discover')
    switch (event.brand) {
        case "visa":
            showOnlyFlag(visa, master, amex, discover);
            break;
        case "mastercard":
            showOnlyFlag(master, visa, amex, discover);
            break;
        case "american-express":
            showOnlyFlag(amex, visa, master, discover);
            break;
        case "discover":
            showOnlyFlag(discover, visa, master, amex);
            break;
        default:
            visa.classList.add("first");
            master.classList.remove("first");
            amex.classList.remove("first");
            discover.classList.remove("first");
            visa.style.display = "block"
            master.style.display = "block"
            amex.style.display = "block"
            discover.style.display = "block"
    }
})

function showOnlyFlag(show, hide1, hide2, hide3) {
    show.classList.add("first");
    hide1.classList.remove("first");
    hide2.classList.remove("first");
    hide3.classList.remove("first");
    show.style.display = "block"
    hide1.style.display = "none"
    hide2.style.display = "none"
    hide3.style.display = "none"
}

// loader

function loader(show) {
    document.getElementById("loader-example-6").style.visibility = show ? "visible" : "hidden";
    document.getElementById("customContainer").style.visibility = show ? "hidden" : "visible";
    document.getElementById("customContainer").style.opacity = show ? 0 : 1;
    document.getElementById("panOverlay").style.visibility = show ? "hidden" : "visible";
}