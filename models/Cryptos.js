const img_base_url = "/images/crypto/";

const Crypto = {
    FIAT: {
        symbol: "FIAT",
        name: "$CAD",
        img_url: img_base_url + "fiat.png"
    },
    BTC: {
        symbol: "BTC",
        name: "Bitcoin",
        img_url: img_base_url + "btc.png"
    },
    ETH: {
        symbol: "ETH",
        name: "Ethereum",
        img_url: img_base_url + "eth.png"
    },
    SAFE: {
        symbol: "SAFE",
        name: "Safemoon",
        img_url: img_base_url + "safe.png"
    },
    SHIB: {
        symbol: "SHIB",
        name: "Shiba Inu",
        img_url: img_base_url + "shib.png"
    }
}

exports.Crypto = Crypto;