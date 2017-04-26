import {UsernamePasswordAuthProvider, UsernamePasswordToken, BasicUser} from "./UsernamePasswordAuthProvider";
import {Http, Response, Headers, URLSearchParams} from "@angular/http";
import {UserTokenInterface, UserInterface, AuthProviderInterface} from "../common";
import {AnonymousUserToken} from "../AnonymousUserToken";


export class ParseAuthProvider implements AuthProviderInterface {
    constructor(private options:{authUrl:string, baseUrl:string, X_Parse_Application_Id:string, X_Parse_REST_API_Key:string}, private http:Http) {
    }

    private readCookie(name:string) {
        var result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie);
        return result ? result[1] : null;
    }

    private writeCookie(name:string, value:string, days?:number) {
        if (!days) {
            days = 365 * 20;
        }

        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        var expires = "; expires=" + date.toUTCString();

        document.cookie = name + "=" + value + expires + "; path=/";
    }

    private removeCookie(name:string) {
        this.writeCookie(name, "", -1);
    }

    supports(token:UserTokenInterface):boolean {
        return token instanceof UsernamePasswordToken;
    }

    authenticate(token:UsernamePasswordToken):Promise<UserTokenInterface> {
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
                this.writeCookie('ParseAuthProvider:remeberme', data);
                return token;
            }).catch((e:Response)=> {
                let error:any = e.json();
                return Promise.reject(new Error(error.error || 'Invalid Username or Password'));
            });
    }

    restore():Promise<UserTokenInterface|null> {
        let token_data = this.readCookie('ParseAuthProvider:remeberme');
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
        this.removeCookie('ParseAuthProvider:remeberme');
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
