import {UsernamePasswordAuthProvider, UsernamePasswordToken, BasicUser} from "./UsernamePasswordAuthProvider";
import {Http, Response, Headers, URLSearchParams} from "@angular/http";
import {UserTokenInterface, UserInterface, AuthProviderInterface} from "../common";
import {AnonymousUserToken} from "../AnonymousUserToken";
import {Utils} from "../../Utils";
import {Observable, Subscriber} from 'rxjs/Rx';
import {AuthenticationException} from "../../exceptions/exceptions";

declare var firebase:any;

export class FirebaseAuthProvider implements AuthProviderInterface {
    private user:any;
    onAuthTokenChanged?:Observable<UserTokenInterface>;


    constructor(private firebase_auth:any) {
        this.onAuthTokenChanged = Observable.create((subscriber:Subscriber<UserTokenInterface>) => {

            firebase_auth.onAuthStateChanged((user:any) => {
                if (user) {
                    // User is signed in.
                    this.user = user;
                    subscriber.next(user.isAnonymous ? new FirebaseAnonymusAuthToken(user) : new FirebaseAuthToken(user));
                    user.getToken()
                        .then((tokenString:string)=> {
                            Utils.writeCookie('FirebaseAuthProvider_token', tokenString);
                        });
                } else {
                    // User is signed out.
                    Utils.removeCookie('FirebaseAuthProvider_token');
                    this.user = null;
                    subscriber.next(new AnonymousUserToken());
                }
            });

        });
    }

    supports(token:UserTokenInterface):boolean {
        return token instanceof UsernamePasswordToken || token instanceof FirebaseSocialAuthToken || token instanceof FirebaseAnonymusAuthToken || token instanceof  FirebaseAuthToken;
    }

    authenticate(token:any):Promise<UserTokenInterface|AuthenticationException> {
        return this.doAuthenticate(token)
            .then((token:UserTokenInterface)=> {
                return token;
            })
            .catch((e:any)=> {
                return Promise.reject(e);
            });
    }

    protected doAuthenticate(token:any):Promise<UserTokenInterface|AuthenticationException> {
        if (token instanceof UsernamePasswordToken) {
            return this.authenticateByUsernamePassword(token);
        }

        if (token instanceof FirebaseSocialAuthToken) {
            return this.authenticateByOAuthService(token);
        }

        if (this.user && token instanceof FirebaseAuthToken){
            return this.authenticateWithExisted(token);
        }

        return this.authenticateAnonymously(token);
    }

    protected authenticateWithExisted(token:FirebaseAuthToken):Promise<FirebaseAuthToken|AuthenticationException> {
        return new Promise((resolve, reject)=> {
            if (this.user){
                return resolve(token);
            } else {
                return reject(new AuthenticationException(token, "User not really signed in. Try reload the app."));
            }
        });
    }

    protected authenticateAnonymously(token:FirebaseAnonymusAuthToken):Promise<FirebaseAnonymusAuthToken|AuthenticationException> {
        return new Promise((resolve, reject)=> {
            this.firebase_auth.signInAnonymously()
                .then((user:any)=> {
                    resolve(new FirebaseAnonymusAuthToken(user));
                })
                .catch((error:any)=> {
                    reject(new AuthenticationException(token, error.message, error));
                });
        });
    }

    protected authenticateByUsernamePassword(token:UsernamePasswordToken):Promise<FirebaseAuthToken|AuthenticationException> {
        return new Promise((resolve, reject)=> {
            if (this.user) {
                let credential = firebase.auth.EmailAuthProvider.credential(token.getUsername(), token.password);
                this.firebase_auth.currentUser.linkWithCredential(credential).then((user)=> {
                    return resolve(new FirebaseAuthToken(user));
                }, (error) => {
                    if (error.code === "auth/email-already-in-use") {
                        this.user.reauthenticateWithCredential(credential)
                            .then((user)=> {
                                resolve(new FirebaseAuthToken(user));
                            })
                            .catch((error)=> {
                                reject(new AuthenticationException(token, error.message, error));
                            });
                    } else {
                        reject(new AuthenticationException(token, error.message, error));
                    }
                });
            } else {
                this.firebase_auth.signInWithEmailAndPassword(token.getUsername(), token.password)
                    .then((user:any)=> {
                        resolve(new FirebaseAuthToken(user));
                    })
                    .catch((error:any)=> {
                        reject(new AuthenticationException(token, error.message, error));
                    });
            }
        });
    }

    protected authenticateByOAuthService(token:FirebaseSocialAuthToken):Promise<FirebaseAuthToken|AuthenticationException> {
        return new Promise((resolve, reject)=> {
            if (this.user) {
                let credential = token.socialProvider.credential(token.socialProvider);
                this.firebase_auth.currentUser.linkWithCredential(credential).then((user)=> {
                    return resolve(new FirebaseAuthToken(user));
                }, (error) => {
                    reject(new AuthenticationException(token, error.message, error));
                });
            } else {
                // this.firebase_auth.signInWithRedirect(token.socialProvider);
                // this.firebase_auth.getRedirectResult()
                this.firebase_auth.signInWithPopup(token.socialProvider)
                    .then((result:any)=> {
                        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                        var token = result.credential.accessToken;
                        // The signed-in user info.
                        var user = result.user;
                        user.facebookAccessToken = token;
                        resolve(new FirebaseAuthToken(user));
                    })
                    .catch((error:any)=> {
                        reject(new AuthenticationException(token, error.message, error));
                    });
            }
        });
    }


    restore():Promise<UserTokenInterface|null> {
        return new Promise((resolve, reject)=> {
            if (this.user) {
                return resolve(new FirebaseAuthToken(this.user));
            }
            let sub = this.onAuthTokenChanged.subscribe((token:UserTokenInterface)=> {
                sub.unsubscribe();
                clearTimeout(timeout);
                resolve(token);
            });
            let timeout = setTimeout(()=> {
                sub.unsubscribe();
                reject(null);
            }, 5000);
        });
    }

    logout(token:UserTokenInterface):Promise<UserTokenInterface> {
        return new Promise((resolve, reject)=> {
            this.firebase_auth.signOut()
                .then(function () {
                    delete this.user;
                    resolve(new AnonymousUserToken());
                }).catch(function (error) {
                reject(token);
            });
        });
    }
}

export class FirebaseAuthToken implements UserTokenInterface {
    protected user:UserInterface;
    roles:string[] = [];

    constructor(data:any) {
        this.user = data;
        // (<any>this.user).isAnonymous = false;
    }

    getUser():UserInterface {
        return this.user;
    }

    getUsername():string {
        return (<any>this.getUser()).email;
    }

    hasRole(name:string):boolean {
        return this.roles.indexOf(name) !== -1;
    }

    setUser(user:UserInterface) {
        this.user = user;
        return this;
    }

    isAuthenticated():boolean {
        return !!(<any>this.getUser());
    }
}

export class FirebaseAnonymusAuthToken extends FirebaseAuthToken {
    roles:string[] = ['anonymous'];

    constructor(data:any) {
        super(data);
    }

    isAuthenticated():boolean {
        return true;
    }

}

export class FirebaseSocialAuthToken extends FirebaseAuthToken {
    constructor(data:any, public socialProvider:any) {
        super(data);
    }

    isAuthenticated():boolean {
        return true;
    }
}