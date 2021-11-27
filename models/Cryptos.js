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
    ADA: {
        symbol: "ADA",
        name: "Cardano",
        img_url: img_base_url + "ada.png"
    }
}

exports.Crypto = Crypto;