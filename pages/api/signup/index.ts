
import { ChatTokenBuilder } from "agora-token";
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const agoraAppId = process.env.AGORA_APP_ID;
            const agoraAppCertificate = process.env.AGORA_APP_CERTIFICATE;
            const agoraServerUrl = process.env.AGORA_SERVER_URL;
            const agoraOrgName = process.env.AGORA_ORG_NAME;
            const agoraAppName = process.env.AGORA_APP_NAME;

            if (!agoraAppId || !agoraAppCertificate || !agoraServerUrl || !agoraOrgName || !agoraAppName) {
                console.error('Agora credentials are missing');
            }
            const { name, password } = req.body;
            const agoraToken = ChatTokenBuilder.buildAppToken(
                agoraAppId!,
                agoraAppCertificate!,
                3660 * 5
            );
            console.log('=---agoraToken---->', agoraToken)

            const registerUser = await axios.post(
                `${agoraServerUrl}/${agoraOrgName}/${agoraAppName}/users`,
                {
                    username: name,
                    password: password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${agoraToken}`,
                    },
                }
            );

            res.status(200).json({
                agoraUserId: registerUser.data.entities[0].uuid,
                agoraUserName: registerUser.data.entities[0].username,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
