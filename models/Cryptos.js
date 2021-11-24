const img_base_url = "/images/crypto/";

const Crypto = {
    FIAT: {
        sigle: "FIAT",
        name: "$CAD",
        img_url: img_base_url + "fiat.png"
    },
    BTC: {
        sigle: "BTC",
        name: "Bitcoin",
        img_url: img_base_url + "btc.png"
    },
    ETH: {
        sigle: "ETH",
        name: "Ethereum",
        img_url: img_base_url + "eth.png"
    },
    ADA: {
        sigle: "ADA",
        name: "Cardano",
        img_url: img_base_url + "ada.png"
    }
}

exports.Crypto = Crypto;