const mongoose = require("mongoose");

const connectMongoDB = (mongoHost: string, dbName: string, username: string, password: string) => {
    const fullMongoURI = `mongodb://${username}:${password}@${mongoHost}:27017/${dbName}`
    return mongoose   
        .connect(fullMongoURI, {dbName: dbName})
        .then(() => console.log('Connexion à mongo réussi'))
        .catch((error: any) => console.log('Connexion à mongo échoué', error))
}

export default connectMongoDB;