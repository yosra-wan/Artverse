import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  findUserById(id: any) {
    return this.http.get(`http://localhost:5000/user/getUserById/${id}`);
  }

  findUserByUsername(username: any) {
    return this.http.get(
      `http://localhost:5000/user/getUserByUsername/${username}`
    );
  }
}