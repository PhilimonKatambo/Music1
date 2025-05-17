import Player from "./player";

class DBase {
    constructor(dbName = 'SongBase', dbVersion = 1) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.db = null;

        this.request = indexedDB.open(this.dbName, this.dbVersion);

        this.request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            if (!this.db.objectStoreNames.contains('mySongs')) {
                let objectStore = this.db.createObjectStore('mySongs', { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('name', 'name', { unique: false });
            }
            console.log('Database upgraded.');
        };

        this.request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('Database initialized.');
        };

        this.request.onerror = (event) => {
            console.error('Database error:', event.target.error);
        };
    }

    SaveSong(name1, url, imageUrl) {
        if (!this.db) {
            console.error('Database not initialized yet. Try again later.');
            return;
        }

        const transaction = this.db.transaction(['mySongs'], 'readwrite');
        const objectStore = transaction.objectStore('mySongs');

        const data = { name: name1, value: url, image:imageUrl};

        const request = objectStore.add(data);

        request.onsuccess = () => {
            console.log('Song added successfully.');
        };

        request.onerror = (event) => {
            console.error('Error adding song:', event.target.error);
        };
    }

    async Retrive(name) {
        return new Promise((resolve, reject) => {
            let db;
            const request1 = indexedDB.open(this.dbName, this.dbVersion);
    
            request1.onsuccess = (event) => {
                db = event.target.result;
                console.log('Database initialized.');
    
                const transaction = db.transaction(["mySongs"], "readonly");
                const store = transaction.objectStore("mySongs");
                const request = store.openCursor();
                const SongValName=[]
    
                request.onsuccess = function (event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        if (cursor.value["name"] === name) {
                            console.log('Song found');
                            SongValName.push(cursor.value["name"])
                            SongValName.push(cursor.value["value"])
                            //console.log(SongValName)
                            resolve(SongValName);
                            return;
                        }
                        cursor.continue();
                    } else {
                        console.log("Song not found");
                        resolve(null);
                    }
                };
    
                request.onerror = function () {
                    console.log("Error retrieving song");
                    reject("Error retrieving song");
                };
            };
    
            request1.onerror = (event) => {
                console.error("Error opening database:", event.target.error);
                reject("Error opening database");
            };
        });
    }
    

    async RetriveAll() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
    
            request.onsuccess = function (event) {
                const db = event.target.result;
                
                const transaction = db.transaction(["mySongs"], "readonly");
                const store = transaction.objectStore("mySongs");
                const cursorRequest = store.openCursor();
                
                const allData = [];
                cursorRequest.onsuccess = function (event) {
                    const cursor = event.target.result;
    
                    if (cursor) {
                        let wholeSong={
                            name:cursor.value['name'],
                            image:cursor.value['image']
                        }
                        allData.push(wholeSong);
                        cursor.continue();
                    } else {
                        resolve(allData);
                    }
                };
    
                cursorRequest.onerror = function () {
                    console.log("Error retrieving song");
                    reject("Error retrieving song");
                };
            };
    
            request.onerror = function () {
                console.log("Error opening database");
                reject("Error opening database");
            };
        });
    }

    async Delete(songName){
        const request = indexedDB.open(this.dbName, this.dbVersion)

        request.onsuccess=function(event){
            const db=event.target.result;

            const transaction=db.transaction('mySongs',"readwrite");

            const store=transaction.objectStore('mySongs')

            let index=store.index('name')

            let getRequest=index.getKey(songName)

            getRequest.onsuccess=()=>{
                let key=getRequest.result;

                if(key!== undefined){
                    let deleteRequest=store.delete(key);

                    deleteRequest.onsuccess=()=>console.log(key+': deleted')

                    deleteRequest.onerror=()=>console.log(key+': cant delete')
                }
                else{
                    console.log('entry not found')
                }
            }
        }

    }
    

}
    
export default DBase;
