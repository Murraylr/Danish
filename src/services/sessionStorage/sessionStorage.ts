export class SessionStorage {
    static setItem(key: string, value: any) {
        sessionStorage.setItem(key, value);
    }

    static getItem(key: string) {
        return sessionStorage.getItem(key);
    }

    static GetPlayerName() {
        return this.getItem("playerName");
    }

    static SetPlayerName(playerName: string) {
        this.setItem("playerName", playerName);
    }
}