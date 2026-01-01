import FacebookPictureRequest from "@/types/externalauth/FacebookPictureRequest";

export default interface FacebookLoginRequest {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    picture?: FacebookPictureRequest;
}
