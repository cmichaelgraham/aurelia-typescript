export class AppState {
    public isAuthenticated: boolean;

    /**
      * Simple application state
      *
      */
    constructor() {
        this.isAuthenticated = false;
    }

    login(username: string, password: string): boolean {
        if (username == "Admin" && password == "xxx") {
            this.isAuthenticated = true;
            return true;
        }
        this.logout();
        return false;
    }

    logout() {
        this.isAuthenticated = false;
    }
}
