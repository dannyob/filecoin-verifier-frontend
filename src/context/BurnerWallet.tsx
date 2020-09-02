import { config } from '../config'

const signer = require("@keyko-io/filecoin-signing-tools/js")
const VerifyAPI = require('@keyko-io/filecoin-verifier-tools/api/api')

export class BurnerWallet {

    mnemonic: string = 'exit mystery juice city argue breeze film learn orange dynamic marine diary antenna road couple surge marine assume loop thought leader liquid rotate believe'
    client: any
    api: any
    lotusNode: any
    networkIndex: number = 0

    public loadWallet = async(networkIndex: number) => {
        this.networkIndex = networkIndex
        this.lotusNode = config.lotusNodes[networkIndex]
        this.api= new VerifyAPI(VerifyAPI.browserProvider(this.lotusNode.url, {
            token: async () => {
                return this.lotusNode.token
            }     
        }),  {sign: this.sign, getAccounts: this.getAccounts})
    }

    public importSeed = async(seedphrase: string) => {
        this.mnemonic = seedphrase
        return this
    }

    public selectNetwork = async(nodeIndex: any) => {
        this.lotusNode = config.lotusNodes[nodeIndex]
        this.loadWallet(this.networkIndex)
        return this
    }

    public getAccounts = async (nStart = 0, nEnd = 10) => {
        const accounts = []
        for (let i = nStart; i < nEnd; i += 1) {
            accounts.push(
                signer.keyDerive(this.mnemonic, `m/44'/${this.lotusNode.code}'/0/0/${i}`, '').address
            )
        }
        return accounts
    }

    public sign = async (filecoinMessage:any, indexAccount:number) => {
        const private_hexstring = signer.keyDerive(this.mnemonic, `m/44'/${this.lotusNode.code}'/0/0/${indexAccount}`, '').private_hexstring
        const signedMessage = signer.transactionSign(
          filecoinMessage,
          private_hexstring
        )
        return JSON.stringify({
            Message: {
              From: signedMessage.message.from,
              GasLimit: signedMessage.message.gaslimit,
              GasPrice: signedMessage.message.gasprice,
              Method: signedMessage.message.method,
              Nonce: signedMessage.message.nonce,
             // Params: signedMessage.message.params,
             Params: Buffer.from(signedMessage.message.params, "hex").toString("base64"),
              To: signedMessage.message.to,
              Value: signedMessage.message.value,
            },
            Signature: {
              Data: signedMessage.signature.data,
              Type: signedMessage.signature.type,
            }
        })
    }
}