import axios from "axios";

interface cbrc20TransferProps {
    tick:string,
    transferAmount:number
}

interface cbrc20TransferProps2 {
    tick:string,
    transferAmount:number,
    destination:string
}

interface getInscribeIdProps {
    address:string
}

export const cbrc20Test = async () => {
    const payload = await axios.get("http://localhost:8081/", {});

    console.log("CBRC20 Test ==> ", payload)
    return payload;
}

export const cbrc20Transfer = async ({
    tick,
    transferAmount
}:cbrc20TransferProps) => {
    // const params = {
    //     tick:"QWER",
    //     transferAmount:1000
    // }
    const payload = await axios.post("http://localhost:8081/transfer", {
        tick,
        transferAmount
    });

    // TODO: send Inscription


    console.log("CBRC20 Test ==> ", payload)
    return payload;
}

export const cbrc20TransferTest = async ({
    tick,
    transferAmount,
    destination
}:cbrc20TransferProps2) => {
    const params = {
        tick:"QWER",
        transferAmount:1000
    }
    const payload = await axios.post("http://localhost:8081/transfer2", {
        tick,
        transferAmount,
        destination
    });

    // TODO: send Inscription
    

    console.log("CBRC20 Test ==> ", payload)
    return payload;
}

export const getInscribeId = async({
    address
}:getInscribeIdProps) => {
    const inscribeId = await axios.post("http://localhost:8080/api/cbrc/getAddressInscriptions", {
        address
    })

    return inscribeId.data.result.list[0].inscriptionId;
}