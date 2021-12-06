const socket = io()
//getting data from server
// sockte work here both client and server


//Elements 
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton= $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//welcome

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = ()=>
{
    //New message element
    const $newMessage =$messages.lastElementChild

    //Height of the last message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin =parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight+ newMessageMargin
    
    //visible Height
    const visibleHeight =$messages.offsetHeight
    

    //height of message container
    const containerHeight =$messages.scrollHeight

    //how far  have i scrolled
    const scrollOffest = $messages.scrollTop +visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffest)
    {
        $messages.scrollTop = $messages.scrollHeight
    }
}
socket.on('message',(message)=>
{
    console.log(message)
    const html = Mustache.render(messageTemplate,
    {
        username:message.username,
        message:message.text,
        CreatedAt:moment(message.CreatedAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(message)=>
{
    console.log(message)
    const html =Mustache.render(locationMessageTemplate,
    {   username:message.username,
        url:message.url, 
        CreatedAt:moment(message.CreatedAt).format('h:mm a')})
    $messages.insertAdjacentHTML('beforeend',html)
})
    socket.on('roomData',({room,users})=>
        {
            const html=Mustache.render(sidebarTemplate, {
                room,
                users
            })      
            document.querySelector('#sidebar').innerHTML =html  
          })
 $messageForm.addEventListener('submit',(e)=>
{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    //disable
    const message = e.target.elements.message.value
     
    socket.emit('sendMessage',message,(error) =>
    {   //enable
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormInput.focus()

        if(error)
        {
            return console.log(error)
        }
        console.log('Message Delivered!')
    })
})

//Elements

//const $messageFormClick = $messageForm.querySelector('button')


$sendLocationButton.addEventListener('click',(e)=>
{
    
   
    if(!navigator.geolocation)
    {
        return alert('Geolocatoion is not supported by  your browser.')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>
    {
        const latitude =position.coords.latitude
        const longitude =position.coords.longitude
        const location ={latitude,longitude}
        // console.log(location)
        socket.emit('SendLocation',location,()=>
        {$sendLocationButton.removeAttribute('disabled')
            console.log('location shared!')
        })
        
    })
})

socket.emit('join',{username,room },(error)=>
{
    if(error)
    {
        alert(error)
        location.href ='/'

        }
})

// //receving  client 
// socket.on('countUpdated',(count) =>
// {
//     console.log('The count has been updated',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>
// {
//     console.log('Clicked')
//     socket.emit('increment')
// })
