const users =[]

const addUser = ({id,username,room})=>
{ 
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate  the data
    if(!username || !room)
    {
        return {
            error:'Username and room is required'
        }
    }

    //check for existing user

    const existingUser = users.find((user)=>
    {
        return user.room === room && user.username=== username
    })

    //validate username
    if(existingUser)
    {
        return{
            error:'username is in use!'
        }
    }

    //store user
    const user ={id,username,room}
    users.push(user)
    return{ user}



}


const removeUser=(id)=>
{
    const index = users.findIndex((user) => user.id === id)
    console.log(index)
    if(index !==  -1)
    {
        return users.splice(index,1)[0]
    }
}

const getUser =(id) =>
{
    return users.find((user)=>  user.id === id )
}

const getUserInRoom =(room)=>
{
    room = room.trim().toLowerCase()
    return users.filter((user)=>user.room === room)
}

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}

  
// addUser({
//     id:22,
//     username:'vignesh',
//     room:'java'
// })
// addUser({
//     id:32,
//     username:'ragul',
//     room:'DotNet'
// })

// addUser({
//     id:42,
//     username:'Vijay',
//     room:'c sharp'
// })
// // const user =getUser(42)
// // console.log(user)

// const userList =getUserInRoom('DotNet')
// console.log(userList)


// const removedUser = removeUser(22)

// console.log(removedUser)
// console.log(users)