import { User } from './user.model';

describe('User', () => {
  it('should create an instance', () => {
    // Provide mock values for username, email, and password
    const username = 'testuser';
    const email = 'test@example.com';
    const password = 'password123';
    const department = 'Information Technology';
    const role = 'student';
    const RollNo = '7376222IT908';
    const batch = '2022';

    // Create a new instance of the User class with mock values
    const user = new User(username, email, password,department, role, RollNo, batch);

    // Assert that the user instance is truthy (i.e., it exists)
    expect(user).toBeTruthy();
  });
});
