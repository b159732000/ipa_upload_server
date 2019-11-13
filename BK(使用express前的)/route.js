// route.js
exports = module.exports = [{
    method: 'GET',
    path: '/api/user',
    impl: 'account.userById'
}, {
    method: 'POST',
    path: '/api/user',
    impl: 'account.createUser'
}];