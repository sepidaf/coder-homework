// add deleteUser function to app.js

/**
 * deleteUser(userId, users)
 * Removes a user with the given id from the provided users array.
 * - If the user is found and removed, returns true.
 * - If the user is not found, returns false.
 * - Throws an error if userId is not provided or users is not an array.
 *
 * This is a synchronous utility function that operates on an in-memory array.
 * If your app uses a database, replace this implementation with the appropriate
 * async database call (e.g. using an ORM or direct DB query).
 *
 * Example:
 *   const users = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
 *   deleteUser('2', users); // returns true, users now [{ id: '1', name: 'A' }]
 */
function deleteUser(userId, users) {
  if (userId === undefined || userId === null) {
    throw new Error('deleteUser: userId is required');
  }
  if (!Array.isArray(users)) {
    throw new Error('deleteUser: users must be an array');
  }

  const index = users.findIndex((u) => u && (u.id === userId || u._id === userId));
  if (index === -1) {
    return false; // user not found
  }

  users.splice(index, 1);
  return true; // user removed
}

// CommonJS export if used in this project
if (typeof module !== 'undefined' && module.exports) {
  module.exports.deleteUser = deleteUser;
}

// For ES modules, also provide a named export if supported
try {
  // This will only work in environments that support exports
  exports.deleteUser = deleteUser; // eslint-disable-line no-undef
} catch (e) {
  // ignore if exports is not available
}
