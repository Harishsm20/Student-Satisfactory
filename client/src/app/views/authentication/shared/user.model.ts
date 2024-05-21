export class User {
    username: string;
    email: string;
    password: string;
    department: string;
    role: string;
    RollNo:string;
    batch: string;
  
    constructor(username: string, email: string, password: string, RollNo:string, batch:string, department:string, role:string) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.department = department;
        this.role = role;
        this.RollNo = RollNo;
        this.batch = batch;
      }
}
