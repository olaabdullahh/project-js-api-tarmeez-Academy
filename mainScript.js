setUpUi()

let basUrl = "https://tarmeezacademy.com/api/v1"
function loader (show=true){
    if(show){
        document.getElementById("loader").style.visibility = "visible"
    }else{
        document.getElementById("loader").style.visibility = "hidden"
    }
}

function login(){
    let userName = document.getElementById("userName-input").value;
    let password = document.getElementById("password-input").value;
    let params = {
        "username" : userName,
        "password" : password
    }
    let url = `${basUrl}/login`
    loader(true)
    axios.post( url, params)
    .then(function(response){
        console.log(response.data);
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        let modal = document.getElementById("login-modal")
        let modalIns = bootstrap.Modal.getInstance(modal)
        modalIns.hide()
        showAlert('Logged in successfully', 'success')
        setUpUi()
})
.catch((error)=>{
    let messageError = error.response.data.message;
    showAlert(messageError, 'danger')
})
.finally(()=>{
    loader(false)
})
}
document.getElementById("register-btn").addEventListener("click", function register(){
    let userName = document.getElementById("register-userName-input").value;
    let password = document.getElementById("register-password-input").value;
    let Name = document.getElementById("register-Name-input").value;
    let Email = document.getElementById("register-email-input").value;
    let image = document.getElementById("file-profile-input").files[0]

    let formData = new FormData()
    formData.append("username", userName)
    formData.append("password", password)
    formData.append("name", Name)
    formData.append("email", Email)
    formData.append("image", image)

    let headers = {}
    const url = `${basUrl}/register`
    loader(true)
    axios.post( url, formData, {
        headers : headers
    })
    .then(function(response){
        console.log(response.data);
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        let modal = document.getElementById("register-modal")
        let modalIns = bootstrap.Modal.getInstance(modal)
        modalIns.hide()
        showAlert('New User registered successfully', 'success')
        setUpUi()
})
.catch((error)=>{
    let messageError = error.response.data.message;
    showAlert(messageError, 'danger')
})
.finally(()=>{
    loader(false)
})
  
})

function showAlert(costemMessage , type='success'){
    const alertPlaceholder = document.getElementById('logged-success')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
             ].join('')

  alertPlaceholder.append(wrapper)
}

    appendAlert(costemMessage , type)
    // to do: hide To Aleart //
        // setTimeout(()=>{
        //     const aleartToHide = bootstrap.Alert.getOrCreateInstance('#logged-success')
        //         // aleartToHide.close()
        // }, 1000)

}


function setUpUi(){
    let token = localStorage.getItem("token")
    let login = document.getElementById("login-btn")
    let register = document.getElementById("register")
    let logout = document.getElementById("logout")
    let imgUi = document.getElementById("imgUi")
    let userUi = document.getElementById("userUi")
    let addBtn = document.getElementById("add-post-btn")
    
    let userStorage = localStorage.getItem("user")
    let user = JSON.parse(userStorage)
    if(token == null){
        if(addBtn != null){
        document.getElementById("add-post-btn").style.display = "none"
        }
        imgUi.style.display = "none"
        userUi.style.display = "none"
        login.style.display = "block"
        register.style.display = "block"
        logout.style.display = "none"
    }else{
        if(addBtn != null){
            document.getElementById("add-post-btn").style.display = "block"
            }
        imgUi.style.display = "inline-block"
        userUi.style.display = "inline-block"
        login.style.display = "none"
        register.style.display = "none"
        logout.style.display = "block"
        document.getElementById("userUi").innerHTML = user.username
        document.getElementById("imgUi").src = user.profile_image
    }
    
}
document.getElementById("logout").addEventListener("click" , function(){
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    showAlert('logged out successfully' , 'success')
    setUpUi()
})
function postClicked(postId){
    window.location = `detailes.html?postId=${postId}`
 }
 function clickedUser(userId){
    window.location = `profile.html?userId=${userId}`
}
function profileClicked(){
    let user = getCurrentUser()
    let userid = user.id
    window.location = `profile.html?userId=${userid}`
}


 function getCurrentUser(){
    let user = null
        const userStoragebtn = localStorage.getItem("user")
        if(userStoragebtn!= null){
         user = JSON.parse(userStoragebtn)
        }
        return user
}
function deletPost(){
    let token = localStorage.getItem("token");
   let postId = document.getElementById("delete-input-id").value
   let headers = {
    "authorization" : `Bearer ${token}`
}
   let url = `${basUrl}/posts/${postId}`
   loader(true)
    axios.delete( url , {
        headers : headers
    })
    .then(function(response){
        console.log(response)
        let modal = document.getElementById("delete-post-modal")
        let modalIns = bootstrap.Modal.getInstance(modal)
        modalIns.hide()
        showAlert('The post has been deleted successfully', 'success')
        getPosts()
})
.catch((error)=>{
    let messageError = error.response.data.message;
        showAlert(messageError, 'danger')
})
.finally(()=>{
    loader(false)
})
}
function createPost(){
    let postId = document.getElementById("post-id").value
    let isCreate = postId == null || postId == ""
 
    let titlePost = document.getElementById("title-post-input").value;
    let bodyPost = document.getElementById("body-post-input").value;
    let imagePost = document.getElementById("file-post-input").files[0];
    let token = localStorage.getItem("token");

    let formData = new FormData()
    formData.append("title" , titlePost)
    formData.append("image" , imagePost)
    formData.append("body" , bodyPost)

    let url = ``
    let headers = {
        "authorization" : `Bearer ${token}`
    }
    if(isCreate){
         url = `${basUrl}/posts`
         loader(true)
         axios.post( url, formData ,{
            headers : headers
        })
        .then(function(response){
            console.log(response);
            
            let modal = document.getElementById("add-post-modal")
            let modalIns = bootstrap.Modal.getInstance(modal)
            modalIns.hide()
            showAlert('Created A New Post', 'success')
            getPosts()
    })
    .catch((error)=>{
        let messageError = error.response.data.message;
        showAlert(messageError, 'danger')
    })
    .finally(()=>{
        loader(false)
    })
    }else{
        formData.append("_method" ,"put")
        url = `${basUrl}/posts/${postId}`
        axios.post( url, formData ,{
            headers : headers
        })
        .then(function(response){
            
            let modal = document.getElementById("add-post-modal")
            let modalIns = bootstrap.Modal.getInstance(modal)
            modalIns.hide()
            showAlert('The post has been edited successfully', 'success')
            getPosts()
    })
    .catch((error)=>{
        let messageError = error.response.data.message;
        showAlert(messageError, 'danger')
    })
    .finally(()=>{
        loader(false)
    })

    }
    
   
}
function editPostClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post.id);
    document.getElementById("post-id").value = post.id
    document.getElementById("add-post-title").innerHTML = "Edit Post";
    document.getElementById("body-post-input").value = post.body
    document.getElementById("title-post-input").value = post.title
    
     document.getElementById("upDate-btn").innerHTML = "Update"
    let postModal = new bootstrap.Modal(document.getElementById("add-post-modal"))
    postModal.toggle()
}
function deletPostClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post);
     document.getElementById("delete-input-id").value = post.id
     document.getElementById("post-name").innerHTML = post.title

    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"))
    postModal.toggle()
}