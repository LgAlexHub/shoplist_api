export interface AuthentificationService {
    verifyToken(token?:string) : Promise<boolean>;
}