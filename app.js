let users = [];

function addUser(name) {
    users.push(name);
    return "User added";
}

console.log(addUser("Ali"));
console.log(users);
