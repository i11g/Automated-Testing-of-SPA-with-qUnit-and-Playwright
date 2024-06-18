QUnit.config.reorder=false 
const base_Url='http://localhost:3030'

let user={
    email:'',
    password:'123456'
}

QUnit.module('user regiastration', ()=>{
    QUnit.test('registration', async (assert) {
        //arrange
        let path='user/register'

        let random=Math.floor(Math.random()*10000);
        let email=`abv${random}@abv.bg`; 
        user.email=email

        //act
        let response=await fetch(base_Url+'path'+{
            method:'POST',
            headers:{
                'content-type':'athorization/json'
            },
            body: JSON.stringify(user)
        }) 
         
        let json=await response.json();

        //assert
        assert.ok(response.ok, 'sucssesfull response'); 
        assert.ok(json.hasOwnProperty('email'), 'email exist')
        assert.equal(json['email'], user.email, 'expected mail')
        assert.strictEqual(typeof json.email, 'string', 'Property mail is e string')

        assert.ok(json.hasOwnProperty('password'), user.password, 'password exists')
        assert.equal(json['password'], user.password, 'expected password')
        assert.strictEqual(typeof json.password, 'string', 'password is a string')

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken property exists')
        token=json['accessToken']
        assert.strictEqual(typeof json.accessToken, 'string', 'Property accessToken is a string') 

        assert.ok(json.hasOwnProperty('_id'), 'id exist')
        assert.strictEqual(typeof json._id, 'string', 'Property _id is a string')
    })
})

