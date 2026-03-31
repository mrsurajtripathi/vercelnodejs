import crypto from 'crypto';

function base64URLEncode(str: string | Buffer) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function sha256(buffer: string | Buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

exports.generateCodeChallenge = (verifier: string | Buffer) => {
    return base64URLEncode(sha256(verifier));
};