module.exports =  function login(username, password, users) {
    const user = users.find((u) => u.username === username);
    if (!user) return { success: false, message: "User not found" };
    if (user.password !== password) return { success: false, message: "Invalid credentials" };
    return { success: true, message: "Login successful" };
}