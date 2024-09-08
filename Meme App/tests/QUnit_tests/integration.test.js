const baseUrl='http://localhost:3030' 

const user={
    username:"",
    email:"",
    password: "123456",
    gender:"male"
} 

let token=""
let userId=""  

const meme={
    title:"",
    description:"",
    imageUrl:"/images/2.png"
} 

let lastCreatedMemeId=""

QUnit.config.reorder=false 

QUnit.module("User functionality", ()=>{
    QUnit.test('registration tesitng', async(assert)=>{
        //arrange
        let path='/users/register'
        let random=Math.floor(Math.random()*1000) 
        let randomUserName=`username_${random}`
        let randomEmail=`abv${random}@abv.bg`
        user.username=randomUserName
        user.email=randomEmail 

        //act 
        let response=await fetch(baseUrl+path, {
            method:"POST",
            headers:{
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        })

        let userData=await response.json()
        console.log(userData) 
        assert.ok(response.ok, 'response is successfull') 

        assert.ok(userData.hasOwnProperty('email'), 'email exists')
        assert.equal(userData['email'], user.email, 'expected email')
        assert.strictEqual(typeof userData.email, 'string', 'Property email is a string')

        assert.ok(userData.hasOwnProperty('gender'), 'gender exists')
        assert.equal(userData['gender'], user.gender, 'expected gender')
        assert.strictEqual(typeof userData.gender, 'string', 'Property gender is a string') 

        assert.ok(userData.hasOwnProperty('password'), 'password exists')
        assert.equal(userData['password'], user.password, 'expected password')
        assert.strictEqual(typeof userData.password, 'string', 'Property password is a string')

        assert.ok(userData.hasOwnProperty('username'), 'username exists')
        assert.equal(userData['username'], user.username, 'expected username')
        assert.strictEqual(typeof userData.username, 'string', 'Property username is a string')

        assert.ok(userData.hasOwnProperty('accessToken'), 'accessToken exists')
        assert.strictEqual(typeof userData.accessToken, 'string', 'Property accessToken is a string')

        assert.ok(userData.hasOwnProperty('_id'), '_id exists')
        assert.strictEqual(typeof userData._id, 'string', 'Property _id is a string') 

        assert.ok(userData.hasOwnProperty('_createdOn'), '_createdOn exists')
        assert.strictEqual(typeof userData._createdOn, 'number', 'Property _createdOn is a string')
        
        token=userData['accessToken']
        userId=userData['_id']
        sessionStorage.setItem('meme-user', JSON.stringify(user))   
    }) 
    QUnit.test('login testing', async (assert)=> {
        //arrange    
        let path='/users/login' 
        //act 

        let response=await fetch(baseUrl+path, {
            method:"POST",
            headers:{
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        })

        let userData=await response.json()

        assert.ok(response.ok, 'response is successfull') 
        assert.ok(userData.hasOwnProperty('email'), 'email exists')
        assert.equal(userData['email'], user.email, 'expected email')
        assert.strictEqual(typeof userData.email, 'string', 'Property email is a string')

        assert.ok(userData.hasOwnProperty('gender'), 'gender exists')
        assert.equal(userData['gender'], user.gender, 'expected gender')
        assert.strictEqual(typeof userData.gender, 'string', 'Property gender is a string') 

        assert.ok(userData.hasOwnProperty('password'), 'password exists')
        assert.equal(userData['password'], user.password, 'expected password')
        assert.strictEqual(typeof userData.password, 'string', 'Property password is a string')

        assert.ok(userData.hasOwnProperty('username'), 'username exists')
        assert.equal(userData['username'], user.username, 'expected username')
        assert.strictEqual(typeof userData.username, 'string', 'Property username is a string')

        assert.ok(userData.hasOwnProperty('accessToken'), 'accessToken exists')
        assert.strictEqual(typeof userData.accessToken, 'string', 'Property accessToken is a string')

        assert.ok(userData.hasOwnProperty('_id'), '_id exists')
        assert.strictEqual(typeof userData._id, 'string', 'Property _id is a string') 

        assert.ok(userData.hasOwnProperty('_createdOn'), '_createdOn exists')
        assert.strictEqual(typeof userData._createdOn, 'number', 'Property _createdOn is a string')
        
        token=userData['accessToken']
        userId=userData['_id']
        sessionStorage.setItem('meme-user', JSON.stringify(user))   

    })

}) 

QUnit.module("Meme functionality", ()=> {
    QUnit.test('get all memes testing', async(assert)=>{
        //arrange
        let path = '/data/memes';
        let queryParam = '?sortBy=_createdOn%20desc';
        //act
        let response=await fetch(baseUrl+ path +queryParam )
        let memeData=await response.json()
        console.log(memeData) 

        assert.ok(response.ok, 'response is successfull') 

        assert.ok(Array.isArray(memeData), 'response is an array')
        memeData.forEach(meme => {
             assert.ok(meme.hasOwnProperty('description'), 'description exists')
             assert.strictEqual(typeof meme.description, 'string', 'Property description is a string')

             assert.ok(meme.hasOwnProperty('imageUrl'), 'imageUrl exists')
             assert.strictEqual(typeof meme.imageUrl , 'string', 'Property imageUrl is a string')

             assert.ok(meme.hasOwnProperty('title'), 'title exists')
             assert.strictEqual(typeof meme.title , 'string', 'Property title is a string') 

             assert.ok(meme.hasOwnProperty('_createdOn'), '_createdOn exists')
             assert.strictEqual(typeof meme._createdOn , 'number', 'Property _createdOn is a string')

             assert.ok(meme.hasOwnProperty('_id'), '_id exists')
             assert.strictEqual(typeof meme._id , 'string', 'Property _id is a string')
            
             assert.ok(meme.hasOwnProperty('_ownerId'), '_id exists')
             assert.strictEqual(typeof meme._ownerId , 'string', 'Property _ownerId is a string')
        });
    })
    QUnit.test('create own meme testing', async(assert)=>{
        //arrange  
        let path='/data/meme'
        let random=Math.floor(Math.random()*1000)
        let randomTitle=`random_title_${random}`
        let randomDecription=`random_description_${random}`
        meme.title=randomTitle
        meme.description=randomDecription
        //act
        let response=await fetch(baseUrl+path, {
            method:"POST",
            headers:{
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body: JSON.stringify(meme)
        }) 

        let memeData=await response.json()
        console.log(memeData) 

        //assert
        assert.ok(response.ok, 'response is successfull')
        
        assert.ok(memeData.hasOwnProperty('description'), 'description exists')
        assert.equal(memeData['description'], meme.description, 'expected description')
        assert.strictEqual(typeof memeData.description, 'string', 'Property description is a string')

        assert.ok(memeData.hasOwnProperty('title'), 'title exists')
        assert.equal(memeData['title'], meme.title, 'expected title')
        assert.strictEqual(typeof memeData.title, 'string', 'Property title is a string') 

        assert.ok(memeData.hasOwnProperty('imageUrl'), 'imageUrl exists')
        assert.equal(memeData['imageUrl'], meme.imageUrl, 'expected imageUrl')
        assert.strictEqual(typeof memeData.imageUrl, 'string', 'Property imageUrl is a string') 

        assert.ok(memeData.hasOwnProperty('_id'), '_id exists')
        assert.strictEqual(typeof memeData._id, 'string', 'Property _id is a string')

        assert.ok(memeData.hasOwnProperty('_ownerId'), '_ownerId exists')
        assert.strictEqual(typeof memeData._ownerId, 'string', 'Property _ownerId is a string')

        assert.ok(memeData.hasOwnProperty('_createdOn'), 'Property "_createdOn" exists');
        assert.strictEqual(typeof memeData._createdOn, 'number', 'Property "_createdOn" is a number');
        lastCreatedMemeId=memeData['_id']
    })
    QUnit.test('Edit meme tesitng', async(assert)=>{
        //arrange  
        let path='/data/meme'
        let random=Math.floor(Math.random()*1000) 

        let editedTitle=`Edit title ${random} `
        meme.title=editedTitle 
        //act
        let response=await fetch(baseUrl+path +`/${lastCreatedMemeId}`, {
            method: "PUT",
            headers:{
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body: JSON.stringify(meme)
        })

        let memeData=await response.json() 
        assert.ok(response.ok, 'response is succesfull')   

        assert.ok(memeData.hasOwnProperty('description'), 'description exists')
        assert.equal(memeData['description'], meme.description, 'expected description')
        assert.strictEqual(typeof memeData.description, 'string', 'Property description is a string')

        assert.ok(memeData.hasOwnProperty('title'), 'title exists')
        assert.equal(memeData['title'], meme.title, 'expected title')
        assert.strictEqual(typeof memeData.title, 'string', 'Property title is a string') 

        assert.ok(memeData.hasOwnProperty('imageUrl'), 'imageUrl exists')
        assert.equal(memeData['imageUrl'], meme.imageUrl, 'expected imageUrl')
        assert.strictEqual(typeof memeData.imageUrl, 'string', 'Property imageUrl is a string') 

        assert.ok(memeData.hasOwnProperty('_id'), '_id exists')
        assert.strictEqual(typeof memeData._id, 'string', 'Property _id is a string')

        assert.ok(memeData.hasOwnProperty('_ownerId'), '_ownerId exists')
        assert.strictEqual(typeof memeData._ownerId, 'string', 'Property _ownerId is a string')

        assert.ok(memeData.hasOwnProperty('_createdOn'), 'Property "_createdOn" exists');
        assert.strictEqual(typeof memeData._createdOn, 'number', 'Property "_createdOn" is a number');
    }) 

    QUnit.test('Delete meme testing', async(assert)=>{
        //arrange 
        let path='/data/meme'
        //act
        let response=await fetch(baseUrl+path+`/${lastCreatedMemeId}`, {
            method:"DELETE",
            headers:{
                 'X-Authorization' : token
            }
        }) 

        assert.ok(response.ok, 'response is successfull')
    })
})
