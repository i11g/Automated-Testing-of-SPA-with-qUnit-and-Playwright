const baseURL='http://localhost:3030'

const user={
    email:"",
    password:"123456"
} 

let token=""
let userId=""

const myEvent ={
    author: "Random Author",
    date: "24.06.2024",
    title: "",
    description: "",
    imageUrl: "/images/2.png"
} 

let lastCreatedEventId=""

QUnit.config.reorder=false 

QUnit.module("User functionallity", ()=>{
    QUnit.test("registration", async (assert)=>{
       //arrange
        let path = '/users/register' 

        let random=Math.floor(Math.random()*1000) 
        let randomEmail=`abv${random}@abv.bg`
        user.email=randomEmail 
     //act
        let response= await fetch(baseURL+ path, {
            method: 'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify(user)
        }) 

        let jsonData= await response.json()         
       
        //assert              
        assert.ok(response.ok) 

        assert.ok(jsonData.hasOwnProperty('email'), 'email exists')
        assert.equal(jsonData['email'], user.email, 'expected email')
        assert.strictEqual(typeof jsonData.email, 'string', 'Property email is a string') 

        assert.ok(jsonData.hasOwnProperty('password'), 'password exists')
        assert.equal(jsonData['password'], user.password, 'password exists')
        assert.strictEqual(typeof jsonData.password, 'string', 'Property password is a string')

        assert.ok(jsonData.hasOwnProperty('_createdOn'), '_createdOn exists')
        assert.strictEqual(typeof jsonData._createdOn, 'number', 'Property _createdOn is a number') 

        assert.ok(jsonData.hasOwnProperty('_id'), '_id exists')
        assert.strictEqual(typeof jsonData._id, 'string', 'Property _id is a string') 

        userId=jsonData['_id']

        assert.ok(jsonData.hasOwnProperty('accessToken'), 'accessToken exists')
        assert.strictEqual(typeof jsonData.accessToken, 'string', 'Property accessToken is a string')

        token=jsonData['accessToken']

        sessionStorage.setItem('event-user', JSON.stringify(user))
    })
    QUnit.test("user login", async(assert)=> {
        //arrange
        let path='/users/login'
        
        //act 
        let reponse = await fetch(baseURL+path, {
            method:"POST",
            headers:{
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        })

        //assert
        assert.ok(reponse.ok, 'response is successfull') 

        let data=await reponse.json();

        assert.ok(data.hasOwnProperty('email'), 'email.exists')
        assert.equal(data['email'], user.email, 'expected email')
        assert.strictEqual(typeof data.email, 'string', 'Property email is a string') 

        assert.ok(data.hasOwnProperty('password'), 'password exists')
        assert.equal(data['password'], user.password, 'expected password')
        assert.strictEqual(typeof data.password, 'string', 'Property password is a string')

        assert.ok(data.hasOwnProperty('_id'), '_id exists')
        assert.strictEqual(typeof data._id, 'string', 'Property _id is a string')

        assert.ok(data.hasOwnProperty('accessToken'), 'accessToken exists')
        assert.strictEqual(typeof data.accessToken, 'string', 'Property accessToken is a string ') 

        token=data['accessToken']
        userId=data['_id']

        sessionStorage.getItem('event-user', JSON.stringify(user))
    })
})
QUnit.module("Event functionallity", ()=>{
      QUnit.test("get all events testing", async(assert)=>{
        //arrange   
         let path='/data/theaters'
         let queryparams='?sortBy=_createdOn%20desc&distinct=title' 

      //act 
        let response= await fetch(baseURL+path+queryparams, {
            method:"GET"
        })

        //assert 

        assert.ok(response.ok, 'response is successfull') 

        let jsonData=await response.json()

        assert.ok(Array.isArray(jsonData), 'response is array') 

        jsonData.forEach(element => {
            assert.ok(element.hasOwnProperty('author'), 'author exists')
            assert.strictEqual(typeof element.author, 'string', 'Property is a string')

            assert.ok(element.hasOwnProperty('title'), 'title exists')
            assert.strictEqual(typeof element.title, 'string', 'Property is a string')

            assert.ok(element.hasOwnProperty('_ownerId'), '_ownerId exists')
            assert.strictEqual(typeof element._ownerId, 'string', 'Property is a string')

            assert.ok(element.hasOwnProperty('date'), 'date exists')
            assert.strictEqual(typeof element.date, 'string', 'Property is a string')

            assert.ok(element.hasOwnProperty('imageUrl'), 'iamgeUrl exists')
            assert.strictEqual(typeof element.imageUrl, 'string', 'Property is a string')

            assert.ok(element.hasOwnProperty('description'), 'description exists')
            assert.strictEqual(typeof element.description, 'string', 'Property is a string')
            
            assert.ok(element.hasOwnProperty('_createdOn'), '_createdOn exists')
            assert.strictEqual(typeof element._createdOn, 'number', 'Property is a number')

            assert.ok(element.hasOwnProperty('_id'), '_id exists')
            assert.strictEqual(typeof element._id, 'string', 'Property is a string')            
            
        });

      })
      QUnit.test("create event testing", async(assert)=>{
        //arrange       
        let path='/data/theaters'
        let random=Math.floor(Math.random()*1000) 
        
        let randomtitle=`random_title_${random}`
        let randomDescription=`random_description_${random}`
        myEvent.title=randomtitle
        myEvent.description=randomDescription
       
        //act 
       let response =await fetch(baseURL+path, {
         method:"POST",
         headers: {
            'content-type' : 'application/json',
            'X-Authorization' : token
         },
         body: JSON.stringify(myEvent)
       }) 

       //assert 

       assert.ok(response.ok, 'response is successfull') 

       let eventData=await response.json() 

       console.log(eventData) 

       assert.ok(eventData.hasOwnProperty('author'), 'author exists')
       assert.equal(eventData['author'], myEvent.author, 'expected author')
       assert.strictEqual(typeof eventData.author, 'string', 'Property author is a string')

       assert.ok(eventData.hasOwnProperty('date'), 'date exists')
       assert.equal(eventData['date'], myEvent.date, 'expected author')
       assert.strictEqual(typeof eventData.date, 'string', 'Property author is a string')

       assert.ok(eventData.hasOwnProperty('description'), 'description exists')
       assert.equal(eventData['description'], myEvent.description, 'expected author')
       assert.strictEqual(typeof eventData.description, 'string', 'Property author is a string') 

       assert.ok(eventData.hasOwnProperty('title'), 'title exists')
       assert.equal(eventData['title'], myEvent.title, 'expected author')
       assert.strictEqual(typeof eventData.description, 'string', 'Property author is a string') 
       
       assert.ok(eventData.hasOwnProperty('_id'), '_id exists')
       assert.strictEqual(typeof eventData._id, 'string', 'Property _id is a string')
      
      lastCreatedEventId=eventData['_id']

      }) 

      QUnit.test("edit event testing", async(assert)=>{
        //arrange      
        let path='/data/theaters'
        let random=Math.floor(Math.random()*1000)
        myEvent.title=`Edited title ${random}`
        
        //act 
        let response= await fetch(baseURL+ path + `/${lastCreatedEventId}`, {
            method:"PUT",
            headers: {
               'content-type' : 'application/json',
               'X-Authorization' : token
            },
            body: JSON.stringify(myEvent)
        }) 
        
        assert.ok(response.ok, 'response is successfull') 

        let eventData=await response.json()

       assert.ok(eventData.hasOwnProperty('author'), 'author exists')
       assert.equal(eventData['author'], myEvent.author, 'expected author')
       assert.strictEqual(typeof eventData.author, 'string', 'Property author is a string')

       assert.ok(eventData.hasOwnProperty('date'), 'date exists')
       assert.equal(eventData['date'], myEvent.date, 'expected author')
       assert.strictEqual(typeof eventData.date, 'string', 'Property author is a string')

       assert.ok(eventData.hasOwnProperty('description'), 'description exists')
       assert.equal(eventData['description'], myEvent.description, 'expected author')
       assert.strictEqual(typeof eventData.description, 'string', 'Property author is a string') 

       assert.ok(eventData.hasOwnProperty('title'), 'title exists')
       assert.equal(eventData['title'], myEvent.title, 'expected author')
       assert.strictEqual(typeof eventData.description, 'string', 'Property author is a string') 
       
       assert.ok(eventData.hasOwnProperty('_id'), '_id exists')
       assert.strictEqual(typeof eventData._id, 'string', 'Property _id is a string') 

       lastCreatedEventId=eventData['_id']


      })
      QUnit.test("delete event testing", async(assert)=>{
        //arrange      
        let path='/data/theaters'
        //act
        let response=await fetch(baseURL+path+`/${lastCreatedEventId}`, {
            method:'DELETE',
            headers: {
                'X-Authorization' : token
            }
        })
         
            //assert
            assert.ok(response.ok, 'response is successfull')
      })
})