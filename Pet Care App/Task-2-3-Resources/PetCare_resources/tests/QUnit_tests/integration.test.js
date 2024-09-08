const baseUrl = "http://localhost:3030";

let user = {
    email: "",
    password: "123456"
};

let lastCreatedPetPostCardtId = '';

let petdata = {
    age : "2 years",
    name : "Random name",
    breed : "Random breed",
    image : "/images/cat-create.jpg",
    weight  : "2 kg"
}

let token = "";
let userId = "";

QUnit.config.reorder = false; 

QUnit.module("user functionalities", () => {
    QUnit.test("registration", async (assert) => {
        
        let path = '/users/register';

        let random = Math.floor(Math.random() * 10000);
        let email = `abv${random}@abv.bg`;
        user.email = email;

        
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        let json = await response.json();

        
        assert.ok(response.ok); 

        console.log(json) 

        assert.ok(json.hasOwnProperty('email'), "email exists");
        assert.equal(json['email'], user.email, 'expexted email');
        assert.strictEqual(typeof json.email, 'string', "email has corect type");

        assert.ok(json.hasOwnProperty('password'), "password exists");
        assert.equal(json['password'], user.password, 'expexted password');
        assert.strictEqual(typeof json.password, 'string', "password has corect type");

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof json._createdOn, 'number', "password has corect type");

        assert.ok(json.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof json._id, 'string', "_id has corect type");

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exists");
        assert.strictEqual(typeof json.accessToken, 'string', "accessToken has corect type");

        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('event-user', JSON.stringify(user));

     })
     QUnit.test("login", async (assert) => {
        
        let path = '/users/login';
                
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        let json = await response.json();

        
        assert.ok(response.ok); 

        console.log(json) 

        assert.ok(json.hasOwnProperty('email'), "email exists");
        assert.equal(json['email'], user.email, 'expexted email');
        assert.strictEqual(typeof json.email, 'string', "email has corect type");

        assert.ok(json.hasOwnProperty('password'), "password exists");
        assert.equal(json['password'], user.password, 'expexted password');
        assert.strictEqual(typeof json.password, 'string', "password has corect type");

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof json._createdOn, 'number', "password has corect type");

        assert.ok(json.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof json._id, 'string', "_id has corect type");

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exists");
        assert.strictEqual(typeof json.accessToken, 'string', "accessToken has corect type");

        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('event-user', JSON.stringify(user));
     })   

})
QUnit.module("pet functionalities", ()=> {
    QUnit.test("get all postcards", async(assert)=> {
        let path='/data/pets';
        let param="?sortBy=_createdOn%20desc&distinct=name";

        let response = await fetch(baseUrl + path + param);
        
        let json = await response.json();

        console.log(json)
        assert.ok(response.ok, "Response is ok");
        assert.ok(Array.isArray(json), "response is array");

        json.forEach(jsonData=> {
             
            assert.ok(jsonData.hasOwnProperty('age'), "age exists");
            assert.strictEqual(typeof jsonData.age, 'string', "age is from correct type");

            assert.ok(jsonData.hasOwnProperty('breed'), "breed exists");
            assert.strictEqual(typeof jsonData.breed, 'string', "breed is from correct type");

            assert.ok(jsonData.hasOwnProperty('image'), "image exists");
            assert.strictEqual(typeof jsonData.image, 'string', "image is from correct type");

            assert.ok(jsonData.hasOwnProperty('name'), "name exists");
            assert.strictEqual(typeof jsonData.name, 'string', "name is from correct type");

            assert.ok(jsonData.hasOwnProperty('weight'), "weight exists");
            assert.strictEqual(typeof jsonData.weight, 'string', "weight is from correct type"); 

            assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exists");
            assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

            assert.ok(jsonData.hasOwnProperty('_id'), "_id exists");
            assert.strictEqual(typeof jsonData._id, 'string', "_id is from correct type");

            assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exists");
            assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is from correct type");

        })

    })
    QUnit.test("create postcard", async (assert)=>{
            let path='/data/pets';

            let response = await fetch(baseUrl + path, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'X-Authorization': token
                },
                body: JSON.stringify(petdata)            
            })
            
            let jsonData = await response.json();

        
            assert.ok(response.ok, "Response is ok");  

            console.log(jsonData) 

            assert.ok(jsonData.hasOwnProperty('age'), "age exists");
            assert.strictEqual(jsonData.age, petdata.age, "age is expected");
            assert.strictEqual(typeof jsonData.age, 'string', "age is from correct type");

            assert.ok(jsonData.hasOwnProperty('breed'), "breed exists");
            assert.strictEqual(jsonData.breed, petdata.breed, "breed is expected");
            assert.strictEqual(typeof jsonData.breed, 'string', "breed is from correct type");

            assert.ok(jsonData.hasOwnProperty('image'), "image exists");
            assert.strictEqual(jsonData.image, petdata.image, "image is expected");
            assert.strictEqual(typeof jsonData.image, 'string', "image is from correct type");

            assert.ok(jsonData.hasOwnProperty('name'), "name exists");
            assert.strictEqual(jsonData.name, petdata.name, "name is expected");
            assert.strictEqual(typeof jsonData.name, 'string', "name is from correct type");

            assert.ok(jsonData.hasOwnProperty('weight'), "weight exists");
            assert.strictEqual(jsonData.weight, petdata.weight, "weight is expected");
            assert.strictEqual(typeof jsonData.weight, 'string', "weight is from correct type"); 

            assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exists");
            assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

            assert.ok(jsonData.hasOwnProperty('_id'), "_id exists");
            assert.strictEqual(typeof jsonData._id, 'string', "_id is from correct type");

            lastCreatedPetPostCardtId=jsonData._id;

            assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exists");
            assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is from correct type");

    })
    QUnit.test("edit postcard", async(assert)=>{
           let path ='/data/pets' 

           petdata.name="Random edited title";
           petdata.breed="Random edited breed"

           let response = await fetch(baseUrl + path+ `/${lastCreatedPetPostCardtId}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(petdata)            
        })
        
        let jsonData = await response.json(); 

        assert.ok(response.ok, "Response is ok");

        console.log(jsonData) 

        assert.ok(jsonData.hasOwnProperty('age'), "age exists");
            assert.strictEqual(jsonData.age, petdata.age, "age is expected");
            assert.strictEqual(typeof jsonData.age, 'string', "age is from correct type");

            assert.ok(jsonData.hasOwnProperty('breed'), "breed exists");
            assert.strictEqual(jsonData.breed, petdata.breed, "breed is expected");
            assert.strictEqual(typeof jsonData.breed, 'string', "breed is from correct type");

            assert.ok(jsonData.hasOwnProperty('image'), "image exists");
            assert.strictEqual(jsonData.image, petdata.image, "image is expected");
            assert.strictEqual(typeof jsonData.image, 'string', "image is from correct type");

            assert.ok(jsonData.hasOwnProperty('name'), "name exists");
            assert.strictEqual(jsonData.name, petdata.name, "name is expected");
            assert.strictEqual(typeof jsonData.name, 'string', "name is from correct type");

            assert.ok(jsonData.hasOwnProperty('weight'), "weight exists");
            assert.strictEqual(jsonData.weight, petdata.weight, "weight is expected");
            assert.strictEqual(typeof jsonData.weight, 'string', "weight is from correct type"); 

            assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exists");
            assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

            assert.ok(jsonData.hasOwnProperty('_id'), "_id exists");
            assert.strictEqual(typeof jsonData._id, 'string', "_id is from correct type");

            lastCreatedPetPostCardtId=jsonData._id;

            assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exists");
            assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is from correct type");
    })
    QUnit.test("delete postcard", async(assert)=>{
        let path ='/data/pets' 
        
        let response = await fetch(baseUrl + path + `/${lastCreatedPetPostCardtId}`, {
            method: "DELETE",
            headers: {
                'X-Authorization' : token
            }
        })

        assert.ok(response.ok)

    })
})