const MONTHLY_LINK = "https://apple.com/";
const ANNUALLY_LINK = "https://google.com/";
const CURRENCY = "$";
const PRICE_PER_MONTH = `${CURRENCY}9.99`;
const PRICE_PER_YEAR = `${CURRENCY}19.99`;
const ANNUALLY_PRICE_PER_MONTH = `${CURRENCY}1.66`;
const EN = "en";
const ES = "es";
const FR = "fr";
const JA = "ja";
const NL = "nl";
const RU = "ru";
const ZH = "zh";

const onContinueButtonClickHandler = () => {
    const shape1 = document.getElementById("shape-1");
    const shape2 = document.getElementById("shape-2");

    shape1.checked && window.open(MONTHLY_LINK);
    shape2.checked && window.open(ANNUALLY_LINK);
};

const allLangs = [EN, ES, FR, JA, NL, RU, ZH];

const browserLang = () => {
    const navLang = navigator.language.slice(0, 2).toLowerCase();
    const result = allLangs.some((elem) => elem === navLang);

    if (result) {
        return navLang
    }
};

const manualLang = () => {
    let lang = window.location.search.slice(6, 9);
    if (!lang) {
        return
    }

    const result = allLangs.some((elem) => elem === lang);
    if (result) {
        return lang
    } else {
        return EN
    }
};

let currentLang = manualLang() || browserLang() || EN;

fetch(`/localizations/${currentLang}.json`)
    .then(response => response.json())
    .then(data => {
            let allDom = document.getElementsByTagName("*");
            for (let i = 0; i < allDom.length; i++) {
                let elem = allDom[i];
                let key = elem.getAttribute('lng-tag');
                if (key !== null) {
                    if (key.includes('{{price}}')) {
                        let elemId = elem.getAttribute('id');
                        switch (elemId) {
                            case "period-1":
                                elem.innerHTML = data[key].replace("{{price}}", PRICE_PER_MONTH);
                                break;
                            case "period-2":
                                elem.innerHTML = data[key].replace("{{price}}", PRICE_PER_YEAR);
                                break
                            case "shape-1-price":
                                elem.innerHTML = data[key].replace("{{price}}", PRICE_PER_MONTH);
                                break
                            case "shape-2-price":
                                elem.innerHTML = data[key].replace("{{price}}", ANNUALLY_PRICE_PER_MONTH);
                                break
                        }
                    } else {
                        elem.innerHTML = data[key];
                    }
                }
            }
        }
    )

function replaceClass(id, oldClass, newClass) {
    let elem = document.getElementById(id);
    elem.classList.remove(oldClass);
    elem.classList.add(newClass);
}

if (currentLang !== EN) {
    replaceClass("title", "title", "title-without-en");
    replaceClass("features", "features", "features-without-en");
}

if (currentLang === FR) {
    replaceClass("monthly", "time", "time-for-fr");
    replaceClass("annually", "time", "time-for-fr");
}

if (currentLang === JA) {
    replaceClass("monthly", "time", "time-for-ja");
    replaceClass("annually", "time", "time-for-ja");
    replaceClass("restore", "restore", "restore-for-ja");
}
if (currentLang === ZH) {
    replaceClass("period-1", "period", "period-for-zh");
    replaceClass("period-2", "period", "period-for-zh");
    replaceClass("monthly", "time", "time-for-zh");
    replaceClass("annually", "time", "time-for-zh");
}
