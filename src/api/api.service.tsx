import axios from 'axios';
import { config } from '../config';

interface StoreGhDataCapRequest {
    issueId: number|string,
    messageId: string,
    verifierAddressId: string,
    applicantName: string,
    applicantLocation: string
}

const ApiService = {
    storeGhDataCapRequest: async (postData: StoreGhDataCapRequest) => {
        await axios.post(config.externalApiUri + '/api/storeGhDataCapRequest', {
            issueId: postData.issueId,
            messageId: postData.messageId,
            verifierAddressId: postData.verifierAddressId,
            applicantName: postData.applicantName,
            applicantLocation: postData.applicantLocation
        })
    }
}

export default ApiService;