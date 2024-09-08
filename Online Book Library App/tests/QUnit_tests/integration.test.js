const baseURL='http://localhost:3030' 

const user= {
    email:"",
    password: "123456"
} 


let token=""
let userId="" 
let lastCreatedBookId=""

const book={
    title:"",
    description:"",
    imageUrl:"/images/book.png",
    type:"Other"
}

QUnit.config.reorder=false 

QUnit.module("User functionallity", ()=> {
    QUnit.test("registration testing", async (assert)=>{
        //arrange 
        let path='/users/register' 

         let random=Math.floor(Math.random()*1000) 
         let randomEmail=`abv${random}@abv.bg`

         user.email=randomEmail 

         //act
         let response=await fetch(baseURL+path, {
            method:"POST",
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
         }) 
         let userdata=await response.json()

         //assert
         assert.ok(response.ok, 'response is successfull')
         console.log(userdata) 

         assert.ok(userdata.hasOwnProperty('email'), 'email exists')
         assert.equal(userdata['email'], user.email, 'email is as expected')
         assert.strictEqual(typeof userdata.email, 'string', 'Property email is a string') 

         assert.ok(userdata.hasOwnProperty('password'), 'password exists')
         assert.equal(userdata['password'], user.password, 'password is as expected')
         assert.strictEqual(typeof userdata.password, 'string', 'Property password is a string') 

         assert.ok(userdata.hasOwnProperty('_createdOn'), '_createdOn exists')         
         assert.strictEqual(typeof userdata._createdOn, 'number', 'Property _createdOn is a number') 

         assert.ok(userdata.hasOwnProperty('_id'), '_id exists')         
         assert.strictEqual(typeof userdata._id, 'string', 'Property _id is a string') 

         assert.ok(userdata.hasOwnProperty('accessToken'), 'accessToken exists')         
         assert.strictEqual(typeof userdata.accessToken, 'string', 'Property accessToken is a string') 
        
         token=userdata['accessToken']
         userId=userdata['-id']
         sessionStorage.setItem('books-user', JSON.stringify())
    })
    QUnit.test('login registration tesitn', async(assert)=>{
        //arrange 
        let path='/users/login'
        //act
        let response=await fetch(baseURL+path, {
            method: 'POST',
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        }) 

        let userdata=await response.json() 
        console.log(userdata)

        assert.ok(response.ok, 'response is successfull') 
       
        assert.ok(userdata.hasOwnProperty('email'), 'email exists')
         assert.equal(userdata['email'], user.email, 'email is as expected')
         assert.strictEqual(typeof userdata.email, 'string', 'Property email is a string') 

         assert.ok(userdata.hasOwnProperty('password'), 'password exists')
         assert.equal(userdata['password'], user.password, 'password is as expected')
         assert.strictEqual(typeof userdata.password, 'string', 'Property password is a string') 

         assert.ok(userdata.hasOwnProperty('_createdOn'), '_createdOn exists')         
         assert.strictEqual(typeof userdata._createdOn, 'number', 'Property _createdOn is a number') 

         assert.ok(userdata.hasOwnProperty('_id'), '_id exists')         
         assert.strictEqual(typeof userdata._id, 'string', 'Property _id is a string') 

         assert.ok(userdata.hasOwnProperty('accessToken'), 'accessToken exists')         
         assert.strictEqual(typeof userdata.accessToken, 'string', 'Property accessToken is a string') 
        
         token=userdata['accessToken']
         userId=userdata['-id']
         sessionStorage.setItem('books-user', JSON.stringify())

    })
})
QUnit.module("Book functionallity", ()=>{
   QUnit.test('get all books testing', async(assert)=>{
        //arrange 
         let path='/data/books'
         let params='?sortBy=_createdOn%20desc'
        //act 
        let response=await fetch(baseURL+path+params)
        
        let booksData=await response.json()

        console.log(booksData) 
       //assert
        assert.ok(response.ok, 'response is successfull')
        assert.ok(Array.isArray(booksData), 'booksData is an array')
        
        booksData.forEach(book => {
                assert.ok(book.hasOwnProperty('title'), 'title esists')
                assert.strictEqual(typeof book.title, 'string', 'Property title is a string')

                assert.ok(book.hasOwnProperty('description'), 'description esists')
                assert.strictEqual(typeof book.description, 'string', 'Property description is a string')

                assert.ok(book.hasOwnProperty('type'), 'type esists')
                assert.strictEqual(typeof book.type, 'string', 'Property type is a string')

                assert.ok(book.hasOwnProperty('_ownerId'), '_ownerId esists')
                assert.strictEqual(typeof book._ownerId, 'string', 'Property _ownerrId is a string')

                assert.ok(book.hasOwnProperty('_id'), '_id esists')
                assert.strictEqual(typeof book._id, 'string', 'Property _ id is a string')

                assert.ok(book.hasOwnProperty('imageUrl'), 'imageUrl esists')
                assert.strictEqual(typeof book.imageUrl, 'string', 'Property imageUrl is a string')
        });

   })
   QUnit.test('create book testting', async(assert)=>{
         //arrange
         let path='/data/books'
         let random=Math.floor(Math.random()*1000) 
         let randomTitle=`random_title_${random}`
         let randomDescription=`random_description_${random}`
         //act
         
         let response=await fetch ( baseURL+ path, {
            method:"POST",
            headers:{
                'content-type' : 'application/json',
                 'X-Authorization': token
            },
            body: JSON.stringify(book)
         })

         let bookData=await response.json()
         console.log(bookData) 

         assert.ok(response.ok, 'response is successfull')
         
         assert.ok(bookData.hasOwnProperty('title'), 'title esists')
         assert.equal(bookData['title'], bookData.title, 'expected title')
         assert.strictEqual(typeof bookData.title, 'string', 'Property title is a string')

        assert.ok(bookData.hasOwnProperty('description'), 'description esists')
        assert.equal(bookData['description'], bookData.description, 'expected description')
        assert.strictEqual(typeof bookData.description, 'string', 'Property description is a string')

        assert.ok(bookData.hasOwnProperty('type'), 'type esists')
        assert.equal(bookData['type'], bookData.type, 'expected type')
        assert.strictEqual(typeof bookData.type, 'string', 'Property type is a string')

        assert.ok(bookData.hasOwnProperty('_ownerId'), '_ownerId esists')
        assert.strictEqual(typeof bookData._ownerId, 'string', 'Property _ownerrId is a string')

        assert.ok(bookData.hasOwnProperty('_id'), '_id esists')
        assert.strictEqual(typeof bookData._id, 'string', 'Property _ id is a string')

        assert.ok(bookData.hasOwnProperty('imageUrl'), 'imageUrl esists')
        assert.strictEqual(typeof bookData.imageUrl, 'string', 'Property imageUrl is a string') 

       lastCreatedBookId=bookData['_id']

   })
   QUnit.test('edit book testing', async(assert)=>{
        //arrane
        let path='/data/books/' + `${lastCreatedBookId}`
        let random = Math.floor(Math.random()*1000) 

        let randomEditedTitle='Edited book title' +`${random}`
        book.title=randomEditedTitle 
        
        //act
        let reponse =await fetch(baseURL+ path, {
              method: 'PUT',
              headers: {
                'content-type' : 'application/json',
                 'X-Authorization' : token
              },
              body: JSON.stringify(book) 
        }) 
        
             let editData=await reponse.json()
             console.log(editData)
             assert.ok(reponse.ok, 'reponse is successfull')
            
             assert.ok(editData.hasOwnProperty('title'), 'title esists')
             assert.equal(editData['title'], editData.title, 'expected title')
             assert.strictEqual(typeof editData.title, 'string', 'Property title is a string')
    
            assert.ok(editData.hasOwnProperty('description'), 'description esists')
            assert.equal(editData['description'], editData.description, 'expected description')
            assert.strictEqual(typeof editData.description, 'string', 'Property description is a string')
    
            assert.ok(editData.hasOwnProperty('type'), 'type esists')
            assert.equal(editData['type'], editData.type, 'expected type')
            assert.strictEqual(typeof editData.type, 'string', 'Property type is a string')
    
            assert.ok(editData.hasOwnProperty('_ownerId'), '_ownerId esists')
            assert.strictEqual(typeof editData._ownerId, 'string', 'Property _ownerrId is a string')
    
            assert.ok(editData.hasOwnProperty('_id'), '_id esists')
            assert.strictEqual(typeof editData._id, 'string', 'Property _ id is a string')
    
            assert.ok(editData.hasOwnProperty('imageUrl'), 'imageUrl esists')
            assert.strictEqual(typeof editData.imageUrl, 'string', 'Property imageUrl is a string') 
            
            assert.ok(editData.hasOwnProperty('_updatedOn'), '_updatedOn exists')
            assert.strictEqual(typeof editData._updatedOn, 'number', 'Property _updayedOn is a string') 
            //lastCreatedBookId=editData['_id']         

   })
   QUnit.test('delete book testing', async(assert)=>{
        //arrange   
        let path='/data/books/' + `${lastCreatedBookId}`
        //act 
        let response = await fetch(baseURL+path, {
            method: "DELETE",
            headers:{
                'X-Authorization' : token
            }
        })

        //assert 

        assert.ok(response.ok, 'response is successfull')
   })
})