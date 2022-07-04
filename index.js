import { Contract, ethers } from "./ethers-5.6.esm.min.js"
import { abi, address } from "./constants.js"

// find the HTML element
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const withdrawButton = document.getElementById("withdraw")
const getBalanceButton = document.getElementById("balance")

const connectMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
        // connects to MetaMask
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Please install Metamask"
    }
}

const fund = async () => {
    const ethAmount = document.getElementById("fundInput").value
    if (typeof window.ethereum !== "undefined") {
        // find the provider from the metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        // create contract instance
        const contract = new ethers.Contract(address, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMined(transactionResponse, provider)
            console.log("Done funding....")
        } catch (error) {
            console.log(error)
        }
    }
}

const listenForTransactionMined = (transactionResponse, provider) => {
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

const withdraw = async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address, abi, signer)

        try {
            console.log("withdrawing")
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMined(transactionResponse, provider)
            console.log("withdrawal success")
        } catch (error) {}
    }
}

const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(address)
        console.log(ethers.utils.formatEther(balance))
    }
}

// connect the method to its onclick attribute
connectButton.onclick = connectMetamask
fundButton.onclick = fund
withdrawButton.onclick = withdraw
getBalanceButton.onclick = getBalance
