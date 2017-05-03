import {UsernamePasswordAuthProvider, UsernamePasswordToken, BasicUser} from "./UsernamePasswordAuthProvider";
import {Http, Response, Headers, URLSearchParams} from "@angular/http";
import {UserTokenInterface, UserInterface, AuthProviderInterface} from "../common";
import {AnonymousUserToken} from "../AnonymousUserToken";
import {Utils} from "../../Utils";
import {AuthenticationException} from "../../exceptions/exceptions";


export class ParseAuthProvider implements AuthProviderInterface {
    constructor(private options:{authUrl:string, baseUrl:string, X_Parse_Application_Id:string, X_Parse_REST_API_Key:string}, private http:Http) {
    }

    supports(token:UserTokenInterface):boolean {
        return token instanceof UsernamePasswordToken;
    }

    authenticate(token:UsernamePasswordToken):Promise<UserTokenInterface|AuthenticationException> {
        return this.http.get(this.options.authUrl,
            {
                params: new URLSearchParams(`username=${token.username}&password=${token.password}`),
                headers: new Headers({
                    'X-Parse-Application-Id': this.options.X_Parse_Application_Id,
                    'X-Parse-REST-API-Key': this.options.X_Parse_REST_API_Key
                })
            })
            .toPromise()
            .then((response:Response)=> {
                let data = response.json();
                let token = new ParseAuthToken(data);
                Utils.writeCookie('ParseAuthProvider_remeberme', data);
                return token;
            }).catch((e:Response)=> {
                let error:any = e.json();
                return Promise.reject(new AuthenticationException(token, error.message, error));
            });
    }

    restore():Promise<UserTokenInterface|null> {
        let token_data = Utils.readCookie('ParseAuthProvider_remeberme');
        return (token_data ? Promise.resolve(new ParseAuthToken(token_data)) : Promise.reject(null))
            .then((token_data:any)=> {
                return this.http.get(this.options.baseUrl + '/users/me',
                    {
                        // search: new URLSearchParams(`username=${token.username}&password=${token.password}`),
                        headers: new Headers({
                            'X-Parse-Application-Id': this.options.X_Parse_Application_Id,
                            'X-Parse-REST-API-Key': this.options.X_Parse_REST_API_Key,
                            'X-Parse-Session-Token': token_data.sessionToken
                        })
                    })
                    .toPromise()
                    .then((response:Response)=> {
                        return token_data;
                    }).catch((e:Response)=> {
                        return Promise.reject(null);
                    });
            });
    }

    logout():Promise<UserTokenInterface> {
        Utils.removeCookie('ParseAuthProvider_remeberme');
        return Promise.resolve(new AnonymousUserToken());
    }
}

export class ParseAuthToken implements UserTokenInterface {
    private user:UserInterface;
    roles:string[] = [];

    constructor(data:any) {
        this.user = {};
        Object.keys(data).forEach((key:string)=> {
            (<any>this.user)[key] = data[key];
        });
    }

    getUser():UserInterface {
        return this.user;
    }

    getUsername():string {
        return (<any>this.getUser()).username;
    }

    hasRole(name:string):boolean {
        return this.roles.indexOf(name) !== -1;
    }

    setUser(user:UserInterface) {
        this.user = user;
        return this;
    }

    isAuthenticated():boolean {
        return !!(<any>this.getUser()).sessionToken;
    }
}
