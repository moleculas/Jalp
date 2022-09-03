import Sib from "sib-api-v3-sdk";
import { API_KEY_SB } from "../config";

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = API_KEY_SB;
const tranEmailApi = new Sib.TransactionalEmailsApi();

export { tranEmailApi };