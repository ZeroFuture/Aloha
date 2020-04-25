# [Aloha](https://alohamessage.herokuapp.com/)

Aloha! is an instant messaging application that provides service to registered users. After login, users are free to add/delete friends, initiate one to one real-time chats, start/join a group chat based on channel Id.

## Author

Zhidong Qu, Jiayan Wei, Qimin Cao, Xinmeng Zhang

## Usage

1. [Install MongoDB Community Edition.](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

```
brew install mongodb-community@4.2
```

2. Clone project to your local.

```
git clone https://github.com/ZeroFuture/Aloha.git
```

3. Run MongoDB Community Edition.
```
brew services start mongodb-community@4.2
```

4. Start the server.
```
npm install
nodemon index.js
```

5. Start the client.
```
cd client
npm install
npm start
```
The browser will be automatically starte at http://localhost:3000, and you can start exploring our application!

