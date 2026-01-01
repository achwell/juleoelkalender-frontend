export default interface Exchange {
    timestamp: Date;
    request: {
        uri: string;
        remoteAddress: string;
        method: string;
        headers: Map<string, string[]>;
    };
    response: {
        status: number;
        headers: Map<string, string[]>;
    };
    principal?: { name: string };
    timeTaken: string;
    session?: { id: string };
}
