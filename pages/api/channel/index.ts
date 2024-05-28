
import { RtcTokenBuilder, RtcRole } from "agora-token";
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
            const { channelName } = req.body;
            const agoraToken = RtcTokenBuilder.buildTokenWithUid(
                agoraAppId!, agoraAppCertificate!, channelName, 0, RtcRole.PUBLISHER, 3600, 3660 * 5
            )
            res.json({ status: 200, token: agoraToken })
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
