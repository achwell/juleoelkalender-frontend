import FacebookPicture from "@/types/externalauth/FacebookPicture";

export default interface FacebookLogin {
    accessToken: string;
    data_access_expiration_time: number;
    email: string;
    expiresIn: number;
    first_name: string;
    grantedScopes: string;
    graphDomain: string;
    id: string;
    last_name: string;
    middle_name: string;
    picture?: FacebookPicture;
    signedRequest: string;
    userId: string;
}
